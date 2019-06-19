<template>
  <div>
    <v-flex>
      <Map/>
    </v-flex>
    <v-flex xs4 class="overlay">
      <TripsInstruction/>
    </v-flex>
  </div>
</template>

<script>
import TripsInstruction from "./TripsInstruction.vue";
import Map from "./Map.vue";

export default {
  components: {
    TripsInstruction,
    Map
  },
  computed: {
    places() {
      return this.$store.getters.loadedTrips;
    }
  }
};
</script>

<style scoped>
.overlay {
  position: absolute;
  z-index: 999;
}
</style>
