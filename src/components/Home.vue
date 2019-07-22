<template>
  <v-container>
    <v-layout row wrap>
      <v-flex v-if="!$store.getters.loaded" text-xs-center>
        <v-progress-circular
          indeterminate
          color="primary"
          size="70"
          width="6"
          class="ma-4"
        ></v-progress-circular>
        <div class="subheading">
          Signing in...
        </div>
      </v-flex>
      <v-flex xs12 class="pt-4 pb-1" v-if="$store.getters.loaded">
        <v-carousel>
          <v-carousel-item v-for="place in places.slice(1)" :key="place.index" :src="place.imageUrl">
            <div class="title">{{ place.name }}</div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-flex mt-2 xs12 class="text-xs-center subheading" v-if="$store.getters.loaded">
        Your places to get to today.
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  computed: {
    places() {
      return this.$store.getters.todayEvents;
    }
  }
};
</script>
<style scoped>
.title {
  position: absolute;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 2em;
  padding: 20px;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
}

p {
  font-size: 1.125em;
}
</style>