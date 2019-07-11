<template>
  <div>
    <v-layout row>
      <v-flex>
        <v-card>
          <v-toolbar extended extension-height="40px" color="light-blue lighten-2">
            <v-icon>directions</v-icon>
            <v-toolbar-title justify-space-around>
              <v-card-text class="title">Route Options</v-card-text>
            </v-toolbar-title>
            <template v-slot:extension>
              <v-radio-group class="pt-3" v-model="sortBy" row>
                <div class="pr-1">Sort By:</div>
                <v-radio 
                  color="black" 
                  label="Fastest" 
                  value="fastest"
                ></v-radio>
                <v-radio 
                  color="black" 
                  label="Cheapest" 
                  value="cheapest"
                ></v-radio>
              </v-radio-group>
            </template>
            <v-spacer></v-spacer>
            <v-btn @click="init(currId)" icon>
              <v-icon>refresh</v-icon>
            </v-btn>
            <v-btn @click="updateLocation" icon>
              <v-icon>gps_fixed</v-icon>
            </v-btn>
            <v-btn to="/trips" icon>
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </v-toolbar>
          <v-expansion-panel>
            <v-expansion-panel-content
              v-for="trip in sortedItineraries"
              :key="trip.index"
              @click.native="$emit('render-polyline', trip.polyline)"
            >
              <template v-slot:header>
                <v-layout style="height: 70px" column>
                  <v-layout class="pb-3" row wrap>
                    <v-flex>
                      <div v-if="trip.travelTime < 3600">
                        Approx. travel time: {{ Math.floor(trip.travelTime / 60) }} min
                      </div>
                      <div v-if="trip.travelTime >= 3600">
                        Approx. travel time: {{ Math.floor(trip.travelTime / 3600) }} hr {{ Math.floor((trip.travelTime - Math.floor(trip.travelTime / 3600) * 3600) / 60) }} min
                      </div>
                    </v-flex>
                    <v-flex class="text-xs-right pr-3" style="color: #008000; font-weight: bold">
                      ${{ trip.cost }}
                    </v-flex>
                  </v-layout>
                  <v-flex class="text-xs-left">
                    <span
                      v-for="(transit, index) in trip.transitInfo" 
                      :key="transit.id"
                    >
                      <v-icon v-if="index !== 0">arrow_right_alt</v-icon>
                      <v-icon >{{ transit.icon }}</v-icon>
                      {{ transit.transport }}
                    </span>
                  </v-flex>
                </v-layout>  
              </template>
              <div class="pl-3 pr-4" style="overflow-y: scroll; height: 400px">
                <v-timeline dense light align-top>
                  <v-timeline-item
                    v-for="(instructions, index) in trip.fullInstructions"
                    :key="instructions.index"
                    :icon="trip.routeIcons[index]"
                    color="red lighten-2"
                    fill-dot
                  >
                    <v-card class="elevation-5">
                      <v-card-title class="subheading">{{instructions[0]}}</v-card-title>
                      <v-card-text>{{instructions[1]}} {{instructions[2]}}</v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'TripsInstruction',
  data() {
    return {
      loaded: false,
      itineraries: [],
      currId: null,
      currEvent: null,
      nextEvent: null,
      sortBy: 'fastest'
    }
  },
  computed: {
    sortedItineraries() {
      if (this.sortBy === 'fastest') {
        return this.itineraries.slice().sort((x, y) => x.travelTime - y.travelTime)
      } else {
        return this.itineraries.slice().sort((x, y) => x.cost - y.cost)
      }
    }
  },
  methods: {
    async init(id) {
      this.currId = id
      this.itineraries = []
      if (this.currEvent === null) {
        this.currEvent = this.$store.getters.calendarEvents[id]
      }
      this.nextEvent = this.$store.getters.calendarEvents[id + 1]
      let oneMapApiKey = ''
      var bodyFormData = new FormData()
      bodyFormData.append('email', 'howgodev@gmail.com')
      bodyFormData.append('password', 'vZG8qgeXpM')
      await this.$http({
        method: 'post',
        url: 'https://developers.onemap.sg/privateapi/auth/post/getToken',
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
        data: bodyFormData
      })
      .then(res => {
        oneMapApiKey = res.data.access_token
      })
      .catch(err => {
        console.log(err)
      })
      await this.$http
        .get(
          'https://developers.onemap.sg/privateapi/routingsvc/route?start=' +
            this.currEvent.latlng +
            '&end=' +
            this.nextEvent.latlng +
            '&routeType=pt&token=' +
            oneMapApiKey +
            '&date=' +
            this.currEvent.date +
            '&time=' +
            this.currEvent.startTime +
            '&mode=TRANSIT&numItineraries=3'
        )
        .then(res => {
          const polyline = require('polyline-encoded')
          var routes = []

          // route instructions
          for (var j = 0; j < res.data.plan.itineraries.length; j++) {
            routes.push(res.data.plan.itineraries[j])
          }
          for (var k = 0; k < routes.length; k++) {
            var tripInfo = {}
            var routeIcons = []
            var transitInfo = []

            // route summary
            tripInfo['travelTime'] = routes[k].duration
            if (Number(routes[k].fare)) {
              tripInfo['cost'] = Number(routes[k].fare)
            } else {
              tripInfo['cost'] = routes[k].fare
            }
            var fullInstructions = []
            var polylineLatLng = []
            for (var l = 0; l < routes[k].legs.length; l++) {

              // polyline decoding
              polylineLatLng.push(polyline.decode(routes[k].legs[l].legGeometry.points))
              var instructions = []
              var transit = {}

              //name
              if (l === 0) {
                routes[k].legs[l].from.name = this.currEvent.name
              }
              if (l === routes[k].legs.length - 1) {
                routes[k].legs[l].to.name = this.nextEvent.name
              }
              instructions.push(routes[k].legs[l].from.name)

              var text = ''
              if (routes[k].legs[l].mode === 'WALK') {
                text =
                  'Walk for ' +
                  Math.round(routes[k].legs[l].distance) +
                  ' m to ' +
                  routes[k].legs[l].to.name
                if (routes[k].legs[l].to.stopId !== undefined) {
                  var id = routes[k].legs[l].to.stopId.slice(6)
                  if (id.length >= 5) {
                    text += ' (Bus Stop: ' + id + ')'
                  } else {
                    text += ' ' + id
                  }
                }
                instructions.push(text)
                instructions.push(
                  '(' + Math.round(routes[k].legs[l].distance) + ' m)'
                )
                routeIcons.push('directions_walk')
              } else {
                let icon = ''
                text =
                  'Take ' +
                  routes[k].legs[l].routeId +
                  ' and alight at ' +
                  routes[k].legs[l].to.name +
                  ' '
                var id2 = routes[k].legs[l].to.stopId.slice(6)
                if (id2.length >= 5) {
                  text += '(Bus Stop: ' + id2 + ')'
                  icon = 'directions_bus'
                } else {
                  text += id2
                  icon = 'directions_subway'
                }
                instructions.push(text)
                instructions.push(
                  Math.round(routes[k].legs[l].duration / 60) +
                    ' min(' +
                    (routes[k].legs[l].intermediateStops.length + 1) +
                    ' stops, ' +
                    Math.round((routes[k].legs[l].distance / 1000) * 10) / 10 +
                    ' km)'
                )
                routeIcons.push(icon)
              }
              if (routes[k].legs[l].transitLeg) {
                if (routes[k].legs[l].mode === 'BUS') {
                  transit['icon'] = 'directions_bus'
                } else {
                  transit['icon'] = 'directions_subway'
                }
                transit['transport'] = routes[k].legs[l].routeShortName
                transitInfo.push(transit)
              }
              fullInstructions.push(instructions)
              tripInfo['fullInstructions'] = fullInstructions
              tripInfo['transitInfo'] = transitInfo
              tripInfo['routeIcons'] = routeIcons
              tripInfo['polyline'] = polylineLatLng.flat(1)
            }
            this.itineraries.push(tripInfo)
          }
        })
        .catch(() => {
          alert('Onemap API error, please refresh')
        })
    },
    updateLocation() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let oneMapApiKey = ''
        var bodyFormData = new FormData()
        bodyFormData.append('email', 'howgodev@gmail.com')
        bodyFormData.append('password', 'vZG8qgeXpM')
        await this.$http({
            method: 'post',
            url: 'https://developers.onemap.sg/privateapi/auth/post/getToken',
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
            data: bodyFormData
        })
        .then(res => {
            oneMapApiKey = res.data.access_token;
        })
        .catch(err => {
            console.log(err);
        })
        this.$http.get('https://developers.onemap.sg/privateapi/commonsvc/revgeocode?location=' + position.coords.latitude + ',' + position.coords.longitude + '&token=' + oneMapApiKey + '&buffer=100')
        .then(res => {
          const d = new Date()
          const dateToday = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString()
          const currDate = dateToday.slice(0, 10)
          const currTime = dateToday.slice(11, 19)
          var eventInfo = {}
          eventInfo['name'] = res.data.GeocodeInfo[0].BUILDINGNAME
          eventInfo['latlng'] = res.data.GeocodeInfo[0].LATITUDE + ',' + res.data.GeocodeInfo[0].LONGITUDE
          eventInfo['date'] = currDate
          eventInfo['startTime'] = currTime
          this.currEvent = eventInfo
          this.init(this.currId)
        })
        .catch(err => {
          console.log(err)
        })
      }, () => {
        alert('Position not found, please try again!')
      }, 
      { 
        enableHighAccuracy: true, 
        maximumAge: 0,
        timeout: 10000
      })
    }
  }
}
</script>

<style scoped>
#possibleTrips {
  border: 7px solid red;
  margin-bottom: 30px;
}
#specificTrip {
  border: 5px solid blue;
}
#instructions {
  border: 3px solid green;
  margin: 20px 0;
}
</style>
