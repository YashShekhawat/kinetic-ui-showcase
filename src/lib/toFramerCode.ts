// src/lib/toFramerCode.ts
// Transforms Kinetic UI block TSX into a Framer-ready Code Component.
// Called at copy-time — no build step, no changes to source files.

export type FramerControlType = "string" | "number" | "boolean" | "color" | "enum";

export interface FramerProp {
  name: string;
  type: FramerControlType;
  title: string;
  default: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

// ---------------------------------------------------------------------------
// Internal hook inlines — import removed, plain implementation injected
// ---------------------------------------------------------------------------

const INTERNAL_HOOK_INLINES: Array<{ pattern: RegExp; inline: string }> = [
  {
    pattern: /import \{[^}]+\} from ['"]@\/hooks\/use-mobile['"]\n?/g,
    inline: `// Inlined: @/hooks/use-mobile
function useIsMobile(): boolean {
  const [v, setV] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const h = (e: MediaQueryListEvent): void => setV(e.matches);
    mql.addEventListener('change', h);
    return () => mql.removeEventListener('change', h);
  }, []);
  return v;
}
function useIsTouch(): boolean {
  return typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}
`,
  },
  {
    pattern: /import \{[^}]+\} from ['"]@\/hooks\/usePro['"]\n?/g,
    inline: `// Inlined: @/hooks/usePro (Pro gate disabled in Framer)\nfunction usePro(): boolean { return true; }\n`,
  },
];

// Any remaining @/ import not handled above gets stripped
const STRIP_INTERNAL_IMPORTS = /import \{[^}]+\} from ['"]@\/[^'"]+['"]\n?/g;

// Tailwind font utilities → explicit fontFamily values
const FONT_CLASS_MAP: Record<string, string> = {
  "font-syne": "'Syne', system-ui, sans-serif",
  "font-inter": "'Inter', system-ui, sans-serif",
  "font-mono": "'Fira Mono', 'Courier New', monospace",
};

// All React hooks we may need — always include them so inlined hooks work
const REACT_HOOKS = ["useEffect", "useRef", "useState", "useCallback", "useMemo", "useReducer"];

// ---------------------------------------------------------------------------
// Main transformer
// ---------------------------------------------------------------------------

export function toFramerCode(rawCode: string, componentName: string, framerProps: FramerProp[]): string {
  let code = rawCode;

  // ── 1. GSAP npm → CDN ────────────────────────────────────────────────────
  code = code.replace(
    /import gsap from ['"]gsap['"]/g,
    `// @ts-ignore — Framer uses CDN imports\nimport gsap from 'https://cdn.skypack.dev/gsap'`,
  );
  code = code.replace(
    /import \{ ScrollTrigger \} from ['"]gsap\/ScrollTrigger['"]/g,
    `// @ts-ignore\nimport { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger'`,
  );
  code = code.replace(
    /import \{ SplitText \} from ['"]gsap\/SplitText['"]/g,
    `// @ts-ignore\nimport { SplitText } from 'https://cdn.skypack.dev/gsap/SplitText'`,
  );

  // ── 2. Fix React import ───────────────────────────────────────────────────
  // Collect all named React imports across the file, merge into one explicit
  // import that always includes all hooks (needed for inlined hook implementations)
  const allNamed = new Set<string>(REACT_HOOKS);
  const reactImportRegex = /import \{([^}]+)\} from ['"]react['"]\n?/g;
  let m: RegExpExecArray | null;
  while ((m = reactImportRegex.exec(code)) !== null) {
    m[1]
      .split(",")
      .map((s) => s.trim().replace(/^type\s+/, ""))
      .filter(Boolean)
      .forEach((n) => allNamed.add(n));
  }
  reactImportRegex.lastIndex = 0;
  // Also handle "import type { ... } from 'react'"
  code = code.replace(/import type \{[^}]+\} from ['"]react['"]\n?/g, "");
  // Remove all existing react imports
  code = code.replace(/import \{[^}]+\} from ['"]react['"]\n?/g, "");
  // Prepend single clean react import
  code = `import { ${[...allNamed].join(", ")} } from 'react'\n` + code;

  // ── 3. Inline known internal hooks ───────────────────────────────────────
  for (const { pattern, inline } of INTERNAL_HOOK_INLINES) {
    if (pattern.test(code)) {
      code = code.replace(pattern, "");
      code = injectAfterLastImport(code, inline);
    }
    pattern.lastIndex = 0;
  }

  // ── 4. Strip remaining @/ imports ────────────────────────────────────────
  code = code.replace(STRIP_INTERNAL_IMPORTS, (match) => {
    const what = match.match(/import \{([^}]+)\}/)?.[1]?.trim() ?? "unknown";
    return `// [Framer] Removed unresolvable import: { ${what} }\n`;
  });

  // ── 5. Strip className props (Tailwind doesn't exist in Framer) ───────────
  // First convert font-* classNames to inline style fontFamily before stripping
  code = replaceClassNames(code);

  // ── 6. Fix default export — Framer requires `export default function` ─────
  // Pattern: const ComponentName = ({ ... }: Props) => { ... }
  // + separate export default ComponentName at bottom
  const constArrowRegex = new RegExp(
    `const ${componentName}\\s*=\\s*\\(([\\s\\S]*?)\\)\\s*(?::\\s*\\w+\\s*)?=>\\s*\\{`,
    "m",
  );
  if (constArrowRegex.test(code)) {
    code = code.replace(constArrowRegex, (_, params: string) => {
      return `export default function ${componentName}(${params}) {`;
    });
    // Remove the now-redundant `export default ComponentName` line at the bottom
    code = code.replace(new RegExp(`\\nexport default ${componentName};?\\n`, "g"), "\n");
  }

  // ── 7. Inject framer import ───────────────────────────────────────────────
  code = injectAfterLastImport(code, `import { addPropertyControls, ControlType } from 'framer'`);

  // ── 8. Append addPropertyControls ────────────────────────────────────────
  if (framerProps.length > 0) {
    code = code.trimEnd() + "\n\n" + buildPropertyControls(componentName, framerProps);
  }

  // ── 9. Ensure default export exists (for components already using function declaration) ──
  const hasDefaultExport = /^export default /m.test(code);
  if (!hasDefaultExport) {
    code = code.trimEnd() + `\n\nexport default ${componentName};\n`;
  }

  // ── 10. Fix container styles — inject Framer-safe layout into first root div style ──
  // Ensures component fills its Framer frame correctly on all screen sizes
  code = fixRootContainerStyle(code);

  // ── 11. Prepend usage header ──────────────────────────────────────────────
  const header = [
    `// Framer Code Component — generated by Kinetic UI`,
    `// HOW TO USE:`,
    `// 1. Open Framer → Assets → Code → "+ New File"`,
    `// 2. Paste this entire file and save`,
    `// 3. Drag the component from Assets onto your canvas`,
    `// 4. Edit props in the right panel — no code needed`,
    ``,
  ].join("\n");

  return header + code;
}

// ---------------------------------------------------------------------------
// className → inline style conversion
// ---------------------------------------------------------------------------

function replaceClassNames(code: string): string {
  // Convert font-* classNames to style={{ fontFamily: '...' }}
  for (const [cls, fontFamily] of Object.entries(FONT_CLASS_MAP)) {
    // className="font-syne ..." → style={{ fontFamily: '...' }} (other classes dropped)
    code = code.replace(new RegExp(`className="([^"]*\\b${cls}\\b[^"]*)"`, "g"), (_match: string, classes: string) => {
      const other = classes.replace(new RegExp(`\\b${cls}\\b`, "g"), "").trim();
      const style = `style={{ fontFamily: '${fontFamily}' }}`;
      return other ? style : style;
    });
  }

  // Strip all remaining className props — Tailwind doesn't exist in Framer
  code = code.replace(/\s*className="[^"]*"/g, "");
  code = code.replace(/\s*className=\{`[^`]*`\}/g, "");
  code = code.replace(/\s*className=\{'[^']*'\}/g, "");
  code = code.replace(/\s*className=\{[^}]+\}/g, "");

  return code;
}

// ---------------------------------------------------------------------------
// Fix root container style
// Injects essential Framer layout properties into the outermost div's style.
// This ensures the component fills its frame and text doesn't overflow.
// ---------------------------------------------------------------------------

function fixRootContainerStyle(code: string): string {
  // Find the first style={{ ... }} on the outermost wrapper div in the return
  // and merge in the Framer-safe properties if not already present.
  const framerSafeProps: Record<string, string> = {
    boxSizing: '"border-box"',
    minHeight: '"100%"',
    wordBreak: '"break-word"',
    overflowWrap: '"break-word"',
    overflow: '"hidden"',
  };

  // Match the first `style={{` in JSX return and inject missing props
  code = code.replace(
    /(return\s*\(\s*\n?\s*<div[^>]*style=\{\{)([\s\S]*?)(\}\})/,
    (_match: string, open: string, styleBody: string, close: string) => {
      let body = styleBody;
      for (const [prop, val] of Object.entries(framerSafeProps)) {
        if (!body.includes(prop + ":")) {
          // Append before closing }}
          body = body.trimEnd() + `,\n    ${prop}: ${val},\n  `;
        }
      }
      return open + body + close;
    },
  );

  return code;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function injectAfterLastImport(code: string, toInject: string): string {
  const matches = [...code.matchAll(/^import .+$/gm)];
  const last = matches.pop();
  if (last?.index !== undefined) {
    const insertAt = last.index + last[0].length;
    return code.slice(0, insertAt) + "\n" + toInject + code.slice(insertAt);
  }
  return toInject + "\n\n" + code;
}

function buildPropertyControls(componentName: string, props: FramerProp[]): string {
  const controls = props.map((p) => {
    const lines: string[] = [`    ${p.name}: {`];
    lines.push(`      type: ControlType.${capitalize(p.type)},`);
    lines.push(`      title: '${p.title}',`);
    if (p.type === "string" || p.type === "color") {
      lines.push(`      defaultValue: '${p.default}',`);
    } else if (p.type === "number") {
      lines.push(`      defaultValue: ${p.default},`);
      if (p.min !== undefined) lines.push(`      min: ${p.min},`);
      if (p.max !== undefined) lines.push(`      max: ${p.max},`);
      if (p.step !== undefined) lines.push(`      step: ${p.step},`);
    } else if (p.type === "boolean") {
      lines.push(`      defaultValue: ${p.default},`);
    } else if (p.type === "enum" && p.options) {
      lines.push(`      options: [${p.options.map((o) => `'${o}'`).join(", ")}],`);
      lines.push(`      defaultValue: '${p.default}',`);
    }
    lines.push(`    },`);
    return lines.join("\n");
  });
  return [`addPropertyControls(${componentName}, {`, controls.join("\n"), `});`].join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
