/**
 * Framework-agnostic contrast theme detector.
 *
 * Measures the effective background color under a set of fixed-position
 * target elements (e.g. nav indicators) and classifies each point into a
 * theme string. Zero dependencies, safe for SSR (no DOM access until start()).
 */

const DEFAULT_MAX_DEPTH = 20

const defaultClassify = ({ r, g, b }) => {
    if (r > 150 && g < 100 && b < 100) return 'red'
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? 'light' : 'dark'
}

// Only rgb()/rgba() computed values are parsed; anything else (oklch, color())
// is treated as unknown so the walk continues to the parent element.
const parseColor = (value) => {
    if (!value || !value.startsWith('rgb')) return null
    const parts = value.match(/[\d.]+/g)
    if (!parts || parts.length < 3) return null
    return {
        r: +parts[0],
        g: +parts[1],
        b: +parts[2],
        a: parts.length > 3 ? +parts[3] : 1
    }
}

const resolveBackground = (element, maxDepth) => {
    let el = element
    for (let depth = 0; el && depth <= maxDepth; depth++) {
        const color = parseColor(getComputedStyle(el).backgroundColor)
        if (color && color.a > 0) return color
        el = el.parentElement
    }
    return null
}

/**
 * @param {Object} options
 * @param {Element[]|NodeList|(() => Element[]|NodeList)} options.targets
 *   Elements whose center points are sampled.
 * @param {Element|string|null} [options.container] Scroll container
 *   (element or selector); defaults to window.
 * @param {Element|null} [options.root] Root element excluded from hit
 *   testing (typically the navigation itself).
 * @param {(color: {r,g,b,a}) => string} [options.classify] Maps a resolved
 *   background color to a theme name.
 * @param {string} [options.fallback] Theme used when nothing is resolvable.
 * @param {number} [options.maxDepth] Max ancestors walked for a background.
 * @param {(themes: string[]) => void} [options.onChange] Called after every
 *   recomputation with the theme per target, in target order.
 */
export function createContrastThemeDetector({
    targets,
    container = null,
    root = null,
    classify = defaultClassify,
    fallback = 'dark',
    maxDepth = DEFAULT_MAX_DEPTH,
    onChange = null
} = {}) {
    let points = []
    let themeCache = new WeakMap()
    let rafId = null
    let scrollTarget = null
    let running = false

    const getTargets = () => {
        const list = typeof targets === 'function' ? targets() : targets
        return list ? Array.from(list) : []
    }

    // Targets are assumed viewport-fixed: centers only change on resize,
    // so they are measured once here instead of on every scroll frame.
    const measure = () => {
        points = getTargets().map((el) => {
            const rect = el.getBoundingClientRect()
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        })
    }

    const themeAt = (x, y) => {
        const el = document.elementsFromPoint(x, y).find(
            (candidate) =>
                candidate !== document.documentElement &&
                candidate !== document.body &&
                !(root && root.contains(candidate))
        )
        if (!el) return fallback

        let theme = themeCache.get(el)
        if (theme === undefined) {
            const color = resolveBackground(el, maxDepth)
            theme = color ? classify(color) : fallback
            themeCache.set(el, theme)
        }
        return theme
    }

    const compute = () => {
        const themes = points.map(({ x, y }) => themeAt(x, y))
        if (onChange) onChange(themes)
    }

    const update = () => {
        if (rafId !== null) return
        rafId = requestAnimationFrame(() => {
            rafId = null
            compute()
        })
    }

    const refresh = () => {
        themeCache = new WeakMap()
        measure()
        compute()
    }

    const start = () => {
        if (running || typeof document === 'undefined') return
        running = true
        scrollTarget = typeof container === 'string'
            ? document.querySelector(container)
            : container
        ;(scrollTarget || window).addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', refresh, { passive: true })
        refresh()
    }

    const stop = () => {
        if (!running) return
        running = false
        ;(scrollTarget || window).removeEventListener('scroll', update)
        window.removeEventListener('resize', refresh)
        if (rafId !== null) {
            cancelAnimationFrame(rafId)
            rafId = null
        }
    }

    return { start, stop, update, refresh }
}
