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

const NAME = args.name;               // "Bounce Button"
const ID = args.id;                   // "bounce-button"
const CATEGORY = args.category;       // "buttons"
const CODE_PATH = path.resolve(args.code);
const TYPE = args.type || 'component'; // "component" | "block"
const IS_PRO = args.pro === 'true' ? true : (TYPE === 'block' ? true : false);
const IS_NEW = args.new !== 'false';
const DRY_RUN = args['dry-run'] === 'true';
const NO_BACKUP = args['no-backup'] === 'true';

// ── Helpers ──────────────────────────────────────────────────
function toPascal(str) {
  return str.replace(/(^|[-_ ])(\w)/g, (_, _s, c) => c.toUpperCase()).replace(/[-_ ]/g, '');
}

function backup(filePath) {
  if (NO_BACKUP) return;
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, filePath + '.bak');
  }
}

const PASCAL = toPascal(NAME);

// ── Validate ─────────────────────────────────────────────────
if (!fs.existsSync(CODE_PATH)) {
  console.error(`❌  Code file not found: ${CODE_PATH}`);
  process.exit(1);
}

const CONFIG_PATH = path.join(ROOT, 'src/config/components.config.ts');
const configSrc = fs.readFileSync(CONFIG_PATH, 'utf-8');

// Check duplicate
if (configSrc.includes(`id: '${ID}'`)) {
  console.error(`❌  ID "${ID}" already exists in components.config.ts`);
  process.exit(1);
}

// Category → section file mapping
const SECTION_MAP = {
  text: 'TextSection',
  cards: 'CardsSection',
  buttons: 'ButtonsSection',
  loaders: 'LoadersSection',
  images: 'ImagesSection',
  backgrounds: 'BackgroundsSection',
  cursor: 'CursorSection',
  scroll: 'ScrollSection',
};

const SECTION_ARRAY_MAP = {
  text: 'textComponents',
  cards: 'cardComponents',
  buttons: 'buttonComponents',
  loaders: 'loaderComponents',
  images: 'imageComponents',
  backgrounds: 'backgroundComponents',
  cursor: 'cursorComponents',
  scroll: 'scrollComponents',
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

// ── Read input file ──────────────────────────────────────────
const rawCode = fs.readFileSync(CODE_PATH, 'utf-8');
let componentSource, codeString;

if (rawCode.includes('// ---CODE---')) {
  const parts = rawCode.split('// ---CODE---');
  componentSource = parts[0].trim();
  codeString = parts.slice(1).join('// ---CODE---').trim();
} else {
  componentSource = rawCode.trim();
  codeString = rawCode.trim();
}

// ── Step 1: Create showcase component file ───────────────────
const showcasePath = path.join(ROOT, `src/components/ui-showcase/${PASCAL}.tsx`);

if (fs.existsSync(showcasePath)) {
  console.error(`❌  File already exists: ${showcasePath}`);
  process.exit(1);
}

console.log(`\n📦  Adding ${TYPE}: "${NAME}" (${ID}) → category "${CATEGORY}"\n`);

if (!DRY_RUN) {
  fs.writeFileSync(showcasePath, componentSource + '\n');
  console.log(`  ✅ Created  ${path.relative(ROOT, showcasePath)}`);
} else {
  console.log(`  [dry] Would create  ${path.relative(ROOT, showcasePath)}`);
}

// ── Step 2: Update components.config.ts ──────────────────────
const configEntry = `  { id: '${ID}', name: '${NAME}', category: '${CATEGORY}', type: '${TYPE}', isPro: ${IS_PRO}, isNew: ${IS_NEW} },`;

let newConfig = configSrc;

if (TYPE === 'component') {
  // Find the category comment (e.g. "// BUTTONS") and insert after last entry in that block
  const categoryComment = `// ${CATEGORY.toUpperCase()}`;
  const idx = newConfig.indexOf(categoryComment);

  if (idx === -1) {
    // New category — append before the closing bracket of `components` array
    const closingIdx = newConfig.indexOf('];');
    const insertLine = `  // ${CATEGORY.toUpperCase()}\n${configEntry}\n`;
    newConfig = newConfig.slice(0, closingIdx) + insertLine + newConfig.slice(closingIdx);

    // Add to categoryLabels
    const labelKey = CATEGORY.includes('-') ? `'${CATEGORY}'` : CATEGORY;
    newConfig = newConfig.replace(
      /};\s*\n\s*export const componentCategories/,
      `  ${labelKey}: '${NAME.split(' ')[0]}',\n};\n\nexport const componentCategories`
    );

    // Add to componentCategories array
    newConfig = newConfig.replace(
      /export const componentCategories = \[([^\]]+)\]/,
      (match, inner) => `export const componentCategories = [${inner.trimEnd()}, '${CATEGORY}']`
    );
  } else {
    // Find the next category comment or end of array to know where this category ends
    const afterIdx = idx + categoryComment.length;
    const restAfterCategory = newConfig.slice(afterIdx);
    // Find next "// " category comment or "];" 
    const nextCategoryMatch = restAfterCategory.match(/\n  \/\/ [A-Z]/);
    const nextBlocksMatch = restAfterCategory.indexOf('\n];\n');
    
    let insertPos;
    if (nextCategoryMatch && nextCategoryMatch.index < nextBlocksMatch) {
      insertPos = afterIdx + nextCategoryMatch.index;
    } else {
      insertPos = afterIdx + nextBlocksMatch;
    }
    newConfig = newConfig.slice(0, insertPos) + '\n' + configEntry + newConfig.slice(insertPos);
  }
} else {
  // Block — insert into blocks array
  const categoryCommentUpper = CATEGORY.toUpperCase();
  // Find if category already has entries
  const blocksArrayMatch = newConfig.match(/export const blocks: ComponentConfig\[\] = \[([\s\S]*?)\];/);
  if (blocksArrayMatch) {
    const blocksContent = blocksArrayMatch[1];
    const lastCategoryEntry = blocksContent.lastIndexOf(`category: '${CATEGORY}'`);
    if (lastCategoryEntry !== -1) {
      // Insert after the line containing the last entry of this category
      const afterLastEntry = blocksContent.indexOf('},', lastCategoryEntry);
      const absolutePos = newConfig.indexOf(blocksArrayMatch[0]) + 'export const blocks: ComponentConfig[] = ['.length + afterLastEntry + 2;
      newConfig = newConfig.slice(0, absolutePos) + '\n' + configEntry + newConfig.slice(absolutePos);
    } else {
      // New block category — append before closing of blocks array
      const blocksClose = newConfig.indexOf('];\n\nexport const categoryLabels');
      newConfig = newConfig.slice(0, blocksClose) + configEntry + '\n' + newConfig.slice(blocksClose);

      // Add to categoryLabels
      const labelKey = CATEGORY.includes('-') ? `'${CATEGORY}'` : CATEGORY;
      const categoryLabel = NAME.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      newConfig = newConfig.replace(
        /};\s*\n\s*export const componentCategories/,
        `  ${labelKey}: '${categoryLabel}',\n};\n\nexport const componentCategories`
      );

      // Add to blockCategories
      newConfig = newConfig.replace(
        /export const blockCategories = \[([^\]]+)\]/,
        (match, inner) => `export const blockCategories = [${inner.trimEnd()}, '${CATEGORY}']`
      );
    }
  }
}

if (!DRY_RUN) {
  backup(CONFIG_PATH);
  fs.writeFileSync(CONFIG_PATH, newConfig);
  console.log(`  ✅ Updated  src/config/components.config.ts`);
} else {
  console.log(`  [dry] Would update  src/config/components.config.ts`);
}

// ── Step 3: Update section file (components) or BlocksPage (blocks) ──
if (TYPE === 'component') {
  const sectionName = SECTION_MAP[CATEGORY];
  const sectionPath = sectionName
    ? path.join(ROOT, `src/components/sections/${sectionName}.tsx`)
    : null;

  if (sectionPath && fs.existsSync(sectionPath)) {
    let sectionSrc = fs.readFileSync(sectionPath, 'utf-8');

    // Add import
    const importLine = `import ${PASCAL} from '../ui-showcase/${PASCAL}';`;
    // Insert after the last import line
    const lastImportIdx = sectionSrc.lastIndexOf("import ");
    const endOfLastImport = sectionSrc.indexOf('\n', lastImportIdx);
    sectionSrc = sectionSrc.slice(0, endOfLastImport + 1) + importLine + '\n' + sectionSrc.slice(endOfLastImport + 1);

    // Add entry to array — find the closing "];" of the array
    const arrayName = SECTION_ARRAY_MAP[CATEGORY];
    // Escape the code string for embedding in template literal
    const escapedCode = codeString.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const entry = `  {\n    name: '${NAME}',\n    component: <${PASCAL} />,\n    code: \`${escapedCode}\`,\n  },`;

    if (arrayName) {
      // Find the array's closing bracket
      const arrayStart = sectionSrc.indexOf(`const ${arrayName}`);
      if (arrayStart !== -1) {
        // Find the "];" that closes this array
        const fromArray = sectionSrc.slice(arrayStart);
        const closingMatch = fromArray.lastIndexOf('\n];');
        if (closingMatch !== -1) {
          const absoluteClose = arrayStart + closingMatch;
          sectionSrc = sectionSrc.slice(0, absoluteClose) + '\n' + entry + sectionSrc.slice(absoluteClose);
        }
      }
    }

    if (!DRY_RUN) {
      backup(sectionPath);
      fs.writeFileSync(sectionPath, sectionSrc);
      console.log(`  ✅ Updated  src/components/sections/${sectionName}.tsx`);
    } else {
      console.log(`  [dry] Would update  src/components/sections/${sectionName}.tsx`);
    }
  } else if (!sectionPath) {
    // New category — create section file from template
    const newSectionName = toPascal(CATEGORY) + 'Section';
    const newSectionPath = path.join(ROOT, `src/components/sections/${newSectionName}.tsx`);
    const arrayName = CATEGORY.replace(/-/g, '') + 'Components';
    const headerInfo = SECTION_HEADERS[CATEGORY] || { label: CATEGORY.toUpperCase(), heading: toPascal(CATEGORY) };
    const escapedCode = codeString.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

    const template = `import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ${PASCAL} from '../ui-showcase/${PASCAL}';

const ${arrayName} = [
  {
    name: '${NAME}',
    component: <${PASCAL} />,
    code: \`${escapedCode}\`,
  },
];

const ${newSectionName} = () => (
  <section id="${CATEGORY}" className="py-24">
    <SectionHeader label="${headerInfo.label}" heading="${headerInfo.heading}" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {${arrayName}.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="${CATEGORY}">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ${newSectionName};
`;

    if (!DRY_RUN) {
      fs.writeFileSync(newSectionPath, template);
      console.log(`  ✅ Created  src/components/sections/${newSectionName}.tsx`);
    } else {
      console.log(`  [dry] Would create  src/components/sections/${newSectionName}.tsx`);
    }

    // Update ComponentsPage.tsx to import and render the new section
    const compPagePath = path.join(ROOT, 'src/pages/ComponentsPage.tsx');
    if (fs.existsSync(compPagePath)) {
      let compPageSrc = fs.readFileSync(compPagePath, 'utf-8');
      
      // Add import
      const lastSectionImport = compPageSrc.lastIndexOf("import ");
      const endOfImport = compPageSrc.indexOf('\n', lastSectionImport);
      compPageSrc = compPageSrc.slice(0, endOfImport + 1) +
        `import ${newSectionName} from '@/components/sections/${newSectionName}';\n` +
        compPageSrc.slice(endOfImport + 1);

      // Add render — before </main>
      compPageSrc = compPageSrc.replace(
        '</main>',
        `          <${newSectionName} />\n        </main>`
      );

      if (!DRY_RUN) {
        backup(compPagePath);
        fs.writeFileSync(compPagePath, compPageSrc);
        console.log(`  ✅ Updated  src/pages/ComponentsPage.tsx`);
      } else {
        console.log(`  [dry] Would update  src/pages/ComponentsPage.tsx`);
      }
    }
  }
} else {
  // Block — update BlocksPage.tsx
  const blocksPagePath = path.join(ROOT, 'src/pages/BlocksPage.tsx');
  let blocksSrc = fs.readFileSync(blocksPagePath, 'utf-8');

  // Add component import after the last ui-showcase component import
  const lastShowcaseImport = blocksSrc.lastIndexOf("from '@/components/ui-showcase/");
  const endOfThatImport = blocksSrc.indexOf('\n', lastShowcaseImport);
  const importLine = `import ${PASCAL} from '@/components/ui-showcase/${PASCAL}';`;
  blocksSrc = blocksSrc.slice(0, endOfThatImport + 1) + importLine + '\n' + blocksSrc.slice(endOfThatImport + 1);

  // Add ?raw source code import after the last ?raw import
  const lastRawImport = blocksSrc.lastIndexOf("?raw';");
  const endOfRawImport = blocksSrc.indexOf('\n', lastRawImport);
  const camelId = ID.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Code';
  const rawImportLine = `import ${camelId} from '@/components/ui-showcase/${PASCAL}.tsx?raw';`;
  blocksSrc = blocksSrc.slice(0, endOfRawImport + 1) + rawImportLine + '\n' + blocksSrc.slice(endOfRawImport + 1);

  // Add to blockComponentMap using getCode() pattern
  const mapEntry = `  '${ID}': { component: <${PASCAL} />, code: getCode(${camelId}, ${IS_PRO}) },`;

  // Insert before the closing "};" of blockComponentMap
  // Find the blockComponentMap declaration, then locate its closing "};"
  const mapStart = blocksSrc.indexOf('const blockComponentMap');
  const mapClose = blocksSrc.indexOf('\n};\n', mapStart);
  if (mapClose !== -1) {
    blocksSrc = blocksSrc.slice(0, mapClose) + '\n' + mapEntry + blocksSrc.slice(mapClose);
  }

  if (!DRY_RUN) {
    backup(blocksPagePath);
    fs.writeFileSync(blocksPagePath, blocksSrc);
    console.log(`  ✅ Updated  src/pages/BlocksPage.tsx`);
  } else {
    console.log(`  [dry] Would update  src/pages/BlocksPage.tsx`);
  }
}

console.log(`\n🎉  Done! "${NAME}" has been added.\n`);
if (DRY_RUN) {
  console.log('   (Dry run — no files were modified)\n');
}
