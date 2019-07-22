import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Landing from '../components/Landing.vue'
import Trips from '../components/Trips/Trips.vue'
import Routes from '../components/Trips/Routes.vue'
import Reminders from '../components/Reminders.vue'
import Profile from '../components/User/Profile.vue'
import AuthGuard from './auth-guard'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Landing',
            component: Landing
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            beforeEnter: AuthGuard
        },
        { 
            path: '/trips', 
            name: 'Trips', 
            component: Trips,
            beforeEnter: AuthGuard
        },
        { 
            path: '/routes', 
            name: 'Routes', 
            component: Routes,
            beforeEnter: AuthGuard
        },
        { 
            path: '/reminders', 
            name: 'Reminders', 
            component: Reminders,
            beforeEnter: AuthGuard
        },
        { 
            path: '/profile', 
            name: 'Profile', 
            component: Profile,
            beforeEnter: AuthGuard
        }
    ],
    mode: 'history'
})