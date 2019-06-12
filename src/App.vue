<template>
  <v-app>
    <Navbar/>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>
