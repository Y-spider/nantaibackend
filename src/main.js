import Vue from 'vue'
import resetCss from "reset-css"
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios"
// axios.defaults.headers.post['Content-Type'] = "application/json"
// Vue.prototype.$route = router
Vue.prototype.$request = axios
Vue.config.productionTip = false
Vue.prototype.$baseImageUrl = "http://localhost/"
Vue.prototype.$baseDocumentImageUrl = "http://localhost:6135/"
Vue.use(ElementUI,{size:"small"});
Vue.use(resetCss)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
