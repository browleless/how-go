import Vue from 'vue'
import Vuex from 'vuex'

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
        user: {
            id: 'to be filled'
        }
    },
    mutations: {},
    actions: {},
    getters: {
        loadedTrips(state) {
            return state.loadedTrips.sort((locationA, locationB) => {
                return locationA.time > locationB.time
            })
        }
    }
})