import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { setupOrientationHandler } from './utils/orientationHandler'

setupOrientationHandler()

const app = createApp(App)
app.use(router)
app.mount('#app')

const img = new Image()
img.src = '/UnderConstruction.svg'
img.decode().catch(() => {})
