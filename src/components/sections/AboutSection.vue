<template>
  <section id="about-section" class="about-section section-full">
    <div class="section-content">
      <div class="row">
        <div class="col about-left">
          <div class="col-content-wrapper section-centered">
            <div class="inner-wrapper">
              <SectionTitle
                text="about"
                subtext="We are a Project Management and Consulting company that provides technology-focused solutions."
              />
            </div>
          </div>
        </div>

        <div class="col collaborate-right">
          <div class="col-content-wrapper section-centered">
            <div class="inner-wrapper">
              <SectionTitle
                text="collaborate"
                subtext="Got an idea or business project that you need help with? We would love to hear from you."
                light
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionTitle from '../ui/SectionTitle.vue'
</script>

<style scoped>
.about-section {
  min-height: 100dvh;
  padding: 0;
}

.section-content {
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
  height: 100dvh;
}

.col {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0;
  display: flex;
  height: 100%;
}


.about-left {
  background-color: var(--text-light);
}

.collaborate-right {
  background-color: var(--primary-red);
}

.collaborate-right :deep(.dot) {
  color: var(--text-light);
}

.inner-wrapper {
  padding: var(--section-padding);
  text-align: left;
  width: 80%;
  margin: 0 auto;
}

@media (max-width: 992px) {
  .row {
    flex-wrap: wrap;
    height: 100dvh;
  }

  .col {
    flex: 0 0 100%;
    max-width: 100%;
    height: 50dvh;
  }
  
  .col-content-wrapper {
    height: 50dvh;
  }

  .inner-wrapper {
    padding: var(--section-padding-tablet);
  }
}

@media (max-width: 768px) {
  .inner-wrapper {
    padding: var(--section-padding-mobile);
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .row {
    flex-wrap: nowrap;
  }

  .col {
    flex: 0 0 50%;
    max-width: 50%;
    height: 100dvh;
  }

  .col-content-wrapper {
    height: 100dvh;
  }

  .inner-wrapper {
    padding: 20px 30px;
  }
}

</style>
