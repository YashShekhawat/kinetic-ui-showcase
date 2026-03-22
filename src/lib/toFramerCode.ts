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
// Internal hook inlines
// ---------------------------------------------------------------------------

const INTERNAL_HOOK_INLINES: Array<{ pattern: RegExp; inline: string }> = [
  {
    pattern: /import \{[^}]+\} from ['"]@\/hooks\/use-mobile['"]\n?/g,
    inline: [
      "// Inlined: @/hooks/use-mobile",
      "function useIsMobile(): boolean {",
      "  const [v, setV] = useState<boolean>(",
      "    typeof window !== 'undefined' ? window.innerWidth < 768 : false",
      "  );",
      "  useEffect(() => {",
      "    const mql = window.matchMedia('(max-width: 767px)');",
      "    const h = (e: MediaQueryListEvent): void => setV(e.matches);",
      "    mql.addEventListener('change', h);",
      "    return () => mql.removeEventListener('change', h);",
      "  }, []);",
      "  return v;",
      "}",
      "function useIsTouch(): boolean {",
      "  return typeof window !== 'undefined' &&",
      "    ('ontouchstart' in window || navigator.maxTouchPoints > 0);",
      "}",
      "",
    ].join("\n"),
  },
  {
    pattern: /import \{[^}]+\} from ['"]@\/hooks\/usePro['"]\n?/g,
    inline: "// Inlined: @/hooks/usePro (Pro gate disabled in Framer)\nfunction usePro(): boolean { return true; }\n",
  },
];

const STRIP_INTERNAL_IMPORTS = /import \{[^}]+\} from ['"]@\/[^'"]+['"]\n?/g;

// All React hooks — always import them so inlined hooks can use them
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

  // ── 2. Fix React imports ──────────────────────────────────────────────────
  // Collect all named imports from any react import lines
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
  // Remove ALL react import lines (named + type)
  code = code.replace(/import type \{[^}]+\} from ['"]react['"]\n?/g, "");
  code = code.replace(/import \{[^}]+\} from ['"]react['"]\n?/g, "");
  // Clean up any stray semicolons left on their own line from stripping
  code = code.replace(/^\s*;\s*$/gm, ""); // removes standalone ; lines
  code = code.replace(/\n{3,}/g, "\n\n"); // collapse blank lines created by removal
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
    return `// [Framer] Removed: { ${what} }\n`;
  });

  // ── 5. Strip className props ──────────────────────────────────────────────
  // IMPORTANT: Do NOT convert font classNames to style — this causes duplicate
  // style props. Instead just strip all classNames. Font families are already
  // set via inline styles in Kinetic UI blocks.
  code = code.replace(/\s*className="[^"]*"/g, "");
  code = code.replace(/\s*className=\{`[^`]*`\}/g, "");
  code = code.replace(/\s*className=\{'[^']*'\}/g, "");
  code = code.replace(/\s*className=\{[^}]+\}/g, "");

  // ── 6. Fix default export ─────────────────────────────────────────────────
  // Framer requires `export default function Name()` not `const Name = () =>`
  const constArrowRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\(`, "m");
  if (constArrowRegex.test(code)) {
    // Replace `const ComponentName = (` with `export default function ComponentName(`
    code = code.replace(
      new RegExp(`const\\s+${componentName}\\s*=\\s*\\(`, "m"),
      `export default function ${componentName}(`,
    );
    // Replace the arrow `): ReturnType =>` or just `) => ` with `) `
    // Find the matching closing paren + arrow and replace with just `{`
    code = code.replace(
      new RegExp(`(export default function ${componentName}\\([\\s\\S]*?)\\)\\s*(?::\\s*[\\w<>]+\\s*)?=>\\s*\\{`, "m"),
      "$1) {",
    );
    // Remove the now-redundant standalone export default line
    code = code.replace(new RegExp(`\\nexport default ${componentName};?\\s*\\n`, "g"), "\n");
    // Remove trailing `};` that arrow functions leave — change to `}`
    code = code.replace(/\};\s*\n(\s*\nadd|$)/g, "}\n$1");
  }

  // ── 7. Inject Framer import ───────────────────────────────────────────────
  code = injectAfterLastImport(code, `import { addPropertyControls, ControlType } from 'framer'`);

  // ── 8. Append addPropertyControls ────────────────────────────────────────
  if (framerProps.length > 0) {
    code = code.trimEnd() + "\n\n" + buildPropertyControls(componentName, framerProps);
  }

  // ── 9. Ensure default export exists ──────────────────────────────────────
  const hasDefaultExport = /^export default /m.test(code);
  if (!hasDefaultExport) {
    code = code.trimEnd() + `\n\nexport default ${componentName};\n`;
  }

  // ── 10. Fix root container — inject missing layout props into first div style
  code = fixRootContainerStyle(code);

  // ── 11. Clean up any double commas or blank lines left by transforms ──────
  code = code.replace(/,\s*,/g, ","); // double commas: ,, → ,
  code = code.replace(/\n{3,}/g, "\n\n"); // 3+ blank lines → 2

  // ── 12. Prepend usage header ──────────────────────────────────────────────
  const header = [
    "// Framer Code Component — generated by Kinetic UI",
    "// HOW TO USE:",
    '// 1. Open Framer → Assets → Code → "+ New File"',
    "// 2. Paste this entire file and save",
    "// 3. Drag the component from Assets onto your canvas",
    "// 4. Edit props in the right panel — no code needed",
    "",
  ].join("\n");

  return header + code;
}

// ---------------------------------------------------------------------------
// Fix root container style
// Merges Framer-safe layout properties into the first div style in JSX return.
// Avoids duplicate keys and double commas.
// ---------------------------------------------------------------------------

function fixRootContainerStyle(code: string): string {
  const propsToInject: Record<string, string> = {
    boxSizing: '"border-box"',
    minHeight: '"100%"',
    wordBreak: '"break-word"',
    overflowWrap: '"break-word"',
    overflow: '"hidden"',
  };

  // Match the first style={{ ... }} object inside the JSX return
  return code.replace(
    /(return\s*\(\s*\n?\s*<\w+[^>]*\bstyle=\{\{)([\s\S]*?)(\}\})/,
    (_match: string, open: string, body: string, close: string) => {
      let updated = body;
      for (const [prop, val] of Object.entries(propsToInject)) {
        // Only inject if not already present
        if (!updated.includes(`${prop}:`)) {
          // Ensure the existing body ends with a comma before we append
          updated = updated.trimEnd();
          if (!updated.endsWith(",")) updated += ",";
          updated += `\n    ${prop}: ${val},`;
        }
      }
      return open + updated + "\n  " + close;
    },
  );
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
