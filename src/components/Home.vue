<template>
  <v-container>
    <v-flex v-if="!$store.getters.loaded" text-xs-center>
      <v-progress-circular
        indeterminate
        color="primary"
        size="70"
        width="6"
        class="ma-4"
      ></v-progress-circular>
      <div class="subheading">
        Signing in...
      </div>
    </v-flex>
    <div v-if="places.length <= 1 && $store.getters.loaded">
      <v-layout row wrap>
        <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
          <v-card>
            <v-container>
              <v-layout row wrap>
                <v-flex mb-5 pb-2 xs12 text-xs-center>
                  <img height="150px" width="150px" src="https://png.pngtree.com/svg/20170731/61fedc708b.svg">
                </v-flex>
                <v-flex pb-3 display-1 font-weight-medium xs12 text-xs-center>
                  No Events Found
                </v-flex>
                <v-flex subheading xs12 text-xs-center>
                  There seems to be no events for today, or the events have already passed.
                </v-flex>
                <v-flex subheading xs12 text-xs-center>
                  Without events, HowGo's functionality is limited.
                </v-flex>
                <v-flex pb-5 subheading xs12 text-xs-center>
                  Start by managing your events and login again to sync!
                </v-flex>
                <v-flex xs12 text-xs-center>
                  <v-btn @click="$router.push('/reminders')" class="info">
                    Manage Events
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <div v-if="places.length > 1 && $store.getters.loaded">
      <v-layout row wrap>
        <v-flex xs12 class="pt-4 pb-1">
          <v-carousel>
            <v-carousel-item v-for="place in places.slice(1)" :key="place.index" :src="place.imageUrl">
              <div class="title">{{ place.name }}</div>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
        <v-flex mt-2 xs12 class="text-xs-center subheading" v-if="$store.getters.loaded">
          Your places to get to today.
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  computed: {
    places() {
      return this.$store.getters.todayEvents;
    }
  }
};
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