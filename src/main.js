import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import vuetify from './plugins/vuetify'
import Nodo from "./components/Nodo";
import Edge from "./components/Edge";

Vue.config.productionTip = false
Vue.component("Nodo",Nodo)
Vue.component("Edge",Edge)

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
