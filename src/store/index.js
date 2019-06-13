import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
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
        user: null,
        gapiCalendarSwitch: null
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setGapiCalendarSwitch(state, payload) {
            state.gapiCalendarSwitch = payload
        }
    },
    actions: {
        async signIn({ commit }, payload) {
            // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
            const user = payload.user
            const gapi = payload.gapi
            commit('setGapiCalendarSwitch', gapi.client.calendar.events)
            const token = user.getAuthResponse().id_token
            console.log('user', user)
            const credential = firebase.auth.GoogleAuthProvider.credential(token)
            firebase.auth().signInWithCredential(credential)
            const d = new Date()
            const startDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0,-13)
            const endDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000) + 60000 * 60 * 24).toISOString().slice(0,-13)
            const events = await gapi.client.calendar.events.list({
                calendarId: 'primary',
                timeMin: startDate + '00:00:00+08:00',
                timeMax: endDate + '23:59:59+08:00',
                orderBy: 'startTime',
                singleEvents: 'true'
            })
            const currUser = {
                id: firebase.auth().currentUser.uid,
                loadedEvents: events.result.items
            }
            commit('setUser', currUser)
        }
    },
    getters: {
        loadedTrips(state) {
            return state.loadedTrips.sort((locationA, locationB) => {
                return locationA.time > locationB.time
            })
        },
        user(state) {
            return state.user
        },
        gapiCalendarSwitch(state) {
            return state.gapiCalendarSwitch
        }
    }
})