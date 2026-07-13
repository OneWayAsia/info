import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const INTRO_SECTION_ID = 'intro-section'
const SCROLL_SETTLE_DELAY = 120
const VIEWPORT_SETTLE_DELAY = 160

export function useHomeSectionNavigation(sectionIds, containerRef) {
  const route = useRoute()
  const router = useRouter()

  let activeSectionId = getSectionId(route.hash)
  let scrollTimer = null
  let viewportTimer = null
  let snapResumeFrame = null

  function getSectionId(hash) {
    const id = hash.replace(/^#/, '')
    return sectionIds.includes(id) ? id : INTRO_SECTION_ID
  }

  function getHash(sectionId) {
    return sectionId === INTRO_SECTION_ID ? '' : `#${sectionId}`
  }

  function getSectionTop(section, container) {
    const sectionRect = section.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    return container.scrollTop + sectionRect.top - containerRect.top
  }

  function pauseSnap(container) {
    container.classList.add('snap-container--restoring')

    if (snapResumeFrame) cancelAnimationFrame(snapResumeFrame)
    requestAnimationFrame(() => {
      snapResumeFrame = requestAnimationFrame(() => {
        container.classList.remove('snap-container--restoring')
        snapResumeFrame = null
      })
    })
  }

  function scrollToSection(sectionId, { behavior = 'auto', pause = false } = {}) {
    const container = containerRef.value
    const section = document.getElementById(sectionId)
    if (!container || !section) return

    activeSectionId = sectionId
    if (pause) pauseSnap(container)
    container.scrollTo({ top: getSectionTop(section, container), behavior })
  }

  function getActiveSectionId() {
    const container = containerRef.value
    if (!container) return activeSectionId

    const containerRect = container.getBoundingClientRect()
    const center = containerRect.top + container.clientHeight / 2

    return sectionIds.reduce((closestId, sectionId) => {
      const section = document.getElementById(sectionId)
      const closestSection = document.getElementById(closestId)
      if (!section || !closestSection) return closestId

      const sectionRect = section.getBoundingClientRect()
      const closestRect = closestSection.getBoundingClientRect()
      const sectionDistance = Math.abs(sectionRect.top + sectionRect.height / 2 - center)
      const closestDistance = Math.abs(closestRect.top + closestRect.height / 2 - center)

      return sectionDistance < closestDistance ? sectionId : closestId
    }, activeSectionId)
  }

  function syncHashWithActiveSection() {
    const sectionId = getActiveSectionId()
    activeSectionId = sectionId

    const hash = getHash(sectionId)
    if (route.hash === hash) return

    router.replace({ path: '/', hash }).catch(() => {})
  }

  function scheduleHashSync() {
    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(syncHashWithActiveSection, SCROLL_SETTLE_DELAY)
  }

  function scheduleReanchor() {
    const sectionId = activeSectionId
    if (viewportTimer) clearTimeout(viewportTimer)

    viewportTimer = window.setTimeout(() => {
      scrollToSection(sectionId, { pause: true })
    }, VIEWPORT_SETTLE_DELAY)
  }

  async function restoreRouteSection() {
    await nextTick()
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    scrollToSection(getSectionId(route.hash), { pause: true })
  }

  function handleRouteHash(hash) {
    const sectionId = getSectionId(hash)
    if (sectionId === activeSectionId) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollToSection(sectionId, { behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  onMounted(async () => {
    const container = containerRef.value
    if (!container) return

    container.addEventListener('scroll', scheduleHashSync, { passive: true })
    window.addEventListener('resize', scheduleReanchor)
    window.visualViewport?.addEventListener('resize', scheduleReanchor)
    screen.orientation?.addEventListener('change', scheduleReanchor)

    await restoreRouteSection()
  })

  onBeforeUnmount(() => {
    const container = containerRef.value
    container?.removeEventListener('scroll', scheduleHashSync)
    window.removeEventListener('resize', scheduleReanchor)
    window.visualViewport?.removeEventListener('resize', scheduleReanchor)
    screen.orientation?.removeEventListener('change', scheduleReanchor)

    if (scrollTimer) clearTimeout(scrollTimer)
    if (viewportTimer) clearTimeout(viewportTimer)
    if (snapResumeFrame) cancelAnimationFrame(snapResumeFrame)
  })

  watch(() => route.hash, handleRouteHash)
}
