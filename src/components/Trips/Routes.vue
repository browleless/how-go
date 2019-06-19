<template>
  <div>
    <TripsInstruction/>
  </div>
</template>

<script>
import TripsInstruction from "./TripsInstruction.vue";

export default {
  components: {
    TripsInstruction
  },
  computed: {
    places() {
      return this.$store.getters.loadedTrips;
    }
  }
};
</script>