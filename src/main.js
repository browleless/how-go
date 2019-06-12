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
      apiKey: "AIzaSyBPxJ-Fh41K9DiIjVPXz6-n4-c9gXSjlGc",
      authDomain: "how-go-243507.firebaseapp.com",
      databaseURL: "https://how-go-243507.firebaseio.com",
      projectId: "how-go-243507",
      storageBucket: "how-go-243507.appspot.com",
      messagingSenderId: "857543360628",
      appId: "1:857543360628:web:89cfc44d09d5993e"
    })
  },
  router,
  store
}).$mount('#app')
