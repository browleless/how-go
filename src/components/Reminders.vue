<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm5 md4 lg3 order-sm1 order-xs2>
        <v-flex v-if="!this.$vuetify.breakpoint.xs" class="display-2 text-xs-center" pb-2 mb-2>{{ monthYear }}</v-flex>

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

        <v-expansion-panel popout expand>
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

              <v-flex class="pt-3 pl-4 pb-4 pr-4" v-if="showForm">
                <form @submit.prevent="scheduleReminders">
                <v-flex class="text-xs-left">
                  <div class="subheading">I want to reach my destinations</div>
                </v-flex>
                <v-flex>
                  <v-layout row wrap align-end mt-1>
                    <v-flex xs5>
                       <v-text-field
                        class="pa-0 ma-0"
                        v-model="minutesEarlierBy"
                        :error-messages="minutesErrors"
                        label="Minutes"
                        maxlength="3"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        
                    @input="$v.minutesEarlierBy.$touch()"
                    @blur="$v.minutesEarlierBy.$touch()"
                      ></v-text-field>
                    </v-flex>
                    <v-flex align-self-center subheading>
                      earlier
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-layout mt-1 row wrap>
                  <v-flex pa-0 class="text-xs-right">
                    <v-btn
                      :disabled="$v.minutesEarlierBy.$invalid || this.scheduledOnce === true"
                      type="submit"
                      class="info"
                    >Submit</v-btn>
                  </v-flex>
                  <v-flex pa-0 class="text-xs-left">
                    <v-btn v-if="showForm" @click="promptForm" class="error">Close</v-btn>
                  </v-flex>
                </v-layout>
                </form>
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
                    v-model="location"
                    label="Location"
                    class="mb-3"
                    required
                    placeholder="Enter an address, zipcode, or location"
                    :error-messages="locationErrors"
                    @input="$v.location.$touch()"
                    @blur="$v.location.$touch()"
                    api-key="AIzaSyAhSv9zWvisiTXRPRw6K8AE0DCmrRMpQcU"
                  ></place-autocomplete-field>

                  <v-layout row wrap>
                    <v-flex pa-0 class="text-xs-right">
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
                    </v-flex>
                    <v-flex pa-0 class="text-xs-left">
                      <v-dialog persistent v-model="timeDialog" max-width="270">
                        <template v-slot:activator="{ on }">
                          <v-btn color="primary" dark v-on="on">Select Time</v-btn>
                        </template>
                        <v-card>
                          <v-time-picker :allowed-minutes="min => min % 5 === 0" v-model="startTime" type="month" width="270"></v-time-picker>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" flat @click="timeDialog=false">Close</v-btn>
                            <v-btn color="green darken-1" flat @click="onSaveTime">Save</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-flex>
                  </v-layout>
                  
                  <div v-if="selectedDate" class="subheading pt-2 pb-1">
                    Selected Date: {{ new Date(startDate.split('-')[0], startDate.split('-')[1] - 1, startDate.split('-')[2]).toString().slice(0, 15) }}
                  </div>
                  <div v-if="selectedTime" class="subheading pt-1 pb-1">
                    Selected Time: {{ getTwelveHourTime(startTime).toUpperCase() }}
                  </div>
                  <div class="subheading pt-1 pb-2">
                    Duration: 
                    <span v-if="duration < 60">
                      {{ duration }} mins
                    </span>
                    <span v-if="duration >= 60">
                      {{ Math.floor(duration / 60) }} hr {{ duration - (Math.floor(duration / 60) * 60)}} mins
                    </span>
                  </div>

                  <v-slider hide-details class="ma-0" append-icon="add" prepend-icon="remove" v-model="duration" min="15" max="180" step="15" @click:append="increaseDuration" @click:prepend="decreaseDuration"></v-slider>

                  <v-layout row wrap>
                    <v-flex pa-0 class="text-xs-right">
                      <v-btn type="submit" :disabled="!formIsValid">
                        Add Event
                      </v-btn>
                    </v-flex>
                    <v-flex pa-0 class="text-xs-left">
                      <v-btn @click="clear">
                        clear
                      </v-btn>
                    </v-flex>
                  </v-layout>
            
                </form>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex d-flex sm7 md8 lg9 order-sm2 order-xs1>
        <v-flex align-self-center v-if="!loaded || scheduleDelete" class="text-xs-center">
          <v-progress-circular
            v-if="!loaded"
            indeterminate
            color="primary"
            size="70"
            width="6"
            class="ma-4"
          ></v-progress-circular>
          <v-progress-circular
            v-if="scheduleDelete"
            :rotate="-90"
            :size="100"
            :width="15"
            :value="value"
            color="primary"
            class="ma-4"
          >
            {{ value }}%
          </v-progress-circular>
          <div v-if="scheduleDelete" class="subheading">
            {{ loadingText }}
          </div>
        </v-flex>
        
        <v-layout v-if="loaded && !scheduleDelete" :class="this.$vuetify.breakpoint.xs ? 'pa-3': ''">
          <v-flex>
            <v-flex v-if="this.$vuetify.breakpoint.xs" class="display-2 text-xs-center" pb-2 mb-2>{{ monthYear }}</v-flex>
            <v-alert
              value="true"
              :dismissible="scheduled"
              :type="scheduled ? 'success' : 'warning'"
              :color="scheduled ? 'teal lighten-1' : '#ff5252'"
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
                :type="$vuetify.breakpoint.smAndDown ? '4day' : 'week'"
                :weekdays="shiftDays"
                interval-height="60"
              >
                <!-- the events at the bottom (timed) -->
                <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
                  <template v-for="event in eventsMap[date]">
                    <!-- timed events -->
                    <div
                      v-if="event.startTime"
                      :key="event.id"
                      :style="{ top: timeToY(event.startTime) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                      :class="event.id === 1 ? 'line' : event.id === 2 ? 'lineCircle' : 'my-event with-time'"
                      @click="showEventDetails(event)"
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
    <v-dialog v-model="showEvent" max-width="400">
      <v-card style="border-radius: 10px; z-index: 999">
        <v-card-title class="pt-1 pb-1">
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click="editMode = !editMode">edit</v-icon>
          </v-btn>
          <v-btn @click="deleteSelectedEvent" icon>
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon @click="showEvent = false">close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="!editMode" class="pt-0">
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex align-self-center xs1>
                  <v-icon>info</v-icon>
                </v-flex>
                <v-flex xs11 pl-1 font-weight-medium headline>
                  {{ selectedEvent.title }}
                  <div class="subheading">
                    {{ new Date(selectedEvent.date.split('-')[0], selectedEvent.date.split('-')[1] - 1, selectedEvent.date.split('-')[2]).toString().slice(0, 11).replace(' ', ', ') }}
                    <span class="ml-1 mr-1">·</span>
                    {{ getTwelveHourTime(selectedEvent.startTime.slice(0, 6)) }}
                    –
                    {{ getTwelveHourTime(selectedEvent.endTime.slice(0, 6)) }}
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="selectedEvent.description" pt-3 xs12>
              <v-layout row wrap>
                <v-flex align-self-center xs1>
                  <v-icon>list</v-icon>
                </v-flex>
                <v-flex xs11 pl-1 subheading>
                  {{ selectedEvent.description }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="selectedEvent.location" pt-3 xs12>
              <v-layout row wrap>
                <v-flex align-self-center xs1>
                  <v-icon>location_on</v-icon>
                </v-flex>
                <v-flex xs11 pl-1 subheading>
                  {{ selectedEvent.location }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-flex v-if="editMode" pl-4 pr-4 pt-1 pb-2>
          <form @submit.prevent="updateEvent">
            <v-text-field
              v-model="selectedEvent.title"
              :counter="20"
              label="Title"
              required
            ></v-text-field>
            <v-text-field v-model="selectedEvent.description" label="Description"></v-text-field>

            <place-autocomplete-field
              label="Location"
              class="mb-3"
              v-model="selectedEvent.fullLocation"
              required
              placeholder="Enter an address, zipcode, or location"
              api-key="AIzaSyAhSv9zWvisiTXRPRw6K8AE0DCmrRMpQcU"
            ></place-autocomplete-field>

            <v-layout row wrap>
              <v-flex pa-0 class="text-xs-right">
                <v-dialog persistent v-model="dateDialog" max-width="290">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">Change Date</v-btn>
                  </template>
                  <v-card>
                    <v-date-picker
                      v-model="selectedEvent.date"
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
              </v-flex>
              <v-flex pa-0 class="text-xs-left">
                <v-dialog persistent v-model="timeDialog" max-width="270">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">Change Time</v-btn>
                  </template>
                  <v-card>
                    <v-time-picker :allowed-minutes="min => min % 5 === 0" v-model="selectedEvent.startTime" type="month" width="270"></v-time-picker>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat @click="timeDialog=false">Close</v-btn>
                      <v-btn color="green darken-1" flat @click="onSaveTime">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-flex>
            </v-layout>
                  
            <div v-if="eventSelectedDate" class="subheading pt-2 pb-1">
              Amended Date: {{ new Date(selectedEvent.date.split('-')[0], selectedEvent.date.split('-')[1] - 1, selectedEvent.date.split('-')[2]).toString().slice(0, 15) }}
            </div>
            <div v-if="eventSelectedTime" class="subheading pt-1 pb-1">
              Amended Time: {{ getTwelveHourTime(selectedEvent.startTime).toUpperCase() }}
            </div>
            <div class="subheading pt-1 pb-2">
              Duration: 
              <span v-if="selectedEvent.duration < 60">
                {{ selectedEvent.duration }} mins
              </span>
              <span v-if="selectedEvent.duration >= 60">
                {{ Math.floor(selectedEvent.duration / 60) }} hr {{ selectedEvent.duration - (Math.floor(selectedEvent.duration / 60) * 60)}} mins
              </span>
            </div>

            <v-slider hide-details class="ma-0" append-icon="add" prepend-icon="remove" v-model="selectedEvent.duration" min="15" max="180" step="15" @click:append="increaseSelectedDuration" @click:prepend="decreaseSelectedDuration"></v-slider>

            <v-layout row wrap>
              <v-flex pa-0 class="text-xs-center">
                <v-btn type="submit">
                  Update Event
                </v-btn>
              </v-flex>
            </v-layout>
            
          </form>
        </v-flex>
      </v-card>
    </v-dialog>
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
  integer,
  minValue,
  maxValue

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
    location: {required},
    description: {},
    minutesEarlierBy: { required, minValue: minValue(0), maxValue: maxValue(180), integer}
  },
  data: () => ({
    today: currDate,
    value: 0,
    monthYear: monthNames[d.getMonth()] + " " + d.getFullYear(),
    minutesEarlierBy: "",
    events: [],
    showForm: false,
    wkEvents: [],
    scheduledOnce: false,
    dateDialog: false,
    timeDialog: false,
    loadingText: '',
    showEvent: false,
    //newEvent
    title: "",
    location: "",
    description: '',
    duration: 60,
    startTime: "",
    startDate: "",
    selectedTime: false,
    selectedDate: false,
    selectedEvent: {
      title: '',
      description: '',
      duration: '',
      location: '',
      date: '',
      startTime: '',
      endTime: ''
    },
    eventSelectedTime: false,
    eventSelectedDate: false,

    reactive: true,
    loaded: false,
    scheduleDelete: false,
    editMode: false
  }),
  watch: {
    showEvent(val) {
      if (!val) {
        this.editMode = false
      }
    }
  },
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
        this.selectedTime &&
        this.selectedDate
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
      !this.$v.location.required && errors.push("Location is required");
      return errors;
    },
    minutesErrors() {
      const errors = [];
      if (!this.$v.minutesEarlierBy.$dirty) return errors;

      !this.$v.minutesEarlierBy.integer &&
        errors.push("Please enter digits only");
      !this.$v.minutesEarlierBy.minValue &&
        errors.push("Please enter a minimum value of 0");
      !this.$v.minutesEarlierBy.maxValue &&
        errors.push("Max Duration: 180");
      !this.$v.minutesEarlierBy.required && errors.push("Please input a value");
      return errors;
    }
  },
  async mounted() {
    if (this.$gAuth.isInit) {
      await this.updateCalendar();
    } else {
      await this.wait(1500)
      .then(async () => {
        await this.updateCalendar()
      })
    }
    this.$refs.calendar.scrollToTime("08:00");
  },
  methods: {
    async wait(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    },
    showEventDetails(event) {
      this.editMode = false
      this.selectedEvent = JSON.parse(JSON.stringify(event))
      this.eventSelectedDate = false
      this.eventSelectedTime = false
      this.showEvent = true
    },
    promptForm() {
      this.showForm = !this.showForm;
      this.minutesEarlierBy = ''
      this.$v.$reset();
    },
    onSaveDate() {
      this.dateDialog = false;
      this.selectedDate = true
      this.eventSelectedDate = true
    },
    onSaveTime() {
      this.timeDialog = false;
      this.selectedTime = true
      this.eventSelectedTime = true
    },
    clear() {
      this.$v.$reset();
      this.title = "";
      this.description = "";
      this.duration = 60
      this.location = "";
      this.startDate = ''
      this.startTime = "";
      this.selectedDate = false
      this.selectedTime = false
      this.selectedEvent = {
        title: '',
        description: '',
        duration: '',
        location: '',
        date: '',
        startTime: '',
        endTime: ''
      }
    },
    increaseDuration() {
      this.duration = (this.duration + 15) || 180
    },
    decreaseDuration() {
      this.duration = (this.duration - 15) || 0
    },
    increaseSelectedDuration() {
      this.selectedEvent.duration = (this.selectedEvent.duration + 15) || 180
    },
    decreaseSelectedDuration() {
      this.selectedEvent.duration = (this.selectedEvent.duration - 15) || 0
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
          dateTime: this.startDate + "T" + this.getTime((this.startTime + ':00'), (this.duration * 60 * -1)) + "+08:00",
          timeZone: "Asia/Singapore"
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 0 }]
        }
      });
      await this.updateCalendar()
      this.$refs.calendar.scrollToTime(this.startTime)
      this.clear()
      console.log("Event Added");
    },
    async updateEvent() {
      await this.$gAuth.gapi.client.calendar.events.update({
        calendarId: "primary",
        eventId: this.selectedEvent.uid,
        summary: this.selectedEvent.title,
        description: this.selectedEvent.description,
        location: this.selectedEvent.fullLocation,
        start: {
          dateTime: this.selectedEvent.date + "T" + this.selectedEvent.startTime + ":00+08:00",
          timeZone: "Asia/Singapore"
        },
        end: {
          dateTime: this.selectedEvent.date + "T" + this.getTime((this.selectedEvent.startTime + ':00'), (this.selectedEvent.duration * 60 * -1)) + "+08:00",
          timeZone: "Asia/Singapore"
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 0 }]
        }
      });
      this.showEvent = false
      await this.updateCalendar()
      this.$refs.calendar.scrollToTime(this.selectedEvent.startTime)
      this.clear()
      console.log("Event updated");
    },
    async deleteSelectedEvent() {
      await this.$gAuth.gapi.client.calendar.events.delete({
          calendarId: "primary",
          eventId: this.selectedEvent.uid
        });
      this.showEvent = false
      await this.updateCalendar()
      this.$refs.calendar.scrollToTime('08:00')
    },
    async updateCalendar() {
      this.loaded = false;
      const dateTimeNow = new Date().toString();
      this.events = [
        { date: currDate, startTime: dateTimeNow.slice(15, 24), duration: 0, id: 1 },
        { date: currDate, startTime: dateTimeNow.slice(15, 24), duration: 0, id: 2 }
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
        eventInfo["twelveHrTime"] = this.getTwelveHourTime(events.result.items[i].start.dateTime.slice(11, 16));
        eventInfo["uid"] = events.result.items[i].id
        eventInfo["title"] = events.result.items[i].summary;
        eventInfo["fullLocation"] = events.result.items[i].location;
        eventInfo["date"] = events.result.items[i].start.dateTime.slice(0, 10);
        eventInfo["description"] = events.result.items[i].description;
        eventInfo["startTime"] = events.result.items[i].start.dateTime.slice(11, 16);
        eventInfo["endTime"] = events.result.items[i].end.dateTime.slice(11, 19);
        eventInfo["duration"] =
          (new Date(events.result.items[i].end.dateTime).getTime() -
            new Date(events.result.items[i].start.dateTime).getTime()) /
          60000;
        if (events.result.items[i].location && events.result.items[i].location.indexOf(',') !== -1) {
          eventInfo["location"] = events.result.items[i].location.substring(
            0,
            events.result.items[i].location.indexOf(",")
          );
        } else {
          eventInfo['location'] = events.result.items[i].location
        }
        if (eventInfo.duration === 0) {
          eventInfo.duration = 25;
        }
        this.events.push(eventInfo);
      }
      this.loaded = true;
    },
    getTwelveHourTime(hhmm) {
      const timeValues = hhmm.split(':')
      var hours = timeValues[0]
      var minutes = timeValues[1]
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return hours + ":" + minutes + ampm
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
      this.loadingText = 'Scheduling Reminders... Please Wait'
      this.scheduledOnce = true;
      this.scheduleDelete = true
      this.value = 0
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

        const progressVal = 100.0 / events.result.items.length

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

                const capitalize = words =>
                  words
                  .replace(/\w\S*/g, word => word.charAt(0) + word.slice(1).toLowerCase())
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
                  description: 'Leave ' + capitalize(currEvent.name) + ' for ' + capitalize(nextEvent.name),
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
                })
                this.value = Math.round((this.value + progressVal) * 10) / 10
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
        this.promptForm();
        this.minutesEarlierBy = "";
        this.loadingText = 'Complete!'
        this.scheduleDelete = false;
        await this.updateCalendar();
        this.$refs.calendar.scrollToTime("08:00")
      } else {
        alert("already scheduled before, please delete first");
        return;
      }
    },
    async deleteScheduledReminders() {
      this.value = 0
      this.loadingText = 'Deleting Reminders... Please Wait'
      this.scheduleDelete = true;
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
      const progressVal = 100.0 / eventsToDelete.length
      for (var j = 0; j < eventsToDelete.length; j++) {
        await this.$gAuth.gapi.client.calendar.events.delete({
          calendarId: "primary",
          eventId: eventsToDelete[j]
        });
        this.value = Math.round((this.value + progressVal) * 10) / 10
      }
      this.wkEvents = [];
      this.$store.commit("setUserScheduledEvents", false);
      firebase
        .firestore()
        .collection("users")
        .doc(this.$store.getters.user.id)
        .update(this.$store.getters.user);
      this.loadingText = 'Completed!'
      this.scheduleDelete = false
      await this.updateCalendar();
      this.$refs.calendar.scrollToTime("08:00")
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
  z-index: 100;
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
  z-index: 100;
}

>>> .v-dialog {
  overflow-y: visible;
}
</style>