<template>
  <v-container>
    <v-layout row wrap>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 class="pt-4 pb-1">
        <v-carousel>
          <v-carousel-item v-for="place in places.slice(1)" :key="place.index" :src="place.imageUrl">
            <div class="title">{{ place.name }}</div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Your places to get to today.</p>
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