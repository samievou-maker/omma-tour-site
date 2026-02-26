export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'omma-theme-mode'

export const useThemeMode = () => {
  const mode = useState<ThemeMode>('theme-mode', () => 'light')

  const applyMode = (next: ThemeMode): void => {
    mode.value = next

    if (import.meta.client) {
      const root = document.documentElement
      root.classList.toggle('dark', next === 'dark')
      localStorage.setItem(STORAGE_KEY, next)
    }
  }

  if (import.meta.client) {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      applyMode(saved)
    } else {
      applyMode('light')
    }
  }

  return {
    mode,
    setMode: applyMode
  }
}
