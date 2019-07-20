<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm3 order-sm1 order-xs2>
        <v-flex v-if="!this.$vuetify.breakpoint.xs" class="display-2 text-xs-center" pb-2>{{ monthYear }}</v-flex>

        <v-flex mb-3 v-if="!this.$vuetify.breakpoint.xs">
          <v-sheet height="200">
            <v-calendar
              :now="today"
              :value="today"
              color="primary"
              hide-header
              :show-month-on-first="false"
            ></v-calendar>
          </v-sheet>
        </v-flex>

        <v-expansion-panel focusable popout expand>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>Reminders</div>
            </template>
            <v-layout>
              <v-flex xs6 v-if="!showForm">
                <v-btn flat block @click="promptForm">
                  Schedule
                  <v-icon light small>check_box</v-icon>
                </v-btn>
              </v-flex>

              <v-flex class="pa-4" v-if="showForm">
                <v-flex class="text-xs-left">
                  <div class="subheading">I want to reach my destinations</div>
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="minutesEarlierBy"
                    label="Minutes"
                    maxlength="3"
                    onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  ></v-text-field>
                </v-flex>
                <v-flex>
                  <div class="subheading">earlier</div>
                </v-flex>
                <v-flex>
                  <v-btn
                    :disabled="this.minutesEarlierBy === '' || this.scheduledOnce === true"
                    @click="scheduleReminders"
                    class="info"
                  >Submit</v-btn>
                  <v-btn v-if="showForm" @click="promptForm" class="error">Close</v-btn>
                </v-flex>
              </v-flex>

              <v-flex xs6 v-if="!showForm">
                <v-btn flat block @click="deleteScheduledReminders">
                  Delete
                  <v-icon light small>delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <template v-slot:header>
              <div>Events</div>
            </template>
            <v-layout>
              <v-flex pa-4>
                <form @submit.prevent="createNewEvent">
                  <v-text-field
                    v-model="title"
                    :counter="20"
                    label="Title"
                    :error-messages="titleErrors"
                    required
                    @input="$v.title.$touch()"
                    @blur="$v.title.$touch()"
                  ></v-text-field>
                  <v-text-field v-model="description" label="Description"></v-text-field>

                  <place-autocomplete-field
                    label="Location"
                    class="mb-3"
                    v-model="location"
                    required
                    placeholder="Enter an address, zipcode, or location"
                    @input="$v.location.$touch()"
                    @blur="$v.location.$touch()"
                    api-key="AIzaSyAhSv9zWvisiTXRPRw6K8AE0DCmrRMpQcU"
                  ></place-autocomplete-field>
                  <!-- <v-text-field
                    v-model="location"
                    :error-messages="locationErrors"
                    label="Location"
                    required
                    @input="$v.location.$touch()"
                    @blur="$v.location.$touch()"
                  ></v-text-field>-->

                  <v-dialog persistent v-model="dateDialog" max-width="290">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on">Select Date</v-btn>
                    </template>
                    <v-card>
                      <v-date-picker
                        v-model="startDate"
                        color="primary"
                        :reactive="reactive"
                        :min="today"
                      ></v-date-picker>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click="dateDialog=false">Close</v-btn>
                        <v-btn color="green darken-1" flat @click="onSaveDate">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog persistent v-model="timeDialog" max-width="270">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on">Select Time</v-btn>
                    </template>
                    <v-card>
                      <v-time-picker v-model="startTime" type="month" width="270"></v-time-picker>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click="timeDialog=false">Close</v-btn>
                        <v-btn color="green darken-1" flat @click="onSaveTime">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-slider v-model="EventDuration" thumb-color="red" thumb-label label="Duration"></v-slider>

                  <v-btn type="submit" :disabled="!formIsValid">Add Event</v-btn>
                  <v-btn @click="clear">clear</v-btn>
                </form>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex d-flex sm9 order-sm2 order-xs1>
        
        <v-progress-circular
          v-if="!loaded"
          indeterminate
          color="primary"
          size="70"
          width="6"
          class="ma-4"
        ></v-progress-circular>
        <v-layout v-if="loaded" :class="this.$vuetify.breakpoint.xs ? 'pa-3': ''">
          <v-flex>
            <v-flex v-if="this.$vuetify.breakpoint.xs" class="display-2 text-xs-center" pb-2>{{ monthYear }}</v-flex>
            <v-alert
              value="true"
              :dismissible="scheduled"
              :type="scheduled ? 'success' : 'warning'"
            >
              {{ alertText }}
              <countdown
                class="subheading font-weight-medium"
                v-if="this.$store.getters.user.scheduledEvents"
                :time="timeTillNextScheduling"
              >
                <template
                  slot-scope="props"
                >{{ props.days }} days, {{ props.hours }} hours, {{ props.minutes }} minutes and {{ props.seconds }} seconds</template>
              </countdown>
            </v-alert>
            <v-sheet :height="this.$vuetify.breakpoint.xsOnly ? '500' :'700'">
              <!-- now is normally calculated by itself, but to keep the calendar in this date range to view events -->
              <v-calendar
                ref="calendar"
                :now="today"
                :value="today"
                color="#6981e0"
                :type="$vuetify.breakpoint.xs ? '4day' : 'week'"
                :weekdays="shiftDays"
                interval-height="60"
              >
                <!-- the events at the bottom (timed) -->
                <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
                  <template v-for="event in eventsMap[date]">
                    <!-- timed events -->
                    <div
                      v-if="event.time"
                      :key="event.id"
                      :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                      :class="event.id === 1 ? 'line' : event.id === 2 ? 'lineCircle' : 'my-event with-time'"
                      @click="open(event)"
                    >
                      {{ event.title }}
                      <div
                        v-if="event.twelveHrTime"
                      >{{ event.twelveHrTime + ', ' + event.location }}</div>
                    </div>
                  </template>
                </template>
              </v-calendar>
            </v-sheet>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from "firebase";
import PlaceAutocompleteField from "./PlaceAutocompleteField.vue";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  integer
} from "vuelidate/lib/validators";

const d = new Date();
const dateToday = new Date(
  d.getTime() - d.getTimezoneOffset() * 60000
).toISOString();
const currDate = dateToday.slice(0, 10);
const endDate = new Date(
  d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 6
)
  .toISOString()
  .slice(0, 10);
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const dayValues = [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0];

export default {
  mixins: [validationMixin],
  components: {
    PlaceAutocompleteField
  },
  validations: {
    title: { required, maxLength: maxLength(20) },
    location: {
      required,
      maxLength: maxLength(6),
      minLength: minLength(6),
      integer
    },
    description: {}
  },
  data: () => ({
    today: currDate,
    monthYear: monthNames[d.getMonth()] + " " + d.getFullYear(),
    minutesEarlierBy: "",
    events: [],
    showForm: false,
    wkEvents: [],
    scheduledOnce: false,
    dateDialog: false,
    timeDialog: false,
    //newEvent
    title: "",
    location: "",
    startTime: "",
    startDate: "",
    endTime: "",
    endDate: "",

    reactive: true,
    loaded: false
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap() {
      const map = {};
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    },
    shiftDays() {
      return dayValues.slice(
        dayValues.indexOf(d.getDay()),
        dayValues.lastIndexOf(d.getDay())
      );
    },
    scheduled() {
      return this.$store.getters.user.scheduledEvents;
    },
    alertText() {
      return this.$store.getters.user.scheduledEvents
        ? "Hurray! Reminders are already scheduled, check back in "
        : "Reminders have yet to been scheduled, do so to get to your destinations punctually!";
    },
    timeTillNextScheduling() {
      return this.$store.getters.user.nextSchedulingTime - Date.now();
    },
    formIsValid() {
      return (
        this.title !== "" &&
        this.location !== "" &&
        this.startTime !== "" &&
        this.startDate !== ""
      );
    },
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.maxLength &&
        errors.push("Title should be less than 20 characters long");
      !this.$v.title.required && errors.push("Title is required");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.required && errors.push("Description is required");
      return errors;
    },
    locationErrors() {
      const errors = [];
      if (!this.$v.location.$dirty) return errors;

      !this.$v.location.integer &&
        errors.push("Postal Code should only contain numbers");
      !this.$v.location.minLength &&
        errors.push("Postal Code should contain 6 characters");
      !this.$v.location.maxLength &&
        errors.push("Postal Code should contain 6 characters");
      !this.$v.location.required && errors.push("Location is required");
      return errors;
    }
  },
  mounted() {
    if (this.$gAuth.isInit) {
      this.updateCalendar();
    } else {
      setTimeout(this.updateCalendar, 1100);
    }
    this.$refs.calendar.scrollToTime("08:00");
  },
  methods: {
    open(event) {
      alert(event.title);
    },
    promptForm() {
      this.showForm = !this.showForm;
    },
    onSaveDate() {
      this.dateDialog = false;
      console.log(this.startDate);
    },
    onSaveTime() {
      this.timeDialog = false;
      console.log(this.startTime);
    },
    clear() {
      console.log(this.today);
      this.$v.$reset();
      this.title = "";
      this.description = "";
      this.location = "";
      this.startTime = "";
      this.endTime = "";
    },
    async createNewEvent() {
      await this.$gAuth.gapi.client.calendar.events.insert({
        calendarId: "primary",
        summary: this.title,
        description: this.description,
        location: this.location,
        start: {
          dateTime: this.startDate + "T" + this.startTime + ":00+08:00",
          timeZone: "Asia/Singapore"
        },
        end: {
          dateTime: this.startDate + "T" + this.startTime + ":00+08:00",
          timeZone: "Asia/Singapore"
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 0 }]
        }
      });
        this.updateCalendar()
      console.log("Event Added");
    },
    async updateCalendar() {
      this.loaded = false;
      const dateTimeNow = new Date().toString();
      this.events = [
        { date: currDate, time: dateTimeNow.slice(15, 24), duration: 0, id: 1 },
        { date: currDate, time: dateTimeNow.slice(15, 24), duration: 0, id: 2 }
      ];
      const events = await this.$gAuth.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: currDate + "T00:00:00+08:00",
        timeMax: endDate + "T23:59:59+08:00",
        orderBy: "startTime",
        singleEvents: "true"
      });
      for (var i = 0; i < events.result.items.length; i++) {
        var eventInfo = {};
        const date = new Date(events.result.items[i].start.dateTime);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        eventInfo["twelveHrTime"] = hours + ":" + minutes + ampm;
        eventInfo["title"] = events.result.items[i].summary;
        eventInfo["date"] = events.result.items[i].start.dateTime.slice(0, 10);
        eventInfo["time"] = events.result.items[i].start.dateTime.slice(11, 19);
        eventInfo["duration"] =
          (new Date(events.result.items[i].end.dateTime).getTime() -
            new Date(events.result.items[i].start.dateTime).getTime()) /
          60000;
        if (events.result.items[i].location) {
          eventInfo["location"] = events.result.items[i].location.substring(
            0,
            events.result.items[i].location.indexOf(",")
          );
        }
        if (eventInfo.duration === 0) {
          eventInfo.duration = 25;
        }
        this.events.push(eventInfo);
      }
      this.loaded = true;
    },
    getTime(startTime, offset) {
      var hms = startTime; // your input string
      var a = hms.split(":"); // split it at the colons
      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var seconds =
        +a[0] * 60 * 60 +
        +a[1] * 60 +
        +a[2] -
        this.minutesEarlierBy * 60 -
        offset;
      var date = new Date(null);
      date.setSeconds(seconds); // specify value for SECONDS here
      return date.toISOString().substr(11, 8);
    },
    async scheduleReminders() {
      this.scheduledOnce = true;
      this.loaded = false
      if (!this.$store.getters.user.scheduledEvents) {
        const d = new Date();
        const dateToday = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000
        ).toISOString();
        const currDate = dateToday.slice(0, 10);
        const date2 = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24
        )
          .toISOString()
          .slice(0, 10);
        const date3 = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 2
        )
          .toISOString()
          .slice(0, 10);
        const date4 = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 3
        )
          .toISOString()
          .slice(0, 10);
        const date5 = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 4
        )
          .toISOString()
          .slice(0, 10);
        const date6 = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 5
        )
          .toISOString()
          .slice(0, 10);
        const endDate = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 6
        )
          .toISOString()
          .slice(0, 10);

        var home = {};
        home["name"] = this.$store.getters.user.address.name;
        home["latlng"] = this.$store.getters.user.address.latlng;

        var day1 = [];
        var day2 = [];
        var day3 = [];
        var day4 = [];
        var day5 = [];
        var day6 = [];
        var day7 = [];
        day1.push(home);
        day2.push(home);
        day3.push(home);
        day4.push(home);
        day5.push(home);
        day6.push(home);
        day7.push(home);

        const events = await this.$gAuth.gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: currDate + "T00:00:00+08:00",
          timeMax: endDate + "T23:59:59+08:00",
          orderBy: "startTime",
          singleEvents: "true"
        });

        for (var i = 0; i < events.result.items.length; i++) {
          var eventInfo = {};
          if (events.result.items[i].location) {
            eventInfo["date"] = events.result.items[i].start.dateTime.slice(
              0,
              10
            );
            eventInfo["startTime"] = events.result.items[
              i
            ].start.dateTime.slice(11, 19);

            var searchVal = events.result.items[i].location;

            if (!isNaN(searchVal.slice(-6))) {
              searchVal = searchVal.slice(-6);
            } else if (searchVal.indexOf(",") !== -1) {
              searchVal = searchVal.slice(0, searchVal.indexOf(","));
            }
            await this.$http
              .get(
                "https://developers.onemap.sg/commonapi/search?searchVal=" +
                  searchVal +
                  "&returnGeom=Y&getAddrDetails=N&pageNum=1"
              )
              .then(res => {
                eventInfo["name"] = res.data.results[0].SEARCHVAL;
                eventInfo["latlng"] =
                  res.data.results[0].LATITUDE +
                  "," +
                  res.data.results[0].LONGITUDE;
              })
              .catch(err => {
                console.log(err);
              });

            if (eventInfo.date === currDate) {
              day1.push(eventInfo);
            } else if (eventInfo.date === date2) {
              day2.push(eventInfo);
            } else if (eventInfo.date === date3) {
              day3.push(eventInfo);
            } else if (eventInfo.date === date4) {
              day4.push(eventInfo);
            } else if (eventInfo.date === date5) {
              day5.push(eventInfo);
            } else if (eventInfo.date === date6) {
              day6.push(eventInfo);
            } else if (eventInfo.date === endDate) {
              day7.push(eventInfo);
            }
          }
        }

        this.wkEvents.push(day1);
        this.wkEvents.push(day2);
        this.wkEvents.push(day3);
        this.wkEvents.push(day4);
        this.wkEvents.push(day5);
        this.wkEvents.push(day6);
        this.wkEvents.push(day7);

        console.log("finished calendar");
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

        for (var idx = 0; idx < this.wkEvents.length; idx++) {
          console.log("day: " + idx);
          for (var id = 0; id < this.wkEvents[idx].length - 1; id++) {
            var currEvent = this.wkEvents[idx][id];
            var nextEvent = this.wkEvents[idx][id + 1];
            console.log("reached here");

            await this.$http
              .get(
                "https://developers.onemap.sg/privateapi/routingsvc/route?start=" +
                  currEvent.latlng +
                  "&end=" +
                  nextEvent.latlng +
                  "&routeType=pt&token=" +
                  oneMapApiKey +
                  "&date=" +
                  currEvent.date +
                  "&time=" +
                  currEvent.startTime +
                  "&mode=TRANSIT&numItineraries=1"
              )
              .then(async res => {
                // console.log(id)
                // console.log("event start time " + nextEvent.startTime)
                // console.log(currEvent.name)
                // console.log("reminder start time " + event.start.dateTime)
                // console.log("reminder end time " + event.end.dateTime)

                const time =
                  nextEvent.date +
                  "T" +
                  this.getTime(
                    nextEvent.startTime,
                    res.data.plan.itineraries[0].duration
                  ) +
                  "+08:00";
                await this.$gAuth.gapi.client.calendar.events.insert({
                  calendarId: "primary",
                  summary: "Attention! Leave NOW!",
                  description: currEvent.name,
                  start: {
                    dateTime: time,
                    timeZone: "Asia/Singapore"
                  },
                  end: {
                    dateTime: time,
                    timeZone: "Asia/Singapore"
                  },
                  reminders: {
                    useDefault: false,
                    overrides: [{ method: "popup", minutes: 0 }]
                  }
                });
                console.log("finished insert");
              })
              .catch(err => {
                alert("same location");
              });
          }
        }
        this.$store.commit("setUserScheduledEvents", true);
        this.$store.commit("setUserNextSchedulingTime");
        firebase
          .firestore()
          .collection("users")
          .doc(this.$store.getters.user.id)
          .update(this.$store.getters.user);
        this.updateCalendar();
        this.promptForm();
        this.minutesEarlierBy = "";
        this.loaded = true;
        alert("scheduling completed!");
      } else {
        alert("already scheduled before, please delete first");
        return;
      }
    },
    async deleteScheduledReminders() {
      this.loaded = false;
      this.scheduledOnce = false;
      const d = new Date();
      const dateToday = new Date(
        d.getTime() - d.getTimezoneOffset() * 60000
      ).toISOString();
      const currDate = dateToday.slice(0, 10);
      const endDate = new Date(
        d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 6
      )
        .toISOString()
        .slice(0, 10);
      var eventsToDelete = [];
      const events = await this.$gAuth.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: currDate + "T00:00:00+08:00",
        timeMax: endDate + "T23:59:59+08:00",
        orderBy: "startTime",
        singleEvents: "true"
      });
      for (var i = 0; i < events.result.items.length; i++) {
        if (
          events.result.items[i].start.dateTime ===
          events.result.items[i].end.dateTime
        ) {
          eventsToDelete.push(events.result.items[i].id);
        }
      }
      for (var j = 0; j < eventsToDelete.length; j++) {
        await this.$gAuth.gapi.client.calendar.events.delete({
          calendarId: "primary",
          eventId: eventsToDelete[j]
        });
      }
      this.updateCalendar();
      this.wkEvents = [];
      this.$store.commit("setUserScheduledEvents", false);
      firebase
        .firestore()
        .collection("users")
        .doc(this.$store.getters.user.id)
        .update(this.$store.getters.user);
      this.loaded = true
      alert(
        "all scheduled reminders deleted, you can now schedule for the week"
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #6981e0;
  color: #ffffff;
  border: 1px solid #6981e0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;

  &.with-time {
    position: absolute;
    right: 4px;
    margin-right: 0px;
  }
}

.line {
  position: absolute;
  z-index: 504;
  border-top: #ea4335 solid 2px;
  left: 0;
  right: -1px;
  pointer-events: none;
}

.lineCircle {
  background: #ea4335;
  border-radius: 50%;
  position: absolute;
  height: 12px !important;
  margin-left: -6.5px;
  margin-top: -5px;
  width: 12px;
  z-index: 504;
}
</style>