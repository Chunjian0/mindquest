export type ThemeId = 'night' | 'sunny' | 'rain' | 'storm' | 'dream'

export interface Theme {
  id:          ThemeId
  label:       string
  icon:        string
  // CSS 变量覆盖
  vars: {
    '--bg-primary':      string
    '--bg-secondary':    string
    '--bg-tertiary':     string
    '--star-opacity':    string
    '--moon-opacity':    string
    '--overlay-color':   string
    '--nav-bg':          string
    '--particle-color1': string
    '--particle-color2': string
  }
  bodyClass: string
}

export const THEMES: Theme[] = [
  {
    id:    'night',
    label: 'Night',
    icon:  '🌙',
    bodyClass: 'theme-night',
    vars: {
      '--bg-primary':      '#08061a',
      '--bg-secondary':    '#0e0c22',
      '--bg-tertiary':     '#0a0818',
      '--star-opacity':    '0.8',
      '--moon-opacity':    '1',
      '--overlay-color':   'rgba(100,60,200,0.06)',
      '--nav-bg':          'rgba(8,6,26,0.95)',
      '--particle-color1': 'rgba(140,100,255,0.6)',
      '--particle-color2': 'rgba(96,165,250,0.5)',
    },
  },
  {
    id:    'sunny',
    label: 'Sunny',
    icon:  '☀️',
    bodyClass: 'theme-sunny',
    vars: {
      '--bg-primary':      '#0a1628',
      '--bg-secondary':    '#0d1e35',
      '--bg-tertiary':     '#071020',
      '--star-opacity':    '0.1',
      '--moon-opacity':    '0',
      '--overlay-color':   'rgba(255,200,60,0.04)',
      '--nav-bg':          'rgba(8,18,40,0.95)',
      '--particle-color1': 'rgba(255,200,60,0.5)',
      '--particle-color2': 'rgba(255,160,40,0.4)',
    },
  },
  {
    id:    'rain',
    label: 'Rain',
    icon:  '🌧️',
    bodyClass: 'theme-rain',
    vars: {
      '--bg-primary':      '#060c18',
      '--bg-secondary':    '#080e20',
      '--bg-tertiary':     '#040a14',
      '--star-opacity':    '0.2',
      '--moon-opacity':    '0.3',
      '--overlay-color':   'rgba(40,80,160,0.08)',
      '--nav-bg':          'rgba(6,10,24,0.97)',
      '--particle-color1': 'rgba(100,160,255,0.5)',
      '--particle-color2': 'rgba(60,120,220,0.4)',
    },
  },
  {
    id:    'storm',
    label: 'Storm',
    icon:  '⛈️',
    bodyClass: 'theme-storm',
    vars: {
      '--bg-primary':      '#050408',
      '--bg-secondary':    '#070609',
      '--bg-tertiary':     '#030207',
      '--star-opacity':    '0',
      '--moon-opacity':    '0',
      '--overlay-color':   'rgba(80,40,120,0.1)',
      '--nav-bg':          'rgba(5,4,8,0.98)',
      '--particle-color1': 'rgba(180,100,255,0.6)',
      '--particle-color2': 'rgba(120,60,200,0.5)',
    },
  },
  {
    id:    'dream',
    label: 'Dream',
    icon:  '✨',
    bodyClass: 'theme-dream',
    vars: {
      '--bg-primary':      '#0d0820',
      '--bg-secondary':    '#120a28',
      '--bg-tertiary':     '#090618',
      '--star-opacity':    '0.9',
      '--moon-opacity':    '0.8',
      '--overlay-color':   'rgba(200,100,255,0.06)',
      '--nav-bg':          'rgba(12,8,32,0.95)',
      '--particle-color1': 'rgba(220,120,255,0.6)',
      '--particle-color2': 'rgba(180,100,240,0.5)',
    },
  },
]

export function getTheme(id: ThemeId): Theme {
  return THEMES.find(t => t.id === id) || THEMES[0]
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })
  // 移除所有主题 class，加上新的
  THEMES.forEach(t => document.body.classList.remove(t.bodyClass))
  document.body.classList.add(theme.bodyClass)
}

export function saveTheme(id: ThemeId) {
  localStorage.setItem('mindquest_theme', id)
}

export function loadTheme(): ThemeId {
  const saved = localStorage.getItem('mindquest_theme') as ThemeId | null
  return saved && THEMES.find(t => t.id === saved) ? saved : 'night'
}