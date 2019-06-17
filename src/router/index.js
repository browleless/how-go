import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Trips from '../components/Trips.vue'
import Reminders from '../components/Reminders.vue'
import Profile from '../components/User/Profile.vue'
import Login from '../components/User/Login.vue'
import authGuard from './auth-guard';

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        { 
            path: '/trips', 
            name: 'Trips', 
            component: Trips,
        },
        { 
            path: '/reminders', 
            name: 'Reminders', 
            component: Reminders,
        },
        { 
            path: '/profile', 
            name: 'Profile', 
            component: Profile 
        },
        { 
            path: '/login', 
            name: 'Login', 
            component: Login 
        }
    ],
    mode: 'history'
})