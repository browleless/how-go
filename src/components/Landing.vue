<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large @click="goToTrips" class="info">Explore Trips</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large @click="goToReminders" class="info">Check Reminders</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 class="pt-4 pb-1">
        <v-carousel>
          <v-carousel-item v-for="place in places" :key="place.id" :src="place.imageUrl">
            <div class="title">{{ place.title }}</div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Your places to get to today.</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Landing",
  data() {
    return {
      places: [
        {
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/7e/OCBC_Skyway%2C_Gardens_By_The_Bay%2C_Singapore_-_20140809.jpg",
          id: "1",
          title: "Gardens By The Bay"
        },
        {
          imageUrl:
            "http://static.asiawebdirect.com/m/phuket/portals/www-singapore-com/homepage/top10/top10-attractions-sentosa/pagePropertiesImage/sentosa-island-singapore.jpg.jpg",
          id: "2",
          title: "Sentosa"
        },
        {
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Presenting..._the_real_ION_%288200217734%29.jpg/1280px-Presenting..._the_real_ION_%288200217734%29.jpg",
          id: "3",
          title: "Orchard Road"
        }
      ]
    }
  },
  methods: {
    goToTrips() {
      if (!this.$store.state.isLoggedIn) {
        this.handleClickSignInT()
      } else {
        this.$router.push("/trips")
      }
    },
    goToReminders() {
      if (!this.$store.state.isLoggedIn) {
        this.handleClickSignInR()
      } else {
        this.$router.push("/reminders")
      }
    },
    handleClickSignInT() {
      this.$gAuth
        .signIn()
        .then(payload => {
          this.$store.dispatch("signIn", payload)
          this.$store.state.isLoggedIn = this.$gAuth.isAuthorized
          this.$router.push("/trips")
        })

        .catch(error => {
          // On fail do something
          console.log(error)
        })
    },
    handleClickSignInR() {
      this.$gAuth
        .signIn()
        .then(payload => {
          this.$store.dispatch("signIn", payload)
          this.$store.state.isLoggedIn = this.$gAuth.isAuthorized
          this.$router.push("/reminders")
        })

        .catch(error => {
          // On fail do something
          console.log(error)
        })
    }
  }
}
</script>
<style scoped>
.title {
  position: absolute;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 2em;
  padding: 20px;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
}

p {
  font-size: 1.125em;
}
</style>