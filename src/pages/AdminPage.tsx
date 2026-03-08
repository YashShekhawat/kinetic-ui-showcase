import { useState, useEffect, useCallback } from 'react';
import { getFile, getRecentCommits, type CommitInfo } from '@/lib/github';
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

function parseRegistry(content: string): RegistryEntry[] {
  const entries: RegistryEntry[] = [];
  const regex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*category:\s*'([^']+)',\s*type:\s*'([^']+)',\s*isPro:\s*(true|false),\s*isNew:\s*(true|false)\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) {
    entries.push({
      id: m[1],
      name: m[2],
      category: m[3],
      type: m[4] as 'component' | 'block',
      isPro: m[5] === 'true',
      isNew: m[6] === 'true',
    });
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

// ── Styles ─────────────────────────────────────────────────────────────
const S = {
  bg: '#0e0e14',
  bgDark: '#0a0a0f',
  bgSidebar: '#0d0d14',
  border: '#1e1e2e',
  violet: '#7c3aed',
  violetLight: '#a78bfa',
  text: '#f0ede8',
  muted: '#909098',
  mutedDark: '#606070',
  green: '#34d399',
  red: '#f87171',
} as const;

// ── Login Screen ───────────────────────────────────────────────────────
function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (pw === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', 'true');
      onAuth();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{ background: S.bgDark, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 340, textAlign: 'center' }}>
        <h1 className="font-mono" style={{ fontSize: 18, color: S.violetLight, marginBottom: 32, letterSpacing: '0.12em' }}>
          KINETIC UI ADMIN
        </h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Password"
          className="font-mono"
          style={{
            width: '100%', padding: '10px 14px', fontSize: 13, background: S.bg,
            border: `1px solid ${S.border}`, borderRadius: 8, color: S.text,
            outline: 'none', marginBottom: 12,
          }}
        />
        {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 8 }}>{error}</p>}
        <button
          onClick={submit}
          className="font-mono"
          style={{
            width: '100%', padding: '10px 0', fontSize: 13, background: S.violet,
            color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────
function Sidebar({
  entries,
  loading,
  onRefresh,
}: {
  entries: RegistryEntry[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const grouped: Record<string, RegistryEntry[]> = {};
  entries.forEach((e) => {
    if (!grouped[e.category]) grouped[e.category] = [];
    grouped[e.category].push(e);
  });

  const compCount = entries.filter((e) => e.type === 'component').length;
  const blockCount = entries.filter((e) => e.type === 'block').length;

  return (
    <div
      style={{
        width: 260, minHeight: '100vh', background: S.bgSidebar,
        borderRight: `1px solid ${S.border}`, padding: '20px 16px',
        overflowY: 'auto', flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span className="font-mono" style={{ fontSize: 13, color: S.violetLight, letterSpacing: '0.12em' }}>ADMIN</span>
        <button
          onClick={onRefresh}
          title="Refresh"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16 }}
        >
          ↻
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: 14, borderRadius: 4, background: '#1a1a2a', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        Object.keys(grouped).sort().map((cat) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <p className="font-mono" style={{ fontSize: 9, color: S.mutedDark, letterSpacing: '0.15em', marginBottom: 6, textTransform: 'uppercase' }}>
              {cat}
            </p>
            {grouped[cat].map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                <span style={{ fontSize: 12, color: S.text }}>{item.name}</span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 8, padding: '1px 5px', borderRadius: 3,
                    background: item.type === 'block' ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.05)',
                    color: item.type === 'block' ? S.violetLight : S.mutedDark,
                  }}
                >
                  {item.type === 'block' ? 'BLK' : 'CMP'}
                </span>
                {item.isPro && (
                  <span className="font-mono" style={{ fontSize: 8, color: S.violet, padding: '1px 4px', borderRadius: 3, background: 'rgba(124,58,237,0.1)' }}>
                    PRO
                  </span>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      <div style={{ marginTop: 24, paddingTop: 12, borderTop: `1px solid ${S.border}` }}>
        <p className="font-mono" style={{ fontSize: 10, color: S.mutedDark }}>
          {compCount} components · {blockCount} blocks
        </p>
      </div>
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────
const BLOCK_CATEGORIES = ['hero', 'features', 'social-proof', 'pricing', 'process', 'content'];
const COMPONENT_CATEGORIES = ['text', 'cards', 'buttons', 'loaders', 'images', 'backgrounds', 'cursor', 'scroll'];

interface FormErrors {
  name?: string;
  id?: string;
  category?: string;
  code?: string;
}

function AdminPanel() {
  // Sidebar state
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [idManual, setIdManual] = useState(false);
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'component' | 'block'>('block');
  const [isPro, setIsPro] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [successLog, setSuccessLog] = useState<string[] | null>(null);
  const [submitError, setSubmitError] = useState('');

  // Preview modal
  const [preview, setPreview] = useState<PreviewChange[] | null>(null);

  // Recent commits
  const [commits, setCommits] = useState<CommitInfo[]>([]);

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
    } catch {
      /* ignore */
    }
    setSidebarLoading(false);
  }, []);

  const fetchCommits = useCallback(async () => {
    try {
      const c = await getRecentCommits(5);
      setCommits(c);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchCommits();
  }, [fetchEntries, fetchCommits]);

  // Auto-fill ID from name
  useEffect(() => {
    if (!idManual) {
      setId(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [name, idManual]);

  // Auto-toggle isPro based on type
  useEffect(() => {
    setIsPro(type === 'block');
  }, [type]);

  const categorySuggestions = type === 'block' ? BLOCK_CATEGORIES : COMPONENT_CATEGORIES;

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

  const handlePreview = () => {
    if (!validate()) return;
    setPreview(previewChanges({ name: name.trim(), id: id.trim(), category: category.trim(), type, isPro, isNew, code }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    setSuccessLog(null);
    try {
      const results = await addComponentToRepo({
        name: name.trim(), id: id.trim(), category: category.trim(), type, isPro, isNew, code,
      });
      setSuccessLog(results);
      // Reset form
      setName(''); setId(''); setIdManual(false); setCategory(''); setCode('');
      setIsNew(true);
      fetchEntries();
      fetchCommits();
    } catch (err: any) {
      setSubmitError(err.message || 'Unknown error');
    }
    setSubmitting(false);
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', padding: '8px 12px', fontSize: 13, background: S.bgDark,
    border: `1px solid ${hasError ? S.red : S.border}`, borderRadius: 8, color: S.text,
    outline: 'none', fontFamily: 'inherit',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: S.bg }}>
      <Sidebar entries={entries} loading={sidebarLoading} onRefresh={fetchEntries} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <h1 className="font-syne" style={{ fontSize: 22, color: S.text, marginBottom: 32, fontWeight: 700 }}>
          Add New Component / Block
        </h1>

        {/* Form */}
        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <div>
            <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>NAME</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kinetic Hero"
              style={inputStyle(!!errors.name)}
            />
            {errors.name && <p style={{ color: S.red, fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
          </div>

          {/* ID */}
          <div>
            <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>ID</label>
            <input
              value={id}
              onChange={(e) => { setId(e.target.value); setIdManual(true); }}
              placeholder="e.g. kinetic-hero"
              className="font-mono"
              style={{ ...inputStyle(!!errors.id), fontSize: 12 }}
            />
            {errors.id && <p style={{ color: S.red, fontSize: 11, marginTop: 4 }}>{errors.id}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>TYPE</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['component', 'block'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="font-mono"
                  style={{
                    flex: 1, padding: '8px 0', fontSize: 12, borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${type === t ? S.violet : S.border}`,
                    background: type === t ? 'rgba(124,58,237,0.1)' : 'transparent',
                    color: type === t ? S.violetLight : S.muted,
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-mono" style={{ fontSize: 11, color: S.muted, letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>CATEGORY</label>
            <input
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. hero"
              style={inputStyle(!!errors.category)}
            />
            <datalist id="category-suggestions">
              {categorySuggestions.map((c) => <option key={c} value={c} />)}
            </datalist>
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
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your TSX component code here..."
              className="font-mono"
              style={{
                ...inputStyle(!!errors.code),
                minHeight: 400, resize: 'vertical', lineHeight: 1.6, fontSize: 13, padding: 16,
              }}
            />
            {errors.code && <p style={{ color: S.red, fontSize: 11, marginTop: 4 }}>{errors.code}</p>}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handlePreview}
              className="font-mono"
              style={{
                flex: 1, padding: '10px 0', fontSize: 12, borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${S.violet}`, background: 'transparent', color: S.violetLight,
              }}
            >
              Preview Changes
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="font-syne"
              style={{
                flex: 2, padding: '10px 0', fontSize: 14, borderRadius: 8, cursor: submitting ? 'wait' : 'pointer',
                border: 'none', background: S.violet, color: '#fff', fontWeight: 600,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Pushing to GitHub...' : 'Add to Repository'}
            </button>
          </div>

          {/* Success */}
          {successLog && (
            <div style={{ background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.2)`, borderRadius: 8, padding: 16 }}>
              <p className="font-mono" style={{ fontSize: 12, color: S.green, marginBottom: 8 }}>✓ Successfully pushed</p>
              {successLog.map((l, i) => (
                <p key={i} className="font-mono" style={{ fontSize: 11, color: S.muted, marginLeft: 8 }}>• {l}</p>
              ))}
              <p className="font-mono" style={{ fontSize: 10, color: S.mutedDark, marginTop: 10 }}>
                Vercel will auto-deploy in ~30 seconds
              </p>
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div style={{ background: 'rgba(248,113,113,0.08)', border: `1px solid rgba(248,113,113,0.2)`, borderRadius: 8, padding: 16 }}>
              <p className="font-mono" style={{ fontSize: 12, color: S.red }}>{submitError}</p>
            </div>
          )}

          {/* Preview modal */}
          {preview && (
            <div style={{ background: S.bgDark, border: `1px solid ${S.border}`, borderRadius: 8, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="font-mono" style={{ fontSize: 13, color: S.text }}>Preview Changes</span>
                <button onClick={() => setPreview(null)} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer' }}>✕</button>
              </div>
              {preview.map((ch, i) => (
                <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${ch.action === 'create' ? S.green : S.violetLight}` }}>
                  <p className="font-mono" style={{ fontSize: 11, color: ch.action === 'create' ? S.green : S.violetLight }}>
                    {ch.action.toUpperCase()} {ch.file}
                  </p>
                  <p className="font-mono" style={{ fontSize: 10, color: S.mutedDark, whiteSpace: 'pre-wrap', marginTop: 2 }}>{ch.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recent commits */}
          {commits.length > 0 && (
            <div style={{ marginTop: 24 }}>
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
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === 'true');

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;
  return <AdminPanel />;
}
