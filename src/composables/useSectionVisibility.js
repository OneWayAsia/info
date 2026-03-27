import { reactive, onMounted, onUnmounted, nextTick } from 'vue'

export function useSectionVisibility(sectionIds, options = {}) {
  const ratios = reactive({})
  let observer = null
  let mutationObserver = null

  const threshold = options.threshold ?? [0, 0.1, 0.3, 0.5, 1]
  const observedElementsById = new Map()

  const observeExistingSections = () => {
    if (!observer) return

    sectionIds.forEach((id) => {
      const currentObservedElement = observedElementsById.get(id)
      const domElement = document.getElementById(id)

      // Section not in DOM now -> unobserve stale reference.
      if (!domElement) {
        if (currentObservedElement) {
          observer.unobserve(currentObservedElement)
          observedElementsById.delete(id)
        }
        delete ratios[id]
        return
      }

      // Section is already observed by the same element.
      if (currentObservedElement === domElement) return

      // Element reference changed (e.g., route remount) -> reobserve.
      if (currentObservedElement) {
        observer.unobserve(currentObservedElement)
      }
      observer.observe(domElement)
      observedElementsById.set(id, domElement)
    })
  }

  onMounted(async () => {
    await nextTick()
    const snapContainer = document.querySelector('.snap-container')

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0
        })
      },
      { root: snapContainer || null, threshold }
    )

    observeExistingSections()

    // Keep observer in sync when route content remounts and section nodes change.
    mutationObserver = new MutationObserver(() => {
      observeExistingSections()
    })
    const observeRoot = snapContainer || document.getElementById('app') || document.body
    mutationObserver.observe(observeRoot, {
      childList: true,
      subtree: true,
    })
  })

  onUnmounted(() => {
    if (mutationObserver) mutationObserver.disconnect()
    if (observer) observer.disconnect()
  })

  return { ratios }
}
