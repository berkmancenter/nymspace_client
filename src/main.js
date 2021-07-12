import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueCookieNext from './plugins/vue-cookie-next'
import './plugins/axios'
import variables from './variables'

window.nymity = createApp(App)
window.nymity.config.globalProperties.appVariables = variables
window.nymity.use(router).use(store).use(vueCookieNext).mount('#app')
