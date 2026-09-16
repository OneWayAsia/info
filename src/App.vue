<template>
  <div id="app" class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <TopBar />
    <main id="main-content" tabindex="-1">
      <RouterView />
    </main>
    <Analytics />
    <SpeedInsights />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TopBar from './components/layout/TopBar.vue'
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<style scoped>
.app-shell {
  width: 100vw;
  min-height: 100dvh;
}

#main-content {
  width: 100vw;
  min-height: 100dvh;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--text-light);
  color: var(--text-dark);
  text-decoration: none;
}

.skip-link:focus-visible {
  position: fixed;
  left: 8px;
  top: 8px;
  width: auto;
  height: auto;
  overflow: visible;
  z-index: 3000;
  outline: 2px solid var(--primary-red);
  outline-offset: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
