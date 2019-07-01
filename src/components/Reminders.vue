<template>
  <div>
    <p>The Reminders Page</p>
    <v-btn @click="scheduleEvents">Schedule Reminders</v-btn>
    <v-btn @click="deleteScheduledReminders">Delete Scheduled Reminders</v-btn>
    {{wkEvents}}
  </div>
</template>

<script>
import * as firebase from 'firebase'

export default {
    data() {
        return {
        wkEvents: []
        };
    },
    computed: {
        gapi() {
            return this.$store.getters.gapiCalendarSwitch
        },
    },
    methods: {
    getTime(startTime, offset) {
        var hms = startTime; // your input string
        var a = hms.split(":"); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2] - offset;
        var date = new Date(null);
        date.setSeconds(seconds); // specify value for SECONDS here
        return date.toISOString().substr(11, 8);
        
    },

    async scheduleEvents() {
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

            const events = await this.$store.getters.gapiCalendarSwitch.list({
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
                        await this.$store.getters.gapiCalendarSwitch.insert({
                            calendarId: 'primary',
                            summary: "Attention! Leave NOW!",
                            description: currEvent.name,
                            start  : {
                                    dateTime: time,
                                    timeZone: 'Asia/Hong_Kong',
                                    },
                            end    : { 
                                    dateTime: time,
                                    timeZone: 'Asia/Hong_Kong',
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
            this.$store.commit('setUserScheduledEvents')
            firebase.firestore().collection('users').doc(this.$store.getters.user.id).update(this.$store.getters.user)
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
        const events = await this.$store.getters.gapiCalendarSwitch.list({
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
            await this.$store.getters.gapiCalendarSwitch.delete({
                calendarId: 'primary',
                eventId: eventsToDelete[j]
            })
        }
        alert('all scheduled reminders deleted, you can now schedule for the week')
        this.wkEvents = []
        this.$store.commit('setUserScheduledEvents')
        firebase.firestore().collection('users').doc(this.$store.getters.user.id).update(this.$store.getters.user)
    }
    }
}
</script>