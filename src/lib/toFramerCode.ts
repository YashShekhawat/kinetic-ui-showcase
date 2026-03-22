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

// Known internal hooks — import removed, implementation inlined
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

// Tailwind font utilities → inline font-family values
const FONT_CLASS_MAP: Record<string, string> = {
  "font-syne": "'Syne', system-ui, sans-serif",
  "font-inter": "'Inter', system-ui, sans-serif",
  "font-mono": "'Fira Mono', 'Courier New', monospace",
};

export function toFramerCode(rawCode: string, componentName: string, framerProps: FramerProp[]): string {
  let code = rawCode;

  // 1. Swap GSAP npm imports → CDN
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

  // 2. Fix React import — ensure named hooks are imported, no React.* namespace needed
  //    Replace any existing react import with a full explicit one that covers all hooks
  const reactNamedImportRegex = /import \{([^}]+)\} from ['"]react['"]/g;
  const hasReactImport = reactNamedImportRegex.test(code);
  reactNamedImportRegex.lastIndex = 0;

  if (hasReactImport) {
    // Collect all named imports across possibly multiple react import lines
    const allNamed = new Set<string>();
    // Always ensure these are present for inlined hooks
    ["useEffect", "useRef", "useState", "useCallback"].forEach((h) => allNamed.add(h));
    let m: RegExpExecArray | null;
    while ((m = reactNamedImportRegex.exec(code)) !== null) {
      m[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((n) => allNamed.add(n));
    }
    reactNamedImportRegex.lastIndex = 0;
    // Remove all existing react imports
    code = code.replace(/import \{[^}]+\} from ['"]react['"]\n?/g, "");
    code = code.replace(/import type \{[^}]+\} from ['"]react['"]\n?/g, "");
    // Prepend a single clean react import
    code = `import { ${[...allNamed].join(", ")} } from 'react'\n` + code;
  } else {
    code = `import { useEffect, useRef, useState, useCallback } from 'react'\n` + code;
  }

  // 3. Replace known internal hook imports with inlined implementations
  for (const { pattern, inline } of INTERNAL_HOOK_INLINES) {
    if (pattern.test(code)) {
      code = code.replace(pattern, "");
      code = injectAfterLastImport(code, inline);
    }
    pattern.lastIndex = 0;
  }

  // 4. Strip any remaining @/ imports — unresolvable in Framer
  code = code.replace(STRIP_INTERNAL_IMPORTS, (match) => {
    const what = match.match(/import \{([^}]+)\}/)?.[1]?.trim() ?? "unknown";
    return `// [Framer] Removed unresolvable import: { ${what} }\n`;
  });

  // 5. Replace className with style where font utility classes are used,
  //    and strip all remaining className props — Tailwind doesn't exist in Framer
  code = replaceClassNames(code);

  // 6. Inject Framer import after last import
  code = injectAfterLastImport(code, `import { addPropertyControls, ControlType } from 'framer'`);

  // 7. Append addPropertyControls
  if (framerProps.length > 0) {
    code = code.trimEnd() + "\n\n" + buildPropertyControls(componentName, framerProps);
  }

  // 8. Add default export — Framer requires it to render on canvas
  const hasDefaultExport = /^export default /m.test(code);
  if (!hasDefaultExport) {
    code = code.trimEnd() + `\n\nexport default ${componentName};\n`;
  }

  // 9. Prepend usage header
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
// className → style replacement
// Framer has no Tailwind. We convert known font classes to inline style values
// and strip all other className attributes entirely.
// ---------------------------------------------------------------------------

function replaceClassNames(code: string): string {
  // Replace className="..." or className={`...`} that contain known font utilities
  // with an inline style={{ fontFamily: '...' }} merge
  // Strategy: remove all className props — styles are already inline in Kinetic UI blocks.
  // Font family classes get converted to fontFamily style additions where possible.

  // Step A — convert standalone font-only classNames to style props
  // e.g. className="font-mono text-[10px]" → style={{ fontFamily: '...' }}
  // We only handle the font-* part; text size etc are ignored (already in inline styles)
  for (const [cls, fontFamily] of Object.entries(FONT_CLASS_MAP)) {
    // className="font-syne ..." on elements that don't already have a style prop
    // This is best-effort — Kinetic UI blocks use inline styles for everything important
    code = code.replace(new RegExp(`className="([^"]*\\b${cls}\\b[^"]*)"`, "g"), (_match: string, classes: string) => {
      const otherClasses = classes.replace(new RegExp(`\\b${cls}\\b`, "g"), "").trim();
      const styleStr = `style={{ fontFamily: '${fontFamily}' }}`;
      return otherClasses ? `${styleStr} /* stripped classes: ${otherClasses} */` : styleStr;
    });
  }

  // Step B — strip all remaining className props entirely
  // className="..." (static strings)
  code = code.replace(/\s*className="[^"]*"/g, "");
  // className={`...`} (template literals)
  code = code.replace(/\s*className=\{`[^`]*`\}/g, "");
  // className={'...'} (single quotes)
  code = code.replace(/\s*className=\{'[^']*'\}/g, "");
  // className={someVar} (expressions — rare but strip safely)
  code = code.replace(/\s*className=\{[^}]+\}/g, "");

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
