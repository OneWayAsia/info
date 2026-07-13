<template>
  <nav class="navigation" aria-label="Section navigation" ref="navRef">
    <ul
      class="nav-list"
      :style="{
        '--active-indicator-color': activeIndicatorColor,
        '--active-index': activeIndex,
        '--sections-center': (sections.length - 1) / 2
      }"
    >
      <li
        v-for="(section, index) in sections"
        :key="section.id"
        :class="getIndicatorTheme(index)"
      >
        <a
          :href="`#${section.id}`"
          :aria-label="`Go to ${section.label}`"
          @click="handleIndicatorClick(section.id, $event)"
          :class="{ active: activeSection === section.id }"
        />
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, inject, computed, watch, onUnmounted, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSectionVisibility } from '../../composables/useSectionVisibility'
import { useScrollThemeInterceptor } from '../../composables/useScrollThemeInterceptor'
import { COLOR_PRIMARY_RED, COLOR_TEXT_LIGHT } from '../../constants'

const SCROLL_DURATION = 1000
const sections = inject('sections', [])
const route = useRoute()
const router = useRouter()

const activeSection = ref(route.hash.slice(1) || sections[0]?.id || '')
const navRef = useTemplateRef('navRef')

const { indicatorThemes, update: updateIndicatorThemes } = useScrollThemeInterceptor(
  navRef,
  sections.length,
  { container: '.snap-container' }
)

let isScrolling = false
let scrollTimeout = null

const activeIndex = computed(() =>
  sections.findIndex(s => s.id === activeSection.value)
)

const activeIndicatorColor = computed(() => {
  if (activeIndex.value === -1) return COLOR_PRIMARY_RED
  const theme = indicatorThemes[activeIndex.value]
  return theme === 'red' ? COLOR_TEXT_LIGHT : COLOR_PRIMARY_RED
})

const scrollToSection = (sectionId) => {
  if (isScrolling) return

  isScrolling = true
  activeSection.value = sectionId
  router.push({ path: '/', hash: `#${sectionId}` })

  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = window.setTimeout(() => {
    isScrolling = false
  }, SCROLL_DURATION)
}

const handleIndicatorClick = (sectionId, event) => {
  event.preventDefault()
  scrollToSection(sectionId)
}

const getIndicatorTheme = (index) => {
  return `indicator-${indicatorThemes[index] || 'dark'}`
}

// Hysteresis thresholds
const ACTIVATION_THRESHOLD = 0.5    // Need 50% visibility to become active
const DEACTIVATION_THRESHOLD = 0.3  // Stay active until below 30%
const MIN_VISIBILITY = 0.1          // Ignore sections with <10% visibility

const { ratios } = useSectionVisibility(sections.map(s => s.id))

watch(ratios, () => {
  if (isScrolling) return

  // Step 1: If current section is still sufficiently visible, keep it active
  const currentVisibility = ratios[activeSection.value] ?? 0
  if (currentVisibility >= DEACTIVATION_THRESHOLD) {
    updateIndicatorThemes()
    return
  }

  // Step 2: Find the most visible section that meets activation threshold
  let newActiveSection = null
  let maxRatio = ACTIVATION_THRESHOLD
  for (const [id, ratio] of Object.entries(ratios)) {
    if (ratio >= maxRatio) {
      maxRatio = ratio
      newActiveSection = id
    }
  }

  // Step 3: Fallback — pick most visible if none meets threshold
  if (!newActiveSection) {
    let fallbackMax = MIN_VISIBILITY
    for (const [id, ratio] of Object.entries(ratios)) {
      if (ratio > fallbackMax) {
        fallbackMax = ratio
        newActiveSection = id
      }
    }
  }

  if (newActiveSection && newActiveSection !== activeSection.value) {
    activeSection.value = newActiveSection
    updateIndicatorThemes()
  }
})

watch(() => route.hash, (hash) => {
  const sectionId = hash.slice(1)
  if (sections.some(section => section.id === sectionId)) {
    activeSection.value = sectionId
  }
})

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<style scoped>
.navigation {
  position: fixed;
  right: var(--nav-right-offset);
  top: 50dvh;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-list::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--nav-indicator-size);
  height: var(--nav-indicator-size);
  border-radius: 50%;
  background-color: var(--active-indicator-color, #d94e47);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.3s ease;
  z-index: 2;
  pointer-events: none;
  --step: calc(var(--nav-indicator-size) + var(--nav-indicator-spacing));
  transform: translate(
    -50%,
    calc(-50% + (var(--active-index, 0) - var(--sections-center, 1)) * var(--step))
  );
}

.nav-list li {
  margin-bottom: var(--nav-indicator-spacing);
  position: relative;
  z-index: 1;
}

.nav-list li:last-child {
  margin-bottom: 0;
}

.nav-list a {
  display: block;
  width: var(--nav-indicator-size);
  height: var(--nav-indicator-size);
  border-radius: 50%;
  transition: background-color 0.3s ease;
  text-decoration: none;
  position: relative;
  z-index: 1;
  cursor: pointer;
}

.nav-list li.indicator-dark a {
  background-color: rgba(255, 255, 255, 0.3);
}

.nav-list li.indicator-light a {
  background-color: rgba(217, 78, 71, 0.3);
}

.nav-list li.indicator-red a {
  background-color: rgba(255, 255, 255, 0.3);
}

.nav-list a.active {
  background-color: transparent !important;
}
</style>
