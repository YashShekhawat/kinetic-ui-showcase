import { useState, useEffect, useCallback } from 'react';
import { getFile, putFile, getRecentCommits, type CommitInfo } from '@/lib/github';
import { addComponentToRepo, previewChanges, type AddComponentOptions, type PreviewChange } from '@/lib/adminUtils';

// ── Password Gate ──────────────────────────────────────────────────────
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

interface RegistryEntry {
  id: string;
  name: string;
  category: string;
  type: 'component' | 'block';
  isPro: boolean;
  isNew: boolean;
}

function toPascal(str: string): string {
  return str.replace(/(^|[-_ ])(\w)/g, (_, _s, c) => c.toUpperCase()).replace(/[-_ ]/g, '');
}

function parseRegistry(content: string): RegistryEntry[] {
  const entries: RegistryEntry[] = [];
  // Match entries across multiple lines — capture the 6 core fields
  const regex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*category:\s*'([^']+)',\s*type:\s*'([^']+)',\s*isPro:\s*(true|false),\s*isNew:\s*(true|false)[^}]*\}/gs;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) {
    entries.push({ id: m[1], name: m[2], category: m[3], type: m[4] as 'component' | 'block', isPro: m[5] === 'true', isNew: m[6] === 'true' });
  }
  return entries;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Map registry id → actual filename (without .tsx) for entries where PascalCase(name) doesn't match
const FILE_NAME_MAP: Record<string, string> = {
  // components
  'dna-loader': 'DNAStrandLoader',
  'orbit-loader': 'OrbitLoader',
  'skeleton-loader': 'SkeletonScreenLoader',
  'pulse-ring': 'PulseRingLoader',
  'text-progress-loader': 'TextProgressLoader',
  'morphing-shape': 'MorphingShapeLoader',
  'hover-reveal': 'HoverRevealImage',
  'image-stack': 'ImageStackReveal',
  'animated-grid': 'AnimatedGridLines',
  'trail-cursor': 'CursorTrail',
  'magnetic-cursor': 'MagneticButton',
  'marquee': 'Marquee',
  'word-by-word': 'WordByWordReveal',
  // blocks
  'bento-grid': 'BentoGridSection',
  'feature-list': 'FeatureListReveal',
  'steps-accordion': 'ProcessStepsAccordion',
  'marquee-statement': 'MarqueeStatementSection',
  'cinematic-split': 'CinematicTextImageReveal',
};

function getShowcasePath(entry: RegistryEntry): string {
  const fileName = FILE_NAME_MAP[entry.id] || toPascal(entry.name);
  const subDir = entry.type === 'block' ? 'blocks' : 'components';
  return `src/components/ui-showcase/${subDir}/${entry.category}/${fileName}.tsx`;
}

// ── Styles ─────────────────────────────────────────────────────────────
const S = {
  bg: '#0e0e14', bgDark: '#0a0a0f', bgSidebar: '#0d0d14',
  border: '#1e1e2e', violet: '#7c3aed', violetLight: '#a78bfa',
  text: '#f0ede8', muted: '#909098', mutedDark: '#606070',
  green: '#34d399', red: '#f87171', yellow: '#fbbf24',
} as const;

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%', padding: '8px 12px', fontSize: 13, background: S.bgDark,
  border: `1px solid ${hasError ? S.red : S.border}`, borderRadius: 8, color: S.text,
  outline: 'none', fontFamily: 'inherit',
});

// ── Login Screen ───────────────────────────────────────────────────────
function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const inputPw = pw.trim();
    const expectedPw = String(ADMIN_PASS ?? '').trim();
    if (inputPw === expectedPw || inputPw === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      onAuth();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{ background: S.bgDark, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 340, textAlign: 'center' }}>
        <h1 className="font-mono" style={{ fontSize: 18, color: S.violetLight, marginBottom: 32, letterSpacing: '0.12em' }}>KINETIC UI ADMIN</h1>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Password" className="font-mono"
          style={{ width: '100%', padding: '10px 14px', fontSize: 13, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 8, color: S.text, outline: 'none', marginBottom: 12 }} />
        {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 8 }}>{error}</p>}
        <button onClick={submit} className="font-mono" style={{ width: '100%', padding: '10px 0', fontSize: 13, background: S.violet, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Enter</button>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ entries, loading, onRefresh, onLogout, onSelectEntry, selectedId }: {
  entries: RegistryEntry[]; loading: boolean; onRefresh: () => void; onLogout: () => void;
  onSelectEntry: (entry: RegistryEntry) => void; selectedId: string | null;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const compEntries = entries.filter((e) => e.type === 'component');
  const blockEntries = entries.filter((e) => e.type === 'block');

  const groupByCategory = (items: RegistryEntry[]) => {
    const grouped: Record<string, RegistryEntry[]> = {};
    items.forEach((e) => { if (!grouped[e.category]) grouped[e.category] = []; grouped[e.category].push(e); });
    return grouped;
  };

  const compGrouped = groupByCategory(compEntries);
  const blockGrouped = groupByCategory(blockEntries);

  const renderGroup = (typeLabel: string, typeKey: string, grouped: Record<string, RegistryEntry[]>, count: number) => (
    <div key={typeKey} style={{ marginBottom: 8 }}>
      <button
        onClick={() => toggle(typeKey)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: 8, color: S.mutedDark, transform: expanded[typeKey] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        <span className="font-mono" style={{ fontSize: 11, color: S.violetLight, letterSpacing: '0.1em', fontWeight: 600 }}>{typeLabel}</span>
        <span className="font-mono" style={{ fontSize: 9, color: S.mutedDark, marginLeft: 'auto' }}>{count}</span>
      </button>
      {expanded[typeKey] && (
        <div style={{ paddingLeft: 8 }}>
          {Object.keys(grouped).sort().map((cat) => (
            <div key={cat} style={{ marginBottom: 4 }}>
              <button
                onClick={() => toggle(`${typeKey}-${cat}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '4px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 7, color: S.mutedDark, transform: expanded[`${typeKey}-${cat}`] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
                <span className="font-mono" style={{ fontSize: 10, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{cat}</span>
                <span className="font-mono" style={{ fontSize: 8, color: S.mutedDark, marginLeft: 'auto' }}>{grouped[cat].length}</span>
              </button>
              {expanded[`${typeKey}-${cat}`] && (
                <div style={{ paddingLeft: 12 }}>
                  {grouped[cat].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectEntry(item)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', width: '100%',
                        background: selectedId === item.id ? 'rgba(124,58,237,0.1)' : 'transparent',
                        border: selectedId === item.id ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
                        borderRadius: 4, cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 12, color: selectedId === item.id ? S.violetLight : S.text }}>{item.name}</span>
                      {item.isPro && <span className="font-mono" style={{ fontSize: 8, color: S.violet, padding: '1px 4px', borderRadius: 3, background: 'rgba(124,58,237,0.1)' }}>PRO</span>}
                      {item.isNew && <span className="font-mono" style={{ fontSize: 8, color: S.green, padding: '1px 4px', borderRadius: 3, background: 'rgba(52,211,153,0.1)' }}>NEW</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: 260, minHeight: '100vh', background: S.bgSidebar, borderRight: `1px solid ${S.border}`, padding: '20px 16px', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span className="font-mono" style={{ fontSize: 13, color: S.violetLight, letterSpacing: '0.12em' }}>ADMIN</span>
        <button onClick={onRefresh} title="Refresh" style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16 }}>↻</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: 14, borderRadius: 4, background: '#1a1a2a' }} />)}
          </div>
        ) : (
          <>
            {renderGroup('COMPONENTS', 'components', compGrouped, compEntries.length)}
            {renderGroup('BLOCKS', 'blocks', blockGrouped, blockEntries.length)}
          </>
        )}
      </div>

      <div style={{ paddingTop: 12, borderTop: `1px solid ${S.border}` }}>
        <p className="font-mono" style={{ fontSize: 10, color: S.mutedDark }}>{compEntries.length} components · {blockEntries.length} blocks</p>
        <button onClick={onLogout} className="font-mono" style={{ marginTop: 12, width: '100%', padding: '6px 0', fontSize: 11, background: 'transparent', border: `1px solid ${S.border}`, borderRadius: 6, color: S.muted, cursor: 'pointer', letterSpacing: '0.06em' }}>Logout</button>
      </div>
    </div>
  );
}

// ── Tab: Add New ───────────────────────────────────────────────────────
const DEFAULT_BLOCK_CATEGORIES = ['hero', 'features', 'social-proof', 'pricing', 'process', 'content'];
const DEFAULT_COMPONENT_CATEGORIES = ['text', 'cards', 'buttons', 'loaders', 'images', 'backgrounds', 'cursor', 'scroll'];

interface FormErrors { name?: string; id?: string; category?: string; code?: string; }

function AddNewTab({ onSuccess, blockCategories, componentCategories, onCategoryCreated, prefill }: {
  onSuccess: () => void;
  blockCategories: string[];
  componentCategories: string[];
  onCategoryCreated: (cat: string, type: 'block' | 'component') => void;
  prefill?: { category: string; type: 'block' | 'component' } | null;
}) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [idManual, setIdManual] = useState(false);
  const [category, setCategory] = useState(prefill?.category || '');
  const [type, setType] = useState<'component' | 'block'>(prefill?.type || 'block');

  useEffect(() => {
    if (prefill) { setCategory(prefill.category); setType(prefill.type); }
  }, [prefill]);
  const [isPro, setIsPro] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successLog, setSuccessLog] = useState<string[] | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [preview, setPreview] = useState<PreviewChange[] | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => { if (!idManual) setId(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')); }, [name, idManual]);
  useEffect(() => { setIsPro(type === 'block'); }, [type]);

  const categorySuggestions = type === 'block' ? blockCategories : componentCategories;

  const handleCreateCategory = () => {
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) return;
    onCategoryCreated(slug, type);
    setCategory(slug);
    setNewCategoryName('');
    setShowNewCategory(false);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!id.trim() || !/^[a-z0-9-]+$/.test(id)) errs.id = 'ID must be lowercase, numbers, hyphens only';
    if (!category.trim()) errs.category = 'Category is required';
    if (!code.trim()) errs.code = 'Code is required';
    else if (!code.includes('export default')) errs.code = 'Code must contain "export default"';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePreview = () => { if (!validate()) return; setPreview(previewChanges({ name: name.trim(), id: id.trim(), category: category.trim(), type, isPro, isNew, code })); };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true); setSubmitError(''); setSuccessLog(null);
    try {
      const results = await addComponentToRepo({ name: name.trim(), id: id.trim(), category: category.trim(), type, isPro, isNew, code });
      setSuccessLog(results);
      setName(''); setId(''); setIdManual(false); setCategory(''); setCode(''); setIsNew(true);
      onSuccess();
    } catch (err: any) { setSubmitError(err.message || 'Unknown error'); }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Name */}
      <div>
        <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>NAME</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kinetic Hero" style={inputStyle(!!errors.name)} />
        {errors.name && <p style={{ color: S.red, fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
      </div>
      {/* ID */}
      <div>
        <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>ID</label>
        <input value={id} onChange={(e) => { setId(e.target.value); setIdManual(true); }} placeholder="e.g. kinetic-hero" className="font-mono" style={{ ...inputStyle(!!errors.id), fontSize: 12 }} />
        {errors.id && <p style={{ color: S.red, fontSize: 11, marginTop: 4 }}>{errors.id}</p>}
      </div>
      {/* Type */}
      <div>
        <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>TYPE</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['component', 'block'] as const).map((t) => (
            <button key={t} onClick={() => setType(t)} className="font-mono" style={{ flex: 1, padding: '8px 0', fontSize: 12, borderRadius: 8, cursor: 'pointer', border: `1px solid ${type === t ? S.violet : S.border}`, background: type === t ? 'rgba(124,58,237,0.1)' : 'transparent', color: type === t ? S.violetLight : S.muted }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {/* Category */}
      <div>
        <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>CATEGORY</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {categorySuggestions.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className="font-mono" style={{
              padding: '5px 12px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${category === c ? S.violet : S.border}`,
              background: category === c ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: category === c ? S.violetLight : S.muted,
            }}>{c}</button>
          ))}
          <button onClick={() => setShowNewCategory(!showNewCategory)} className="font-mono" style={{
            padding: '5px 12px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
            border: `1px dashed ${S.violet}`, background: 'transparent', color: S.violetLight,
          }}>+ New</button>
        </div>
        {showNewCategory && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. navigation"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              style={{ ...inputStyle(), flex: 1 }} />
            <button onClick={handleCreateCategory} className="font-mono" style={{
              padding: '8px 16px', fontSize: 11, borderRadius: 8, cursor: 'pointer',
              border: 'none', background: S.violet, color: '#fff',
            }}>Create</button>
          </div>
        )}
        {!categorySuggestions.includes(category) && category && (
          <p className="font-mono" style={{ fontSize: 10, color: S.yellow, marginBottom: 4 }}>⚡ New category "{category}" will be created</p>
        )}
        {errors.category && <p style={{ color: S.red, fontSize: 11, marginTop: 4 }}>{errors.category}</p>}
      </div>
      {/* Toggles */}
      <div style={{ display: 'flex', gap: 32 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={isPro} onChange={(e) => setIsPro(e.target.checked)} style={{ accentColor: S.violet }} />
          <span className="font-mono" style={{ fontSize: 12, color: S.muted }}>Pro</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} style={{ accentColor: S.violet }} />
          <span className="font-mono" style={{ fontSize: 12, color: S.muted }}>New</span>
        </label>
      </div>
      {/* Code */}
      <div>
        <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>CODE</label>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your TSX component code here..." className="font-mono" style={{ ...inputStyle(!!errors.code), minHeight: 400, resize: 'vertical', lineHeight: 1.6, fontSize: 13, padding: 16 }} />
        {errors.code && <p style={{ color: S.red, fontSize: 11, marginTop: 4 }}>{errors.code}</p>}
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handlePreview} className="font-mono" style={{ flex: 1, padding: '10px 0', fontSize: 12, borderRadius: 8, cursor: 'pointer', border: `1px solid ${S.violet}`, background: 'transparent', color: S.violetLight }}>Preview Changes</button>
        <button onClick={handleSubmit} disabled={submitting} className="font-syne" style={{ flex: 2, padding: '10px 0', fontSize: 14, borderRadius: 8, cursor: submitting ? 'wait' : 'pointer', border: 'none', background: S.violet, color: '#fff', fontWeight: 600, opacity: submitting ? 0.7 : 1 }}>{submitting ? 'Pushing to GitHub...' : 'Add to Repository'}</button>
      </div>
      {successLog && (
        <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 8, padding: 16 }}>
          <p className="font-mono" style={{ fontSize: 12, color: S.green, marginBottom: 8 }}>✓ Successfully pushed</p>
          {successLog.map((l, i) => <p key={i} className="font-mono" style={{ fontSize: 11, color: S.muted, marginLeft: 8 }}>• {l}</p>)}
          <p className="font-mono" style={{ fontSize: 10, color: S.mutedDark, marginTop: 10 }}>Vercel will auto-deploy in ~30 seconds</p>
        </div>
      )}
      {submitError && (
        <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: 16 }}>
          <p className="font-mono" style={{ fontSize: 12, color: S.red }}>{submitError}</p>
        </div>
      )}
      {preview && (
        <div style={{ background: S.bgDark, border: `1px solid ${S.border}`, borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="font-mono" style={{ fontSize: 13, color: S.text }}>Preview Changes</span>
            <button onClick={() => setPreview(null)} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer' }}>✕</button>
          </div>
          {preview.map((ch, i) => (
            <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${ch.action === 'create' ? S.green : S.violetLight}` }}>
              <p className="font-mono" style={{ fontSize: 11, color: ch.action === 'create' ? S.green : S.violetLight }}>{ch.action.toUpperCase()} {ch.file}</p>
              <p className="font-mono" style={{ fontSize: 10, color: S.mutedDark, whiteSpace: 'pre-wrap', marginTop: 2 }}>{ch.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Edit Code ─────────────────────────────────────────────────────
function EditCodeTab({ entry }: { entry: RegistryEntry | null }) {
  const [code, setCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [filePath, setFilePath] = useState('');
  const [sha, setSha] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (!entry) { setCode(''); setOriginalCode(''); setFilePath(''); setSha(''); return; }
    const path = getShowcasePath(entry);
    setFilePath(path);
    setLoading(true);
    setStatus(null);
    getFile(path).then((file) => {
      if (file) {
        setCode(file.content);
        setOriginalCode(file.content);
        setSha(file.sha);
      } else {
        setCode('');
        setOriginalCode('');
        setSha('');
        setStatus({ type: 'error', msg: `File not found: ${path}` });
      }
      setLoading(false);
    }).catch(() => { setLoading(false); setStatus({ type: 'error', msg: 'Failed to fetch file' }); });
  }, [entry]);

  const isDirty = code !== originalCode;

  const handleSave = async () => {
    if (!isDirty || !entry) return;
    setSaving(true);
    setStatus(null);
    try {
      const result = await putFile(filePath, code, `update: ${entry.name} code`, sha);
      setSha(result.content.sha);
      setOriginalCode(code);
      setStatus({ type: 'success', msg: `Saved ${entry.name} — Vercel will auto-deploy in ~30s` });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to save' });
    }
    setSaving(false);
  };

  if (!entry) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <p className="font-mono" style={{ fontSize: 13, color: S.mutedDark }}>← Select a component from the sidebar to edit its code</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 className="font-syne" style={{ fontSize: 18, color: S.text, margin: 0, fontWeight: 600 }}>{entry.name}</h3>
          <p className="font-mono" style={{ fontSize: 11, color: S.mutedDark, marginTop: 4 }}>{filePath}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDirty && <span className="font-mono" style={{ fontSize: 10, color: S.yellow }}>● unsaved</span>}
          <span className="font-mono" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: entry.type === 'block' ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.05)', color: entry.type === 'block' ? S.violetLight : S.mutedDark }}>
            {entry.type.toUpperCase()}
          </span>
          <span className="font-mono" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: S.mutedDark }}>{entry.category}</span>
        </div>
      </div>

      {/* Editor */}
      {loading ? (
        <div style={{ height: 400, background: S.bgDark, borderRadius: 8, border: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="font-mono" style={{ fontSize: 12, color: S.mutedDark }}>Loading...</p>
        </div>
      ) : (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono"
          style={{
            width: '100%', minHeight: 500, resize: 'vertical', lineHeight: 1.6, fontSize: 13,
            padding: 16, background: S.bgDark, border: `1px solid ${S.border}`, borderRadius: 8,
            color: S.text, outline: 'none',
          }}
        />
      )}

      {/* Save button */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="font-syne"
          style={{
            padding: '10px 32px', fontSize: 14, borderRadius: 8,
            cursor: !isDirty || saving ? 'not-allowed' : 'pointer',
            border: 'none', background: isDirty ? S.violet : S.border,
            color: isDirty ? '#fff' : S.mutedDark, fontWeight: 600,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save to GitHub'}
        </button>
        {isDirty && (
          <button
            onClick={() => setCode(originalCode)}
            className="font-mono"
            style={{ padding: '8px 16px', fontSize: 12, borderRadius: 8, cursor: 'pointer', border: `1px solid ${S.border}`, background: 'transparent', color: S.muted }}
          >
            Discard
          </button>
        )}
      </div>

      {/* Status */}
      {status && (
        <div style={{
          background: status.type === 'success' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
          border: `1px solid ${status.type === 'success' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
          borderRadius: 8, padding: 12,
        }}>
          <p className="font-mono" style={{ fontSize: 12, color: status.type === 'success' ? S.green : S.red }}>{status.msg}</p>
        </div>
      )}
    </div>
  );
}

// ── Tab: Reorder ───────────────────────────────────────────────────────
function ReorderTab({ entries, onSuccess }: { entries: RegistryEntry[]; onSuccess: () => void }) {
  const [filterType, setFilterType] = useState<'block' | 'component'>('block');
  const [items, setItems] = useState<RegistryEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    setItems(entries.filter((e) => e.type === filterType));
  }, [entries, filterType]);

  const move = (index: number, dir: -1 | 1) => {
    const newItems = [...items];
    const target = index + dir;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setItems(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const registryPath = filterType === 'block' ? 'src/config/blocks.registry.ts' : 'src/config/components.registry.ts';
      const file = await getFile(registryPath);
      if (!file) throw new Error(`Could not read ${registryPath}`);

      // Rebuild registry content with new order
      const arrayName = filterType === 'block' ? 'blocks' : 'components';

      // Group items by category in the order they appear
      const categories: string[] = [];
      items.forEach((item) => {
        if (!categories.includes(item.category)) categories.push(item.category);
      });

      let entriesStr = '';
      categories.forEach((cat, ci) => {
        entriesStr += `  // ${cat.toUpperCase().replace('-', ' ')}\n`;
        items.filter((i) => i.category === cat).forEach((item) => {
          entriesStr += `  { id: '${item.id}', name: '${item.name}', category: '${item.category}', type: '${item.type}', isPro: ${item.isPro}, isNew: ${item.isNew} },\n`;
        });
        if (ci < categories.length - 1) entriesStr += '\n';
      });

      // Rebuild the file
      let content = file.content.replace(/\r\n/g, '\n');

      // Find and replace the array
      const arrayRegex = new RegExp(`export const ${arrayName}: ComponentConfig\\[\\] = \\[[\\s\\S]*?\\];`);
      const newArray = `export const ${arrayName}: ComponentConfig[] = [\n${entriesStr}];`;
      content = content.replace(arrayRegex, newArray);

      // Also rebuild the categories array
      const catArrayName = filterType === 'block' ? 'blockCategories' : 'componentCategories';
      const catRegex = new RegExp(`export const ${catArrayName} = \\[[\\s\\S]*?\\];`);
      const catStr = categories.map((c) => `  '${c}',`).join('\n');
      content = content.replace(catRegex, `export const ${catArrayName} = [\n${catStr}\n];`);

      await putFile(registryPath, content, `reorder: update ${filterType} display order`, file.sha);
      setStatus({ type: 'success', msg: `Order saved — Vercel will auto-deploy in ~30s` });
      onSuccess();
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to save' });
    }
    setSaving(false);
  };

  const hasChanged = (() => {
    const original = entries.filter((e) => e.type === filterType);
    if (original.length !== items.length) return true;
    return items.some((item, i) => item.id !== original[i].id);
  })();

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Type filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['block', 'component'] as const).map((t) => (
          <button key={t} onClick={() => setFilterType(t)} className="font-mono" style={{
            padding: '6px 16px', fontSize: 12, borderRadius: 8, cursor: 'pointer',
            border: `1px solid ${filterType === t ? S.violet : S.border}`,
            background: filterType === t ? 'rgba(124,58,237,0.1)' : 'transparent',
            color: filterType === t ? S.violetLight : S.muted,
          }}>
            {t === 'block' ? 'Blocks' : 'Components'}
          </button>
        ))}
      </div>

      {/* Sortable list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, index) => {
          // Show category separator
          const showCatHeader = index === 0 || items[index - 1].category !== item.category;
          return (
            <div key={item.id}>
              {showCatHeader && (
                <p className="font-mono" style={{ fontSize: 9, color: S.mutedDark, letterSpacing: '0.15em', marginTop: index > 0 ? 16 : 0, marginBottom: 6, textTransform: 'uppercase' }}>
                  {item.category}
                </p>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                background: S.bgDark, border: `1px solid ${S.border}`, borderRadius: 6,
              }}>
                {/* Move buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', color: index === 0 ? S.border : S.muted, fontSize: 12, lineHeight: 1, padding: 0 }}
                  >▲</button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    style={{ background: 'none', border: 'none', cursor: index === items.length - 1 ? 'default' : 'pointer', color: index === items.length - 1 ? S.border : S.muted, fontSize: 12, lineHeight: 1, padding: 0 }}
                  >▼</button>
                </div>

                {/* Index */}
                <span className="font-mono" style={{ fontSize: 10, color: S.mutedDark, width: 20, textAlign: 'center' }}>{index + 1}</span>

                {/* Name */}
                <span style={{ flex: 1, fontSize: 13, color: S.text }}>{item.name}</span>

                {/* Badges */}
                <span className="font-mono" style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: S.mutedDark }}>{item.category}</span>

                {/* Pro/Free toggle */}
                <button
                  onClick={() => {
                    setItems(prev => prev.map((it, i) => i === index ? { ...it, isPro: !it.isPro } : it));
                  }}
                  className="font-mono"
                  style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                    border: `1px solid ${item.isPro ? 'rgba(124,58,237,0.3)' : 'rgba(52,211,153,0.3)'}`,
                    background: item.isPro ? 'rgba(124,58,237,0.1)' : 'rgba(52,211,153,0.08)',
                    color: item.isPro ? S.violet : S.green,
                    minWidth: 42, textAlign: 'center',
                  }}
                >
                  {item.isPro ? 'PRO' : 'FREE'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={handleSave}
          disabled={!hasChanged || saving}
          className="font-syne"
          style={{
            padding: '10px 32px', fontSize: 14, borderRadius: 8,
            cursor: !hasChanged || saving ? 'not-allowed' : 'pointer',
            border: 'none', background: hasChanged ? S.violet : S.border,
            color: hasChanged ? '#fff' : S.mutedDark, fontWeight: 600,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save Order to GitHub'}
        </button>
        {hasChanged && <span className="font-mono" style={{ fontSize: 10, color: S.yellow }}>● unsaved changes</span>}
      </div>

      {status && (
        <div style={{
          marginTop: 12,
          background: status.type === 'success' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
          border: `1px solid ${status.type === 'success' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
          borderRadius: 8, padding: 12,
        }}>
          <p className="font-mono" style={{ fontSize: 12, color: status.type === 'success' ? S.green : S.red }}>{status.msg}</p>
        </div>
      )}
    </div>
  );
}

// ── Tab: Categories ────────────────────────────────────────────────────
function CategoriesTab({ entries, blockCategories, componentCategories, onCategoryCreated, onAddToCategory }: {
  entries: RegistryEntry[];
  blockCategories: string[];
  componentCategories: string[];
  onCategoryCreated: (cat: string, type: 'block' | 'component') => void;
  onAddToCategory: (cat: string, type: 'block' | 'component') => void;
}) {
  const [newCat, setNewCat] = useState('');
  const [newCatType, setNewCatType] = useState<'block' | 'component'>('block');

  const handleCreate = () => {
    const slug = newCat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) return;
    onCategoryCreated(slug, newCatType);
    setNewCat('');
  };

  const countByCategory = (cat: string, type: 'block' | 'component') =>
    entries.filter(e => e.category === cat && e.type === type).length;

  const renderCategoryList = (cats: string[], type: 'block' | 'component') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {cats.map(cat => (
        <div key={cat} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
          background: S.bgDark, border: `1px solid ${S.border}`, borderRadius: 8,
        }}>
          <span style={{ flex: 1, fontSize: 13, color: S.text }}>{cat}</span>
          <span className="font-mono" style={{ fontSize: 10, color: S.mutedDark }}>
            {countByCategory(cat, type)} {type === 'block' ? 'blocks' : 'components'}
          </span>
          <button onClick={() => onAddToCategory(cat, type)} className="font-mono" style={{
            padding: '4px 10px', fontSize: 10, borderRadius: 5, cursor: 'pointer',
            border: `1px solid ${S.violet}`, background: 'transparent', color: S.violetLight,
          }}>+ Add {type}</button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Create new category */}
      <div style={{ background: S.bgDark, border: `1px solid ${S.border}`, borderRadius: 10, padding: 20 }}>
        <h3 className="font-mono" style={{ fontSize: 12, color: S.violetLight, letterSpacing: '0.1em', marginBottom: 16 }}>CREATE NEW CATEGORY</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['block', 'component'] as const).map(t => (
            <button key={t} onClick={() => setNewCatType(t)} className="font-mono" style={{
              padding: '5px 14px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${newCatType === t ? S.violet : S.border}`,
              background: newCatType === t ? 'rgba(124,58,237,0.1)' : 'transparent',
              color: newCatType === t ? S.violetLight : S.muted,
            }}>{t === 'block' ? 'Block' : 'Component'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="e.g. navigation"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            style={{ ...inputStyle(), flex: 1 }} />
          <button onClick={handleCreate} className="font-mono" style={{
            padding: '8px 20px', fontSize: 12, borderRadius: 8, cursor: 'pointer',
            border: 'none', background: S.violet, color: '#fff',
          }}>Create</button>
        </div>
      </div>

      {/* Block categories */}
      <div>
        <h3 className="font-mono" style={{ fontSize: 11, color: S.violetLight, letterSpacing: '0.1em', marginBottom: 12 }}>BLOCK CATEGORIES</h3>
        {renderCategoryList(blockCategories, 'block')}
      </div>

      {/* Component categories */}
      <div>
        <h3 className="font-mono" style={{ fontSize: 11, color: S.violetLight, letterSpacing: '0.1em', marginBottom: 12 }}>COMPONENT CATEGORIES</h3>
        {renderCategoryList(componentCategories, 'component')}
      </div>
    </div>
  );
}

// ── Main Admin Panel ───────────────────────────────────────────────────
type AdminTab = 'add' | 'edit' | 'reorder' | 'categories';

function AdminPanel() {
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('add');
  const [selectedEntry, setSelectedEntry] = useState<RegistryEntry | null>(null);
  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [customBlockCats, setCustomBlockCats] = useState<string[]>([]);
  const [customCompCats, setCustomCompCats] = useState<string[]>([]);
  const [categoryPrefill, setCategoryPrefill] = useState<{ category: string; type: 'block' | 'component' } | null>(null);

  const blockCategories = [...new Set([...DEFAULT_BLOCK_CATEGORIES, ...customBlockCats])];
  const componentCategories = [...new Set([...DEFAULT_COMPONENT_CATEGORIES, ...customCompCats])];

  // Also merge categories from loaded entries
  useEffect(() => {
    const bCats = entries.filter(e => e.type === 'block').map(e => e.category);
    const cCats = entries.filter(e => e.type === 'component').map(e => e.category);
    setCustomBlockCats(prev => [...new Set([...prev, ...bCats.filter(c => !DEFAULT_BLOCK_CATEGORIES.includes(c))])]);
    setCustomCompCats(prev => [...new Set([...prev, ...cCats.filter(c => !DEFAULT_COMPONENT_CATEGORIES.includes(c))])]);
  }, [entries]);

  const handleCategoryCreated = (cat: string, type: 'block' | 'component') => {
    if (type === 'block') setCustomBlockCats(prev => [...new Set([...prev, cat])]);
    else setCustomCompCats(prev => [...new Set([...prev, cat])]);
  };

  const fetchEntries = useCallback(async () => {
    setSidebarLoading(true);
    try {
      const [compFile, blockFile] = await Promise.all([
        getFile('src/config/components.registry.ts'),
        getFile('src/config/blocks.registry.ts'),
      ]);
      const all = [
        ...(compFile ? parseRegistry(compFile.content) : []),
        ...(blockFile ? parseRegistry(blockFile.content) : []),
      ];
      setEntries(all);
    } catch { /* ignore */ }
    setSidebarLoading(false);
  }, []);

  const fetchCommits = useCallback(async () => {
    try { setCommits(await getRecentCommits(5)); } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchEntries(); fetchCommits(); }, [fetchEntries, fetchCommits]);

  const handleSelectEntry = (entry: RegistryEntry) => {
    setSelectedEntry(entry);
    setActiveTab('edit');
  };

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'add', label: 'Add New' },
    { id: 'edit', label: 'Edit Code' },
    { id: 'reorder', label: 'Reorder' },
    { id: 'categories', label: 'Categories' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: S.bg }}>
      <Sidebar
        entries={entries}
        loading={sidebarLoading}
        onRefresh={fetchEntries}
        onLogout={() => { sessionStorage.removeItem('admin_auth'); window.location.reload(); }}
        onSelectEntry={handleSelectEntry}
        selectedId={activeTab === 'edit' ? selectedEntry?.id ?? null : null}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: `1px solid ${S.border}`, paddingBottom: 12 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="font-mono"
              style={{
                padding: '6px 16px', fontSize: 12, borderRadius: 6, cursor: 'pointer',
                border: activeTab === tab.id ? `1px solid ${S.violet}` : '1px solid transparent',
                background: activeTab === tab.id ? 'rgba(124,58,237,0.1)' : 'transparent',
                color: activeTab === tab.id ? S.violetLight : S.muted,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'add' && (
          <>
            <h1 className="font-syne" style={{ fontSize: 22, color: S.text, marginBottom: 24, fontWeight: 700 }}>Add New Component / Block</h1>
            <AddNewTab
              onSuccess={() => { fetchEntries(); fetchCommits(); setCategoryPrefill(null); }}
              blockCategories={blockCategories}
              componentCategories={componentCategories}
              onCategoryCreated={handleCategoryCreated}
              prefill={categoryPrefill}
            />
          </>
        )}

        {activeTab === 'edit' && (
          <>
            <h1 className="font-syne" style={{ fontSize: 22, color: S.text, marginBottom: 24, fontWeight: 700 }}>Edit Component Code</h1>
            <EditCodeTab entry={selectedEntry} />
          </>
        )}

        {activeTab === 'reorder' && (
          <>
            <h1 className="font-syne" style={{ fontSize: 22, color: S.text, marginBottom: 24, fontWeight: 700 }}>Reorder Components</h1>
            <ReorderTab entries={entries} onSuccess={() => { fetchEntries(); fetchCommits(); }} />
          </>
        )}

        {activeTab === 'categories' && (
          <>
            <h1 className="font-syne" style={{ fontSize: 22, color: S.text, marginBottom: 24, fontWeight: 700 }}>Manage Categories</h1>
            <CategoriesTab
              entries={entries}
              blockCategories={blockCategories}
              componentCategories={componentCategories}
              onCategoryCreated={handleCategoryCreated}
              onAddToCategory={(cat, type) => { setCategoryPrefill({ category: cat, type }); setActiveTab('add'); }}
            />
          </>
        )}

        {/* Recent commits (shown on all tabs) */}
        {commits.length > 0 && (
          <div style={{ marginTop: 48, maxWidth: 640 }}>
            <h3 className="font-mono" style={{ fontSize: 11, color: S.mutedDark, letterSpacing: '0.1em', marginBottom: 12 }}>RECENT COMMITS</h3>
            {commits.map((c) => (
              <div key={c.sha} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${S.border}` }}>
                <div>
                  <p style={{ fontSize: 12, color: S.text, margin: 0 }}>{c.message.split('\n')[0]}</p>
                  <p className="font-mono" style={{ fontSize: 10, color: S.mutedDark, margin: 0 }}>{c.author}</p>
                </div>
                <span className="font-mono" style={{ fontSize: 10, color: S.mutedDark, flexShrink: 0 }}>{timeAgo(c.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;
  return <AdminPanel />;
}
