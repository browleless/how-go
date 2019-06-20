<template>
  <div>
    <l-map ref="map" style="position: absolute" :center="center" :zoom="zoom">
      <l-tile-layer :url="url" :attribution="attribution"/>
    </l-map>
  </div>
</template>

<script>
import { LMap, LPolyline, LTileLayer } from "vue2-leaflet";

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
      zoom: 12
    };
  },

  mounted() {
    const map = this.$refs.map.mapObject
    map.zoomControl.remove()
    L.control.zoom({ position:'topright' }).addTo(map);
  },

  methods: {
    // insertPolyline: function() {
    //   var map = this.$refs.map.mapObject;
    //  // var polyline = require("google-polyline");
    //  // var points = polyline.decode("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
    //   L.polyline(points, {
    //     color: "blue",
    //     weight: 5,
    //     opacity: 0.7,
    //     lineJoin: "round"
    //   }).addTo(map);
    //   map.fitBounds(points);
    // }
  }
};
</script>

<style>
@import "~leaflet/dist/leaflet.css";
</style>