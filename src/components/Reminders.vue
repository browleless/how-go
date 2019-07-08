<template>
  <v-container>
    <v-layout row wrap pb-4>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large v-if="!showForm" @click="promptForm" class="info">Schedule Reminders</v-btn>
        <v-btn large v-if="showForm" @click="promptForm" class="error">Close</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large @click="deleteScheduledReminders" class="error">Delete Scheduled Reminders</v-btn>
      </v-flex>
      <v-layout v-if="showForm" align-center>
        <v-flex xs5 sm4 lg3 xl2 class="text-xs-center">
          <div class="subheading">I want to reach my destinations</div>
        </v-flex>
        <v-flex xs3 sm2 md1>
          <v-text-field
          v-model="minutesEarlierBy"
          label="Minutes"
          maxlength="3"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          ></v-text-field>
        </v-flex>
        <v-flex xs2 sm1 class="text-xs-center">
          <div class="subheading">earlier</div>
        </v-flex>
        <v-flex xs3 sm5 md6 xl8>
          <v-btn 
          :disabled="this.minutesEarlierBy === ''" 
          @click="scheduleReminders"
          class="info"
          >Submit</v-btn>
        </v-flex>
      </v-layout>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-flex class="display-2 text-xs-center" pb-3>
          {{ monthYear }}
        </v-flex>
        <v-alert
          value="true"
          :dismissible="scheduled"
          :type="scheduled ? 'success' : 'warning'"
        >{{ alertText }}</v-alert>
        <v-sheet height="700">
          <!-- now is normally calculated by itself, but to keep the calendar in this date range to view events -->
          <v-calendar
            ref="calendar"
            :now="today"
            :value="today"
            color="primary"
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
                  class="my-event with-time"
                  @click="open(event)"
                >
                {{ event.title }}
                <br>
                {{ event.twelveHrTime + ', ' + event.location }}
                </div>
              </template>
            </template>
          </v-calendar>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from 'firebase'

const d = new Date()
const dateToday = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString()
const currDate = dateToday.slice(0, 10)
const endDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 6).toISOString().slice(0, 10)
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]
const dayValues = [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0]

export default {
  data: () => ({
    today: currDate,
    monthYear: monthNames[d.getMonth()] + ' ' + d.getFullYear(), 
    minutesEarlierBy: '',
    events: [],
    showForm: false,
    wkEvents: []
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
      return map
    },
    shiftDays() {
      return dayValues.slice(dayValues.indexOf(d.getDay()), dayValues.lastIndexOf(d.getDay()))
    },
    scheduled() {
      return this.$store.getters.user.scheduledEvents
    },
    alertText() {
      return this.$store.getters.user.scheduledEvents 
      ? 'Hurray! Reminders are already scheduled, check back next week!' 
      : 'Reminders have yet to been scheduled, do so to get to your destinations punctually!'
    }
  },
  mounted () {
    if (this.$gAuth.isInit) {
      this.updateCalendar()
    } else {
      setTimeout(this.updateCalendar, 1100)
    }
    this.$refs.calendar.scrollToTime('08:00')
  },
  methods: {
    open (event) {
      alert(event.title)
    },
    promptForm() {
      this.showForm = !this.showForm
    },
    async updateCalendar() {
      this.events = []
      const events = await this.$gAuth.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: currDate + 'T00:00:00+08:00',
        timeMax: endDate + 'T23:59:59+08:00',
        orderBy: 'startTime',
        singleEvents: 'true'
      })
      for (var i = 0; i < events.result.items.length; i++) {
        var eventInfo = {}
        const date = new Date(events.result.items[i].start.dateTime)
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes
        eventInfo['twelveHrTime'] = hours + ':' + minutes + ampm
        eventInfo['title'] = events.result.items[i].summary
        eventInfo['date'] = events.result.items[i].start.dateTime.slice(0,10)
        eventInfo['time'] = events.result.items[i].start.dateTime.slice(11,19)
        eventInfo['duration'] = (new Date(events.result.items[i].end.dateTime).getTime() - new Date(events.result.items[i].start.dateTime).getTime()) / 60000
        if (events.result.items[i].location) {
          eventInfo['location'] = events.result.items[i].location.substring(0,  events.result.items[i].location.indexOf(','))
        }
        if (eventInfo.duration === 0) {
          eventInfo.duration = 25
        }
        this.events.push(eventInfo)
      }
    },
    getTime(startTime, offset) {
      var hms = startTime // your input string
      var a = hms.split(":") // split it at the colons
       // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2] - this.minutesEarlierBy * 60 - offset;
      var date = new Date(null)
      date.setSeconds(seconds) // specify value for SECONDS here
      return date.toISOString().substr(11, 8)
    },
    async scheduleReminders() {
      if (!this.$store.getters.user.scheduledEvents) {
          const d = new Date()
          const dateToday = new Date( d.getTime() - d.getTimezoneOffset() * 60000 ).toISOString()
          const currDate = dateToday.slice(0, 10)
          const date2 = new Date( d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 ).toISOString().slice(0, 10)
          const date3 = new Date(d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 2).toISOString().slice(0, 10)
          const date4 = new Date(d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 3).toISOString().slice(0, 10)
          const date5 = new Date(d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 4).toISOString().slice(0, 10)
          const date6 = new Date(d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 5).toISOString().slice(0, 10)
          const endDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 6).toISOString().slice(0, 10)

          var home = {}
          home['name'] = this.$store.getters.user.address.name
          home['latlng'] = this.$store.getters.user.address.latlng

          var day1 = []
          var day2 = []
          var day3 = []
          var day4 = []
          var day5 = []
          var day6 = []
          var day7 = []
          day1.push(home)
          day2.push(home)
          day3.push(home)
          day4.push(home)
          day5.push(home)
          day6.push(home)
          day7.push(home)

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
                  eventInfo["date"] = events.result.items[i].start.dateTime.slice(0,10);
                  eventInfo["startTime"] = events.result.items[i].start.dateTime.slice(11,19);
                    
                  var searchVal = events.result.items[i].location;

                  if (!isNaN(searchVal.slice(-6))) {
                      searchVal = searchVal.slice(-6);
                  } else if (searchVal.indexOf(",") !== -1) {
                      searchVal = searchVal.slice(0, searchVal.indexOf(","));
                  }
                  await this.$http
                      .get("https://developers.onemap.sg/commonapi/search?searchVal=" + searchVal + "&returnGeom=Y&getAddrDetails=N&pageNum=1" )
                      .then(res => {
                      eventInfo["name"] = res.data.results[0].SEARCHVAL
                      eventInfo["latlng"] = res.data.results[0].LATITUDE + "," + res.data.results[0].LONGITUDE
                      })
                      .catch(err => {
                      console.log(err)
                      })

                  if (eventInfo.date === currDate) {
                      day1.push(eventInfo)
                  } else if (eventInfo.date === date2) {
                      day2.push(eventInfo)
                  } else if (eventInfo.date === date3) {
                      day3.push(eventInfo)
                  } else if (eventInfo.date === date4) {
                      day4.push(eventInfo)
                  } else if (eventInfo.date === date5) {
                      day5.push(eventInfo)
                  } else if (eventInfo.date === date6) {
                      day6.push(eventInfo)
                  } else if (eventInfo.date === endDate) {
                      day7.push(eventInfo)
                  }
              }
          }

          this.wkEvents.push(day1)
          this.wkEvents.push(day2)
          this.wkEvents.push(day3)
          this.wkEvents.push(day4)
          this.wkEvents.push(day5)
          this.wkEvents.push(day6)
          this.wkEvents.push(day7)

          console.log("finished calendar")
          let oneMapApiKey = ""
          var bodyFormData = new FormData()
          bodyFormData.append("email", "howgodev@gmail.com")
          bodyFormData.append("password", "vZG8qgeXpM")
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
          })

          for (var idx = 0; idx < this.wkEvents.length; idx++) {
              console.log("day: "+ idx)
              for (var id = 0; id < this.wkEvents[idx].length - 1; id++) {
                  var currEvent  = this.wkEvents[idx][id]
                  var nextEvent = this.wkEvents[idx][id + 1]
                  console.log("reached here")

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
                  .then(async (res) => {
                      // console.log(id)
                      // console.log("event start time " + nextEvent.startTime)
                      // console.log(currEvent.name)
                      // console.log("reminder start time " + event.start.dateTime)
                      // console.log("reminder end time " + event.end.dateTime)

                      const time = nextEvent.date + "T" + this.getTime( nextEvent.startTime, res.data.plan.itineraries[0].duration ) + "+08:00"
                      await this.$gAuth.gapi.client.calendar.events.insert({
                          calendarId: 'primary',
                          summary: "Attention! Leave NOW!",
                          description: currEvent.name,
                          start  : {
                                  dateTime: time,
                                  timeZone: 'Asia/Singapore',
                                  },
                          end    : { 
                                  dateTime: time,
                                  timeZone: 'Asia/Singapore',
                                  },
                          reminders: {
                              useDefault: false,
                              overrides: [
                                  { method: 'popup', minutes: 0 }
                              ]
                          }
                      })
                      console.log("finished insert")
                  })
                  .catch(err => {
                      alert('same location')
                  })
              }
          }
          this.$store.commit('setUserScheduledEvents', true)
          firebase.firestore().collection('users').doc(this.$store.getters.user.id).update(this.$store.getters.user)
          this.updateCalendar()
          this.promptForm()
          this.minutesEarlierBy = ''
          alert('scheduling completed!')
          } else {
              alert('already scheduled before, please delete first')
              return
          }
      },
    async deleteScheduledReminders() {
      const d = new Date()
      const dateToday = new Date( d.getTime() - d.getTimezoneOffset() * 60000 ).toISOString()
      const currDate = dateToday.slice(0, 10)
      const endDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000 + 60000 * 60 * 24 * 6).toISOString().slice(0, 10);
      var eventsToDelete = []
      const events = await this.$gAuth.gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: currDate + "T00:00:00+08:00",
          timeMax: endDate + "T23:59:59+08:00",
          orderBy: "startTime",
          singleEvents: "true"
      })
      for (var i = 0; i < events.result.items.length; i++) {
          if (events.result.items[i].start.dateTime === events.result.items[i].end.dateTime) {
              eventsToDelete.push(events.result.items[i].id)
          }
      }
      for (var j = 0; j < eventsToDelete.length; j++) {
          await this.$gAuth.gapi.client.calendar.events.delete({
              calendarId: 'primary',
              eventId: eventsToDelete[j]
          })
      }
      this.updateCalendar()
      this.wkEvents = []
      this.$store.commit('setUserScheduledEvents', false)
      firebase.firestore().collection('users').doc(this.$store.getters.user.id).update(this.$store.getters.user)
      alert('all scheduled reminders deleted, you can now schedule for the week')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #2196F3;
    color: #ffffff;
    border: 1px solid #2196F3;
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
</style>