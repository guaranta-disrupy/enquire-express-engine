import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import HighchartsVue from 'highcharts-vue'

import '@vueform/slider/themes/default.css'
import 'vue-next-select/dist/index.min.css'
//import '@/css/default.scss'
import '@/css/default/style.scss'

createApp(App)
.use(store)
.use(router)
.use(HighchartsVue)
.mount('#explicit')




