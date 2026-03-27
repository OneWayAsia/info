<template>
  <div
    class="top-bar"
    :class="{ 'top-bar--visible': isVisible }"
  >
    <div v-if="!isServiceRoute" class="home-bar" :class="{ 'home-bar--expanded': isExpanded }">

      <div class="home-bar__default">
        <button class="home-bar__cell" @click="isExpanded = true">PROJECTS</button>
        <button class="home-bar__cell" @click="goToSection('about-section')">ABOUT</button>
        <button class="home-bar__cell" @click="goToSection('contact-section')">CONTACT</button>
      </div>

      <div class="home-bar__projects">
        <button
          class="home-bar__collapse"
          type="button"
          aria-label="Close projects menu"
          @click="isExpanded = false"
        >&lt;</button>
        <RouterLink
          v-for="item in TOPBAR_ITEMS"
          :key="item.id"
          class="top-bar__item"
          :to="item.path"
          @click="isExpanded = false"
        >
          <span class="full-label">{{ item.label }}</span>
          <span class="short-label">{{ item.shortLabel }}</span>
        </RouterLink>
      </div>

    </div>

    <template v-else>
      <button
        class="top-bar__back"
        type="button"
        aria-label="Back to start"
        @click="goToStart"
      >&lt;</button>
      <RouterLink
        v-for="item in TOPBAR_ITEMS"
        :key="item.id"
        class="top-bar__item"
        :class="{ 'top-bar__item--active': route.path === item.path }"
        :aria-label="`Open ${item.label}`"
        :to="item.path"
        replace
      >
        <span class="full-label">{{ item.label }}</span>
        <span class="short-label">{{ item.shortLabel }}</span>
      </RouterLink>
    </template>

  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TOPBAR_ITEMS } from '../../constants'

const route = useRoute()
const router = useRouter()
const isServiceRoute = computed(() => route.path !== '/')
const isExpanded = ref(false)
const isOnIntro = ref(true)

let scrollEl = null

function handleScroll() {
  isOnIntro.value = scrollEl.scrollTop < window.innerHeight * 0.5
}

function attachScroll() {
  scrollEl = document.querySelector('.snap-container')
  if (scrollEl) {
    scrollEl.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
}

function detachScroll() {
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', handleScroll)
    scrollEl = null
  }
  isOnIntro.value = true
}

onMounted(async () => {
  await router.isReady()
  if (!isServiceRoute.value) attachScroll()
})

watch(isServiceRoute, async (onService) => {
  if (onService) {
    detachScroll()
  } else {
    await nextTick()
    attachScroll()
  }
})

onUnmounted(() => detachScroll())

function goToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
}

function goToStart() {
  if (route.path === '/') return
  router.replace('/').then(() => {
    requestAnimationFrame(() => {
      const snapContainer = document.querySelector('.snap-container')
      if (snapContainer) snapContainer.scrollTo({ top: 0, behavior: 'auto' })
    })
  })
}

const isVisible = computed(() => {
  if (isServiceRoute.value) return true
  return isOnIntro.value
})
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  height: 64px;
  background-color: var(--dark-bg);
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 0.35s ease, transform 0.35s ease;
  pointer-events: none;
}


.top-bar--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.home-bar {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.home-bar__default,
.home-bar__projects {
  position: absolute;
  inset: 0;
  display: flex;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.home-bar__default {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.home-bar__projects {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}

.home-bar--expanded .home-bar__default {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}

.home-bar--expanded .home-bar__projects {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.home-bar__cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
  user-select: none;
  -webkit-user-select: none;
}

.home-bar__cell:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.95);
}

.home-bar__cell:active {
  background-color: rgba(255, 255, 255, 0.12);
}

.home-bar__cell:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: -2px;
}

.home-bar__collapse {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.home-bar__collapse:hover,
.top-bar__back:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.home-bar__collapse:active,
.top-bar__back:active {
  background-color: rgba(255, 255, 255, 0.12);
}

.home-bar__collapse:focus-visible,
.top-bar__back:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: -2px;
}

.top-bar__item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 0;
  background: transparent;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
  user-select: none;
  -webkit-user-select: none;
  padding: 0 12px;
}

.top-bar__back {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.top-bar__item:hover,
.top-bar__item--active {
  background-color: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.95);
}

.top-bar__item:active {
  background-color: rgba(255, 255, 255, 0.12);
}

.top-bar__item:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: -2px;
}

.short-label {
  display: none;
}

@media (max-width: 768px) {
  .top-bar__item,
  .home-bar__cell {
    font-size: 0.75rem;
    letter-spacing: 1px;
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .top-bar {
    height: 54px;
  }

  .home-bar__cell {
    font-size: clamp(0.6rem, 2.5vw, 0.75rem);
    letter-spacing: 1px;
  }

  .top-bar__item {
    font-size: clamp(0.6rem, 2.5vw, 0.75rem);
    letter-spacing: 0.5px;
    padding: 0 4px;
  }

  .full-label {
    display: none;
  }

  .short-label {
    display: inline;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .top-bar {
    height: 48px;
  }

  .home-bar__cell,
  .top-bar__item {
    font-size: clamp(0.55rem, 3.5dvh, 0.75rem);
    letter-spacing: 0.5px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .top-bar {
    transition: none;
  }

  .home-bar__default,
  .home-bar__projects,
  .home-bar__cell,
  .home-bar__collapse,
  .top-bar__item,
  .top-bar__back {
    transition: none;
  }
}
</style>
