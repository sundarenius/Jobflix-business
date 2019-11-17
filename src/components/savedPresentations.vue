<template>
  <main class="grey lighten-3 fill-height">
    <v-container class="noPaddingOnSmallScreenSizes">
      <v-btn v-if="0" @click="test">TEST fr. savedP</v-btn>
      <v-layout :mt-3="$vuetify.breakpoint.mdAndUp" row wrap>
        <v-flex :my-4="$vuetify.breakpoint.smAndDown" :mt-1="$vuetify.breakpoint.smAndUp" :mb-4="$vuetify.breakpoint.smAndUp" px-3 xs12 v-if="$vuetify.breakpoint.smAndDown">
          <v-btn @click="showFilter = !showFilter" small block round outline>
            Filtrera ({{ totalSavedPresentations }})
            <v-icon class="ml-2">{{ showFilter ? 'arrow_drop_up' : 'arrow_drop_down'}}</v-icon>
          </v-btn>
          <div class="my-4 px-1" v-show="showFilter">
              <div style="border-top:1px solid lightgrey" class="title px-3 py-3">
                Sparade presentationer: 
                <span v-show="totalSavedPresentations > 0">{{ totalSavedPresentations }} st.</span>
                <span v-show="totalSavedPresentations === 0">0 st.</span>
              </div>
              <div class="caption grey lighten-4 v-card pl-2 mb-3">
                <v-icon small>info</v-icon> En presentation tas automatiskt bort efter du skickat en mötesförfrågan.
              </div>
              <v-autocomplete
                :items="getBranschMainArr"
                v-model="filter.bransch"
                label="Bransch"
              ></v-autocomplete>
              <v-autocomplete
                :items="getBranschCategoryArr"
                v-model="filter.choosedUnderCategory"
                label="Underkategori"
              ></v-autocomplete>
              <v-autocomplete
                :items="$store.state.filter.region"
                v-model="filter.region"
                label="Region"
              ></v-autocomplete>
              <v-btn small @click="cleanFilter" block round outline>Rensa filter</v-btn>
          </div>
        </v-flex>
        <v-flex :px-4="$vuetify.breakpoint.smAndUp" xs12 md8>
          <v-layout row wrap>
            <div class="text-xs-center subheading py-4 secondary--text textPrio" v-if="totalSavedPresentations === 0">
              <v-icon class="primary--text" small>info</v-icon> Du har inga sparade presentationer.
              Alla presentationer du sparar hamnar på denna sida.
            </div>
      <!--  HÄR BÖRJAR VIDEON  -->
        <v-layout v-bind:key="index" v-for="(user, index) in savedPresentations" wrap>
          <v-card v-if="user.id" style="width:100%" :class="{'mx-3 px-2 hoverVideo' : $vuetify.breakpoint.smAndUp, 'mb-2' : true }">
            <v-card-title>
                  <v-avatar
                    size="28px"
                  >
                    <img
                      :src="user.profilePic"
                      alt="Avatar"
                    >
                  </v-avatar>
                  <span class="pl-2 body-2">{{ user.name }}</span><span>&nbsp;- {{ user.title }}</span>
            </v-card-title>
            <v-divider class="pb-2"></v-divider>
            <div v-if="$vuetify.breakpoint.xsOnly">
                <div v-if="user.videoPlay" style="position:relative">
                  <v-btn @click="playVideo(index), user.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:31%" large fab flat class="white">
                    <v-icon large class="secondary--text">play_arrow</v-icon>
                  </v-btn>
                <img style="min-height:200px" @click="playVideo(index), user.videoPlay = false" :src="user.snapshot" width="100%" alt="Video snapshot">
              </div>
              <video :id="`playSmall${index}`" preload v-show="!user.videoPlay" width="100%" controls>
                <source :src="user.videoUrl.i" type="video/mp4">
                Your browser does not support HTML5 video.
              </video>
            </div>
            <div v-if="$vuetify.breakpoint.smAndUp">
              <video preload width="100%" controls>
                <source :src="user.videoUrl.i" type="video/mp4">
                Your browser does not support HTML5 video.
              </video>
            </div>
              <v-card-text>
                <div class="body-2">
                  <v-chip v-bind:key="x" v-for="x in user.competences" small outline color="green" text-color="green">#{{ x }}</v-chip>
                </div>
                <div class="pt-1">
                  <span class="body-2 grey--text text--darken-2"><span class="grey--text text--darken-3">{{ user.bransch }}</span>
                    <span v-bind:key="x" v-for="(x, index) in user.underCategory" v-show="user.underCategory !== '' && user.underCategory !== undefined"><span v-show="index === 0">></span> {{ x }}<span v-show="index < user.underCategory.length - 1">,</span></span>
                  </span>
                </div>
                <span class="body-2 pr-2 success--text text--darken-1">
                  Nuvarande tjänst: <span class="body-2 grey--text text--darken-3">{{ user.nuvarande }}</span>
                </span> |
                <span class="body-2 pl-2 success--text text--darken-1">
                  Region: <span class="body-2 grey--text text--darken-2"> 
                    <span v-bind:key="x" v-for="(x, index) in user.region">{{ x }}<span v-show="index < user.region.length - 1">, </span></span>
                  </span>
                </span>
                <div>
                  <span class="body-1">
                    {{ user.msg }}
                  </span>
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="hidden-xs-only">
              <v-btn @click="sendInvitation(user)" flat class="green white--text" small round>
                Skicka inbjudan <v-icon small class="ml-1 white--text">send</v-icon>
              </v-btn>
              <v-btn @click="showProfile(user.profile)" class="blue blue--text" small outline round>
                CV/Profil <v-icon class="ml-1">person</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="deletePresentation(user)" class="grey grey--text text--darken-2 darken-2" small outline round>
                Ta bort <v-icon class="ml-1">delete</v-icon>
              </v-btn>
            </v-card-actions>
            <v-card-actions class="hidden-sm-and-up">
              <v-btn @click="sendInvitation(user)" flat class="green white--text" small round>
                 <v-icon class="ml-2 white--text">send</v-icon>
              </v-btn>
              <v-btn @click="showProfile(user.profile)" class="primary white--text" flat small round>
                <v-icon>person</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="deletePresentation(user)" class="grey grey--text text--darken-2 darken-2" small outline round>
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
      <!-- HÄR SLUTAR VIDEON  -->

          </v-layout>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.mdAndUp" pl-4 md4>
          <div class="imSticky">
            <div style="border-top:1px solid lightgrey" class="title pl-2 py-3">
              Sparade presentationer: 
              <span v-show="totalSavedPresentations > 0">{{ totalSavedPresentations }} st.</span>
              <span v-show="totalSavedPresentations === 0">0 st.</span>
            </div>
            <div class="caption grey lighten-4 v-card pl-2 mb-3">
              <v-icon small>info</v-icon> En presentation tas automatiskt bort efter du skickat en mötesförfrågan.
            </div>
            <v-autocomplete
              :items="getBranschMainArr"
              v-model="filter.bransch"
              label="Bransch"
            ></v-autocomplete>
            <v-autocomplete
              :items="getBranschCategoryArr"
              v-model="filter.choosedUnderCategory"
              label="Underkategori"
            ></v-autocomplete>
            <v-autocomplete
              :items="$store.state.filter.region"
              v-model="filter.region"
              label="Region"
            ></v-autocomplete>
            <v-btn @click="cleanFilter" block round outline>Rensa filter</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>


       <!-- SEND INVITATION DIALOG  -->
      <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="700px" v-model="sendInvitationDialog">
            <v-stepper v-model="invitationStepper">
              <v-stepper-header>
                <v-stepper-step :complete="invitationStepper > 1" step="1">Välj minst 2 datum</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="invitationStepper > 2" step="2">Mötesinfo</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="invitationStepper > 3" step="3">Sammanfattning</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card>
                    <v-flex xs12>
                      <v-date-picker
                      style="max-height:300px!important"
                      color="green lighten-2"
                      multiple
                      full-width
                      v-model="invitationDate"
                      :landscape="!this.$vuetify.breakpoint.smAndDown"
                      class="my-3"
                      event-color="blue"
                      :events="appointmentsEventsDates"
                      ></v-date-picker>
                    </v-flex>
                    <v-flex :class="{'selectDatesMarginTop' : $vuetify.breakpoint.smAndDown }" xs12>
                      <div style="border-radius:10px" v-bind:key="x.date" v-for="(x, index) in invitationDateObj" class="v-card success lighten-4 my-2 text-xs-center px-2 py-2">
                        <div style="font-weight:bold" class="subheading text-xs-left mb-1">
                          Datum {{ index + 1 }}:
                          <span class="primary--text">{{ x.date }}</span>
                          </div>
                        <v-select
                          :items="selectDates"
                          v-model="x.time"
                          label="Välj tid"
                        ></v-select>
                      </div>
                    </v-flex>
                    <v-flex class="grey lighten-4" px-1 py-1 xs12>
                        <div class="caption">
                          <v-icon small class="primary--text">info</v-icon>
                          Efter att kanditaten har accepterat din inbjudan så får du kanditatens kontaktuppgifter.
                          Då kan du hantera dubbelbokningar &amp; andra eventuella förhinder.
                        </div>
                      </v-flex>
                    <v-card-actions>
                      <v-btn flat round :disabled="invitationDateObj.length < 2" @click="invitationStepper = 2" block class="success">Nästa</v-btn>
                      <v-btn flat round @click="sendInvitationDialog = false" block class="secondary">Avsluta</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-card>
                    <v-layout justify-center wrap row>
                      <v-flex :pr-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                        <v-select
                          :items="invitationType"
                          v-model="choosedInvitationType"
                          label="Välj mötestyp"
                          outline
                        ></v-select>
                      </v-flex>
                      <v-flex :pl-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                        <v-select
                          :items="invitationTime"
                          v-model="choosedInvitationTime"
                          label="Hur länge gäller erbjudandet?"
                          outline
                        ></v-select>
                      </v-flex>
                      <v-flex v-if="choosedInvitationType === 'Personligt möte'" xs12 md9>
                        <v-text-field
                          label="Adress"
                          placeholder="Skriv in adress för mötet"
                          v-model="invitationAdress"
                          outline
                        ></v-text-field>
                      </v-flex>
                      <v-flex :pr-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                        <v-textarea
                          outline
                          name="input-7-4"
                          label="Skicka ett meddelande"
                          v-model="invitationMsg"
                        ></v-textarea>
                      </v-flex>
                      <v-flex :pl-1="$vuetify.breakpoint.mdAndUp" xs12 md6>
                        <v-textarea
                          outline
                          name="input-7-4"
                          label="Beskriv tjänsten"
                          placeholder="Beskriv tjänsten och er själva med några meningar."
                          v-model="invitationAbout"
                        ></v-textarea>
                      </v-flex>
                      <v-flex style="margin-top:-10px" :pr-1="$vuetify.breakpoint.mdAndUp" md6>
                        <v-text-field
                          label="Hemsida (Frivilligt)"
                        ></v-text-field>
                      </v-flex>
                      <v-flex style="margin-top:-10px" :pl-1="$vuetify.breakpoint.mdAndUp" md6>
                        <v-select
                          v-model="invitationAd"
                          label="Ev. jobbannons (Frivilligt)"
                          :items="jobbaAnnonser"
                        ></v-select>
                      </v-flex>
                      <v-flex style="margin-top:-10px" class="grey lighten-4" px-1 py-1 xs12>
                        <div class="caption">
                          <v-icon small class="primary--text">info</v-icon>
                          Efter att kanditaten har accepterat din inbjudan så får du kanditatens kontaktuppgifter.
                          Då kan du hantera dubbelbokningar &amp; andra eventuella förhinder.
                        </div>
                      </v-flex>
                    </v-layout>
                    <v-card-actions>
                      <v-btn flat round @click="invitationStepper = 3" block class="success">Nästa</v-btn>
                      <v-btn flat round @click="sendInvitationDialog = false" block class="secondary">Avsluta</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="3">
                  <v-card>
                    <v-card-title class="justify-center">
                      <div style="margin-top:-20px" class="title">Sammanfattning</div>
                    </v-card-title>
                    <v-card-text v-if="invitationStepper === 3">
                      <v-layout justify-center row wrap>
                        <v-flex px-2 py-2 text-xs-center v-bind:key="x.date" v-for="(x, index) in invitationDateObj" class="white" xs12 :md3="!invitationDateObj.length % 3 === 0 && !invitationDateObj.length % 2 === 0" :md4="invitationDateObj.length % 3 === 0" :md6="invitationDateObj.length % 2 === 0">
                          <div class="body-2">Datum {{ index + 1 }}</div>
                          <div class="body-2 primary--text text-darken-3"><span class="success--text text--darken-2">Tid:</span> {{ x.date }} kl. {{ x.time }}</div>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex class="grey lighten-4" text-xs-center py-3 xs6>
                          <div class="subheading black--text">Mötestyp: <span style="font-weight:bold" class="success--text text--darken-2">{{ choosedInvitationType }}</span></div>
                          <div v-show="choosedInvitationType === 'Personligt möte'" class="subheading black--text">Adress: <span style="font-weight:bold" class="success--text text--darken-2">{{ invitationAdress }}</span></div>
                        </v-flex>
                        <v-flex class="grey lighten-2" text-xs-center py-3 xs6>
                          <div class="subheading black--text">Svar senast: <span style="font-weight:bold" class="success--text text--darken-2">{{ choosedInvitationTime }}</span></div>
                        </v-flex>
                        <v-flex class="grey lighten-4" py-3 px-2 mt-1 xs12>
                          <div class="body-2 text-xs-center">Om tjänsten</div>
                          <div class="body-1">{{ invitationAbout }}</div>
                        </v-flex>
                        <v-flex class="grey lighten-4" py-3 px-2 mt-1 xs12>
                          <div class="body-2 text-xs-center">Personligt meddelande</div>
                          <div class="body-1">{{ invitationMsg }}</div>
                        </v-flex>
                        <v-flex text-xs-center py-3 xs12>
                          <div class="body-2">Från //</div>
                          <div class="title success--text text--darken-2 pt-2">{{ this.$store.state.corpObject.businessName }}</div>
                          <div class="subheading success--text text--darken-2 pt-2">{{ this.currentUserName }}</div>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-flex class="grey lighten-4" px-1 py-1 xs12>
                        <div class="caption">
                          <v-icon small class="primary--text">info</v-icon>
                          Efter att kanditaten har bekräftat din inbjudan så får du kanditatens kontaktuppgifter.
                          Då kan du hantera dubbelbokningar &amp; andra eventuella förhinder.
                        </div>
                      </v-flex>
                    <v-card-actions>
                      <v-btn flat round @click="sendInvitation(1), sendInvitationDialog = false" block class="success">
                        Skicka inbjudan
                        <v-icon small class="ml-1">send</v-icon>  
                      </v-btn>
                      <v-btn flat round @click="sendInvitationDialog = false" block class="secondary">Avsluta</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
      </v-dialog>


  </main>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      sendInvitationDialog: false,
      // ---------------- INVITATIONS DATA START
      invitationType: ['Personligt möte', 'Telefonmöte', 'Videomöte'],
      choosedInvitationType: 'Telefonmöte',
      invitationTime: ['5 dagar', '1 vecka', '2 veckor', '3 veckor', '1 månad', '2 månader', '3 månader', '6 månader'],
      choosedInvitationTime: '2 veckor',
      invitationMsg: 'Tack för en bra presentation! Vi tycker du har en lämplig och intressant profil för tjänsten vi försöker fylla. Vi skulle gärna vilja gå vidare med dig. Bekräfta ett av dessa datum. Fungerar ingen av dessa så får du be oss skicka nya tider. Tack på förhand.',
      invitationAbout: '',
      invitationAdress: '',
      invitationAd: '',
      invitationDate: [],
      invitationStepper: 0,
      selectDates: ['07.00', '07.15', '07.30', '07.45', '08.00', '08.15', '08.30', '08.45', '09.00', '09.15', '09.30', '09.45', '10.00', '10.15', '10.30', '10.45', '11.00', '11.15', '11.30', '12.00', '12.15', '12.30', '12.45', '13.00', '13.15', '13.30', '13.45', '14.00', '14.15', '14.30', '14.45', '15.00', '15.15', '15.30', '15.45', '16.00', '16.15', '16.30', '16.45', '17.00', '17.15', '17.30', '17.45', '18.00', '18.15', '18.30', '18.45', '19.00', '19.15', '19.30', '19.45', '20.00', '20.15', '20.30', '20.45', '21.00'],
      theInvUser: '',
      // --------------- INVITATIONS DATA END
      filter: {
        bransch: '',
        choosedUnderCategory: '',
        region: ''
      },
      totalSavedPresentations: 0,
      showFilter: false
    }
  },
  watch: {
    sendInvitationDialog: function () {
      if (this.sendInvitationDialog === false) {
        this.invitationStepper = 1
        this.invitationDate = []
      }
    },
    watchBranschChange: function () {
      this.filter.choosedUnderCategory = ''
    },
    watchUndercategoryChange: function () {
      if (this.filter.choosedUnderCategory !== '' && this.filter.bransch === '') {
        for (let i in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[i]) {
            if (this.$store.state.filter.bransch[i][ii] === this.watchUndercategoryChange) {
              this.filter.bransch = this.$store.state.filter.bransch[i].main
              setTimeout(() => {
                this.filter.choosedUnderCategory = this.$store.state.filter.bransch[i][ii]
              }, 100)
            }
          }
        }
      }
    }
  },
  methods: {
    test () {
      console.log(this.totalSavedPresentations)
    },
    playVideo (index) {
      const playVideo = `playSmall${index}`
      document.querySelector(`#${playVideo}`).play()
    },
    cleanFilter () {
      var filter = {
        bransch: '',
        choosedUnderCategory: '',
        region: ''
      }
      this.filter = filter
    },
    sendInvitation (user) {
      if ((this.$store.state.corpObject.pricePlan.package === 1) && !this.$store.getters.freePlan) {
        // Om de har paket basic och trial är förbi
        this.basicPacketModal = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 2) && (this.$store.state.corpObject.pricePlan.sentRequests >= 20) && !this.$store.getters.freePlan) {
        // Om de har paket Guld, har skickat 20 förfrågningar och trial är förbi
        this.goldPacketModal = true
      } else if (user !== 1) {
        if (!user.invitationsUsers.includes(this.$store.state.user.id)) {
          this.sendInvitationDialog = true
          this.theInvUser = user
        } else {
          alert('Du har redan skickat en förfrågan på denna kampanj. Du hittar denna på "hantera förfrågningar".')
        }
      } else {
        var invitationObject = {}
        this.theInvUser.invitationsUsers.push(this.$store.state.user.id)
        this.theInvUser.invitations++
        invitationObject.dates = this.invitationDateObj
        invitationObject.corp = this.$store.state.corpObject.businessName
        invitationObject.type = this.choosedInvitationType
        invitationObject.adress = this.invitationAdress
        invitationObject.deadline = this.choosedInvitationTime
        invitationObject.msg = this.invitationMsg
        invitationObject.name = this.currentUserName
        invitationObject.phoneNr = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.phoneNr
        invitationObject.businessUserMail = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email
        invitationObject.id = (new Date().getTime() + 'gfsg' + Math.random())
        invitationObject.accepted = 0
        invitationObject.acceptedTime = 'xx'
        invitationObject.userCampaign = this.theInvUser
        invitationObject.businessUserId = this.$store.state.user.id
        invitationObject.businessDBId = this.$store.state.yourDatabaseString
        invitationObject.businessUserDBId = this.$store.state.theUserDBId
        invitationObject.answerMsg = 'Meddelande...'
        invitationObject.dateAndTimeAtSend = new Date().getTime()
        invitationObject.about = this.invitationAbout
        invitationObject.website = this.$store.state.corpObject.website
        invitationObject.ad = this.invitationAdObj
        invitationObject.readMore = false
        let theDBKey = firebase.database().ref().push().key
        invitationObject.dbKey = theDBKey
        invitationObject.logo = this.$store.state.corpObject.businessLogo.i
        invitationObject.adminNotification = {
          notificationTo: 'Privatperson',
          name: invitationObject.userCampaign.name,
          mail: invitationObject.userCampaign.email,
          kampanj: invitationObject.userCampaign.campaignName,
          msg: 'Privatperson har fått intervjuerbjudande via sparade presentationer!',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'fj'
        }
        let invitationObjectCopy = JSON.stringify(invitationObject)
        this.$store.commit('sendInvitationStore', JSON.parse(invitationObjectCopy))
        this.sendInvitationDialog = false
        this.deletePresentation(this.theInvUser)
      }
    },
    showProfile (profile) {
      if ((this.$store.state.corpObject.pricePlan.package === 1) && !this.$store.getters.freePlan) {
        // Om de har paket basic och trial är förbi
        this.basicPacketModal = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 2) && (this.$store.state.corpObject.pricePlan.sentRequests >= 20) && !this.$store.getters.freePlan) {
        // Om de har paket Guld, har skickat 20 förfrågningar och trial är förbi
        this.goldPacketModal = true
      } else {
        this.userProfileObj = profile
        this.showUsersProfile = true
      }
    },
    deletePresentation (p) {
      // Denna gör en ny obj med alla förutom den som ska bort (Dunka upp denna i firebase sen)
      var obj = this.savedPresentations
      var newObj = {0: 'xx'}
      for (var i in obj) {
        if (obj[i].id !== p.id) {
          newObj[i] = obj[i]
        }
      }
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/')
        .update({savedProfiles: newObj})
    }
  },
  computed: {
    watchBranschChange () {
      return this.filter.bransch
    },
    watchUndercategoryChange () {
      return this.filter.choosedUnderCategory
    },
    userProfileObj: {
      get () { return this.$store.getters.userProfileObjGetter },
      set (value) { this.$store.commit('userProfileObjCommit', value) }
    },
    showUsersProfile: {
      get () { return this.$store.getters.showUsersProfileGetter },
      set (value) { this.$store.commit('showUsersProfileCommit', value) }
    },
    basicPacketModal: {
      get () { return this.$store.getters.basicPacketModalGetter },
      set (value) { this.$store.commit('basicPacketModalCommit', value) }
    },
    goldPacketModal: {
      get () { return this.$store.getters.goldPacketModalGetter },
      set (value) { this.$store.commit('goldPacketModalCommit', value) }
    },
    invitationAdObj () {
      let obj
      if (this.invitationAd !== '') {
        for (var i in this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.ads) {
          if (this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.ads[i].title === this.invitationAd) {
            obj = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.ads[i]
          }
        }
      } else {
        obj = ''
      }
      return obj
    },
    getBranschMainArr () {
      var arr = []
      for (var i in this.$store.state.filter.bransch) {
        arr.push(this.$store.state.filter.bransch[i].main)
      }
      return arr
    },
    getBranschCategoryArr () {
      var arr = []
      if (this.filter.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.$store.state.filter.bransch[i].main === this.filter.bransch) {
            for (var ii in this.$store.state.filter.bransch[i]) {
              arr.push(this.$store.state.filter.bransch[i][ii])
            }
          }
        }
      } else {
        for (let i in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[i]) {
            if (ii !== 'main') {
              arr.push(this.$store.state.filter.bransch[i][ii])
            }
          }
        }
      }
      arr.shift()
      return arr
    },
    invitationDateObj () {
      var arr = []
      this.invitationDate.forEach((val, index) => {
        arr.push({})
        arr[index].date = val
        arr[index].time = '11.00'
      })
      return arr
    },
    appointmentsEventsDates () {
      return this.$store.state.appointmentsEventsDates
    },
    jobbaAnnonser () {
      var arr = []
      for (var i in this.$store.state.corpObject.users) {
        for (var ii in this.$store.state.corpObject.users[i].user.ads) {
          if (this.$store.state.corpObject.users[i].user.ads[ii].hasOwnProperty('active')) {
            arr.push(this.$store.state.corpObject.users[i].user.ads[ii].title)
          }
        }
      }
      return arr
    },
    currentUserName () {
      return this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName
    },
    savedPresentations () {
      var arr = []
      this.totalSavedPresentations = (Object.keys(this.$store.state.savedPresentations).length - 1)
      var val = this.$store.state.savedPresentations
      for (var i in val) {
        if ((val[i] !== 'xx') && (val[i].bransch === this.filter.bransch || this.filter.bransch === '') && (val[i].underCategory === this.filter.choosedUnderCategory || this.filter.choosedUnderCategory === '' || this.filter.choosedUnderCategory === this.filter.bransch) && (this.filter.region === val[i].region || this.filter.region === '' || this.filter.region === 'Hela Sverige')) {
          if (val[i].hasOwnProperty('active')) {
            val[i].videoPlay = true
          }
          arr.push(val[i])
        }
      }
      return arr
    }
  }
}
</script>
