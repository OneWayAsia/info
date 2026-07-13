export const setupOrientationHandler = () => {
  const controller = new AbortController()
  const options = { signal: controller.signal }

  const updateOrientation = () => {
    const isPortrait = window.innerHeight > window.innerWidth
    document.documentElement.classList.toggle('is-portrait', isPortrait)
    document.documentElement.classList.toggle('is-landscape', !isPortrait)
  }

  updateOrientation()

  window.addEventListener('resize', updateOrientation, options)

  if (screen.orientation) {
    screen.orientation.addEventListener('change', updateOrientation, options)
  } else {
    window.addEventListener('orientationchange', updateOrientation, options)
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateOrientation, options)
  }

  return () => controller.abort()
}
