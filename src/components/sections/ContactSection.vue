<template>
  <section id="contact" class="contact-section">
    <div class="content-wrapper section-centered">
      <div class="section-content">
        <div class="contact-title">
          <SectionTitle
            text="contact"
            center
            light
          >
            <template #subtext>
              <div class="info-wrapper">
                <div class="info">
                  <p class="info-text">
                    <a href="mailto:info@oneway.asia" class="email-link">info@oneway.asia</a>
                  </p>
                </div>
              </div>
            </template>
          </SectionTitle>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionTitle from '../ui/SectionTitle.vue'
</script>

<style scoped>
.contact-section {
  width: 100%;
  height: 100dvh;
  background-color: var(--dark-bg);
}

.section-content {
  text-align: center;
  padding: 0 20px;
}

.contact-title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-wrapper {
  margin: 0;
}

.info-text {
  color: var(--text-light);
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1.6;
  margin: 0;
}

.email-link {
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.3s ease;
}

.email-link:hover {
  color: var(--primary-red);
}

@media (max-width: 768px) {
  .section-content {
    padding: 0 20px;
  }

  .info-text {
    font-size: var(--font-size-intro-text-mobile);
    word-break: break-word;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .info-text {
    font-size: clamp(0.9rem, 5dvh, 1.3rem);
  }
}

</style>
