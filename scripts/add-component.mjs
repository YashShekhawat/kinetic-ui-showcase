#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Arg parsing ──────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      args[key] = val;
    }
  }
  return args;
}

const args = parseArgs(process.argv);

const REQUIRED = ['name', 'id', 'category', 'code'];
for (const flag of REQUIRED) {
  if (!args[flag]) {
    console.error(`❌  Missing required flag --${flag}`);
    process.exit(1);
  }
}

const NAME      = args.name;
const ID        = args.id;
const CATEGORY  = args.category;
const CODE_PATH = path.resolve(args.code);
const TYPE      = args.type || 'component';
const IS_PRO    = args.pro === 'true' ? true : (TYPE === 'block' ? true : false);
const IS_NEW    = args.new !== 'false';
const DRY_RUN   = args['dry-run'] === 'true';
const NO_BACKUP = args['no-backup'] === 'true';

// ── Helpers ──────────────────────────────────────────────────
function toPascal(str) {
  return str.replace(/(^|[-_ ])(\w)/g, (_, _s, c) => c.toUpperCase()).replace(/[-_ ]/g, '');
}

function backup(filePath) {
  if (NO_BACKUP || DRY_RUN) return;
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, filePath + '.bak');
  }
}

// Normalise CRLF → LF so all regex/indexOf work the same on Windows projects
function readNorm(filePath) {
  return fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
}

function writeFile(filePath, content, label) {
  if (DRY_RUN) {
    console.log(`  [dry] Would write   ${label}`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log(`  ✅ Written  ${label}`);
}

function updateFile(filePath, content, label) {
  if (DRY_RUN) {
    console.log(`  [dry] Would update  ${label}`);
    return;
  }
  backup(filePath);
  fs.writeFileSync(filePath, content);
  console.log(`  ✅ Updated  ${label}`);
}

const PASCAL   = toPascal(NAME);
const CAMEL_ID = ID.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Code';

// ── Validate input file ──────────────────────────────────────
if (!fs.existsSync(CODE_PATH)) {
  console.error(`❌  Code file not found: ${CODE_PATH}`);
  process.exit(1);
}

// ── Validate no duplicate id ─────────────────────────────────
const CONFIG_PATH = path.join(ROOT, 'src/config/components.config.ts');
const configSrc   = readNorm(CONFIG_PATH);

if (configSrc.includes(`id: '${ID}'`)) {
  console.error(`❌  ID "${ID}" already exists in components.config.ts`);
  process.exit(1);
}

// ── Validate showcase file doesn't already exist ─────────────
// Dry-run: warn but continue (we won't create it, just simulate)
// Real run: hard stop
const showcasePath = path.join(ROOT, `src/components/ui-showcase/${PASCAL}.tsx`);
if (fs.existsSync(showcasePath)) {
  if (DRY_RUN) {
    console.warn(`  [dry] WARNING: ${PASCAL}.tsx already exists — real run would abort here`);
  } else {
    console.error(`❌  File already exists: ${showcasePath}`);
    process.exit(1);
  }
}

// ── Read input file ──────────────────────────────────────────
const rawCode = readNorm(CODE_PATH);
let componentSource;

if (rawCode.includes('// ---CODE---')) {
  componentSource = rawCode.split('// ---CODE---')[0].trim();
} else {
  componentSource = rawCode.trim();
}

console.log(`\n📦  Adding ${TYPE}: "${NAME}" (${ID}) → category "${CATEGORY}"\n`);

// ── STEP 1: Write showcase component file ────────────────────
writeFile(
  showcasePath,
  componentSource + '\n',
  `src/components/ui-showcase/${PASCAL}.tsx`
);

// ── STEP 2: Update components.config.ts ─────────────────────
const configEntry = `  { id: '${ID}', name: '${NAME}', category: '${CATEGORY}', type: '${TYPE}', isPro: ${IS_PRO}, isNew: ${IS_NEW} },`;
let newConfig = configSrc;

if (TYPE === 'component') {
  const categoryComment = `// ${CATEGORY.toUpperCase()}`;
  const idx = newConfig.indexOf(categoryComment);

  if (idx === -1) {
    const closingIdx  = newConfig.indexOf('];');
    const insertLine  = `  // ${CATEGORY.toUpperCase()}\n${configEntry}\n`;
    newConfig = newConfig.slice(0, closingIdx) + insertLine + newConfig.slice(closingIdx);

    const labelKey = CATEGORY.includes('-') ? `'${CATEGORY}'` : CATEGORY;
    newConfig = newConfig.replace(
      /};\s*\n\s*export const componentCategories/,
      `  ${labelKey}: '${NAME.split(' ')[0]}',\n};\n\nexport const componentCategories`
    );
    newConfig = newConfig.replace(
      /export const componentCategories = \[([^\]]+)\]/,
      (match, inner) => `export const componentCategories = [${inner.trimEnd()}, '${CATEGORY}']`
    );
  } else {
    const afterIdx             = idx + categoryComment.length;
    const restAfterCategory    = newConfig.slice(afterIdx);
    const nextCategoryMatch    = restAfterCategory.match(/\n  \/\/ [A-Z]/);
    const nextBlocksMatch      = restAfterCategory.indexOf('\n];\n');

    let insertPos;
    if (nextCategoryMatch && nextCategoryMatch.index < nextBlocksMatch) {
      insertPos = afterIdx + nextCategoryMatch.index;
    } else {
      insertPos = afterIdx + nextBlocksMatch;
    }
    newConfig = newConfig.slice(0, insertPos) + '\n' + configEntry + newConfig.slice(insertPos);
  }
} else {
  // Block
  const blocksArrayMatch = newConfig.match(/export const blocks: ComponentConfig\[\] = \[([\s\S]*?)\];/);
  if (blocksArrayMatch) {
    const blocksContent      = blocksArrayMatch[1];
    const lastCategoryEntry  = blocksContent.lastIndexOf(`category: '${CATEGORY}'`);

    if (lastCategoryEntry !== -1) {
      const afterLastEntry = blocksContent.indexOf('},', lastCategoryEntry);
      const absolutePos =
        newConfig.indexOf(blocksArrayMatch[0]) +
        'export const blocks: ComponentConfig[] = ['.length +
        afterLastEntry + 2;
      newConfig = newConfig.slice(0, absolutePos) + '\n' + configEntry + newConfig.slice(absolutePos);
    } else {
      // New block category
      const blocksClose = newConfig.indexOf('];\n\nexport const categoryLabels');
      newConfig = newConfig.slice(0, blocksClose) + configEntry + '\n' + newConfig.slice(blocksClose);

      const labelKey      = CATEGORY.includes('-') ? `'${CATEGORY}'` : CATEGORY;
      const categoryLabel = NAME.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      newConfig = newConfig.replace(
        /};\s*\n\s*export const componentCategories/,
        `  ${labelKey}: '${categoryLabel}',\n};\n\nexport const componentCategories`
      );
      newConfig = newConfig.replace(
        /export const blockCategories = \[([^\]]+)\]/,
        (match, inner) => `export const blockCategories = [${inner.trimEnd()}, '${CATEGORY}']`
      );
    }
  }
}

updateFile(CONFIG_PATH, newConfig, 'src/config/components.config.ts');

// ── STEP 3: Update the right page file ──────────────────────
if (TYPE === 'component') {
  const SECTION_MAP = {
    text: 'TextSection', cards: 'CardsSection', buttons: 'ButtonsSection',
    loaders: 'LoadersSection', images: 'ImagesSection', backgrounds: 'BackgroundsSection',
    cursor: 'CursorSection', scroll: 'ScrollSection',
  };
  const SECTION_ARRAY_MAP = {
    text: 'textComponents', cards: 'cardComponents', buttons: 'buttonComponents',
    loaders: 'loaderComponents', images: 'imageComponents', backgrounds: 'backgroundComponents',
    cursor: 'cursorComponents', scroll: 'scrollComponents',
  };
  const SECTION_HEADERS = {
    text: { label: 'TEXT', heading: 'Typography in Motion' },
    cards: { label: 'CARDS', heading: 'Containers that Captivate' },
    buttons: { label: 'BUTTONS', heading: 'Every Click, Intentional' },
    loaders: { label: 'LOADERS', heading: 'Wait States, Elevated' },
    images: { label: 'IMAGES', heading: 'Visuals in Motion' },
    backgrounds: { label: 'BACKGROUNDS', heading: 'Set the Scene' },
    cursor: { label: 'CURSOR', heading: 'Pointer Personality' },
    scroll: { label: 'SCROLL', heading: 'Scroll-Driven Stories' },
  };

  const sectionName = SECTION_MAP[CATEGORY];
  const sectionPath = sectionName
    ? path.join(ROOT, `src/components/sections/${sectionName}.tsx`)
    : null;

  if (sectionPath && fs.existsSync(sectionPath)) {
    let sectionSrc = readNorm(sectionPath);

    const importLine    = `import ${PASCAL} from '../ui-showcase/${PASCAL}';`;
    const rawImportLine = `import ${CAMEL_ID} from '../ui-showcase/${PASCAL}.tsx?raw';`;
    const lastImportIdx = sectionSrc.lastIndexOf('import ');
    const endOfLastImport = sectionSrc.indexOf('\n', lastImportIdx);
    sectionSrc =
      sectionSrc.slice(0, endOfLastImport + 1) +
      importLine + '\n' + rawImportLine + '\n' +
      sectionSrc.slice(endOfLastImport + 1);

    const arrayName = SECTION_ARRAY_MAP[CATEGORY];
    if (arrayName) {
      const entry      = `  {\n    name: '${NAME}',\n    component: <${PASCAL} />,\n    code: ${CAMEL_ID},\n  },`;
      const arrayStart = sectionSrc.indexOf(`const ${arrayName}`);
      if (arrayStart !== -1) {
        const fromArray    = sectionSrc.slice(arrayStart);
        const closingMatch = fromArray.lastIndexOf('\n];');
        if (closingMatch !== -1) {
          const absoluteClose = arrayStart + closingMatch;
          sectionSrc = sectionSrc.slice(0, absoluteClose) + '\n' + entry + sectionSrc.slice(absoluteClose);
        }
      }
    }

    updateFile(sectionPath, sectionSrc, `src/components/sections/${sectionName}.tsx`);

  } else {
    // Create new section file
    const newSectionName = toPascal(CATEGORY) + 'Section';
    const newSectionPath = path.join(ROOT, `src/components/sections/${newSectionName}.tsx`);
    const arrayNameNew   = CATEGORY.replace(/-/g, '') + 'Components';
    const headerInfo     = SECTION_HEADERS[CATEGORY] || {
      label: CATEGORY.toUpperCase(),
      heading: toPascal(CATEGORY),
    };

    const template = `import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ${PASCAL} from '../ui-showcase/${PASCAL}';
import ${CAMEL_ID} from '../ui-showcase/${PASCAL}.tsx?raw';

const ${arrayNameNew} = [
  {
    name: '${NAME}',
    component: <${PASCAL} />,
    code: ${CAMEL_ID},
  },
];

const ${newSectionName} = () => (
  <section id="${CATEGORY}" className="py-24">
    <SectionHeader label="${headerInfo.label}" heading="${headerInfo.heading}" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {${arrayNameNew}.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="${CATEGORY}">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ${newSectionName};
`;

    writeFile(newSectionPath, template, `src/components/sections/${newSectionName}.tsx`);

    const compPagePath = path.join(ROOT, 'src/pages/ComponentsPage.tsx');
    if (fs.existsSync(compPagePath)) {
      let compPageSrc   = readNorm(compPagePath);
      const lastImport  = compPageSrc.lastIndexOf('import ');
      const endOfImport = compPageSrc.indexOf('\n', lastImport);
      compPageSrc =
        compPageSrc.slice(0, endOfImport + 1) +
        `import ${newSectionName} from '@/components/sections/${newSectionName}';\n` +
        compPageSrc.slice(endOfImport + 1);
      compPageSrc = compPageSrc.replace('</main>', `          <${newSectionName} />\n        </main>`);
      updateFile(compPagePath, compPageSrc, 'src/pages/ComponentsPage.tsx');
    }
  }

} else {
  // ── Block: detect which file holds blockComponentMap ────────
  // Support both BlocksPage.tsx (legacy) and BlockCategoryPage.tsx (new split)
  const candidateFiles = [
    path.join(ROOT, 'src/pages/BlockCategoryPage.tsx'),
    path.join(ROOT, 'src/pages/BlocksPage.tsx'),
  ];

  const blockPagePath = candidateFiles.find(f => {
    if (!fs.existsSync(f)) return false;
    const content = readNorm(f);
    return content.includes('blockComponentMap');
  });

  if (!blockPagePath) {
    console.error(`❌  Could not find a file containing blockComponentMap in src/pages/`);
    process.exit(1);
  }

  let src = readNorm(blockPagePath);
  const relPath = path.relative(ROOT, blockPagePath);

  // ── Detect import style: lazy() or static import ────────────
  const usesLazy = src.includes('lazy(() => import(');

  if (usesLazy) {
    // Insert lazy import after the last lazy() line
    const lastLazyIdx   = src.lastIndexOf('lazy(() => import(');
    const endOfLastLazy = src.indexOf('\n', lastLazyIdx);
    const lazyLine      = `const ${PASCAL} = lazy(() => import('@/components/ui-showcase/${PASCAL}'));`;
    src = src.slice(0, endOfLastLazy + 1) + lazyLine + '\n' + src.slice(endOfLastLazy + 1);
  } else {
    // Insert static import after the last ui-showcase import
    const lastShowcaseIdx   = src.lastIndexOf("from '@/components/ui-showcase/");
    const endOfLastShowcase = src.indexOf('\n', lastShowcaseIdx);
    const importLine        = `import ${PASCAL} from '@/components/ui-showcase/${PASCAL}';`;
    src = src.slice(0, endOfLastShowcase + 1) + importLine + '\n' + src.slice(endOfLastShowcase + 1);
  }

  // ── Add ?raw import after the last ?raw import line ──────────
  const lastRawIdx = src.lastIndexOf("?raw';");
  if (lastRawIdx === -1) {
    console.error(`❌  Could not find any ?raw import in ${relPath}`);
    process.exit(1);
  }
  const endOfLastRaw = src.indexOf('\n', lastRawIdx);
  const rawLine      = `import ${CAMEL_ID} from '@/components/ui-showcase/${PASCAL}.tsx?raw';`;
  src = src.slice(0, endOfLastRaw + 1) + rawLine + '\n' + src.slice(endOfLastRaw + 1);

  // ── Insert entry in blockComponentMap ────────────────────────
  // Find map, then find its closing "};" — robust against multi-line entries
  const mapStart = src.indexOf('const blockComponentMap');
  if (mapStart === -1) {
    console.error(`❌  Could not find blockComponentMap in ${relPath}`);
    process.exit(1);
  }

  // Walk forward from mapStart to find the matching closing "};"
  // Count braces: we enter the object when we hit the first "{" after "= {"
  const fromMap   = src.slice(mapStart);
  const eqBrace   = fromMap.indexOf('= {');
  if (eqBrace === -1) {
    console.error(`❌  blockComponentMap has unexpected format`);
    process.exit(1);
  }

  let depth   = 0;
  let closeAt = -1;
  for (let i = eqBrace + 2; i < fromMap.length; i++) {
    if (fromMap[i] === '{') depth++;
    else if (fromMap[i] === '}') {
      depth--;
      if (depth === 0) { closeAt = i; break; }
    }
  }

  if (closeAt === -1) {
    console.error(`❌  Could not find closing brace of blockComponentMap`);
    process.exit(1);
  }

  const absoluteClose = mapStart + closeAt;
  const mapEntry      = `  '${ID}': { component: <${PASCAL} />, code: getCode(${CAMEL_ID}, ${IS_PRO}) },`;
  src = src.slice(0, absoluteClose) + mapEntry + '\n' + src.slice(absoluteClose);

  updateFile(blockPagePath, src, relPath);
}

console.log(`\n🎉  Done! "${NAME}" has been added.\n`);
if (DRY_RUN) {
  console.log('   (Dry run — no files were modified)\n');
}
