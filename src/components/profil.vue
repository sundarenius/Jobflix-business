<template>
  <div>
    <div class="grey lighten-3 fill-height py-5" v-if="$store.state.corpObject === ''" style="min-height:80vh">
      <!--  ANVÄND v-if="!loadTheSite under production -->
      <v-layout class="py-5" justify-center>
            <v-flex my-5 xs8>
              <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
              <span class="jobflix-title">
                <v-icon class="black--text play-icon-title">play_arrow</v-icon>
                <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              </span>
            </h1>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-flex>
        </v-layout>
    </div>
  <main v-if="$store.state.corpObject !== ''" class="grey lighten-3 fill-height" style="min-height:80vh">
    <v-container>
      <v-btn v-if="0" @click="test" style="position:absolute;z-index:5">TEST fr. profil</v-btn>
      <v-layout :mt-4="$vuetify.breakpoint.mdAndUp" row wrap>
        <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" mb-2 text-xs-center md3>
          <v-card>
            <v-layout row wrap>
              <v-flex xs12>
                <img style="max-width:80%!important;max-height:120px!important" :src="$store.state.corpObject.businessLogo.i" alt="Företagslogga">
                <div class="px-3">
                  <v-btn @click="updateLogoModal = true" small block outline round>Ändra företagslogga <v-icon class="ml-2" small>edit</v-icon></v-btn>
                </div>
              </v-flex>
              <v-flex @click="updateContact = true" class="pointer" style="position:relative" @mouseover="editUserInfo = true" @mouseout="editUserInfo = false" px-3 py-2 text-xs-left xs12>
                <div v-show="editUserInfo" style="position:absolute;right:0px;top:0px">
                  <v-tooltip bottom>
                    <v-btn flat fab small slot="activator">
                      <v-icon small class="grey--text text--darken-4">build</v-icon>
                    </v-btn>
                    <span>Redigera</span>
                  </v-tooltip>
                </div>
                <div>
                  <div class="title pb-2">Dina kontaktuppgifter</div>
                  <div class="caption grey lighten-3 mb-2">
                    <v-icon small class="primary--text text--darken-2">info</v-icon>
                    Denna data kommer bara vara synlig till de du skickar förfrågningar till. 
                    Viktigt att denna information stämmer.
                  </div>
                  <div class="body-1">Namn</div>
                  <div class="body-2 pb-2">{{ userInfo.fullName }}</div>
                  <div class="body-1">E-mail</div>
                  <div class="body-2 pb-2">{{ userInfo.email }}</div>
                  <div class="body-1">Telefonnummer:</div>
                  <div class="body-2 pb-2">{{ userInfo.phoneNr }}</div>
                  <div class="body-1">Besöksadress:</div>
                  <div class="body-2">{{ userInfo.adress }}</div>
                </div>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex mb-2 md6>
          <v-card>
            <v-layout row wrap>
              <v-flex md12>
                <img width="100%" height="140px" src="@/assets/businessBG.jpg" alt="Business background">
              </v-flex>
              <v-flex class="pointer" @click="corpDescription = true" style="position:relative" @mouseover="editCorpDescription = true" @mouseout="editCorpDescription = false" my-2 py-2 px-3 md8>
                <div v-show="editCorpDescription" style="position:absolute;right:20px;top:0px">
                    <v-tooltip bottom>
                      <v-btn flat fab small slot="activator">
                        <v-icon small class="grey--text text--darken-4">build</v-icon>
                      </v-btn>
                      <span>Redigera</span>
                    </v-tooltip>
                  </div>
                <div class="title pb-2">{{ $store.state.corpObject.businessName }}</div>
                <div v-bind:key="x" v-for="x in corpDescriptionArr" class="body-1 pr-3">
                  <p>{{ x }}</p>
                </div>
              </v-flex>
              <v-flex xs12 md4>
                <v-layout wrap>
                  <v-flex @click="corpInformationsDialog = true" xs12>
                    <v-card style="box-shadow: 0 0 0 0" @mouseover="editCorpInfo = true" @mouseout="editCorpInfo = false" :class="{'grey lighten-3 mt-3 mb-2 mr-2 text-xs-left px-2 py-2 pointer' : $vuetify.breakpoint.mdAndUp, 'grey lighten-3 text-xs-left px-2 py-2 pointer' : $vuetify.breakpoint.smAndDown}">
                        <div v-show="editCorpInfo" style="position:absolute;right:-5px;top:-5px">
                          <v-tooltip bottom>
                            <v-btn flat fab small slot="activator">
                              <v-icon small class="grey--text text--darken-4">build</v-icon>
                            </v-btn>
                            <span>Redigera</span>
                          </v-tooltip>
                        </div>
                        <div class="body-1">Namn</div>
                        <div class="body-2">{{ $store.state.corpObject.businessName }}</div>
                        <div class="body-1 mt-2">VatId</div>
                        <div class="body-2">{{ $store.state.corpObject.orgNr }}</div>
                        <div class="body-1 mt-2">Land</div>
                        <div class="body-2">{{ $store.state.corpObject.country }}</div>
                        <div class="body-1 mt-2">Anställda</div>
                        <div class="body-2">{{ $store.state.corpObject.employeeSize }}</div>
                        <div class="body-1 mt-2">Webbsida</div>
                        <div class="body-2"><a target="_blank" class="teal--text" :href="fullCorpInfo.website">{{ fullCorpInfo.website }}</a></div>
                      </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex text-xs-center md3>
          <v-card :class="{'text-xs-center px-3 py-3' : true, 'ml-2' : $vuetify.breakpoint.mdAndUp}">
            <div class="title pb-2">Företagets prisplan:</div>

            <div v-if="priceplan === 'trial'" style="font-weight:bold" class="subheading grey--text text--darken-3 pb-3">Platinum <v-icon class="black--text" small>check_circle</v-icon>
              <div class="body-2 pt-2">0 SEK</div>
            </div>
            <div v-if="priceplan === 1" style="font-weight:bold" class="subheading black--text pb-3">Basic <v-icon class="black--text" small>check_circle</v-icon>
              <div class="body-2 pt-2">{{ $store.state.corpObject.pricePlan.price }} SEK</div>
            </div>
              <div v-if="priceplan === 2" style="font-weight:bold" class="subheading yellow--text text--darken-3 pb-3">Gold <v-icon class="orange--text" small>check_circle</v-icon>
                <div class="body-2 pt-2">{{ $store.state.corpObject.pricePlan.price }} SEK</div>
              </div>
              <div v-if="priceplan === 3" style="font-weight:bold" class="subheading grey--text text--darken-3 pb-3">Platinum <v-icon class="grey--text text--darken-3" small>check_circle</v-icon>
                <div class="body-2 pt-2">{{ $store.state.corpObject.pricePlan.price }} SEK</div>
              </div>

            <v-btn round to="/prisplaner" flat outline block small style="margin:0" class="body-2 teal"><a class="teal--text">Till prisplaner</a></v-btn>
            <hr class="mt-4 grey lighten-4">
            <div class="body-1 text-xs-left primary--text text--darken-2 mt-1 grey lighten-3">
              <v-icon class="primary--text text--darken-2" small>info</v-icon> 
              Datan på detta kort är ej publik.
            </div>
            <div class="pt-3 text-xs-left body-2">Statistik för hela företagskontot:</div>
            <div class="pt-2 text-xs-left body-1">Kommande möten:</div>
            <div class="text-xs-left body-2">{{ totalBookedMeetings }}</div>
            <div class="pt-2 text-xs-left body-1">Väntande förfrågningar:</div>
            <div class="text-xs-left body-2">{{ pendingRequests }}</div>
            <div class="pt-2 text-xs-left body-1">Aktiva annonser:</div>
            <div class="text-xs-left body-2">{{ totalActiveAds }}</div>
            <div class="pt-2 text-xs-left body-1">Antal användare:</div>
            <div class="text-xs-left body-2">{{ totalUsers }}</div>
            <div>
            <v-btn @click="showAllUsers" outline round small class="secondary">Se alla användare <v-icon class="ml-1">supervisor_account</v-icon></v-btn>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>


    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" v-model="corpInformationsDialog" max-width="500">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="title white--text">Uppdatera företagsuppgifter</div>
          <div class="closeModal">
            <v-icon @click="corpInformationsDialog = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Föregets namn"
            v-model="fullCorpInfo.businessName"
          ></v-text-field>
          <v-text-field
            label="VatId"
            v-model="fullCorpInfo.orgNr"
          ></v-text-field>
          <v-select
            label="Land"
            :items="countries"
            v-model="fullCorpInfo.country"
          ></v-select>
          <v-select
            label="Anställda"
            :items="employeeSize"
            v-model="fullCorpInfo.employeeSize"
          ></v-select>
          <v-text-field
            label="Hemsida"
            v-model="fullCorpInfo.website"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="updating" flat round @click="updateCorpDescription('updateBusinessUserDB'), corpInformationsDialog = false" block class="primary">Spara ändringar <v-icon class="ml-2">save</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  Dialog för att uppdatera kontaktuppgitfer  -->
    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="600" v-model="updateContact">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="title white--text">
            Uppdatera kontaktuppgifter
          </div>
          <div class="closeModal">
            <v-icon @click="updateContact = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
        <v-layout>
          <v-flex px-4 py-4 xs12>
            <div>
              <v-text-field
                disabled
                label="Namn"
                v-model="userInfo.fullName"
              ></v-text-field>
            </div>
            <div>
              <v-text-field
                disabled
                label="E-mail"
                v-model="userInfo.email"
              ></v-text-field>
            </div>
            <div>
              <v-text-field
                label="Telefonnummer"
                v-model="userInfo.phoneNr"
              ></v-text-field>
            </div>
            <div>
              <v-text-field
                label="Besöksadress (Möte)"
                v-model="userInfo.adress"
              ></v-text-field>
            </div>
            <div class="body-1 grey lighten-3">
              <v-icon small class="primary--text">info</v-icon>
              Du måste spara ändringarna för att spara permanent.
              Kontakta support@jobflix.se om du behöver byta e-post eller namn.
            </div>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-btn :loading="updating" flat round @click="updateProfileInfo(), updateContact = false" block class="primary">Spara ändringar <v-icon class="ml-2">save</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog för att uppdatera företags beskrivningen  -->
    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" v-model="corpDescription" max-width="700">
      <v-card>
        <v-card-title class="justify-center primary lighten-2">
          <div class="title white--text">Företags beskrivning</div>
          <div class="closeModal">
            <v-icon @click="corpDescription = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-textarea
            placeholder="Företags beskrivning"
            v-model="fullCorpInfo.corpDescription"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="updating" flat round @click="updateCorpDescription(), corpDescription = false" block class="primary">Spara ändringar <v-icon class="ml-2">save</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog för att ändringar har sparats (Notifikation)  -->
    <v-dialog max-width="400" v-model="saveChanges">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="title white--text">
            Dina ändringar har sparats <v-icon class="white--text">check_circle</v-icon>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn round @click="saveChanges = false" outline block>OK!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  MODAL SOM VISAR ALLA ANVÄNDARE I KONTOT  -->
    <v-dialog max-width="500" v-model="showAllUsersModal">
      <v-card>
        <v-card-title class="justify-center primary lighten-2">
          <div class="title white--text">Alla användare</div>
          <div class="closeModal">
            <v-icon @click="showAllUsersModal = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="py-2" v-bind:key="user.userId" v-for="(user, index) in allUsers">
           <div class="body-2">
             {{index + 1}}: {{ user.fullName }}
           </div>
           <div>
             <span class="body-1">Mail: <span class="body-2">{{ user.email }}</span></span>
           </div>
           <v-divider></v-divider>
          </div>
          <div class="body-1 pt-2">
            Finns det obehöriga användare? Anmäl då till support@jobflix.se.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showAllUsersModal = false" block flat>Stäng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <!--   UPPDATERA FÖRETAGSLOGGA   -->
    <v-dialog v-model="updateLogoModal" max-width="500">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="title white--text">
            Ändra företagslogga
          </div>
          <div class="closeModal">
            <v-icon @click="updateLogoModal = false" large class="white--text">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text class="text-xs-center">
          <img style="max-width:80%!important;max-height:120px!important" :src="$store.state.corpObject.businessLogo.i" alt="Företagslogga">
          <v-btn round @click="onPickFile" outline class="secondary" block>Välj fil <v-icon class="ml-2">computer</v-icon></v-btn>
          <input 
            v-show="0" 
            type="file" 
            ref="fileInput" 
            accept="image/*"
            @change="onFilePicked"
            >
            <div v-show="valueDeterminate > 0">
              <div v-show="valueDeterminate < 100" class="subheading pt-3" style="font-weight:bold">Laddar upp: {{ valueDeterminate }}%</div>
              <div v-show="valueDeterminate === 100" class="success--text subheading pt-3" style="font-weight:bold">
                  <span v-show="fileUploadError === ''">Klart! Din fil har laddats upp <v-icon small class="success--text">thumb_up</v-icon></span> 
                  <span v-show="fileUploadError !== ''" class="red--text body-2">{{ fileUploadError }}</span>
              </div>
              <v-progress-linear v-model="valueDeterminate"></v-progress-linear>
            </div>
        </v-card-text>
        <v-card-actions>
          <v-btn round :loading="updating" @click="updateCorpDescription" :disabled="!uploadFinishedReal" block class="success" flat>SPARA <v-icon class="ml-1">cloud_upload</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="updating" max-width="400">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">
            Uppdaterar...
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn block flat :loading="updating"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </main>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

export default {
  data () {
    return {
      msg: 'hej',
      editCorpInfo: false,
      editUserInfo: false,
      editCorpDescription: false,
      updateContact: false,
      saveChanges: false,
      corpDescription: false,
      corpInformationsDialog: false,
      showAllUsersModal: false,
      updateLogoModal: false,
      valueDeterminate: 0,
      fileUploadError: '',
      uploadFinished: false,
      updating: false,
      corpDataWatches: {
        businessLogoWatch: 0,
        corpDescriptionWatch: 0,
        businessNameWatch: 0,
        orgNrWatch: 0,
        countryWatch: 0,
        employeeSizeWatch: 0,
        websiteWatch: 0
      }
    }
  },
  methods: {
    test () {
      console.log(this.corpDataWatches)
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      var global = this
      // Get file
      var file = event.target.files[0]
      // Create storage red
      var theUrl = new Date().getTime().toString()
      var storageRef = firebase.storage().ref('official-businessImages/' + theUrl + file.name)
      // Upload file
      var task = storageRef.put(file)
      // Update progress bar
      task.on('state_changed',
        function progress (snapshot) {
          var percentage = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100
          global.valueDeterminate = Math.floor(percentage)
        },
        function error (err) {
          console.log(err)
          global.fileUploadError = 'Något gick fel och filen kunde inte laddas upp.'
        },
        function complete () {
          var myStorage = firebase.storage()
          var giveMe
          var getImageUrl = function () {
            return myStorage.ref('official-businessImages/' + theUrl + file.name).getDownloadURL()
          }
          giveMe = getImageUrl()
          global.$store.state.corpObject.businessLogo = giveMe
          global.uploadFinished = true
        }
      )
    },
    showAllUsers () {
      this.showAllUsersModal = true
    },
    updateProfileInfo () {
      this.updating = true
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId)
        .update({user: this.userInfo})
      .then(res => {
        this.updating = false
        this.saveChanges = true
      })
    },
    updateCorpDescription (par) {
      this.updating = true
      let arrayPromise = []
      if (this.corpDataWatches.businessLogoWatch > 0) {
        let updateBusinessLogo = firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
        .update({businessLogo: this.fullCorpInfo.businessLogo})
        arrayPromise.push(updateBusinessLogo)
      }
      if (this.corpDataWatches.corpDescriptionWatch > 0) {
        let updateCorpDescription = firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
        .update({corpDescription: this.fullCorpInfo.corpDescription})
        arrayPromise.push(updateCorpDescription)
      }
      if (this.corpDataWatches.businessNameWatch > 0) {
        let updateBusinessName = firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
        .update({businessName: this.fullCorpInfo.businessName})
        arrayPromise.push(updateBusinessName)
      }
      if (this.corpDataWatches.orgNrWatch > 0) {
        let updateOrgNr = firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
        .update({orgNr: this.fullCorpInfo.orgNr})
        arrayPromise.push(updateOrgNr)
      }
      if (this.corpDataWatches.countryWatch > 0) {
        let country = firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
        .update({country: this.fullCorpInfo.country})
        arrayPromise.push(country)
      }
      if (this.corpDataWatches.employeeSizeWatch > 0) {
        let employeeSize = firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
        .update({employeeSize: this.fullCorpInfo.employeeSize})
        arrayPromise.push(employeeSize)
      }
      if (this.corpDataWatches.websiteWatch > 0) {
        let website = firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
        .update({website: this.fullCorpInfo.website})
        arrayPromise.push(website)
      }
      Promise.all(arrayPromise)
      .then(res => {
        this.updating = false
        this.updateLogoModal = false
        this.saveChanges = true
      })
      for (var i in this.fullCorpInfo.users) {
        if (this.fullCorpInfo.users[i].user.userId !== this.$store.state.user.id) {
          this.fullCorpInfo.users[i].user.businessInfoWasModified = [true, this.fullCorpInfo.users[this.$store.state.theUserDBId].user.fullName + ' har ändrat i företagets uppgifter.']
          firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + i + '/user')
          .update({businessInfoWasModified: this.fullCorpInfo.users[i].user.businessInfoWasModified})
        }
      }
      if (par === 'updateBusinessUserDB') {
        this.$store.commit('updateBusinessUserDB')
      }
    }
  },
  watch: {
    businessLogoWatch: function () {
      this.corpDataWatches.businessLogoWatch++
    },
    corpDescriptionWatch: function () {
      this.corpDataWatches.corpDescriptionWatch++
    },
    businessNameWatch: function () {
      this.corpDataWatches.businessNameWatch++
    },
    orgNrWatch: function () {
      this.corpDataWatches.orgNrWatch++
    },
    countryWatch: function () {
      this.corpDataWatches.countryWatch++
    },
    employeeSizeWatch: function () {
      this.corpDataWatches.employeeSizeWatch++
    },
    websiteWatch: function () {
      this.corpDataWatches.websiteWatch++
    }
  },
  computed: {
    businessLogoWatch () {
      return this.fullCorpInfo.businessLogo
    },
    corpDescriptionWatch () {
      return this.fullCorpInfo.corpDescription
    },
    businessNameWatch () {
      return this.fullCorpInfo.businessName
    },
    orgNrWatch () {
      return this.fullCorpInfo.orgNr
    },
    countryWatch () {
      return this.fullCorpInfo.country
    },
    employeeSizeWatch () {
      return this.fullCorpInfo.employeeSize
    },
    websiteWatch () {
      return this.fullCorpInfo.website
    },
    uploadFinishedReal () {
      if (this.$store.state.corpObject !== '') {
        if (this.$store.state.corpObject.businessLogo.hasOwnProperty('i')) {
          return this.uploadFinished && this.$store.state.corpObject.businessLogo.i !== undefined
        } else {
          return false
        }
      } else {
        return this.uploadFinished
      }
    },
    priceplan () {
      if (this.$store.getters.freePlan) {
        return 'trial'
      } else {
        return this.$store.state.corpObject.pricePlan.package
      }
    },
    corpDescriptionArr () {
      var arr = this.fullCorpInfo.corpDescription.split(String.fromCharCode(10))
      var newArr = []
      arr.forEach(val => {
        if (val.length > 0) {
          newArr.push(val)
        }
      })
      return newArr
    },
    corpObject () {
      return this.$store.state.corpObject
    },
    employeeSize () {
      return this.$store.state.employeeSize
    },
    totalUsers () {
      return Object.keys(this.$store.state.corpObject.users).length
    },
    allUsers () {
      var allUsers = []
      for (var i in this.$store.state.corpObject.users) {
        allUsers.push(this.$store.state.corpObject.users[i].user)
      }
      return allUsers
    },
    countries () {
      return this.$store.state.countries
    },
    pendingRequests () {
      var pendingRequests = 0
      for (var i in this.$store.state.corpObject.users) {
        for (var ii in this.$store.state.corpObject.users[i].user.events.requests) {
          if (this.$store.state.corpObject.users[i].user.events.requests[ii].hasOwnProperty('accepted')) {
            if (this.$store.state.corpObject.users[i].user.events.requests[ii].accepted === 0 || this.$store.state.corpObject.users[i].user.events.requests[ii].accepted === 2) {
              pendingRequests = (pendingRequests + 1)
            }
          }
        }
      }
      return pendingRequests
    },
    totalActiveAds () {
      var totalActiveAds = 0
      for (var i in this.$store.state.corpObject.users) {
        for (var ii in this.$store.state.corpObject.users[i].user.ads) {
          if (this.$store.state.corpObject.users[i].user.ads[ii].hasOwnProperty('active') && this.$store.state.corpObject.users[i].user.ads[ii].active === true) {
            if (this.$store.state.corpObject.users[i].user.ads[ii].lastDay.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
              totalActiveAds = (totalActiveAds + 1)
            }
          }
        }
      }
      return totalActiveAds
    },
    totalBookedMeetings () {
      var meetingsBooked = 0
      for (var i in this.$store.state.corpObject.users) {
        for (var ii in this.$store.state.corpObject.users[i].user.events.appointments) {
          if (typeof (this.$store.state.corpObject.users[i].user.events.appointments[ii]) === 'object') {
            if (this.$store.state.corpObject.users[i].user.events.appointments[ii].accepted === 1 && this.$store.state.corpObject.users[i].user.events.appointments[ii].acceptedTime.date.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
              meetingsBooked = (meetingsBooked + 1)
            }
          }
        }
      }
      return meetingsBooked
    },
    fullCorpInfo () {
      return this.$store.state.corpObject
    },
    userInfo () {
      var user
      for (var i in this.$store.state.corpObject.users) {
        if (this.$store.state.corpObject.users[i].user.userId === this.$store.state.user.id) {
          user = this.$store.state.corpObject.users[i].user
        }
      }
      return user
    }
  },
  mounted () {
    // Mounted
  }
}
</script>

