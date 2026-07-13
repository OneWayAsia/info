<template>
  <div class="home-view">
    <AdaptiveNavigation />
    <main ref="snapContainer" class="snap-container">
      <div class="snap-section" v-for="section in sections" :key="section.id" :id="section.id">
        <component :is="section.component" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { provide, useTemplateRef } from 'vue'
import AdaptiveNavigation from '../components/layout/AdaptiveNavigation.vue'
import IntroSection from '../components/sections/IntroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import { useHomeSectionNavigation } from '../composables/useHomeSectionNavigation'

const sections = [
  { id: 'intro-section', label: 'Introduction', component: IntroSection },
  { id: 'about', label: 'About', component: AboutSection },
  { id: 'contact', label: 'Contact', component: ContactSection },
]

provide('sections', sections)

const snapContainer = useTemplateRef('snapContainer')
useHomeSectionNavigation(sections.map(section => section.id), snapContainer)
</script>

<style scoped>
.home-view {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.snap-container {
  width: 100%;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.snap-container::-webkit-scrollbar {
  display: none;
}

.snap-container--restoring {
  scroll-snap-type: none;
}

.snap-section {
  width: 100%;
  height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
