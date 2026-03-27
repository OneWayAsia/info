<template>
  <section id="intro-section" class="intro-section">
    <div class="content-wrapper section-centered">
      <div class="section-content">
        <div class="intro-title">
          <h2 class="home-title">
            project<br class="mobile-break" /><span class="dot">.</span
            ><span class="typeit-text">{{ typeitText }}</span
            ><span class="cursor blink">|</span>
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useTypewriter } from '../../composables/useTypewriter'
import { TYPEWRITER_WORDS } from '../../constants'

const { typeitText } = useTypewriter(TYPEWRITER_WORDS)
</script>

<style scoped>
.intro-section {
  width: 100%;
  height: 100dvh;
  position: relative;
  background-color: var(--dark-bg);
}


.section-content {
  text-align: center;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--content-gap);
}

.home-title {
  font-size: var(--heading-size-desktop);
  font-weight: 200;
  color: var(--text-light);
  letter-spacing: 2px;
  position: relative;
  z-index: 1;

  .dot {
    color: var(--primary-red);
  }

  .typeit-text {
    color: var(--primary-red);
  }

  .cursor {
    color: var(--primary-red);
    margin-left: 2px;
  }
}

.mobile-break {
  display: none;
}



@media (max-width: 768px) {
  .home-title {
    font-size: var(--heading-size-tablet);
    white-space: nowrap;
    margin: 0 auto;
    overflow: hidden;
    max-width: calc(100vw - 50px);
  }

  .section-content {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .home-title {
    white-space: normal;
    font-size: var(--heading-size-mobile);
  }

  .mobile-break {
    display: block;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .home-title {
    font-size: clamp(2rem, 12dvh, 4rem);
    max-width: 90vw;
  }
}

</style>
