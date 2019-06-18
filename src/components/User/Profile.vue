<template>
  <v-container>
    <v-layout row wrap class="mb-3">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card>
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-img :src="photo" height="130px" contain></v-img>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h2>{{ name }}</h2>
                    <div>Email: {{ email }}</div>
                    <div>
                      Home Address:
                      <input type="text" placeholder="Postal Code..">
                    </div>
                    <v-btn @click="handleChangeAccount">Change account</v-btn>
                  </div>
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
export default {
  data() {
    return {
      name: this.$store.getters.user.name,
      email: this.$store.getters.user.email,
      photo: this.$store.getters.user.photo
    }
  },
  methods: {
    handleChangeAccount() {
      this.$gAuth
        .signOut()
        .then(() => {
          // On success do something
          this.$store.dispatch('resetStoreState')
          this.$router.push('/')
          this.$gAuth
            .signIn()
            .then(payload => {
              this.$store.dispatch("signIn", payload)
              this.$store.state.isLoggedIn = this.$gAuth.isAuthorized
            })
            .catch(error => {
              // On fail do something
              console.log(error)
            })
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
input {
  border: 1px solid black;
}
</style>

