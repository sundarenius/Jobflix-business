<template>
  <v-container fill-height>
    <v-layout px-3 row wrap justify-center py-5>
      <v-flex mb-3 text-xs-center xs12 md5 :ml-5="$vuetify.breakpoint.mdAndUp">
        <v-card>
          <v-card-title class="white--text primary lighten-1 justify-center">
            <div class="title">Är du jobbsökande?</div>
          </v-card-title>
            <v-card-text>
              <div class="subheading pt-3">
                Vill du också synas i flödet och få erbjudanden av företag?
              </div>
              <div class="body-1 py-3">
                Då ska du skapa konto och logga in på <a href="#"><strong class="primary--text">"Work Managern".</strong></a>
              </div>
            </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn class="primary" block>Till Work Managern <v-icon>arrow_right</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex text-xs-center xs12 md5 :ml-5="$vuetify.breakpoint.mdAndUp">
        <v-card>
          <div v-if="wrongCredentialsMsg !== null">
            <v-alert style="width:100%" type="error" v-model="wrongCredentials">{{ wrongCredentialsMsg }}</v-alert>
          </div>
          <v-card-title>
            <v-container>
              <div style="font-weight:bold" class="myDisplay-1">Logga in</div>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-container>
              <form style="margin-top:-60px;margin-bottom:-20px">
                <v-layout row>
                  <v-flex pr-5 xs1>
                    <v-icon style="margin-top:25px" class="primary--text">mail</v-icon>
                  </v-flex>
                  <v-flex xs11>
                    <v-text-field 
                      name="email" 
                      label="Mail" 
                      id="mail"
                      v-model="email"
                      type="email"
                      outline></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex pr-5 xs1>
                    <v-icon style="margin-top:25px" class="black--text">vpn_key</v-icon>
                  </v-flex>
                  <v-flex xs11>
                    <v-text-field 
                      name="password" 
                      label="Lösenord" 
                      id="password"
                      v-model="password"
                      type="password"
                      outline></v-text-field>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn :loading="loading" :disabled="!loggaInDisabled" type="submit" @click="onLogin" block class="success">Logga in</v-btn>
          </v-card-actions>
          <v-card-text>
            <v-divider style="margin-top:-15px"></v-divider>
            <div class="body-2 primary--text pt-3" style="cursor:pointer">Har du glömt ditt lösenord?</div>
            <v-btn @click="signUpDialog = true" class="primary mt-3" round><v-icon class="mr-2" medium>work</v-icon> Skapa ett nytt konto</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>

    </v-layout>


    <!-- SIGNUP DIALOG -->
    <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" width="500" v-model="signUpDialog">
      <div style="margin-bottom:-5px" v-if="wrongSignUp">
        <v-alert style="width:100%" type="error" v-model="wrongSignUp">{{ wrongSignUpMsg }}</v-alert>
      </div>
      <div class="title white py-4 text-xs-center">Skapa företagskonto</div>
      <div @click="signUpDialog = false" style="position:absolute;top:15px;right:15px"><v-icon style="font-weight:bold" large>close</v-icon></div>
      <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Företagets uppgifter</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">Individuellt konto</v-stepper-step>

          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">

              <v-card>
                <v-container class="pt-3 pb-4">

                  <form>
                    <v-layout row wrap>
                      <div class="body-2 pb-2">
                        Om ditt företag redan är registerat så skickas istället en 
                        inbjudan om att få "joina med egen inloggning".
                      </div>
                      <v-flex xs1>
                        <v-icon class="black--text" style="margin-top:25px">work</v-icon>
                      </v-flex>
                      <v-flex xs11>
                        <v-text-field 
                          name="businessName" 
                          label="Företagsnamn" 
                          id="businessName"
                          v-model="businessName"
                          type="text"
                          required></v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout row>
                      <v-flex xs1>
                        <v-icon style="margin-top:25px" class="black--text">business</v-icon>
                      </v-flex>
                      <v-flex xs11>
                        <v-text-field 
                          name="orgNr" 
                          label="Organisationsnummer (VAT ID)" 
                          id="orgNr"
                          v-model="orgNr"
                          type="text"
                          required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs1>
                        <v-icon style="margin-top:25px" class="black--text">group</v-icon>
                      </v-flex>
                      <v-flex xs11>
                        <v-select
                          color="primary"
                          label="Antal anställda"
                          :items="employers"
                          v-model="employersNr"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </form>

              </v-container>
              </v-card>

              <v-btn
                color="primary"
                @click="e1 = 2"
                block
                :disabled="!firstStepSignUpBtn"
              >
                Nästa
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card>
                <v-container class="pt-3 pb-4">
                  <form @submit.prevent="onSignUp">
                    <v-layout row>
                        <v-flex xs1>
                          <v-icon style="margin-top:25px" class="black--text">person</v-icon>
                        </v-flex>
                          <v-flex xs11>
                            <v-text-field 
                              name="fullname" 
                              label="För och efternamn" 
                              id="fullname"
                              v-model="fullname"
                              type="text"
                              required></v-text-field>
                          </v-flex>
                      </v-layout>

                    <v-layout row>
                        <v-flex xs1>
                          <v-icon style="margin-top:25px" class="black--text">mail</v-icon>
                        </v-flex>
                          <v-flex xs11>
                            <v-text-field 
                              name="mail" 
                              label="Din e-mail" 
                              id="mailSignUp"
                              v-model="mailSignUp"
                              type="mail"
                              required></v-text-field>
                          </v-flex>
                      </v-layout>

                  <v-layout row>
                        <v-flex xs1>
                          <v-icon style="margin-top:25px" class="black--text">vpn_key</v-icon>
                        </v-flex>
                          <v-flex xs11>
                            <v-text-field 
                              name="password" 
                              label="Lösenord" 
                              id="passwordSignUp"
                              counter="6"
                              v-model="passwordSignUp"
                              type="password"
                              :rules="[passIsLongerThanSix]"></v-text-field>
                          </v-flex>
                      </v-layout>

                      <v-layout row>
                        <v-flex xs1>
                          <v-icon style="margin-top:25px" class="black--text">repeat</v-icon>
                        </v-flex>
                          <v-flex xs11>
                            <v-text-field 
                              name="confirmPassword" 
                              label="Upprepa lösenord" 
                              id="confirmPassword"
                              v-model="confirmPassword"
                              type="password"
                              :rules="[comparePasswords]"></v-text-field>
                          </v-flex>
                      </v-layout>
                    </form>
                </v-container>
              </v-card>

              <v-btn
                color="success"
                @click="onSignUp"
                block
                :disabled="!registerNewAccBtn"
                :loading="loading"
              >
                Registrera
              </v-btn>

              <v-btn @click="e1 = 1" block flat> <v-icon>arrow_back</v-icon>  Tillbaka</v-btn>
            </v-stepper-content>

          </v-stepper-items>
        </v-stepper>
      </v-dialog>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      passwordSignUp: '',
      confirmPassword: '',
      mailSignUp: '',
      orgNr: '',
      businessName: '',
      fullname: '',
      signUpDialog: false,
      employersNr: '',
      e1: 0
    }
  },
  methods: {
    onSignUp () {
      this.$store.dispatch('signUserUp', {email: this.mailSignUp, password: this.passwordSignUp, businessName: this.businessName, orgNr: this.orgNr, employersNr: this.employersNr, userName: this.fullname})
    },
    onLogin () {
      // Vuex
      this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
    },
    test () {
      console.log('test')
    }
  },
  computed: {
    loading () {
      return this.$store.state.loadingUser
    },
    employers () {
      return this.$store.state.employeeSize
    },
    wrongCredentialsMsg () {
      if (this.$store.state.authError !== null) {
        if (this.$store.state.authError.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
          return 'Finns ingen användare med denna mail registrerad'
        } else if (this.$store.state.authError.message === 'The password is invalid or the user does not have a password.') {
          return 'Fel lösenord. Försök igen'
        } else {
          return this.$store.state.authError.message
        }
      } else {
        return 'Inget felmeddelande'
      }
    },
    wrongCredentials () {
      return this.wrongCredentialsMsg !== 'Inget felmeddelande' && this.loggaInDisabled
    },
    wrongSignUpMsg () {
      if (this.$store.state.authError !== null) {
        return this.$store.state.authError.message
      } else {
        return 'Inget felmeddelande'
      }
    },
    wrongSignUp () {
      return this.wrongSignUpMsg !== 'Inget felmeddelande' && this.registerNewAccBtn
    },
    comparePasswords () {
      return this.passwordSignUp !== this.confirmPassword ? 'Lösenorden matchar inte!' : 'Bra, lösenorden matchar!'
    },
    passIsLongerThanSix () {
      return this.passwordSignUp.length >= 6 ? '' : 'Lösenordet måste vara minst 6 tecken långt'
    },
    user () {
      return this.$store.getters.user
    },
    loggaInDisabled () {
      return this.email !== '' && this.password.length >= 6
    },
    firstStepSignUpBtn () {
      return this.businessName !== '' && this.orgNr !== '' && this.employersNr !== ''
    },
    registerNewAccBtn () {
      return this.fullname !== '' && this.mailSignUp !== '' && this.passwordSignUp.length >= 6 && (this.passwordSignUp === this.confirmPassword)
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  }
}
</script>
