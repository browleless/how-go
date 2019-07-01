<template>
  <div>
    <l-map ref="map" style="position: absolute" :center="center" :zoom="zoom">
      <l-tile-layer :url="url" :attribution="attribution"/>
      <l-marker v-for="marker in markers" :lat-lng="marker" :key="marker.id">
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet"

import { Icon } from 'leaflet'

delete Icon.Default.prototype._getIconUrl

Icon.Default.imagePath = '.'
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      center: L.latLng(1.3521, 103.8198),
      zoom: 12,
      polyline: null,
      markers: []
    }
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
        this.markers = []
      }
      var map = this.$refs.map.mapObject
      this.polyline = L.polyline(points, {
        color: "blue",
        weight: 5,
        opacity: 0.7,
        lineJoin: "round"
      })
      this.polyline.addTo(map)
      this.markers.push(points[0])
      this.markers.push(points[points.length - 1])
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