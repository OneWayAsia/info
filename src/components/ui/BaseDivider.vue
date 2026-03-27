<template>
  <hr class="base-divider" :class="[light && 'base-divider--light', center && 'base-divider--center']" />
</template>

<script setup>
const { light = false, center = false } = defineProps({
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
.base-divider {
  width: 100px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  margin: 20px 0;
}

.base-divider--light {
  background-color: rgba(255, 255, 255, 0.3);
}

.base-divider--center {
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .base-divider {
    width: 80px;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .base-divider {
    margin: 15px 0;
  }
  .base-divider--center {
    margin: 15px auto;
  }
}

</style>
