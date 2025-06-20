import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)


// Важно! Порядок имеет значение
app.use(router)
app.use(createPinia())
app.mount('#app')

// Для диагностики
console.log('Router initialized:', router)