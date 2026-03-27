export const setupOrientationHandler = () => {
  const updateOrientation = () => {
    const isPortrait = window.innerHeight > window.innerWidth
    document.documentElement.classList.toggle('is-portrait', isPortrait)
    document.documentElement.classList.toggle('is-landscape', !isPortrait)

    const isDesktopMode = window.visualViewport && window.visualViewport.scale < 1
    document.documentElement.classList.toggle('is-desktop-mode', isDesktopMode)
  }

  updateOrientation()

  window.addEventListener('resize', updateOrientation)

  if (screen.orientation) {
    screen.orientation.addEventListener('change', updateOrientation)
  } else {
    window.addEventListener('orientationchange', () => {
      setTimeout(updateOrientation, 100)
    })
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateOrientation)
  }
}
