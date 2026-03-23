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
      "  const [v, setV] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);",
      "  useEffect(() => {",
      "    const mql = window.matchMedia('(max-width: 767px)');",
      "    const h = (e: MediaQueryListEvent): void => setV(e.matches);",
      "    mql.addEventListener('change', h);",
      "    return () => mql.removeEventListener('change', h);",
      "  }, []);",
      "  return v;",
      "}",
      "function useIsTouch(): boolean {",
      "  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);",
      "}",
      "",
    ].join("\n"),
  },
  {
    pattern: /import \{[^}]+\} from ['"]@\/hooks\/usePro['"]\n?/g,
    inline: "// Inlined: @/hooks/usePro\nfunction usePro(): boolean { return true; }\n",
  },
];

const STRIP_INTERNAL_IMPORTS = /import \{[^}]+\} from ['"]@\/[^'"]+['"]\n?/g;
const REACT_HOOKS = ["useEffect", "useRef", "useState", "useCallback", "useMemo", "useReducer"];

// ---------------------------------------------------------------------------
// Tailwind → inline style map
// CRITICAL: These are the classes that control layout. Stripping them without
// converting causes the entire component layout to collapse in Framer.
// ---------------------------------------------------------------------------

// Static single-value class → CSS property:value
const TAILWIND_STATIC: Record<string, Record<string, string>> = {
  // Display
  flex: { display: "flex" },
  "inline-flex": { display: "inline-flex" },
  "inline-block": { display: "inline-block" },
  block: { display: "block" },
  hidden: { display: "none" },
  "w-full": { width: "100%" },
  "w-max": { width: "max-content" },
  "h-full": { height: "100%" },
  "overflow-hidden": { overflow: "hidden" },
  "whitespace-nowrap": { whiteSpace: "nowrap" },
  // Flex
  "flex-col": { flexDirection: "column" },
  "flex-row": { flexDirection: "row" },
  "flex-wrap": { flexWrap: "wrap" },
  "items-center": { alignItems: "center" },
  "items-start": { alignItems: "flex-start" },
  "items-end": { alignItems: "flex-end" },
  "justify-center": { justifyContent: "center" },
  "justify-between": { justifyContent: "space-between" },
  "justify-start": { justifyContent: "flex-start" },
  "justify-end": { justifyContent: "flex-end" },
  "flex-1": { flex: "1" },
  "flex-shrink-0": { flexShrink: "0" },
  // Position
  relative: { position: "relative" },
  absolute: { position: "absolute" },
  fixed: { position: "fixed" },
  sticky: { position: "sticky" },
  "inset-0": { inset: "0" },
  "top-0": { top: "0" },
  "left-0": { left: "0" },
  "right-0": { right: "0" },
  "bottom-0": { bottom: "0" },
  // Pointer
  "pointer-events-none": { pointerEvents: "none" },
  "pointer-events-auto": { pointerEvents: "auto" },
  "select-none": { userSelect: "none" },
  "cursor-pointer": { cursor: "pointer" },
  // Text align
  "text-center": { textAlign: "center" },
  "text-left": { textAlign: "left" },
  italic: { fontStyle: "italic" },
  // Font weight
  "font-light": { fontWeight: "300" },
  "font-normal": { fontWeight: "400" },
  "font-medium": { fontWeight: "500" },
  "font-semibold": { fontWeight: "600" },
  "font-bold": { fontWeight: "700" },
  "font-extrabold": { fontWeight: "800" },
  // Border radius
  rounded: { borderRadius: "4px" },
  "rounded-full": { borderRadius: "9999px" },
  "rounded-lg": { borderRadius: "8px" },
  "rounded-md": { borderRadius: "6px" },
  // Z-index
  "z-10": { zIndex: "10" },
  "z-20": { zIndex: "20" },
  "z-50": { zIndex: "50" },
  // Font families (these were converted before — keep here for completeness)
  "font-syne": { fontFamily: "Syne, system-ui, sans-serif" },
  "font-inter": { fontFamily: "Inter, system-ui, sans-serif" },
  "font-mono": { fontFamily: "monospace" },
};

// Dynamic classes with values e.g. gap-3, mt-6, p-4, text-[11px]
// Processed via regex since values vary
const TAILWIND_DYNAMIC: Array<{ pattern: RegExp; toCss: (match: RegExpMatchArray) => Record<string, string> }> = [
  // gap-{n} → gap: n*4px
  { pattern: /^gap-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ gap: `${parseFloat(m[1]!) * 4}px` }) },
  // gap-x, gap-y
  { pattern: /^gap-x-(\d+)$/, toCss: (m) => ({ columnGap: `${parseInt(m[1]!) * 4}px` }) },
  { pattern: /^gap-y-(\d+)$/, toCss: (m) => ({ rowGap: `${parseInt(m[1]!) * 4}px` }) },
  // mt, mb, ml, mr, mx, my, m — margin
  { pattern: /^mt-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ marginTop: `${parseFloat(m[1]!) * 4}px` }) },
  { pattern: /^mb-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ marginBottom: `${parseFloat(m[1]!) * 4}px` }) },
  { pattern: /^ml-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ marginLeft: `${parseFloat(m[1]!) * 4}px` }) },
  { pattern: /^mr-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ marginRight: `${parseFloat(m[1]!) * 4}px` }) },
  {
    pattern: /^mx-(\d+(?:\.\d+)?)$/,
    toCss: (m) => ({ marginLeft: `${parseFloat(m[1]!) * 4}px`, marginRight: `${parseFloat(m[1]!) * 4}px` }),
  },
  {
    pattern: /^my-(\d+(?:\.\d+)?)$/,
    toCss: (m) => ({ marginTop: `${parseFloat(m[1]!) * 4}px`, marginBottom: `${parseFloat(m[1]!) * 4}px` }),
  },
  // pt, pb, pl, pr, px, py, p — padding
  { pattern: /^pt-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ paddingTop: `${parseFloat(m[1]!) * 4}px` }) },
  { pattern: /^pb-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ paddingBottom: `${parseFloat(m[1]!) * 4}px` }) },
  { pattern: /^pl-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ paddingLeft: `${parseFloat(m[1]!) * 4}px` }) },
  { pattern: /^pr-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ paddingRight: `${parseFloat(m[1]!) * 4}px` }) },
  {
    pattern: /^px-(\d+(?:\.\d+)?)$/,
    toCss: (m) => ({ paddingLeft: `${parseFloat(m[1]!) * 4}px`, paddingRight: `${parseFloat(m[1]!) * 4}px` }),
  },
  {
    pattern: /^py-(\d+(?:\.\d+)?)$/,
    toCss: (m) => ({ paddingTop: `${parseFloat(m[1]!) * 4}px`, paddingBottom: `${parseFloat(m[1]!) * 4}px` }),
  },
  { pattern: /^p-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ padding: `${parseFloat(m[1]!) * 4}px` }) },
  // w-{n}, h-{n}
  { pattern: /^w-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ width: `${parseFloat(m[1]!) * 4}px` }) },
  { pattern: /^h-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ height: `${parseFloat(m[1]!) * 4}px` }) },
  // max-w-{n}
  { pattern: /^max-w-(\d+(?:\.\d+)?)$/, toCss: (m) => ({ maxWidth: `${parseFloat(m[1]!) * 4}px` }) },
  // text-[npx] — arbitrary
  { pattern: /^text-\[(\d+(?:\.\d+)?(?:px|rem|em)?)\]$/, toCss: (m) => ({ fontSize: m[1]! }) },
  // z-[n] — arbitrary
  { pattern: /^z-\[(\d+)\]$/, toCss: (m) => ({ zIndex: m[1]! }) },
  // rounded-{n} — arbitrary
  { pattern: /^rounded-\[([^\]]+)\]$/, toCss: (m) => ({ borderRadius: m[1]! }) },
  // top/left/right/bottom arbitrary
  { pattern: /^top-\[([^\]]+)\]$/, toCss: (m) => ({ top: m[1]! }) },
  { pattern: /^left-\[([^\]]+)\]$/, toCss: (m) => ({ left: m[1]! }) },
  { pattern: /^right-\[([^\]]+)\]$/, toCss: (m) => ({ right: m[1]! }) },
  { pattern: /^bottom-\[([^\]]+)\]$/, toCss: (m) => ({ bottom: m[1]! }) },
  // opacity-{n}
  { pattern: /^opacity-(\d+)$/, toCss: (m) => ({ opacity: `${parseInt(m[1]!) / 100}` }) },
];

// ---------------------------------------------------------------------------
// Convert a className string to a style object string
// ---------------------------------------------------------------------------

function classesToStyleProps(classStr: string): string {
  const classes = classStr.trim().split(/\s+/).filter(Boolean);
  const styleProps: Record<string, string> = {};

  for (const cls of classes) {
    // Static lookup
    if (TAILWIND_STATIC[cls]) {
      Object.assign(styleProps, TAILWIND_STATIC[cls]);
      continue;
    }
    // Dynamic patterns
    let matched = false;
    for (const { pattern, toCss } of TAILWIND_DYNAMIC) {
      const m = cls.match(pattern);
      if (m) {
        Object.assign(styleProps, toCss(m));
        matched = true;
        break;
      }
    }
    // Unrecognised class — silently drop (responsive/state prefixes etc)
    if (!matched) continue;
  }

  if (Object.keys(styleProps).length === 0) return "";

  return Object.entries(styleProps)
    .map(([k, v]) => {
      // Use double quotes for all string values to avoid conflicts with
      // single-quoted JSX attribute strings and font-family comma lists
      const isNumeric = /^\d+(\.\d+)?$/.test(v) && k !== "zIndex" && k !== "fontWeight" && k !== "opacity";
      return `${k}: ${isNumeric ? v : `"${v}"`}`;
    })
    .join(", ");
}

// ---------------------------------------------------------------------------
// Main className → style merger
// Finds className="..." on JSX elements and merges converted styles into the
// existing style={{ }} prop on the SAME element, or creates a new one.
// ---------------------------------------------------------------------------

function mergeClassNamesIntoStyles(code: string): string {
  // Match JSX opening tags that have className — capture the full tag content
  // Strategy: find className="...", compute style string, then either:
  //   a) merge into existing style={{ ... }} on same tag
  //   b) add new style={{ ... }} if no style prop exists
  //   c) drop if no convertible classes

  // Process line by line to handle multi-line tags
  // This regex finds className="..." anywhere and processes it
  return code
    .replace(/className="([^"]*)"/g, (_fullMatch: string, classStr: string) => {
      const styleStr = classesToStyleProps(classStr);
      if (!styleStr) return ""; // all classes unrecognised — just remove
      // Return as a data attribute we'll merge in a second pass
      return `data-tw-style="${styleStr.replace(/"/g, "&quot;")}"`;
    })
    .replace(
      // Second pass: merge data-tw-style into adjacent style={{ }}
      /data-tw-style="([^"]*)"(\s*)style=\{\{([^}]*(?:\}[^}]*)*?)\}\}/g,
      (_: string, twStyle: string, ws: string, existingStyle: string) => {
        const decoded = twStyle.replace(/&quot;/g, '"');
        const merged = existingStyle.trimEnd();
        const comma = merged.endsWith(",") ? "" : ",";
        return `${ws}style={{ ${merged}${comma} ${decoded} }}`;
      },
    )
    .replace(
      // Third pass: merge style={{ }} into adjacent data-tw-style (other order)
      /style=\{\{([^}]*(?:\}[^}]*)*?)\}\}(\s*)data-tw-style="([^"]*)"/g,
      (_: string, existingStyle: string, ws: string, twStyle: string) => {
        const decoded = twStyle.replace(/&quot;/g, '"');
        const merged = existingStyle.trimEnd();
        const comma = merged.endsWith(",") ? "" : ",";
        return `style={{ ${merged}${comma} ${decoded} }}`;
      },
    )
    .replace(
      // Fourth pass: remaining data-tw-style with no adjacent style → convert to style prop
      /data-tw-style="([^"]*)"/g,
      (_: string, twStyle: string) => {
        const decoded = twStyle.replace(/&quot;/g, '"');
        return `style={{ ${decoded} }}`;
      },
    );
}

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
  code = code.replace(/import type \{[^}]+\} from ['"]react['"];?\n?/g, "");
  code = code.replace(/import \{[^}]+\} from ['"]react['"];?\n?/g, "");
  code = code.replace(/^\s*;\s*$/gm, ""); // catch any remaining stray semicolons
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

  // ── 5. Convert className → inline styles (CRITICAL — must happen before strip) ──
  code = mergeClassNamesIntoStyles(code);

  // ── 6. Strip any remaining className props (template literals, expressions) ──
  code = code.replace(/\s*className=\{`[^`]*`\}/g, "");
  code = code.replace(/\s*className=\{'[^']*'\}/g, "");
  code = code.replace(/\s*className=\{[^}]+\}/g, "");
  code = code.replace(/\s*className="[^"]*"/g, ""); // any missed static ones

  // ── 7. Fix default export ─────────────────────────────────────────────────
  const constArrowRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\(`, "m");
  if (constArrowRegex.test(code)) {
    code = code.replace(
      new RegExp(`const\\s+${componentName}\\s*=\\s*\\(`, "m"),
      `export default function ${componentName}(`,
    );
    code = code.replace(
      new RegExp(
        `(export default function ${componentName}\\([\\s\\S]*?)\\)\\s*(?::\\s*[\\w<>, ]+\\s*)?=>\\s*\\{`,
        "m",
      ),
      "$1) {",
    );
    code = code.replace(new RegExp(`\\nexport default ${componentName};?\\s*\\n`, "g"), "\n");
    // trailing }; from arrow → }
    code = code.replace(/\};\s*(\n\s*\nadd|\s*$)/g, "}\n$1");
  }

  // ── 8. Inject Framer import ───────────────────────────────────────────────
  code = injectAfterLastImport(code, `import { addPropertyControls, ControlType } from 'framer'`);

  // ── 9. Append addPropertyControls ────────────────────────────────────────
  if (framerProps.length > 0) {
    code = code.trimEnd() + "\n\n" + buildPropertyControls(componentName, framerProps);
  }

  // ── 10. Ensure default export exists ─────────────────────────────────────
  if (!/^export default /m.test(code)) {
    code = code.trimEnd() + `\n\nexport default ${componentName};\n`;
  }

  // ── 11. Fix root container ────────────────────────────────────────────────
  code = fixRootContainerStyle(code);

  // ── 12. Cleanup ───────────────────────────────────────────────────────────
  code = code.replace(/,\s*,/g, ",");
  code = code.replace(/\n{3,}/g, "\n\n");

  // ── 13. Header ───────────────────────────────────────────────────────────
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
// ---------------------------------------------------------------------------

function fixRootContainerStyle(code: string): string {
  const propsToInject: Record<string, string> = {
    boxSizing: '"border-box"',
    minHeight: '"100%"',
    wordBreak: '"break-word"',
    overflowWrap: '"break-word"',
  };

  return code.replace(
    /(return\s*\(\s*\n?\s*<\w+[^>]*\bstyle=\{\{)([\s\S]*?)(\}\})/,
    (_match: string, open: string, body: string, close: string) => {
      let updated = body;
      for (const [prop, val] of Object.entries(propsToInject)) {
        if (!updated.includes(`${prop}:`)) {
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
