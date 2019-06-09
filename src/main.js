import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import Trips from './components/Trips.vue'
import Reminders from './components/Reminders.vue'
import Profile from './components/User/Profile.vue'
import Login from './components/User/Login.vue'

Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/trips', name: 'Trips', component: Trips },
  { path: '/reminders', name: 'Reminders', component: Reminders },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/login', name: 'Login', component: Login }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
