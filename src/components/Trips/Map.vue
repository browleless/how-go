<template>
  <div>
    <l-map ref="map" style="position: absolute" :center="center" :zoom="zoom">
      <l-tile-layer :url="url" :attribution="attribution"/>
    </l-map>
  </div>
</template>

<script>
import { LMap, LPolyline, LTileLayer } from "vue2-leaflet"

export default {
  name: "Map",
  components: {
    LMap,
    LPolyline,
    LTileLayer
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      center: L.latLng(1.3521, 103.8198),
      zoom: 12,
      polyline: null
    };
  },

  mounted() {
    const map = this.$refs.map.mapObject
    map.zoomControl.remove()
    L.control.zoom({ position:'bottomleft' }).addTo(map)
  },

  methods: {
    insertPolyline(points) {
      if (this.polyline !== null) {
        this.removePolyline()
      }
      var map = this.$refs.map.mapObject
      this.polyline = L.polyline(points, {
        color: "blue",
        weight: 5,
        opacity: 0.7,
        lineJoin: "round"
      })
      this.polyline.addTo(map)
      map.fitBounds(points)
    },
    removePolyline() {
      this.$refs.map.mapObject.removeLayer(this.polyline)
    }
  }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
</style>