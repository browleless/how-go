<template>
  <div id="top">
    <v-responsive
      style="height: 100vh; background-image: url('https://images.unsplash.com/photo-1519885277449-12eee5564d68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80'); background-repeat: no-repeat;
  background-attachment: fixed; background-position: center"
    >
      <v-container fill-height>
        <v-layout align-center>
          <v-flex
            offset-xl1
            xs12
            sm10
            md8
            xl6
            style="background-color: rgba(0, 0, 0, 0.4); border-radius: 25px"
            class="white--text px-4 py-2"
          >
            <h3 style="font-weight: bold" class="display-3">Welcome to HowGo</h3>
            <div
              class="subheading"
            >A personal travel assistant which helps users get to their planned locations in a time or cost-efficient way.</div>
            <div
              class="subheading"
            >Now, there is no need to constantly search for ways to get to places as things would be automated.</div>
            <v-divider class="my-3"></v-divider>
            <v-btn
              class="mx-0"
              color="primary"
              large
              @click="$vuetify.goTo('#routing', 0, 1000)"
            >Try it!</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-responsive>

    <v-responsive
      style="height: 80vh; background-color: white;   background: rgb(54,98,119);
background: linear-gradient(180deg, rgba(54,98,119,0.8442109265581232) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,1) 85%, rgba(212,153,141,1) 100%); "
    >
      <v-container fill-height>
        <v-layout align-center pt-0 pb-5 mb-3>
          <v-flex
            v-if="hover1 !==''"
            class="text-xs-center"
            @mouseover="hover1 = 'asdf'"
            @mouseleave="hover1 = ''"
            xs12
            sm4
            xl2
            offset-xl3
          >
            <img height="280px" src="../assets/img/meet3.gif" />
            <h3 style=" width:80%; text-align:center;margin:0 auto;">Plan your days in advance</h3>
            <h3 style=" width:80%; text-align:center;margin:0 auto;">Schedule your events</h3>
          </v-flex>
          <v-flex
            v-if="hover1 ==''"
            class="text-xs-center"
            @mouseover="hover1 = 'asdf'"
            @mouseleave="hover1 = ''"
            xs12
            sm4
            xl2
            offset-xl3
          >
            <img height="280px" src="../assets/img/meet4s.jpg" />
            <h3 style=" width:80%; text-align:center;margin:0 auto;">Plan your days in advance</h3>
            <h3 style=" width:80%; text-align:center;margin:0 auto;">Schedule your events</h3>
          </v-flex>

          <v-flex
            v-if="hover2 !=='' && !this.$vuetify.breakpoint.xs"
            class="text-xs-center"
            sm4
            xl2
            @mouseover="hover2 = 'asdf'"
            @mouseleave="hover2 = ''"
          >
            <img src="../assets/img/location5.gif" height="280px" />
            <h3
              style=" width:60%; text-align:center;margin:0 auto;"
            >Conveniently map out places you have to be!</h3>
            <h3 style=" width:80%; text-align:center;margin:0 auto;"></h3>
          </v-flex>
          <v-flex
            v-if="hover2 == '' && !this.$vuetify.breakpoint.xs"
            class="text-xs-center"
            sm4
            xl2
            @mouseover="hover2 = 'asdf'"
            @mouseleave="hover2 = ''"
          >
            <img src="../assets/img/location6.jpg" height="280px" />
            <h3
              style=" width:60%; text-align:center;margin:0 auto;"
            >Conveniently map out places you have to be</h3>
            <h3 style=" width:80%; text-align:center;margin:0 auto;"></h3>
          </v-flex>

          <v-flex
            class="text-xs-center"
            v-if="hover3 !== '' && !this.$vuetify.breakpoint.xs"
            @mouseover="hover3 = 'asdf'"
            @mouseleave="hover3 = ''"
            sm4
            xl2
          >
            <img src="../assets/img/warning4.gif" height="280px" />
            <h3 style=" width:80%; text-align:center;margin:0 auto">Receive prompts to leave</h3>
            <h3 style=" width:80%; text-align:center;margin:0 auto;">Never be late again!</h3>
          </v-flex>
          <v-flex
            class="text-xs-center"
            v-if="hover3 == '' && !this.$vuetify.breakpoint.xs"
            @mouseover="hover3 = 'asdf'"
            @mouseleave="hover3 = ''"
            sm4
            xl2
          >
            <img src="../assets/img/warning3.jpg" height="280px" />
            <h3 style=" width:80%; text-align:center;margin:0 auto">Receive prompts to leave</h3>
            <h3 style=" width:80%; text-align:center;margin:0 auto;">Never be late again!</h3>
          </v-flex>
        </v-layout>
      </v-container>
    </v-responsive>

    <v-responsive
      style="height: 100%; background-image: url('https://images.unsplash.com/photo-1543187018-21e461e7538e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=80'); background-repeat: no-repeat;
  background-attachment: fixed; background-position: center"
    >
      <v-container id="routing">
        <v-responsive class="subheading mb-3">
          <v-container class="pa-0" pt-4 fill-height>
            <v-layout
              align-center
              xs12
              sm10
              md8
              xl6
              style="background-color: rgba(0, 0, 0, 0.4); border-radius: 25px"
              class="white--text px-4 py-2"
            >
              <v-flex>
                <h3 style="font-weight: bold" class="display-3">Have a Go</h3>
                <v-divider></v-divider>
                <span
                  class="subheading"
                >HowGo utilises the OneMap API Routing Service to get to your destinations. Simply enter two locations to view your route options.</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-responsive>
        <v-layout :class="$vuetify.breakpoint.smAndDown ? 'column' : 'row'" wrap>
          <v-flex xs5>
            <v-layout column wrap>
              <v-flex xs12>
                <v-card style="z-index: 504">
                  <v-toolbar extended :extension-height="from && to ? '220px' : '130px'" color="light-blue lighten-2">
                    <v-icon>directions</v-icon>
                    <v-toolbar-title justify-space-around>
                      <v-card-text class="title">HowGo?</v-card-text>
                    </v-toolbar-title>
                    <template v-slot:extension>
                      <v-layout wrap column>
                        <v-flex>
                          <place-autocomplete-field solo class="mb-3" v-model="fromStr" @autocomplete-select="fillFrom" icon="place" placeholder="Enter your current location" api-key="AIzaSyAhSv9zWvisiTXRPRw6K8AE0DCmrRMpQcU"></place-autocomplete-field>
                        </v-flex>
                        <v-flex>
                          <place-autocomplete-field solo class="mb-3" icon="flag" @autocomplete-select="fillTo" placeholder="Enter your destination's location" api-key="AIzaSyAhSv9zWvisiTXRPRw6K8AE0DCmrRMpQcU"></place-autocomplete-field>
                        </v-flex>
                        <v-flex v-if="to && from">
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
                        <v-flex v-if="to && from">
                          <v-tabs slider-color="rgba(0, 0, 0, 0.87)" color="light-blue lighten-2" grow>
                            <v-tab @click="modeOfTransport = 'TRANSIT'; getRoute()">
                              <v-icon>directions_subway</v-icon>
                            </v-tab>
                            <v-tab @click="modeOfTransport ='BUS'; getRoute()">
                              <v-icon>directions_bus</v-icon>
                            </v-tab>
                          </v-tabs>
                        </v-flex>
                      </v-layout>
                    </template>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!to && !from" @click="getRoute" icon>
                      <v-icon>refresh</v-icon>
                    </v-btn>
                    <v-btn @click="updateLocation" icon>
                      <v-icon>gps_fixed</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-expansion-panel>
                    <v-progress-circular
                      v-if="!loaded && to && from"
                      indeterminate
                      color="primary"
                      size="70"
                      width="6"
                      class="ma-4"
                    ></v-progress-circular>
                    <v-expansion-panel-content
                      v-for="trip in sortedItineraries"
                      :key="trip.index"
                      @click.native="renderPolyline(trip.polyline)"
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
                      <div class="pl-3 pr-4" style="overflow-y: scroll; height: 220px">
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
                              <v-card-title class="title">
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
          </v-flex>
          <v-flex xs7 :class="$vuetify.breakpoint.smAndDown ? 'mt-4' : 'pl-4'">
            <Map ref="map" style="height:520px; position: relative" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-responsive>

    <v-responsive style="height: 100vh;  background: rgb(117,101,164);
background: linear-gradient(180deg, rgba(117,101,164,1) 0%, rgba(111,196,212,1) 100%); ">
      <v-container>
        <v-layout row pa-5>
          <v-flex style="color: white" text-xs-center>
            <h2  class="display-1">CONTACT US</h2>
            <v-divider></v-divider>
            <h3 style="font-weight: 300">Experiencing any issues, or just chatty? Either way, we'd love to hear from you.</h3>
          </v-flex>
        </v-layout>
        <v-layout ml-3 mr-3 :class="{'ml-5': $vuetify.breakpoint.mdAndUp, 'mr-5': $vuetify.breakpoint.mdAndUp, 'pl-5': $vuetify.breakpoint.mdAndUp, 'pr-5': $vuetify.breakpoint.mdAndUp}" row wrap>
          <v-flex class="text-xs-center" xs12>
            <v-form id="queryForm">
              <v-flex d-none>
                <v-text-field
                  name="contact_number"
                  v-model="getRandomVal"
                ></v-text-field>
              </v-flex>
              <v-flex mb-3>
                <v-text-field 
                  style="background-color: white; border-radius: 5px"
                  hide-details
                  required
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                  :error-messages="nameErrors"
                  outline
                  name="user_name"
                  label="Full Name"
                  v-model="name"
                ></v-text-field>
              </v-flex>
              <v-flex mb-3>
                <v-text-field
                  style="background-color: white; border-radius: 5px"

                  hide-details
                  required
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                  :error-messages="emailErrors"
                  outline
                  label="Email Address"
                  name="user_email"
                  type="email"
                  v-model="email"
                ></v-text-field>
              </v-flex>
              <v-flex mb-3>
                <v-text-field
                  required
                  style="background-color: white; border-radius: 5px"

                  hide-details
                  @input="$v.subject.$touch()"
                  @blur="$v.subject.$touch()"
                  :error-messages="subjectErrors"
                  outline
                  name="user_subject"
                  label="Subject"
                  v-model="subject"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-textarea
                  style="background-color: white; border-radius: 5px"

                  hide-details
                  required
                  @input="$v.message.$touch()" 
                  @blur="$v.message.$touch()"
                  :error-messages="msgErrors"
                  clearable
                  outline
                  clear-icon="cancel"
                  label="Message"
                  maxlength="250"
                  v-model="message"
                  counter
                  auto-grow
                  name="message"
                ></v-textarea>
              </v-flex>
            </v-form>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex pt-3 class="text-xs-right">
            <v-spacer></v-spacer>
            <vue-recaptcha ref="recaptcha" sitekey="6LcRb68UAAAAABAAl3wqVtcyeYPKbVaPQfC8UfFh" @verify="submitVerify" @expired="onCaptchaExpired" :loadRecaptchaScript="true"></vue-recaptcha>
          </v-flex>
          <v-flex pt-2 text-xs-right>
            <v-btn  large fab :disabled="!formValid" @click="submitQuery">
              <v-icon>mail_outline</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-responsive>
    <v-dialog v-model="submission" max-width="290">
      <v-card>
        <v-card-title class="headline">{{this.submitHeadline}}</v-card-title>
        <v-card-text>{{this.submitMsg}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="submission = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      style="z-index: 504"
      fixed
      dark
      fab
      bottom
      right
      color="black"
      @click="$vuetify.goTo(0, 10, 1000)"
    >
      <v-icon>arrow_upward</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Map from "./Trips/Map.vue";
import PlaceAutocompleteField from "./PlaceAutocompleteField.vue";
import * as emailjs from "emailjs-com";
import { validationMixin } from "vuelidate";
import { required, email, maxLength } from "vuelidate/lib/validators";
import VueRecaptcha from 'vue-recaptcha';

export default {
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(10) },
    email: {
      required,
      email
    },
    subject: { required},
    message: { required}
  },
  components: {
    PlaceAutocompleteField,
    Map,
    VueRecaptcha
  },
  name: "Landing",
  data() {
    return {
      fromStr: "",
      from: "",
      to: "",
      loaded: false,
      askedForRoute: false,
      itineraries: [],
      sortBy: "fastest",
      modeOfTransport: "TRANSIT",
      hover1: "",
      hover2: "",
      hover3: "",
      name: "",
      email: "",
      subject: "",
      message: "",
      submission: false,
      submitMsg: "",
      submitHeadline: "",
      captchaSuccess: false
    };
  },
  methods: {
    submitVerify() {
      this.captchaSuccess = true
    },
    onCaptchaExpired () { this.$refs.recaptcha.reset() } ,
    submitQuery() {
      if (this.$v.$invalid) {
        this.submitHeadline = "Error encountered"
        this.submitMsg = "Please check that you have entered all fields correctly"
        this.submission = true;
      } else {
        console.log(document.getElementById("queryForm"));
      emailjs
        .sendForm(
          "contact_service",
          "contact_form",
          document.getElementById("queryForm"),
          "user_eTOkSv753RVHVKaHILn89"
        )
        .then(
          response => {
            console.log("SUCCESS!", response.status, response.text);
            this.submitHeadline = "Query Submit Success!"
            this.submitMsg = "Thank you for contacting us. We have received your query successfully, please check your email for a confirmation."
            this.submission = true;
            this.queryFormReset();
            this.$v.$reset() 
            this.$refs.recaptcha.reset()
          },
          err => {
            console.log("FAILED...", err);
          }
        );
      }
    },
    queryFormReset() {
      this.name = "";
      this.email = "";
      this.subject = "";
      this.message = "";
    },
    sendForm() {
      console.log(this.message);
    },
    fillFrom(place, response) {
      let eventInfo = {};
      eventInfo["name"] = place.structured_formatting.main_text;
      eventInfo["latlng"] =
        response.geometry.location.lat() +
        "," +
        response.geometry.location.lng();
      this.from = eventInfo;
      if (this.to) {
        this.getRoute();
      }
    },
    fillTo(place, response) {
      let eventInfo = {};
      eventInfo["name"] = place.structured_formatting.main_text;
      eventInfo["latlng"] =
        response.geometry.location.lat() +
        "," +
        response.geometry.location.lng();
      this.to = eventInfo;
      if (this.from) {
        this.getRoute();
      }
    },
    scrollTo(str) {
      document.getElementById(str).scrollIntoView();
    },
    async getRoute() {
      this.loaded = false;
      this.itineraries = [];
      const d = new Date();
      const dateToday = new Date(
        d.getTime() - d.getTimezoneOffset() * 60000
      ).toISOString();
      const currDate = dateToday.slice(0, 10);
      const currTime = dateToday.slice(11, 19);
      let oneMapApiKey = "";
      var bodyFormData = new FormData();
      bodyFormData.append("email", "howgodev@gmail.com");
      bodyFormData.append("password", "vZG8qgeXpM");
      await this.$http({
        method: "post",
        url: "https://developers.onemap.sg/privateapi/auth/post/getToken",
        config: { headers: { "Content-Type": "multipart/form-data" } },
        data: bodyFormData
      })
        .then(res => {
          oneMapApiKey = res.data.access_token;
        })
        .catch(err => {
          console.log(err);
        });
      await this.$http
        .get(
          "https://developers.onemap.sg/privateapi/routingsvc/route?start=" +
            this.from.latlng +
            "&end=" +
            this.to.latlng +
            "&routeType=pt&token=" +
            oneMapApiKey +
            "&date=" +
            currDate +
            "&time=" +
            currTime +
            "&mode=" +
            this.modeOfTransport +
            "&numItineraries=3"
        )
        .then(res => {
          const polyline = require("polyline-encoded");
          var routes = [];

          // route instructions
          for (var j = 0; j < res.data.plan.itineraries.length; j++) {
            routes.push(res.data.plan.itineraries[j]);
          }
          for (var k = 0; k < routes.length; k++) {
            var tripInfo = {};
            var routeIcons = [];
            var transitInfo = [];

            // route summary
            tripInfo["travelTime"] = routes[k].duration;
            if (Number(routes[k].fare)) {
              tripInfo["cost"] = Number(routes[k].fare);
            } else {
              tripInfo["cost"] = routes[k].fare;
            }
            var fullInstructions = [];
            var polylineLatLng = [];
            for (var l = 0; l < routes[k].legs.length; l++) {
              // polyline decoding
              polylineLatLng.push(
                polyline.decode(routes[k].legs[l].legGeometry.points)
              );
              var instructions = [];
              var legInfo = {};
              var transit = {};

              //name
              if (l === 0) {
                routes[k].legs[l].from.name = this.from.name.toUpperCase();
              }
              if (l === routes[k].legs.length - 1) {
                routes[k].legs[l].to.name = this.to.name.toUpperCase();
              }
              instructions.push(routes[k].legs[l].from.name);

              var text = "";
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
                routeIcons.push("directions_walk");
              } else {
                let icon = "";
                text =
                  "Take " +
                  routes[k].legs[l].routeId +
                  " and alight at " +
                  routes[k].legs[l].to.name +
                  " ";
                var id2 = routes[k].legs[l].to.stopId.slice(6);
                if (id2.length >= 5) {
                  text += "(Bus Stop: " + id2 + ")";
                  icon = "directions_bus";
                } else {
                  text += id2;
                  icon = "directions_subway";
                }
                instructions.push(text);
                instructions.push(
                  Math.round(routes[k].legs[l].duration / 60) +
                    " min (" +
                    (routes[k].legs[l].intermediateStops.length + 1) +
                    " stops, " +
                    Math.round((routes[k].legs[l].distance / 1000) * 10) / 10 +
                    " km)"
                );
                routeIcons.push(icon);
              }
              if (routes[k].legs[l].transitLeg) {
                if (routes[k].legs[l].mode === "BUS") {
                  transit["icon"] = "directions_bus";
                } else {
                  transit["icon"] = "directions_subway";
                }
                transit["transport"] = routes[k].legs[l].routeShortName;
                transitInfo.push(transit);
              }
              legInfo["instructions"] = instructions;
              legInfo["transport"] = routes[k].legs[l].route;
              fullInstructions.push(legInfo);
              tripInfo["fullInstructions"] = fullInstructions;
              tripInfo["transitInfo"] = transitInfo;
              tripInfo["routeIcons"] = routeIcons;
              tripInfo["polyline"] = polylineLatLng.flat(1);
            }
            this.itineraries.push(tripInfo);
          }
          this.loaded = true;
        })
        .catch(() => {
          alert("Onemap API error, please refresh");
        });
    },
    updateLocation() {
      navigator.geolocation.getCurrentPosition(
        async position => {
          let oneMapApiKey = "";
          var bodyFormData = new FormData();
          bodyFormData.append("email", "howgodev@gmail.com");
          bodyFormData.append("password", "vZG8qgeXpM");
          await this.$http({
            method: "post",
            url: "https://developers.onemap.sg/privateapi/auth/post/getToken",
            config: { headers: { "Content-Type": "multipart/form-data" } },
            data: bodyFormData
          })
            .then(res => {
              oneMapApiKey = res.data.access_token;
            })
            .catch(err => {
              console.log(err);
            });
          this.$http
            .get(
              "https://developers.onemap.sg/privateapi/commonsvc/revgeocode?location=" +
                position.coords.latitude +
                "," +
                position.coords.longitude +
                "&token=" +
                oneMapApiKey +
                "&buffer=100"
            )
            .then(res => {
              var eventInfo = {};
              eventInfo["name"] = res.data.GeocodeInfo[0].BUILDINGNAME;
              eventInfo["latlng"] =
                res.data.GeocodeInfo[0].LATITUDE +
                "," +
                res.data.GeocodeInfo[0].LONGITUDE;
              const capitalize = words =>
                words
                  .split(" ")
                  .map(
                    word =>
                      word.substring(0, 1).toUpperCase() +
                      word.substring(1).toLowerCase()
                  )
                  .join(" ");
              if (res.data.GeocodeInfo[0].BUILDINGNAME) {
                this.fromStr =
                  capitalize(res.data.GeocodeInfo[0].BUILDINGNAME) +
                  ", " +
                  capitalize(res.data.GeocodeInfo[0].ROAD);
              } else {
                this.fromStr = capitalize(res.data.GeocodeInfo[0].ROAD);
              }
              this.from = eventInfo;
              if (this.from && this.to) {
                this.getRoute();
              }
            })
            .catch(err => {
              console.log(err);
            });
        },
        () => {
          alert("Position not found, please try again!");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000
        }
      );
    },
    getColor(typeOfTransport, index, length) {
      if (index === 0 || index === length) {
        return "#424242";
      } else if (typeOfTransport === "") {
        return "#6981E0";
      } else if (typeOfTransport === "EW" || typeOfTransport === "CG") {
        return "#009E52";
      } else if (typeOfTransport === "NE") {
        return "#6B3294";
      } else if (typeOfTransport === "CC" || typeOfTransport === "CE") {
        return "#FCB029";
      } else if (typeOfTransport === "NS") {
        return "#F92D38";
      } else if (typeOfTransport === "DT") {
        return "#4465B7";
      } else if (
        typeOfTransport === "SW" ||
        typeOfTransport === "SE" ||
        typeOfTransport === "PW" ||
        typeOfTransport === "PE" ||
        typeOfTransport === "BP"
      ) {
        return "#668372";
      } else {
        if (index) {
          return "#22B5D0";
        } else {
          return "#424242";
        }
      }
    },
    renderPolyline(latlngs) {
      this.$refs.map.insertPolyline(latlngs);
    }
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Title should be less than 20 characters long");
      !this.$v.name.required && errors.push("Please enter your name");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email &&
        errors.push("Please enter a valid email");
      !this.$v.email.required && errors.push("Please enter your email");
      return errors;
    },
    subjectErrors() {
      const errors = [];
      if (!this.$v.subject.$dirty) return errors;
      !this.$v.subject.required &&
        errors.push("Subject title here!");
      return errors;
    },
    msgErrors() {
      const errors = [];
      if (!this.$v.message.$dirty) return errors;
      !this.$v.message.required && errors.push("What's on your mind");
      return errors;
    },
    formValid() {
      return this.name && this.email && this.subject && this.message && this.captchaSuccess;
    },
    getRandomVal() {
      return (Math.random() * 100000) | 0;
    },
    sortedItineraries() {
      if (this.sortBy === "fastest") {
        return this.itineraries
          .slice()
          .sort((x, y) => x.travelTime - y.travelTime);
      } else {
        return this.itineraries.slice().sort((x, y) => x.cost - y.cost);
      }
    },
    image3() {
      if (this.hover3 == true) {
        return "../assets/img/warning3.gif";
      } else {
        return "../assets/img/warning3.jpg";
      }
    }
  }
};
</script>

<style>
.v-expansion-panel__header {
  position: inherit;
}
</style>
