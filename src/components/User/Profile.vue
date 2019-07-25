<template>
  <v-container>
    <v-layout row wrap class="mb-3">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-alert
          v-model="emptyAddress"
          type="warning"
        >Please set up your address for the first time.</v-alert>
        <v-alert v-model="alert" dismissible :type="type">{{ alertText }}</v-alert>
        <v-card>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex text-xs-center xs12 sm4 lg3>
                <v-avatar class="ma-3" size="90">
                  <img :src="photo" />
                </v-avatar>
                <br />
                <v-btn @click="handleChangeAccount">Change account</v-btn>
              </v-flex>
              <v-flex align-self-center xs12 sm8 lg9>
                <v-card-title primary-title>
                  <v-flex>
                    <h2>{{ name }}</h2>
                    <v-flex>Email: {{ email }}</v-flex>
                    <v-flex>
                      Address: {{ this.$store.getters.user.address.full }}
                      <v-btn class="info" v-if="!update" @click="update = !update">Update</v-btn>
                      <v-btn class="error" v-if="update" @click="update = !update">Close</v-btn>
                    </v-flex>
                    <v-layout>
                      <v-flex xs6 sm5 md4 lg3 xl2 v-if="this.update">
                        <v-text-field
                          v-model="location"
                          :error-messages="locationErrors"
                          label="Postal Code"
                          maxlength="6"
                          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                          @input="$v.location.$touch()"
                          @blur="$v.location.$touch()"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6 v-if="this.update">
                        <v-btn
                          class="info"
                          @click="updatePostalCode"
                          :disabled="this.location.length !== 6 ? true : false"
                        >Submit</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-card-title>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from "firebase";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  integer
} from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  validations: {
    location: {
      required,
      maxLength: maxLength(6),
      minLength: minLength(6),
      integer
    }
  },
  data() {
    return {
      name: this.$store.getters.user.name,
      email: this.$store.getters.user.email,
      photo: this.$store.getters.user.photo,
      update: false,
      alert: false,
      type: null,
      alertText: "",
      location: ""
    };
  },
  computed: {
    emptyAddress() {
      return !this.$store.getters.user.address.name && !this.alert;
    },
    locationErrors() {
      const errors = [];
      if (!this.$v.location.$dirty) return errors;

      !this.$v.location.integer &&
        errors.push("Postal Code should only contain numbers");
      !this.$v.location.minLength &&
        errors.push("Postal Code should contain 6 characters");
      !this.$v.location.maxLength &&
        errors.push("Postal Code should contain 6 characters");
      !this.$v.location.required && errors.push("Location is required");
      return errors;
    },
  },
  methods: {
    handleChangeAccount() {
      this.$gAuth
        .signOut()
        .then(() => {
          // On success do something
          this.$store.dispatch("resetStoreState");
          this.$router.push("/");
          this.$gAuth
            .signIn()
            .then(payload => {
              this.$store.dispatch("signIn", payload);
              this.$store.state.isLoggedIn = this.$gAuth.isAuthorized;
              this.$router.push("/home");
            })
            .catch(error => {
              // On fail do something
              console.log(error);
            });
        })
        .catch(error => {
          // On fail do something
          console.log(error);
        });
    },
    async updatePostalCode() {
      await this.$http
        .get(
          "https://developers.onemap.sg/commonapi/search?searchVal=" +
            this.location +
            "&returnGeom=Y&getAddrDetails=Y&pageNum=1"
        )
        .then(res => {
          if (res.data.results.length !== 0) {
            const name = res.data.results[0].SEARCHVAL;
            const latlng =
              res.data.results[0].LATITUDE +
              "," +
              res.data.results[0].LONGITUDE;
            const address = res.data.results[0].ADDRESS;
            const d = new Date();
            const dateToday = new Date(
              d.getTime() - d.getTimezoneOffset() * 60000
            ).toISOString();
            const date = dateToday.slice(0, 10);
            const startTime = dateToday.slice(11, 19);
            const completedAddress = {
              name: name,
              latlng: latlng,
              date: date,
              startTime: startTime,
              full: address
            };
            firebase
              .firestore()
              .collection("users")
              .doc(this.$store.getters.user.id)
              .update({ address: completedAddress });
            this.$store.commit("setAddress", completedAddress);
            if (
              this.$store.getters.todayEvents[0].full ||
              this.$store.getters.todayEvents[0].full === ""
            ) {
              this.$store.commit("shiftTodayHome");
              this.$store.commit("setTodayHome", completedAddress);
            }
            this.$store.commit("shiftTmrwHome");
            this.$store.commit("setTmrwHome", completedAddress);
            this.type = "success";
            this.alertText = "Successfully updated Address!";
          } else {
            this.type = "error";
            this.alertText = "Postal Code not found, please try again!";
          }
          this.alert = true;
        })
        .catch(err => {
          console.log(err);
        });
      this.location = "";
      this.$v.$reset();
    }
  }
};
</script>