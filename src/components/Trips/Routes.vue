<template>
  <div>
    <v-flex>
      <Map ref="map"/>
    </v-flex>
    <v-flex xs12 sm9 md6 lg4 class="overlay">
      <TripsInstruction ref="instruction" @render-polyline="renderPolyline"/>
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
  methods: {
    renderPolyline(latlngs) {
      this.$refs.map.insertPolyline(latlngs)
    }
  },
  mounted() {
    this.$refs.instruction.init(this.$store.getters.currIdx)
  }
};
</script>

<style scoped>
.overlay {
  position: relative;
  z-index: 999;
}
</style>
