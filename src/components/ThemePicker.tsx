import { themes, ThemeId } from '@/lib/themes'
import { useBlockTheme } from '@/contexts/ThemeContext'

export function ThemePicker() {
  const { currentTheme, setTheme } = useBlockTheme()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.15em',
        color: '#606070',
        textTransform: 'uppercase',
      }}>
        Theme
      </span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {themes.map((theme) => {
          const isActive = currentTheme.id === theme.id
          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id as ThemeId)}
              title={theme.label}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: theme.previewBg,
                border: isActive
                  ? '2px solid #7c3aed'
                  : '2px solid #1e1e2e',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.2s ease',
                boxShadow: isActive
                  ? '0 0 0 2px rgba(124,58,237,0.3)'
                  : 'none',
                padding: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                inset: '3px',
                borderRadius: '50%',
                background: theme.previewAccent,
                opacity: 0.8,
              }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
