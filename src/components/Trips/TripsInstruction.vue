<template>
  <div>
    <v-btn @click="show">Get routes</v-btn>
    <v-btn v-if="!hidden && loaded" @click="hidden = !hidden">Show</v-btn>
    <v-btn v-if="hidden && loaded" @click="hidden = !hidden">Hide</v-btn>
    <div v-if="loaded && hidden">
      <div v-for="trips in tripsInfo" :key="trips.index" id="individualTrip">
        <div
          v-for="fullInstructions in trips.fullInstructions"
          :key="fullInstructions.index"
          id="eachInstruction"
        >
          <ul
            v-for="instructions in fullInstructions.steps"
            :key="instructions.index"
          >{{ instructions }}</ul>
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
      routes: [],
      loaded: false,
      hidden: true
    }
  },
  methods: {
    show() {
      this.$http.get(
          "https://developers.onemap.sg/privateapi/routingsvc/route?start=1.39202430708239,103.896214703952&end=1.29499029079783,103.773912326613&routeType=pt&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI3MjksInVzZXJfaWQiOjI3MjksImVtYWlsIjoiMTk5OG5hdWZhbEBnbWFpbC5jb20iLCJmb3JldmVyIjpmYWxzZSwiaXNzIjoiaHR0cDpcL1wvb20yLmRmZS5vbmVtYXAuc2dcL2FwaVwvdjJcL3VzZXJcL3Nlc3Npb24iLCJpYXQiOjE1NjA0MDk3MjIsImV4cCI6MTU2MDg0MTcyMiwibmJmIjoxNTYwNDA5NzIyLCJqdGkiOiI0NjUzN2YzZmE4YjEyZTMwZTMzODdlZDZmMzgwZTEzMiJ9.0WQUOPl_s0n9TxNaLondpmVamvAvt0PLFSYzCQlkhpU&date=2019-06-17&time=10:30:00&mode=TRANSIT"
        )
        .then(res => {
          // polyline decoding
          for (var j = 0; j < res.data.plan.itineraries.length; j++) {
            this.routes.push(res.data.plan.itineraries[j])
          }
          // route instructions
          for (var k = 0; k < this.routes.length; k++) {
            var tripInfo = {}
            tripInfo["travelTime"] =
              "Approx. travel time: " +
              Math.round(this.routes[k].duration / 60) +
              " min"
            tripInfo["cost"] = "Cost: $" + this.routes[k].fare
            var fullInstructions = []
            for (var l = 0; l < this.routes[k].legs.length; l++) {
              var instructions = []
              var text = ""
              var steps = {}
              instructions.push(this.routes[k].legs[l].from.name);
              if (this.routes[k].legs[l].mode === "WALK") {
                text =
                  "Walk for " +
                  Math.round(this.routes[k].legs[l].distance) +
                  " m to " +
                  this.routes[k].legs[l].to.name
                if (this.routes[k].legs[l].to.stopId !== undefined) {
                  var id = this.routes[k].legs[l].to.stopId.slice(6);
                  if (id.length >= 5) {
                    text += " (Bus Stop: " + id + ")"
                  } else {
                    text += " " + id
                  }
                }
                instructions.push(text)
                instructions.push(
                  "(" + Math.round(this.routes[k].legs[l].distance) + " m)"
                )
              } else {
                text =
                  "Take " +
                  this.routes[k].legs[l].routeId +
                  " and alight at " +
                  this.routes[k].legs[l].to.name +
                  " "
                var id2 = this.routes[k].legs[l].to.stopId.slice(6);
                if (id2.length >= 5) {
                  text += "(Bus Stop: " + id + ")"
                } else {
                  text += id2
                }
                instructions.push(text);
                instructions.push(
                  Math.round(this.routes[k].legs[l].duration / 60) +
                    " min(" +
                    (this.routes[k].legs[l].intermediateStops.length + 1) +
                    " stops, " +
                    Math.round((this.routes[k].legs[l].distance / 1000) * 10) /
                      10 +
                    " km)"
                )
              }
              steps["steps"] = instructions
              fullInstructions.push(steps)
              tripInfo["fullInstructions"] = fullInstructions
            }
            this.tripsInfo.push(tripInfo)
          }
          this.loaded = true;
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
}
</script>

<style scoped>
#individualTrip {
  border: 7px solid red;
  margin-bottom: 30px;
}
#eachInstruction {
  border: 2px solid blue;
}
</style>
