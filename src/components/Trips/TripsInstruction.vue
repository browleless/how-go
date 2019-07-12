<template>
  <div>
    <v-layout row>
      <v-flex>
        <v-card>
          <v-toolbar extended extension-height="92px" color="light-blue lighten-2">
            <v-icon>directions</v-icon>
            <v-toolbar-title justify-space-around>
              <v-card-text class="title">Route Options</v-card-text>
            </v-toolbar-title>
            <template v-slot:extension>
              <v-layout wrap column>
                <v-flex>
                  <v-radio-group class="pt-1 pb-3" v-model="sortBy" hide-details row>
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
                </v-flex>
                <v-flex>
                  <v-tabs slider-color="rgba(0, 0, 0, 0.87)" color="light-blue lighten-2" grow>
                    <v-tab @click="modeOfTransport = 'TRANSIT'; init(currId)">
                      <v-icon>directions_subway</v-icon>
                    </v-tab>
                    <v-tab @click="modeOfTransport ='BUS'; init(currId)">
                      <v-icon>directions_bus</v-icon>
                    </v-tab>
                  </v-tabs>
                </v-flex>
              </v-layout>
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
            <v-progress-circular
              v-if="!loaded"
              indeterminate
              color="primary"
              size="70"
              width="6"
              class="ma-4"
            ></v-progress-circular>
            <v-expansion-panel-content
              v-for="trip in sortedItineraries"
              :key="trip.index"
              @click.native="$emit('render-polyline', trip.polyline)"
            >
              <template v-slot:header>
                <v-layout class="subheading" style="height: 70px" column>
                  <v-layout class="pb-3" row wrap>
                    <v-flex>
                      <div v-if="trip.travelTime < 3600">
                        Approx. travel time: 
                        <span style="font-weight: bold">
                          {{ Math.floor(trip.travelTime / 60) }} min
                        </span>
                      </div>
                      <div v-if="trip.travelTime >= 3600">
                        Approx. travel time: 
                        <span style="font-weight: bold">
                          {{ Math.floor(trip.travelTime / 3600) }} hr {{ Math.floor((trip.travelTime - Math.floor(trip.travelTime / 3600) * 3600) / 60) }} min
                        </span>
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
                      <span 
                        style="border-radius: 5px; font-weight: 500"
                        :style="[{'background-color': getColor(transit.transport, ''), 'color': !parseInt(transit.transport) ? 'white' : '#FFA726'}]"
                        :class="index === trip.transitInfo.length - 1 ? 'pr-1' : ''"
                      >
                        {{ transit.transport }}
                      </span>
                    </span>
                  </v-flex>
                </v-layout>  
              </template>
              <div class="pl-3 pr-4" style="overflow-y: scroll; height: 400px">
                <v-timeline dense light align-top>
                  <v-timeline-item
                    v-for="(steps, index) in trip.fullInstructions"
                    :key="steps.index"
                    :icon="trip.routeIcons[index]"
                    :color="getColor(steps.transport, index, trip.fullInstructions.length - 1)"
                    fill-dot
                  >
                    <v-card 
                      style="border-radius: 10px" class="elevation-5" 
                      :color="getColor(steps.transport, index, trip.fullInstructions.length - 1)"
                      dark
                    >
                      <v-card-title class='title'>
                        {{steps.instructions[0]}}
                      </v-card-title>
                      <v-card-text class="white text--primary subheading">
                        <div>
                          {{steps.instructions[1]}}
                        </div>
                        <div class="mt-3">
                          <span 
                            style="color: white; border-radius: 5px;" 
                            :style="[{'background-color': getColor(steps.transport, index, trip.fullInstructions.length - 1)}]"
                            class="pa-1"
                          >
                            {{steps.instructions[2]}}
                          </span>
                        </div>
                      </v-card-text>
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
      sortBy: 'fastest',
      modeOfTransport: 'TRANSIT'
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
      this.loaded = false
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
            '&mode=' + 
            this.modeOfTransport +
            '&numItineraries=3'
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
              var legInfo = {}
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
                    ' min (' +
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
              legInfo['instructions'] = instructions
              legInfo['transport'] = routes[k].legs[l].route
              fullInstructions.push(legInfo)
              tripInfo['fullInstructions'] = fullInstructions
              tripInfo['transitInfo'] = transitInfo
              tripInfo['routeIcons'] = routeIcons
              tripInfo['polyline'] = polylineLatLng.flat(1)
            }
            this.itineraries.push(tripInfo)
          }
          this.loaded = true
        })
        .catch(() => {
          alert('Onemap API error, please refresh')
        })
    },
    updateLocation() {
      this.itineraries = []
      this.loaded = false
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
    },
    getColor(typeOfTransport, index, length) {
      if (index === 0 || index === length) {
        return '#424242'
      } else if (typeOfTransport === '') {
        return '#6981E0'
      } else if (typeOfTransport === 'EW' || typeOfTransport === 'CG') {
        return '#009E52'
      } else if (typeOfTransport === 'NE') {
        return '#6B3294'
      } else if (typeOfTransport === 'CC' || typeOfTransport === 'CE') {
        return '#FCB029'
      } else if (typeOfTransport === 'NS') {
        return '#F92D38'
      } else if (typeOfTransport === 'DT') {
        return '#4465B7'
      } else if (typeOfTransport === 'SW' || typeOfTransport === 'SE' ||
      typeOfTransport === 'PW' || typeOfTransport === 'PE' || typeOfTransport === 'BP') {
        return '#668372'
      } else {
        if (index) {
          return '#22B5D0'
        } else {
          return '#424242'
        }
      }
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
