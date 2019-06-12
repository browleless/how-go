<template>
  <div>
    <v-navigation-drawer temporary absolute v-model="sideNav">
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="!isLoggedIn" @click="handleClickSignIn">
          <v-list-tile-action>
            <v-icon>lock_open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Login</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="isLoggedIn" @click="handleClickSignOut">
          <v-list-tile-action>
            <v-icon>lock</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar>
      <v-toolbar-side-icon @click="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">HowGo?</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn flat v-if="!isLoggedIn" @click="handleClickSignIn">
          <v-icon left>lock_open</v-icon>Login
        </v-btn>
        <v-btn flat v-if="isLoggedIn" @click="handleClickSignOut">
          <v-icon left>lock</v-icon>Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: "Navbar",
  data() {
    return {
      sideNav: false,
      isLoggedIn: false,
      events: []
    }
  },
  computed: {
    menuItems() {
      let menuItems = []
      if (this.isLoggedIn) {
        menuItems = [
          { icon: "room", title: "Trips", link: "/trips" },
          { icon: "notifications_on", title: "Reminders", link: "/reminders" },
          { icon: "person", title: "Profile", link: "/profile" }
        ]
      }
      return menuItems
    }
  },
  methods: {
      handleClickSignIn () {
      this.$gAuth
        .signIn()
        .then(async (payload) => {
          // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
          const user = payload.user
          const gapi = payload.gapi
          const token = user.getAuthResponse().id_token
          console.log('user', user)
          const credential = firebase.auth.GoogleAuthProvider.credential(token)
          firebase.auth().signInWithCredential(credential)
          const events = await gapi.client.calendar.events.list({
            calendarId: 'primary'
          })
          console.log(events)
          this.isLoggedIn = this.$gAuth.isAuthorized
        })
        .catch(error => {
          // On fail do something
          console.log(error)
        })
    },
    handleClickSignOut () {
      this.$gAuth
        .signOut()
        .then(() => {
          // On success do something
          this.isLoggedIn = this.$gAuth.isAuthorized
        })
        .catch(error => {
          // On fail do something
          console.log(error)
        })
    }
  }
}
</script>

