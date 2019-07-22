import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as firebase from 'firebase'
import createPersistedState from 'vuex-persistedstate'
import setimmediate from 'setimmediate'

Vue.use(Vuex)

const getDefaultState = () => {
    return {
        todayEvents: [],
        tmrwEvents: [],
        user: null,
        calendarEvents: [],
        isLoggedIn: false,
        today: true,
        tomorrow: false,
        currIdx: null,
        loaded: false
    }
}

const state = getDefaultState()

const actions = {
    resetStoreState({ commit }) {
        commit('resetState')
    },
    async signIn({ commit }, payload) {
        // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
        commit('setLoading', false)
        const d = new Date()
        const dateToday = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString()
        const currDate = dateToday.slice(0, 10)
        const currTime = dateToday.slice(11, 19)
        const user = payload.user
        const gapi = payload.gapi
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
                    scheduledEvents: false,
                    nextSchedulingTime: 0,
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
                            currUser.scheduledEvents = querySnapshot.data().scheduledEvents
                            currUser.nextSchedulingTime = querySnapshot.data().nextSchedulingTime
                            currUser.address.date = currDate
                            currUser.address.startTime = currTime
                            if (currUser.nextSchedulingTime < Date.now()) {
                                currUser.scheduledEvents = false
                            }
                            userData.update(currUser)
                        })
                }
                console.log(currUser)
                commit('setTodayHome', currUser.address)
                commit('setTmrwHome', currUser.address)
                commit('setUser', currUser)
            })
            .then(() => {
                if (flag) {
                    commit('shiftTodayHome')
                }
                for (var i = 0; i < this.state.todayEvents.length; i++) {
                    this.state.todayEvents[i]['id'] = i
                }
                for (var j = 0; j < this.state.tmrwEvents.length; j++) {
                    this.state.tmrwEvents[j]['id'] = j
                }
                commit('setLoading', true)
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
        const GoogleImages = require('google-images')
        const client = new GoogleImages('010327027899987409234:euxsclkbdw4', 'AIzaSyBPxJ-Fh41K9DiIjVPXz6-n4-c9gXSjlGc')
        var flag = false
        for (var i = 0; i < events.result.items.length; i++) {
            var eventInfo = {}
            if (events.result.items[i].location) {
                eventInfo['date'] = events.result.items[i].start.dateTime.slice(0, 10)
                eventInfo['startTime'] = events.result.items[i].start.dateTime.slice(11, 19)
                var searchVal = events.result.items[i].location
                if (!isNaN(searchVal.slice(-6))) {
                    searchVal = searchVal.slice(-6)
                } else if (searchVal.indexOf(',') !== -1) {
                    searchVal = searchVal.slice(0, searchVal.indexOf(','))
                }
                await axios.get('https://developers.onemap.sg/commonapi/search?searchVal=' + searchVal + '&returnGeom=Y&getAddrDetails=N&pageNum=1')
                    .then(res => {
                        eventInfo['name'] = res.data.results[0].SEARCHVAL
                        eventInfo['latlng'] = res.data.results[0].LATITUDE + ',' + res.data.results[0].LONGITUDE
                    })
                    .catch(err => {
                        console.log(err)
                    })
                if (eventInfo.date === currDate) {
                    if (eventInfo.startTime < currTime) {
                        if (!flag) {
                            flag = true
                        } else {
                            commit('shiftTodayHome')
                        }
                        commit('setTodayEvents', eventInfo)
                        continue
                    }
                    // await client.search(events.result.items[i].location, { size: 'huge' })
                    //     .then(images => {
                    //         eventInfo['imageUrl'] = images[0].url
                    //         console.log('images success', images)
                    //     })
                    //     .catch(err => {
                    //         console.log(err)
                    //     })
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
    setCalendarEvents(state, payload) {
        state.calendarEvents.push(payload)
    },
    setAddress(state, payload) {
        state.user.address = payload
    },
    setTodayEvents(state, payload) {
        state.todayEvents.push(payload)
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
    setTodayState(state) {
        state.today = true,
        state.tomorrow = false
    },
    setTmrwState(state) {
        state.today = false,
        state.tomorrow = true
    },
    setCurrIdx(state, payload) {
        state.currIdx = payload
    },
    setUserScheduledEvents(state, payload) {
        state.user.scheduledEvents = payload
    },
    setUserNextSchedulingTime(state) {
        const today = new Date()
        state.user.nextSchedulingTime = new Date(today.setDate(today.getDate() + 6)).setHours(23, 59, 59)
    },
    setLoading(state, payload) {
        state.loaded = payload
    }
}

const getters = {
    user(state) {
        return state.user
    },
    todayEvents(state) {
        return state.todayEvents
    },
    tmrwEvents(state) {
        return state.tmrwEvents
    },
    calendarEvents(state) { 
        if (state.today) {
            return state.todayEvents
        } else {
            return state.tmrwEvents
        }
    },
    currIdx(state) {
        return state.currIdx
    },
    loaded(state) {
        return state.loaded
    }
}

export const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state,
    actions,
    mutations,
    getters
})