import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { store } from './store'
import GAuth from 'vue-google-oauth2'
import * as firebase from 'firebase'

const gauthOption = {
  clientId: '857543360628-rrmp7stavqroch9ccf7e4tu2a5m22cg6.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/calendar.events',
  prompt: 'select_account'
}

Vue.use(GAuth, gauthOption)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyBWRRoZ1dD1trQWBC_CIvgeQRTQFJ-CMoM",
      authDomain: "howgo-c3b1f.firebaseapp.com",
      databaseURL: "https://howgo-c3b1f.firebaseio.com",
      projectId: "howgo-c3b1f",
      storageBucket: "howgo-c3b1f.appspot.com",
      messagingSenderId: "229012285253",
      appId: "1:229012285253:web:dcc12e738d4ed891"
    })
  },
  router,
  store
}).$mount('#app')
