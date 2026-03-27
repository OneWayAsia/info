import { ref, onMounted, onUnmounted } from 'vue'
import { TYPING_SPEED, DELETING_SPEED, PAUSE_TIME, START_DELAY, INTER_WORD_DELAY } from '../constants'

export function useTypewriter(words) {
    const typeitText = ref('')
    let currentWordIndex = 0
    let currentCharIndex = 0
    let isDeleting = false
    let timeoutId = null
    let isPaused = false

    const type = () => {
        if (isPaused) return

        const currentWord = words[currentWordIndex]

        if (isDeleting) {
            typeitText.value = currentWord.substring(0, currentCharIndex - 1)
            currentCharIndex--
        } else {
            typeitText.value = currentWord.substring(0, currentCharIndex + 1)
            currentCharIndex++
        }

        if (!isDeleting && currentCharIndex === currentWord.length) {
            timeoutId = setTimeout(type, PAUSE_TIME)
            isDeleting = true
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false
            currentWordIndex = (currentWordIndex + 1) % words.length
            timeoutId = setTimeout(type, INTER_WORD_DELAY)
        } else {
            const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED
            timeoutId = setTimeout(type, speed)
        }
    }

    const handleVisibilityChange = () => {
        if (document.hidden) {
            isPaused = true
            if (timeoutId) {
                clearTimeout(timeoutId)
                timeoutId = null
            }
        } else {
            isPaused = false
            timeoutId = setTimeout(type, TYPING_SPEED)
        }
    }

    onMounted(() => {
        timeoutId = setTimeout(type, START_DELAY)
        document.addEventListener('visibilitychange', handleVisibilityChange)
    })

    onUnmounted(() => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange)
    })

    return {
        typeitText
    }
}
