export type ThemeId = 'dark' | 'light'

export interface Theme {
  id: ThemeId
  label: string
  previewBg: string
  previewAccent: string
  tokens: Record<string, string>
}

export const themes: Theme[] = [
  {
    id: 'dark',
    label: 'Dark',
    previewBg: '#060608',
    previewAccent: '#7c3aed',
    tokens: {
      '--theme-bg-page':       '#060608',
      '--theme-bg-panel':      '#0e0e14',
      '--theme-bg-card':       '#0d0d12',
      '--theme-bg-surface':    '#13131f',
      '--theme-border':        '#1e1e2e',
      '--theme-border-hover':  '#2a2a3e',
      '--theme-accent':        '#7c3aed',
      '--theme-accent-light':  '#a78bfa',
      '--theme-accent-dim':    'rgba(124, 58, 237, 0.12)',
      '--theme-accent-border': 'rgba(124, 58, 237, 0.25)',
      '--theme-accent-subtle': 'rgba(124, 58, 237, 0.05)',
      '--theme-accent-glow':   'rgba(124, 58, 237, 0.07)',
      '--theme-text-primary':  '#f0ede8',
      '--theme-text-muted':    '#909098',
      '--theme-text-dim':      '#606070',
      '--theme-text-very-dim': '#404050',
    },
  },
  {
    id: 'light',
    label: 'Light',
    previewBg: '#ffffff',
    previewAccent: '#7c3aed',
    tokens: {
      '--theme-bg-page':       '#ffffff',
      '--theme-bg-panel':      '#f4f4f5',
      '--theme-bg-card':       '#f9f9fb',
      '--theme-bg-surface':    '#ececf0',
      '--theme-border':        '#dddde8',
      '--theme-border-hover':  '#c8c8d8',
      '--theme-accent':        '#7c3aed',
      '--theme-accent-light':  '#6d28d9',
      '--theme-accent-dim':    'rgba(124, 58, 237, 0.08)',
      '--theme-accent-border': 'rgba(124, 58, 237, 0.30)',
      '--theme-accent-subtle': 'rgba(124, 58, 237, 0.06)',
      '--theme-accent-glow':   'rgba(124, 58, 237, 0.05)',
      '--theme-text-primary':  '#0f0e11',
      '--theme-text-muted':    '#3f3f50',
      '--theme-text-dim':      '#606070',
      '--theme-text-very-dim': '#909098',
    },
  },
]

export const defaultTheme = themes[0]

export function applyTheme(container: HTMLElement, theme: Theme): void {
  Object.entries(theme.tokens).forEach(([key, value]) => {
    container.style.setProperty(key, value)
  })
}
