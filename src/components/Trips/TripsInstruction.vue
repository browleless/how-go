<template>
  <div>
    <v-layout row>
      <v-flex>
        <v-card>
          <v-toolbar color="light-blue lighten-2">
            <v-icon>directions</v-icon>
            <v-toolbar-title justify-space-around>
              <v-card-text class="title">Route Options</v-card-text>
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-expansion-panel>
            <v-expansion-panel-content
              v-for="trip in itineraries"
              :key="trip.index"
              @click.native="$emit('render-polyline', trip.polyline)"
            >
              <template v-slot:header>
                {{trip.travelTime}} {{trip.cost}}
              </template>
              <v-timeline dense light align-top>
                <v-timeline-item
                  v-for="instructions in trip.fullInstructions"
                  :key="instructions.index"
                  color="red lighten-2"
                  small
                >
                  <v-card class="elevation-5">
                    <v-card-title class="subheading">{{instructions[0]}}</v-card-title>
                    <v-card-text>{{instructions[1]}} {{instructions[2]}}</v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
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
    }
  },
  methods: {
    async init(id) {
      const currEvent = this.$store.getters.calendarEvents[id]
      const nextEvent = this.$store.getters.calendarEvents[id + 1]
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
            currEvent.latlng +
            '&end=' +
            nextEvent.latlng +
            '&routeType=pt&token=' +
            oneMapApiKey +
            '&date=' +
            currEvent.date +
            '&time=' +
            currEvent.startTime +
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

            // route summary
            tripInfo['travelTime'] =
              'Approx. travel time: ' +
              Math.round(routes[k].duration / 60) +
              ' min'
            tripInfo['cost'] = 'Cost: $' + routes[k].fare
            var fullInstructions = []
            var polylineLatLng = []
            for (var l = 0; l < routes[k].legs.length; l++) {

              // polyline decoding
              polylineLatLng.push(polyline.decode(routes[k].legs[l].legGeometry.points))
              var instructions = []

              //name
              if (l === 0) {
                routes[k].legs[l].from.name = currEvent.name
              }
              if (l === routes[k].legs.length - 1) {
                routes[k].legs[l].to.name = nextEvent.name
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
              } else {
                text =
                  'Take ' +
                  routes[k].legs[l].routeId +
                  ' and alight at ' +
                  routes[k].legs[l].to.name +
                  ' '
                var id2 = routes[k].legs[l].to.stopId.slice(6)
                if (id2.length >= 5) {
                  text += '(Bus Stop: ' + id2 + ')'
                } else {
                  text += id2
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
              }
              fullInstructions.push(instructions)
              tripInfo['fullInstructions'] = fullInstructions
              tripInfo['polyline'] = polylineLatLng.flat(1)
            }
            this.itineraries.push(tripInfo)
          }
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
