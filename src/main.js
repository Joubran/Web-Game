import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Важно! Порядок имеет значение
app.use(router)
app.mount('#app')

// Для диагностики
console.log('Router initialized:', router)