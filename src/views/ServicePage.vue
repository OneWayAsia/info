<template>
  <section class="service-page">
    <div class="service-page__panel service-page__panel--media">
      <div class="service-page__media-wrap">
        <img
          class="service-page__status-image"
          src="/UnderConstruction.svg"
          alt="Under construction"
          width="500"
          height="500"
        />
      </div>
    </div>

    <div class="service-page__panel service-page__panel--text">
      <div class="service-page__inner">
        <SectionTitle
          subtext="Under construction"
          :hasDot="false"
        >
          <template #title>
            {{ service.first }}<span class="dot">.</span><span class="second">{{ service.second }}</span>
          </template>
        </SectionTitle>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionTitle from '../components/ui/SectionTitle.vue'

const { service } = defineProps({
  service: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.service-page {
  --service-topbar-height: 64px;
  --service-inner-padding: var(--section-padding);
  --service-inner-width: 80%;
  --service-panel-basis: 50%;

  width: 100vw;
  min-height: 100dvh;
  padding-top: var(--service-topbar-height);
  box-sizing: border-box;
  overflow-x: hidden;
  background-color: var(--text-light);
  display: flex;
  align-items: stretch;
}

.service-page__panel {
  flex: 0 0 var(--service-panel-basis);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: calc(100dvh - var(--service-topbar-height));
}

.service-page__panel--media {
  justify-content: center;
}

.service-page__panel--text {
  justify-content: flex-start;
}

.service-page__media-wrap {
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-page__status-image {
  display: block;
  width: 70%;
  max-width: 70%;
  max-height: min(72dvh, 680px);
  height: auto;
}

.service-page__inner {
  padding: var(--service-inner-padding);
  width: var(--service-inner-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

:deep(.heading) {
  color: var(--text-dark);
}

:deep(.dot) {
  color: var(--primary-red);
}

:deep(.second) {
  color: var(--primary-red);
}

@media (max-width: 1024px) and (orientation: portrait) {
  .service-page {
    --service-topbar-height: 54px;
    --service-panel-basis: 100%;
    --service-inner-padding: var(--section-padding-mobile);
    --service-inner-width: 90%;
    flex-direction: column;
    justify-content: center;
    gap: clamp(8px, 2dvh, 24px);
  }

  .service-page__panel {
    flex: 0 0 auto;
    min-height: auto;
  }

  .service-page__panel--text {
    justify-content: center;
  }

  .service-page__inner {
    align-items: center;
    text-align: center;
  }
  
  /* Make SectionTitle center itself under 1024 portrait */
  .service-page__inner :deep(.section-title) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .service-page__inner :deep(.base-divider) {
    margin-left: auto;
    margin-right: auto;
  }

  .service-page__status-image {
    width: min(70%, 420px);
    max-width: min(70%, 420px);
    max-height: 45dvh;
  }
}

@media (max-width: 768px) {
  .service-page {
    --service-topbar-height: 54px;
  }
}

@media (orientation: landscape) and (min-width: 769px) and (max-width: 1440px) {
  .service-page__inner :deep(.heading) {
    font-size: clamp(1.5rem, 3vw, 3.5rem);
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .service-page {
    --service-topbar-height: 48px;
    --service-inner-padding: 20px 30px;
  }
}
</style>
