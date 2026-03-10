import { getFile, putFile } from './github';

function toPascal(str: string): string {
  return str
    .replace(/(^|[-_ ])(\w)/g, (_, _s, c) => c.toUpperCase())
    .replace(/[-_ ]/g, '');
}

function toCamelId(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) + 'Code';
}

export interface AddComponentOptions {
  name: string;
  id: string;
  category: string;
  type: 'component' | 'block';
  isPro: boolean;
  isNew: boolean;
  code: string;
}

export interface PreviewChange {
  action: 'create' | 'update';
  file: string;
  detail: string;
}

// ── Section maps (mirrors scripts/add-component.mjs) ──────────────────
const SECTION_MAP: Record<string, string> = {
  text: 'TextSection', cards: 'CardsSection', buttons: 'ButtonsSection',
  loaders: 'LoadersSection', images: 'ImagesSection', backgrounds: 'BackgroundsSection',
  cursor: 'CursorSection', scroll: 'ScrollSection',
};
const SECTION_ARRAY_MAP: Record<string, string> = {
  text: 'textComponents', cards: 'cardComponents', buttons: 'buttonComponents',
  loaders: 'loaderComponents', images: 'imageComponents', backgrounds: 'backgroundComponents',
  cursor: 'cursorComponents', scroll: 'scrollComponents',
};

// ── Dry-run preview ────────────────────────────────────────────────────
export function previewChanges(opts: AddComponentOptions): PreviewChange[] {
  const { name, id, category, type, isPro, isNew, code: _code } = opts;
  const PASCAL = toPascal(name);
  const CAMEL_ID = toCamelId(id);
  const changes: PreviewChange[] = [];

  const showcasePath = `src/components/ui-showcase/${PASCAL}.tsx`;
  changes.push({ action: 'create', file: showcasePath, detail: 'New showcase component file' });

  const registryFile = type === 'block' ? 'src/config/blocks.registry.ts' : 'src/config/components.registry.ts';
  const entry = `{ id: '${id}', name: '${name}', category: '${category}', type: '${type}', isPro: ${isPro}, isNew: ${isNew} }`;
  changes.push({ action: 'update', file: registryFile, detail: `Add entry: ${entry}` });

  if (type === 'block') {
    changes.push({
      action: 'update',
      file: 'src/pages/BlockCategoryPage.tsx',
      detail: `Add lazy import: const ${PASCAL} = lazy(…)\nAdd raw import: import ${CAMEL_ID} from '…?raw'\nAdd map entry: '${id}': { component: <${PASCAL} />, code: getCode(${CAMEL_ID}, ${isPro}) }`,
    });
  } else {
    const sectionName = SECTION_MAP[category];
    if (sectionName) {
      changes.push({
        action: 'update',
        file: `src/components/sections/${sectionName}.tsx`,
        detail: `Add import ${PASCAL} + ${CAMEL_ID}, add entry to array`,
      });
    } else {
      const newSection = toPascal(category) + 'Section';
      changes.push({ action: 'create', file: `src/components/sections/${newSection}.tsx`, detail: 'New section file' });
      changes.push({ action: 'update', file: 'src/pages/ComponentsPage.tsx', detail: `Import and render <${newSection} />` });
    }
  }

  return changes;
}

// ── Real commit ────────────────────────────────────────────────────────
export async function addComponentToRepo(opts: AddComponentOptions): Promise<string[]> {
  const { name, id, category, type, isPro, isNew, code } = opts;
  const PASCAL = toPascal(name);
  const CAMEL_ID = toCamelId(id);
  const results: string[] = [];

  // 1. Write showcase component file
  const subDir = type === 'block' ? 'blocks' : 'components';
  const showcasePath = `src/components/ui-showcase/${subDir}/${category}/${PASCAL}.tsx`;
  const existingShowcase = await getFile(showcasePath);
  if (existingShowcase) throw new Error(`File already exists: ${showcasePath}`);

  await putFile(showcasePath, code, `feat: add ${name} showcase component`);
  results.push(`Created ${showcasePath}`);

  // 2. Update the correct registry file
  const registryPath = type === 'block'
    ? 'src/config/blocks.registry.ts'
    : 'src/config/components.registry.ts';
  const registryFile = await getFile(registryPath);
  if (!registryFile) throw new Error(`Could not read ${registryPath}`);

  let reg = registryFile.content.replace(/\r\n/g, '\n');
  if (reg.includes(`id: '${id}'`)) throw new Error(`ID "${id}" already exists in registry`);

  const configEntry = `  { id: '${id}', name: '${name}', category: '${category}', type: '${type}', isPro: ${isPro}, isNew: ${isNew} },`;

  if (type === 'block') {
    // Insert into blocks array, after last entry of same category or at end
    const arrayMatch = reg.match(/export const blocks: ComponentConfig\[\] = \[([\s\S]*?)\];/);
    if (!arrayMatch) throw new Error('Could not find blocks array in blocks.registry.ts');

    const blocksContent = arrayMatch[1];
    const lastCategoryEntry = blocksContent.lastIndexOf(`category: '${category}'`);

    if (lastCategoryEntry !== -1) {
      const afterLastEntry = blocksContent.indexOf('},', lastCategoryEntry);
      const absolutePos =
        reg.indexOf(arrayMatch[0]) +
        'export const blocks: ComponentConfig[] = ['.length +
        afterLastEntry + 2;
      reg = reg.slice(0, absolutePos) + '\n' + configEntry + reg.slice(absolutePos);
    } else {
      // New block category — add before closing ];
      const closeBracket = reg.lastIndexOf('];');
      reg = reg.slice(0, closeBracket) + '\n  // ' + category.toUpperCase().replace('-', ' ') + '\n' + configEntry + '\n' + reg.slice(closeBracket);

      // Add to blockCategories array
      reg = reg.replace(
        /export const blockCategories = \[([^\]]+)\]/,
        (_, inner: string) => `export const blockCategories = [${inner.trimEnd()},\n  '${category}',\n]`,
      );
    }
  } else {
    // Component registry
    const categoryComment = `// ${category.toUpperCase()}`;
    const idx = reg.indexOf(categoryComment);

    if (idx === -1) {
      // New component category
      const closeBracket = reg.indexOf('];');
      reg = reg.slice(0, closeBracket) + `\n  // ${category.toUpperCase()}\n${configEntry}\n` + reg.slice(closeBracket);

      reg = reg.replace(
        /export const componentCategories = \[([^\]]+)\]/,
        (_, inner: string) => `export const componentCategories = [${inner.trimEnd()},\n  '${category}',\n]`,
      );
    } else {
      const afterIdx = idx + categoryComment.length;
      const rest = reg.slice(afterIdx);
      const nextCat = rest.match(/\n  \/\/ [A-Z]/);
      const nextClose = rest.indexOf('\n];');
      const insertPos = (nextCat && nextCat.index! < nextClose)
        ? afterIdx + nextCat.index!
        : afterIdx + nextClose;
      reg = reg.slice(0, insertPos) + '\n' + configEntry + reg.slice(insertPos);
    }
  }

  await putFile(registryPath, reg, `feat: register ${name} in ${type === 'block' ? 'blocks' : 'components'} registry`, registryFile.sha);
  results.push(`Updated ${registryPath}`);

  // 3. Update page file
  if (type === 'block') {
    const pagePath = 'src/pages/BlockCategoryPage.tsx';
    const pageFile = await getFile(pagePath);
    if (!pageFile) throw new Error('Could not read BlockCategoryPage.tsx');

    let src = pageFile.content.replace(/\r\n/g, '\n');

    // Add lazy import
    const lastLazyIdx = src.lastIndexOf('lazy(() => import(');
    const endOfLastLazy = src.indexOf('\n', lastLazyIdx);
    src = src.slice(0, endOfLastLazy + 1) +
      `const ${PASCAL} = lazy(() => import('@/components/ui-showcase/${subDir}/${category}/${PASCAL}'));\n` +
      src.slice(endOfLastLazy + 1);

    // Add raw import
    const lastRawIdx = src.lastIndexOf("?raw';");
    const endOfLastRaw = src.indexOf('\n', lastRawIdx);
    src = src.slice(0, endOfLastRaw + 1) +
      `import ${CAMEL_ID} from '@/components/ui-showcase/${subDir}/${category}/${PASCAL}.tsx?raw';\n` +
      src.slice(endOfLastRaw + 1);

    // Add entry to blockComponentMap via brace counting
    const mapStart = src.indexOf('buildBlockComponentMap');
    const fromMap = src.slice(mapStart);
    const eqBrace = fromMap.indexOf('=> ({');
    if (eqBrace === -1) throw new Error('Could not find blockComponentMap opening');

    let depth = 0;
    let closeAt = -1;
    for (let i = eqBrace + 4; i < fromMap.length; i++) {
      if (fromMap[i] === '{') depth++;
      else if (fromMap[i] === '}') {
        depth--;
        if (depth === 0) { closeAt = i; break; }
      }
    }
    if (closeAt === -1) throw new Error('Could not find blockComponentMap closing brace');

    const absoluteClose = mapStart + closeAt;
    const mapEntry = `  '${id}': {\n    component: <${PASCAL} />,\n    code: getCode(${CAMEL_ID}, ${isPro}, proUnlocked),\n  },\n`;
    src = src.slice(0, absoluteClose) + mapEntry + src.slice(absoluteClose);

    await putFile(pagePath, src, `feat: add ${name} to BlockCategoryPage`, pageFile.sha);
    results.push('Updated BlockCategoryPage.tsx');
  } else {
    // Component: update section file
    const sectionName = SECTION_MAP[category];
    if (sectionName) {
      const sectionPath = `src/components/sections/${sectionName}.tsx`;
      const sectionFile = await getFile(sectionPath);
      if (!sectionFile) throw new Error(`Could not read ${sectionPath}`);

      let sectionSrc = sectionFile.content.replace(/\r\n/g, '\n');

      const importLine = `import ${PASCAL} from '../ui-showcase/${subDir}/${category}/${PASCAL}';`;
      const rawImportLine = `import ${CAMEL_ID} from '../ui-showcase/${subDir}/${category}/${PASCAL}.tsx?raw';`;
      const lastImportIdx = sectionSrc.lastIndexOf('import ');
      const endOfLastImport = sectionSrc.indexOf('\n', lastImportIdx);
      sectionSrc =
        sectionSrc.slice(0, endOfLastImport + 1) +
        importLine + '\n' + rawImportLine + '\n' +
        sectionSrc.slice(endOfLastImport + 1);

      const arrayName = SECTION_ARRAY_MAP[category];
      if (arrayName) {
        const entry = `  {\n    name: '${name}',\n    component: <${PASCAL} />,\n    code: ${CAMEL_ID},\n  },`;
        const arrayStart = sectionSrc.indexOf(`const ${arrayName}`);
        if (arrayStart !== -1) {
          const fromArray = sectionSrc.slice(arrayStart);
          const closingMatch = fromArray.lastIndexOf('\n];');
          if (closingMatch !== -1) {
            const absoluteClose = arrayStart + closingMatch;
            sectionSrc = sectionSrc.slice(0, absoluteClose) + '\n' + entry + sectionSrc.slice(absoluteClose);
          }
        }
      }

      await putFile(sectionPath, sectionSrc, `feat: add ${name} to ${sectionName}`, sectionFile.sha);
      results.push(`Updated ${sectionPath}`);
    } else {
      // New section — create it
      const newSectionName = toPascal(category) + 'Section';
      const arrayNameNew = category.replace(/-/g, '') + 'Components';
      const headerLabel = category.toUpperCase();
      const headerHeading = toPascal(category);

      const template = `import ComponentCard from '../ComponentCard';
import SectionHeader from '../SectionHeader';
import ${PASCAL} from '../ui-showcase/${subDir}/${category}/${PASCAL}';
import ${CAMEL_ID} from '../ui-showcase/${subDir}/${category}/${PASCAL}.tsx?raw';

const ${arrayNameNew} = [
  {
    name: '${name}',
    component: <${PASCAL} />,
    code: ${CAMEL_ID},
  },
];

const ${newSectionName} = () => (
  <section id="${category}" className="py-24">
    <SectionHeader label="${headerLabel}" heading="${headerHeading}" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {${arrayNameNew}.map(c => (
        <ComponentCard key={c.name} name={c.name} code={c.code} category="${category}">
          {c.component}
        </ComponentCard>
      ))}
    </div>
  </section>
);

export default ${newSectionName};
`;

      await putFile(`src/components/sections/${newSectionName}.tsx`, template, `feat: create ${newSectionName}`);
      results.push(`Created src/components/sections/${newSectionName}.tsx`);

      // Update ComponentsPage.tsx
      const compPageFile = await getFile('src/pages/ComponentsPage.tsx');
      if (compPageFile) {
        let compSrc = compPageFile.content.replace(/\r\n/g, '\n');
        const lastImport = compSrc.lastIndexOf('import ');
        const endOfImport = compSrc.indexOf('\n', lastImport);
        compSrc =
          compSrc.slice(0, endOfImport + 1) +
          `import ${newSectionName} from '@/components/sections/${newSectionName}';\n` +
          compSrc.slice(endOfImport + 1);
        compSrc = compSrc.replace('</main>', `          <${newSectionName} />\n        </main>`);
        await putFile('src/pages/ComponentsPage.tsx', compSrc, `feat: add ${newSectionName} to ComponentsPage`, compPageFile.sha);
        results.push('Updated ComponentsPage.tsx');
      }
    }
  }

  // Also update categoryLabels in components.config.ts if new category
  const configFile = await getFile('src/config/components.config.ts');
  if (configFile) {
    let cfg = configFile.content.replace(/\r\n/g, '\n');
    const labelKey = category.includes('-') ? `'${category}'` : category;
    if (!cfg.includes(`${labelKey}:`)) {
      const categoryLabel = name.split(' ').map((w: string) => w[0].toUpperCase() + w.slice(1)).join(' ');
      cfg = cfg.replace(
        /};\s*$/m,
        `  ${labelKey}: '${categoryLabel}',\n};`,
      );
      await putFile('src/config/components.config.ts', cfg, `feat: add ${category} label`, configFile.sha);
      results.push('Updated components.config.ts (category label)');
    }
  }

  return results;
}
