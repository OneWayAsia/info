import { reactive } from 'vue'

const RED_THRESHOLD = 150
const NON_RED_THRESHOLD = 100
const BRIGHTNESS_THRESHOLD = 128
const MAX_DOM_DEPTH = 20

const getComputedBackgroundColor = (element, depth = 0) => {
    if (!element || depth > MAX_DOM_DEPTH) return null

    const style = window.getComputedStyle(element)
    const color = style.backgroundColor

    if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
        const match = color.match(/\d+/g)
        if (match && match.length >= 3) {
            return {
                r: parseInt(match[0], 10),
                g: parseInt(match[1], 10),
                b: parseInt(match[2], 10)
            }
        }
    }

    if (element.parentElement) {
        return getComputedBackgroundColor(element.parentElement, depth + 1)
    }

    return null
}

const detectThemeAtPoint = (x, y) => {
    const elements = document.elementsFromPoint(x, y)
    const targetElement = elements.find(el =>
        el.tagName !== 'NAV' &&
        el.tagName !== 'UL' &&
        el.tagName !== 'LI' &&
        el.tagName !== 'A' &&
        el.tagName !== 'HTML' &&
        el.tagName !== 'BODY' &&
        !el.closest('.navigation')
    )

    if (!targetElement) return 'dark'

    const bgColor = getComputedBackgroundColor(targetElement)
    if (!bgColor) return 'dark'

    const { r, g, b } = bgColor
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    const isRed = r > RED_THRESHOLD && g < NON_RED_THRESHOLD && b < NON_RED_THRESHOLD

    if (isRed) return 'red'
    if (brightness > BRIGHTNESS_THRESHOLD) return 'light'
    return 'dark'
}

export function useScrollThemeInterceptor(navRef, initialCount = 3) {
    const indicatorThemes = reactive(Array(initialCount).fill('dark'))
    let rafId = null

    const updateAllIndicatorThemes = () => {
        const nav = typeof navRef === 'function' ? navRef() : navRef.value
        if (!nav) return

        const list = nav.querySelector('.nav-list')
        if (!list) return

        const items = list.querySelectorAll('li')

        items.forEach((item, index) => {
            const rect = item.getBoundingClientRect()
            const x = rect.left + rect.width / 2
            const y = rect.top + rect.height / 2
            indicatorThemes[index] = detectThemeAtPoint(x, y)
        })
    }

    const throttledUpdate = () => {
        if (rafId) return
        rafId = requestAnimationFrame(() => {
            updateAllIndicatorThemes()
            rafId = null
        })
    }

    return {
        indicatorThemes,
        updateAllIndicatorThemes,
        throttledUpdate
    }
}
