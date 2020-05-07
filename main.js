import Vue from 'vue'
import App from './App'
import store from './store'
Vue.prototype.$store = store
// Vue.config.productionTip = false
// Vue.prototype.$serverUrl = 'https://unidemo.dcloud.net.cn';
App.mpType = 'app'
const app = new Vue({
    ...App,store
})
app.$mount()