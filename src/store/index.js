import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as firebase from 'firebase'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const getDefaultState = () => {
    return {
        loadedTrips: [
            {
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/OCBC_Skyway%2C_Gardens_By_The_Bay%2C_Singapore_-_20140809.jpg',
                id: '1',
                title: 'Gardens By The Bay',
                time: '0000'
            },
            {
                imageUrl: 'http://static.asiawebdirect.com/m/phuket/portals/www-singapore-com/homepage/top10/top10-attractions-sentosa/pagePropertiesImage/sentosa-island-singapore.jpg.jpg',
                id: '2',
                title: 'Sentosa',
                time: '0000'
            },
            {
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Presenting..._the_real_ION_%288200217734%29.jpg/1280px-Presenting..._the_real_ION_%288200217734%29.jpg',
                id: '3',
                title: 'Orchard Road',
                time: '0000'
            }
        ],
        todayEvents: [],
        tmrwEvents: [],
        user: null,
        gapiCalendarSwitch: null,
        calendarEvents: [],
        isLoggedIn: false
    }
}

const state = getDefaultState()

const actions = {
    resetStoreState({ commit }) {
        commit('resetState')
    },
    async signIn({ commit }, payload) {
        // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
        const d = new Date()
        const dateToday = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString()
        const currDate = dateToday.slice(0, 10)
        const currTime = dateToday.slice(11, 19)
        const user = payload.user
        const gapi = payload.gapi
        commit('setGapiCalendarSwitch', gapi.client.calendar.events)
        const token = user.getAuthResponse().id_token
        console.log('user', user)
        const credential = firebase.auth.GoogleAuthProvider.credential(token)
        let currUser = {}
        firebase.auth().signInWithCredential(credential)
            .then(async res => {
                currUser = {
                    id: '',
                    name: firebase.auth().currentUser.displayName,
                    email: firebase.auth().currentUser.email,
                    photo: firebase.auth().currentUser.photoURL,
                    address: {
                        full: ''
                    }
                }
                const userData = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
                if (res.additionalUserInfo.isNewUser) {
                    currUser.id = firebase.auth().currentUser.uid
                    userData.set(currUser)
                } else {
                    await userData.get()
                        .then(querySnapshot => {
                            currUser.id = querySnapshot.data().id
                            currUser.address = querySnapshot.data().address
                            currUser.address.date = currDate
                            currUser.address.startTime = currTime
                            userData.update(currUser)
                        })
                }
                console.log(currUser)
                commit('setTodayHome', currUser.address)
                commit('setTmrwHome', currUser.address)
                commit('setUser', currUser)
            })
            .then(() => {
                let sliceIdx = 0
                for (var u = 1; u < this.state.todayEvents.length; u++) {
                    if (this.state.todayEvents[u].startTime < currTime) {
                        sliceIdx = u
                    }
                    let loadedEvent = {}
                    loadedEvent['id'] = u;
                    loadedEvent['title'] = this.state.todayEvents[u].name
                    loadedEvent['time'] = this.state.todayEvents[u].startTime
                    loadedEvent['imageURL'] = 'https://upload.wikimedia.org/wikipedia/commons/7/7e/OCBC_Skyway%2C_Gardens_By_The_Bay%2C_Singapore_-_20140809.jpg'
                    commit('addLoadedTrips', loadedEvent)
                }
                for (var o = 1; o < this.state.tmrwEvents.length; o++) {
                    let loadedEvent = {}
                    loadedEvent['id'] = o;
                    loadedEvent['title'] = this.state.tmrwEvents[o].name
                    loadedEvent['time'] = this.state.tmrwEvents[o].startTime
                    loadedEvent['imageURL'] = 'https://upload.wikimedia.org/wikipedia/commons/7/7e/OCBC_Skyway%2C_Gardens_By_The_Bay%2C_Singapore_-_20140809.jpg'
                    commit('addLoadedTrips', loadedEvent)
                }
                commit('sliceTodayEvents', sliceIdx)
            })
        const endDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000) + 60000 * 60 * 24).toISOString().slice(0, 10)
        const events = await gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: currDate + 'T00:00:00+08:00',
            timeMax: endDate + 'T23:59:59+08:00',
            orderBy: 'startTime',
            singleEvents: 'true'
        })
        console.log(events)
        for (var i = 0; i < events.result.items.length; i++) {
            var eventInfo = {}
            if (events.result.items[i].location) {
                const postalCode = events.result.items[i].location.slice(-6)
                await axios.get('https://developers.onemap.sg/commonapi/search?searchVal=' + postalCode + '&returnGeom=Y&getAddrDetails=N&pageNum=1')
                    .then(res => {
                        eventInfo['name'] = res.data.results[0].SEARCHVAL
                        eventInfo['latlng'] = res.data.results[0].LATITUDE + ',' + res.data.results[0].LONGITUDE
                    })
                    .catch(err => {
                        console.log(err)
                    })
                eventInfo['date'] = events.result.items[i].start.dateTime.slice(0, 10)
                eventInfo['startTime'] = events.result.items[i].start.dateTime.slice(11, 19)

                if (eventInfo.date === currDate) {
                    commit('setTodayEvents', eventInfo)
                } else {
                    commit('setTmrwEvents', eventInfo)
                }
            }
        }
    }
}

const mutations = {
    resetState(state) {
        Object.assign(state, getDefaultState())
    },
    setUser(state, payload) {
        state.user = payload
    },
    setGapiCalendarSwitch(state, payload) {
        state.gapiCalendarSwitch = payload
    },
    setCalendarEvents(state, payload) {
        state.calendarEvents.push(payload)
    },
    setAddress(state, payload) {
        state.user.address = payload
    },
    setTodayEvents(state, payload) {
        state.todayEvents.push(payload)
    },
    sliceTodayEvents(state, payload) {
        state.todayEvents = state.todayEvents.slice(payload)
    },
    setTmrwEvents(state, payload) {
        state.tmrwEvents.push(payload)
    },
    setTodayHome(state, payload) {
        state.todayEvents.unshift(payload)
    },
    shiftTodayHome(state) {
        state.todayEvents.shift()
    },
    setTmrwHome(state, payload) {
        state.tmrwEvents.unshift(payload)
    },
    shiftTmrwHome(state) {
        state.tmrwEvents.shift()
    },
    addLoadedTrips(state, payload) {
        state.loadedTrips.push(payload)
    }
}

const getters = {
    loadedTrips(state) {
        return state.loadedTrips.sort((locationA, locationB) => {
            return locationA.time > locationB.time
        })
    },
    user(state) {
        return state.user
    },
    todayEvents(state) {
        return state.todayEvents
    },
    tmrwEvents(state) {
        return state.tmrwEvents
    },
    gapiCalendarSwitch(state) {
        return state.gapiCalendarSwitch
    }
}

export const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state,
    actions,
    mutations,
    getters
})