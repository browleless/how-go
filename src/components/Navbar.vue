<template>
  <div style="z-index: 1000"> 
    <v-navigation-drawer temporary absolute v-model="sideNav">
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="!this.$store.state.isLoggedIn" @click="handleClickSignIn">
          <v-list-tile-action>
            <v-icon>lock_open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Login</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="this.$store.state.isLoggedIn" @click="handleClickSignOut">
          <v-list-tile-action>
            <v-icon>lock</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar style="color: #69F0AE" color="#212121">
      <v-toolbar-side-icon @click="sideNav = !sideNav" class="hidden-sm-and-up"><v-icon color='#69F0AE' >menu</v-icon></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/home" tag="span" style="cursor: pointer">HowGo?</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link" color='#69F0AE'>
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn flat v-if="!this.$store.state.isLoggedIn" @click="handleClickSignIn"  color='#69F0AE'>
          <v-icon left>lock_open</v-icon>Login
        </v-btn>
        <v-btn flat v-if="this.$store.state.isLoggedIn" @click="handleClickSignOut"  color='#69F0AE'>
          <v-icon left>lock</v-icon>Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "Navbar",

  computed: {
    menuItems() {
      let menuItems = [];
      if (this.$store.state.isLoggedIn) {
        menuItems = [
          { icon: "room", title: "Trips", link: "/trips" },
          { icon: "notifications_on", title: "Reminders", link: "/reminders" },
          { icon: "person", title: "Profile", link: "/profile" }
        ];
      }
      return menuItems;
    }
  },
  data() {
    return {
      sideNav: false,
    };
  },
  methods: {
    handleClickSignIn() {
      this.$gAuth
        .signIn()
        .then(payload => {
          this.$store.dispatch("signIn", payload);
          this.$store.state.isLoggedIn = this.$gAuth.isAuthorized;
          this.$router.push("/home");
        })
        .catch(error => {
          // On fail do something
          console.log(error);
        });
    },
    handleClickSignOut() {
      this.$gAuth
        .signOut()
        .then(() => {
          // On success do something
          this.$store.dispatch('resetStoreState')
          this.$router.push("/");
        })
        .catch(error => {
          // On fail do something
          console.log(error);
        });
    }
  }
};
</script>

