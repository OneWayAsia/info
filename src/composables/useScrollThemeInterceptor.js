import { reactive, onMounted, onScopeDispose, nextTick } from 'vue'
import { createContrastThemeDetector } from '../lib/contrastThemeDetector'

/**
 * Vue adapter over the framework-agnostic contrast theme detector.
 * Owns the full lifecycle: attaches scroll/resize listeners on mount,
 * detaches and cancels pending frames on scope dispose.
 *
 * @param {import('vue').Ref<Element|null>|(() => Element|null)} navRef
 * @param {number} count Number of indicators (initial theme array size).
 * @param {Object} [options]
 * @param {string} [options.itemSelector] Selector for indicator items
 *   inside the nav root.
 * @param {Element|string|null} [options.container] Scroll container.
 * @param {Function} [options.classify] Custom color classifier.
 */
export function useScrollThemeInterceptor(navRef, count = 3, options = {}) {
    const indicatorThemes = reactive(Array(count).fill('dark'))
    let detector = null

    onMounted(async () => {
        await nextTick()
        const nav = typeof navRef === 'function' ? navRef() : navRef.value
        if (!nav) return

        detector = createContrastThemeDetector({
            targets: () => nav.querySelectorAll(options.itemSelector || '.nav-list li'),
            container: options.container || null,
            root: nav,
            classify: options.classify,
            onChange: (themes) => {
                themes.forEach((theme, index) => {
                    indicatorThemes[index] = theme
                })
            }
        })
        detector.start()
    })

    onScopeDispose(() => {
        if (detector) {
            detector.stop()
            detector = null
        }
    })

    return {
        indicatorThemes,
        update: () => detector?.update(),
        refresh: () => detector?.refresh()
    }
}
