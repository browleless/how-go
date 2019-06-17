<template>
  <div>
    <v-btn v-if="loaded" @click="loaded = !loaded">Show</v-btn>
    <v-btn v-if="!loaded" @click="loaded = !loaded">Hide</v-btn>
    <div v-if="!loaded">
      <div v-for="trips in tripsInfo" :key="trips.index" id="possibleTrips">
        Route Options for Destination
        <div
          v-for="itinararies in trips.itinararies"
          :key="itinararies.index"
          id="specificTrip"
        >
        <div>{{ itinararies.travelTime }}</div>
        <div>{{ itinararies.cost }}</div>
          <ul
            v-for="instructions in itinararies.fullInstructions"
            :key="instructions.index"
            id="instructions"
          >
            <div
              v-for="steps in instructions.steps"
              :key="steps.index"
            >{{ steps }}</div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TripsInstruction",
  data() {
    return {
      tripsInfo: [],
      loaded: false,
    }
  },
  methods: {
    async init() {
      for (var i = 0; i < this.$store.getters.calendarEvents.length - 1; i++) {
        var trip = {}
        await this.$http.get(
            'https://developers.onemap.sg/privateapi/routingsvc/route?start=' + this.$store.getters.calendarEvents[i].latlng +'&end=' + this.$store.getters.calendarEvents[i + 1].latlng +'&routeType=pt&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI3MjksInVzZXJfaWQiOjI3MjksImVtYWlsIjoiMTk5OG5hdWZhbEBnbWFpbC5jb20iLCJmb3JldmVyIjpmYWxzZSwiaXNzIjoiaHR0cDpcL1wvb20yLmRmZS5vbmVtYXAuc2dcL2FwaVwvdjJcL3VzZXJcL3Nlc3Npb24iLCJpYXQiOjE1NjA0MDk3MjIsImV4cCI6MTU2MDg0MTcyMiwibmJmIjoxNTYwNDA5NzIyLCJqdGkiOiI0NjUzN2YzZmE4YjEyZTMwZTMzODdlZDZmMzgwZTEzMiJ9.0WQUOPl_s0n9TxNaLondpmVamvAvt0PLFSYzCQlkhpU&date=' + this.$store.getters.calendarEvents[i].date + '&time=10:30:00&mode=TRANSIT&numItineraries=3'
          )
          .then(res => {
            var routes = []
            for (var j = 0; j < res.data.plan.itineraries.length; j++) {
              routes.push(res.data.plan.itineraries[j])
            }
            // route instructions
            var itineraries = []
            for (var k = 0; k < routes.length; k++) {
              var tripInfo = {}
              tripInfo["travelTime"] =
                "Approx. travel time: " +
                Math.round(routes[k].duration / 60) +
                " min"
              tripInfo["cost"] = "Cost: $" + routes[k].fare
              var fullInstructions = []
              for (var l = 0; l < routes[k].legs.length; l++) {
                var instructions = []
                var text = ""
                var steps = {}
                if (l === 0) {
                  routes[k].legs[l].from.name = this.$store.getters.calendarEvents[i].name
                }
                if (l === routes[k].legs.length - 1) {
                  routes[k].legs[l].to.name = this.$store.getters.calendarEvents[i + 1].name
                }
                instructions.push(routes[k].legs[l].from.name);
                if (routes[k].legs[l].mode === "WALK") {
                  text =
                    "Walk for " +
                    Math.round(routes[k].legs[l].distance) +
                    " m to " +
                    routes[k].legs[l].to.name
                  if (routes[k].legs[l].to.stopId !== undefined) {
                    var id = routes[k].legs[l].to.stopId.slice(6);
                    if (id.length >= 5) {
                      text += " (Bus Stop: " + id + ")"
                    } else {
                      text += " " + id
                    }
                  }
                  instructions.push(text)
                  instructions.push(
                    "(" + Math.round(routes[k].legs[l].distance) + " m)"
                  )
                } else {
                  text =
                    "Take " +
                    routes[k].legs[l].routeId +
                    " and alight at " +
                    routes[k].legs[l].to.name +
                    " "
                  var id2 = routes[k].legs[l].to.stopId.slice(6);
                  if (id2.length >= 5) {
                    text += "(Bus Stop: " + id2 + ")"
                  } else {
                    text += id2
                  }
                  instructions.push(text);
                  instructions.push(
                    Math.round(routes[k].legs[l].duration / 60) +
                      " min(" +
                      (routes[k].legs[l].intermediateStops.length + 1) +
                      " stops, " +
                      Math.round((routes[k].legs[l].distance / 1000) * 10) /
                        10 +
                      " km)"
                  )
                }
                steps["steps"] = instructions
                fullInstructions.push(steps)
                tripInfo["fullInstructions"] = fullInstructions
              }
              itineraries.push(tripInfo)
              trip['itinararies'] = itineraries
            }
          })
          .catch(err => {
            console.log(err)
          })
          this.tripsInfo.push(trip)
      }
    }
  },
  mounted() {
    this.init()
    this.loaded = true
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
