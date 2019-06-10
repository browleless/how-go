<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
                  height="130px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h2 class="white--text">My Route</h2>
                    <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, illo.</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat>
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