<template>
  <div>
    <v-layout row>
      <v-flex >
        <v-card>
          <v-toolbar color="light-blue lighten-2">
            <v-icon>directions</v-icon>
            <v-toolbar-title justify-space-around>
              <v-card-text class="title">Route Options</v-card-text>
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-expansion-panel>
            <v-expansion-panel-content v-for="itinerary in itineraries" :key="itinerary.index">
              <template v-slot:header>
                <div>{{itinerary.travelTime}}</div>
              </template>
              <v-timeline dense light align-top>
                <v-timeline-item
                  v-for="instructions in itinerary.fullInstructions"
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
  name: "TripsInstruction",
  computed: {
    itinerary() {
      return this.itineraries[0];
    }
  },
  data() {
    return {
      itineraries: [
        {
          travelTime: "Approx. travel time: 4 min",
          cost: "Cost: $1.51",
          fullInstructions: [
            ["COMPAasdfEIGHTS", "Walk for 123412298m to path", "4 min (298 m)"],
            ["SENGKANG STN", "Walk for 97m to SENGKANG MRT", "(97 m)"],
            [
              "SERANGOON MRT STATION",
              "Take and alight at PAYA LEBAR MRT STATION",
              "7 min(4 stops, 4.4km)"
            ]
          ]
        },

        {
          travelTime: "Approx. travel time: 10 min",
          cost: "Cost: $1.51",
          fullInstructions: [
            ["CasdfTS", "Walk for 298m to path", "4 min (298 m)"],
            ["SENGKANG STN", "Walk for 9232327m to SENGKANG MRT", "(97 m)"],
            [
              "SERANGOON MRT STATION",
              "Take and alight at PAYA LEBAR MRT STATION",
              "7 min(4 stops, 4.4km)"
            ]
          ]
        },

        {
          travelTime: "Approx. travel time: 12 min",
          cost: "Cost: $1.51",
          fullInstructions: [
            ["CfdsaS", "Walk for 298m to path", "4 min (298 m)"],
            ["SENGKANG STN", "Walk for 97m to SENGKANG MRT", "(97 m)"],
            [
              "SERANGOON MRT STATION",
              "Take and alight at PAYA LEBAR MRT STATION",
              "7 min(4 stops, 4.23r234km)"
            ]
          ]
        }
      ],
      loaded: false
    };
  },
  methods: {
    async init(id) {
      console.log("sdfasf");
      for (var i = 0; i < this.$store.getters.calendarEvents.length - 1; i++) {
        //if(this.$store.getters.calendarEvents.id === id){
        console.log("entered id = " + id);
        var trip = {};
        await this.$http
          .get(
            "https://developers.onemap.sg/privateapi/routingsvc/route?start=" +
              this.$store.getters.calendarEvents[i].latlng +
              "&end=" +
              this.$store.getters.calendarEvents[i + 1].latlng +
              "&routeType=pt&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI3MjksInVzZXJfaWQiOjI3MjksImVtYWlsIjoiMTk5OG5hdWZhbEBnbWFpbC5jb20iLCJmb3JldmVyIjpmYWxzZSwiaXNzIjoiaHR0cDpcL1wvb20yLmRmZS5vbmVtYXAuc2dcL2FwaVwvdjJcL3VzZXJcL3Nlc3Npb24iLCJpYXQiOjE1NjA0MDk3MjIsImV4cCI6MTdate=" +
              this.$store.getters.calendarEvents[i].date +
              "&time=10:30:00&mode=TRANSIT&numItineraries=3"
          )
          .then(res => {
            var routes = [];
            for (var j = 0; j < res.data.plan.itineraries.length; j++) {
              routes.push(res.data.plan.itineraries[j]);
            }
            // route instructions
            var itineraries = [];
            for (var k = 0; k < routes.length; k++) {
              var tripInfo = {};
              tripInfo["travelTime"] =
                "Approx. travel time: " +
                Math.round(routes[k].duration / 60) +
                " min";
              tripInfo["cost"] = "Cost: $" + routes[k].fare;
              var fullInstructions = [];
              for (var l = 0; l < routes[k].legs.length; l++) {
                var instructions = [];
                var text = "";
                var steps = {};
                if (l === 0) {
                  routes[k].legs[
                    l
                  ].from.name = this.$store.getters.calendarEvents[i].name;
                }
                if (l === routes[k].legs.length - 1) {
                  routes[k].legs[
                    l
                  ].to.name = this.$store.getters.calendarEvents[i + 1].name;
                }
                instructions.push(routes[k].legs[l].from.name);
                if (routes[k].legs[l].mode === "WALK") {
                  text =
                    "Walk for " +
                    Math.round(routes[k].legs[l].distance) +
                    " m to " +
                    routes[k].legs[l].to.name;
                  if (routes[k].legs[l].to.stopId !== undefined) {
                    var id = routes[k].legs[l].to.stopId.slice(6);
                    if (id.length >= 5) {
                      text += " (Bus Stop: " + id + ")";
                    } else {
                      text += " " + id;
                    }
                  }
                  instructions.push(text);
                  instructions.push(
                    "(" + Math.round(routes[k].legs[l].distance) + " m)"
                  );
                } else {
                  text =
                    "Take " +
                    routes[k].legs[l].routeId +
                    " and alight at " +
                    routes[k].legs[l].to.name +
                    " ";
                  var id2 = routes[k].legs[l].to.stopId.slice(6);
                  if (id2.length >= 5) {
                    text += "(Bus Stop: " + id2 + ")";
                  } else {
                    text += id2;
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
                  );
                }
                steps["steps"] = instructions;
                fullInstructions.push(steps);
                tripInfo["fullInstructions"] = fullInstructions;
              }
              itineraries.push(tripInfo);
              trip["itinararies"] = itineraries;
            }
          })
          .catch(err => {
            console.log(err);
          });
        this.tripsInfo.push(trip);
      }
      //}
    },
    pullInstructions(id) {
      this.init(id)
      this.loaded = true
    },
    show() {
      console.log("this button was pressed");
    }
  },
  mounted() {
    
  }
};
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
