export const COLOR_PRIMARY_RED = '#d94e47'
export const COLOR_TEXT_LIGHT = '#ffffff'

export const TYPING_SPEED = 100
export const DELETING_SPEED = 50
export const PAUSE_TIME = 2000
export const START_DELAY = 1000
export const INTER_WORD_DELAY = 500

export const TYPEWRITER_WORDS = ['management', 'consulting', 'development']

export const SERVICES = Object.freeze({
  mobile: { first: 'mobile', second: 'development' },
  web: { first: 'web', second: 'development' },
  integration: { first: 'system', second: 'integration' },
})

export const TOPBAR_ITEMS = Object.freeze([
  { id: 'mobile', label: 'mobile development', shortLabel: 'mobile', path: '/mobile' },
  { id: 'web', label: 'web development', shortLabel: 'web', path: '/web' },
  { id: 'integration', label: 'system integration', shortLabel: 'integration', path: '/integration' },
])
