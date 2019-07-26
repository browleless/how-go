<template>
  <v-container>
    <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
      <v-tabs v-model="selectedTab" fixed-tabs color="blue-grey lighten-1" dark slider-color="yellow">
        <v-tab @click="loadToday">Today</v-tab>
        <v-tab @click="loadTomorrow">Tomorrow</v-tab>
      </v-tabs>
    </v-flex>

    <v-layout row wrap v-for="place in places.slice(1)" :key="place.id" class="mb-3">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card>
          <v-img :src="place.imageUrl" aspect-ratio="2.75" fit></v-img>
          <v-card-title primary-title class="ml-2">
            <v-layout row wrap>
              <v-flex>
                <h3 class="mb-0">{{ place.name }}</h3>
                <div>Time to reach: {{ place.startTime }}</div>
              </v-flex>
              <v-flex text-xs-right>
                <v-btn flat @click.native="updateCurrIdx(place.id - 1)">
                  <v-icon left>arrow_forward</v-icon>View Route
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedTab: null
    }
  },
  mounted() {
    if (this.$store.state.today) {
      this.selectedTab = 0
    } else {
      this.selectedTab = 1
    }
  },
  computed: {
    places() {
      return this.$store.getters.calendarEvents;
    }
  },
  methods: {
    pushed() {
      this.$router.push("/routes");
    },
    loadToday() {
      this.$store.commit("setTodayState");
    },
    loadTomorrow() {
      this.$store.commit("setTmrwState");
    },
    updateCurrIdx(id) {
      this.$store.commit("setCurrIdx", id);
      this.$router.push("/routes");
    }
  }
};
</script>