<template>
  <div class="section-title" :class="{ 'section-title--center': center }">
    <h1 class="title large heading" :class="{ 'heading--light': light, 'heading--center': center }">
      <slot name="title">{{ text }}<span class="dot" v-if="hasDot">.</span></slot>
    </h1>
    <BaseDivider :light :center />
    <h2 v-if="subtext || $slots.subtext" class="title intro-text subtext" :class="{ 'subtext--light': light, 'subtext--center': center }">
      <slot name="subtext">{{ subtext }}</slot>
    </h2>
    <slot></slot>
  </div>
</template>

<script setup>
import BaseDivider from './BaseDivider.vue'

const { text, subtext, hasDot = true, light = false, center = false } = defineProps({
  text: {
    type: String,
    default: ''
  },
  subtext: {
    type: String,
    default: ''
  },
  hasDot: {
    type: Boolean,
    default: true
  },
  light: {
    type: Boolean,
    default: false
  },
  center: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.section-title {
  text-align: left;
}

.section-title--center {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.heading {
  margin-bottom: 20px;
  color: var(--primary-red);
}

.heading--center {
  margin-left: auto;
  margin-right: auto;
}

:deep(.dot) {
  color: var(--primary-red);
}

.heading--light {
  color: var(--text-light);
}

.subtext {
  color: var(--text-dark);
  font-size: 1.2rem;
  line-height: 1.6;
}

.subtext--light {
  color: var(--text-light);
}

.subtext--center {
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .heading {
    word-break: break-word;
    max-width: calc(100vw - 50px);
  }
  .subtext {
    word-break: break-word;
  }
}

@media (max-width: 480px) {
  .section-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .heading {
    margin: 0 auto 20px;
    max-width: calc(100vw - 50px);
  }

  .subtext {
    font-size: clamp(0.9rem, 4vw, 1.2rem);
    letter-spacing: 0.5px;
    margin: 0 auto;
    max-width: calc(100vw - 50px);
    box-sizing: border-box;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .heading {
    font-size: clamp(2rem, 12dvh, 4rem);
    margin-bottom: 15px;
  }
  .subtext {
    font-size: clamp(0.9rem, 5dvh, 1.3rem);
  }
}

</style>
