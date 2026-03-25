import { createContext, useContext, useRef, useState } from 'react'
import { Theme, ThemeId, applyTheme, defaultTheme, themes } from '@/lib/themes'

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (id: ThemeId) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function BlockThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)
  const containerRef = useRef<HTMLDivElement>(null)

  const setTheme = (id: ThemeId): void => {
    const theme = themes.find(t => t.id === id) ?? defaultTheme
    setCurrentTheme(theme)
    if (containerRef.current) {
      applyTheme(containerRef.current, theme)
    }
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, containerRef }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useBlockTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useBlockTheme must be used inside BlockThemeProvider')
  }
  return context
}
