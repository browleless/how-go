<template>
  <div>
    <l-map ref="map" style="position: absolute" :center="center" :zoom="zoom">
      <l-tile-layer :url="url" :attribution="attribution"/>
      <l-marker v-for="marker in markers" :icon="marker.icon" :lat-lng="marker.latLng" :key="marker.id">
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
      this.markers.push({
        latLng: points[0],
        icon: new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
      this.markers.push({
        latLng: points[points.length - 1],
        icon: new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
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