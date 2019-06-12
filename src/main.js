import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { store } from './store'
import GAuth from 'vue-google-oauth2'
import * as firebase from 'firebase'

const gauthOption = {
  clientId: '157627819195-sud1fpsa8kc1bgekh6s69vlb03adql70.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/calendar',
  prompt: 'select_account'
}

Vue.use(GAuth, gauthOption)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyBVYVezJo3SaW6Vf5tTSTa_EtjVIeHOhdw",
      authDomain: "how-go.firebaseapp.com",
      databaseURL: "https://how-go.firebaseio.com",
      projectId: "how-go",
      storageBucket: "how-go.appspot.com",
      messagingSenderId: "904627633830",
      appId: "1:904627633830:web:526745d3580da259"
    })
  },
  router,
  store
}).$mount('#app')
