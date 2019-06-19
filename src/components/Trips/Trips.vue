<template>
  <v-container>
    <v-layout row wrap v-for="place in places.slice(1)" :key="place.id" class="mb-3" >
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-img
                  :src="place.imageUrl"
                  height="100%"
                  fit
                ></v-img>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h2 class="white--text">{{ place.name }}</h2>
                    <div>Time to reach: {{ place.startTime }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat @click ="$emit('pullInstructions', place.id)" to="/routes">
                    <v-icon left>arrow_forward</v-icon>
                    View Route
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    places() {
      return this.$store.state.todayEvents
    }
  },
  methods: {
    pushed() {
      this.$router.push("/routes")
    }
  }
}
</script>