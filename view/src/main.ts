import { createApp, provide } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import ModalView from '@/components/modal-view.vue'
import 'element-plus/dist/index.css'
import router from '@/router/index'
import directive from '@/plugin/directive'
import { createPinia } from 'pinia'

const instance = createApp(App)
directive(instance)
instance.use(createPinia())
instance.use(router)
instance.use(ElementPlus)
instance.component('ModalView', ModalView)
instance.mount('#app')
