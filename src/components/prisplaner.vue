<template>
<div>
  <div class="py-5" v-if="$store.state.corpObject === ''">
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

  <main v-if="$store.state.corpObject !== ''" class="grey lighten-3 fill-height">
    <v-container>
      <v-layout row wrap>
        <v-btn v-if="0" @click="test" flat smalll class="orange">Test fr. prisplaner</v-btn>
        <v-flex class="textPrio secondary--text" text-xs-left xs12 px-3>
          <h1 class="my-4 display-1 black--text text-xs-center">Priser</h1>
          <div class="body-1 pb-2 black--text">
            Priserna gäller för ett helt företagskonto med ett obegränsat antal användare. Ni faktureras för 30 dagars perioder.
          </div>
          <div class="body-1 black--text pb-2">
            En nedgradering börjar gälla nästkommande period. En uppgradering börjar gälla direkt (om inte trial är aktiv) 
            och ni blir bara fakturerade för det valda paketet.
          </div>
          <!-- OM TRIAL ÄR FÖRBI OCH PRESENTATIONERNA ÄR UNDER 100 STYCKEN  -->
          <div v-if="!trialIsActive && !presentationsAboveHundred">
            <span class="title">
              Ditt paket:
            </span>
            <span style="padding:2px 5px;border-radius:5px" class="grey darken-1 title white--text">Platinum</span>
            <div class="body-1 px-1 py-1 grey lighten-2 my-3">
              <v-icon small>info</v-icon>
              Eftersom den totala nivån av aktiva presentationer är under 100 st. i dagsläget så fortsätter ni med
              platinum helt <strong>kostnadsfritt tillsvidare</strong>. Skulle presentationerna bli över 100 st. så kommer ni
              behöva uppgradera erat paket.
            </div>
          </div>
          <!-- OM TRIAL ÄR FÖRBI OCH PRESENTATIONERNA ÄR ÖVER 100 STYCKEN  -->
          <div v-if="!trialIsActive && presentationsAboveHundred">
            <div class="title pt-3 pb-2">
              <span v-if="pricePlan.package === 3" style="padding:2px 5px;border-radius:5px" class="grey darken-1 white--text">Platinum</span>
              <span v-if="pricePlan.package === 2" style="padding:2px 5px;border-radius:5px" class="orange white--text">Gold</span>
              <span v-if="pricePlan.package === 1" style="padding:2px 5px;border-radius:5px" class="secondary white--text">Basic</span>
              t.o.m: {{ endOfPeriod }} 
            </div>
            <div class="title mb-5">
              Förnyas <span style="font-weight:bold">{{ renewDate }}</span> till:
            <span style="padding:2px 5px;border-radius:5px" :class="{'secondary white--text' : renewTo === 'Basic', 'orange white--text' : renewTo === 'Gold', 'grey darken-1 white--text' : renewTo === 'Platinum'}">
              {{ renewTo }}
            </span>
            </div>
          </div>
          <!--  OM TRIAL ÄR PÅ  -->
          <div v-if="trialIsActive" class="title pt-3 pb-2">
            Trial till: <span style="font-weight:bold" class="success--text text--darken-1">{{ pricePlan.trialUntil }}</span>
            <span style="padding:2px 5px;border-radius:5px" class="grey darken-1 white--text">Platinum</span>
            <div class="title my-3">
              Förnyas <span style="font-weight:bold">{{ renewDate }}</span> till:
            <span style="padding:2px 5px;border-radius:5px" :class="{'secondary white--text' : renewTo === 'Basic', 'orange white--text' : renewTo === 'Gold', 'grey darken-1 white--text' : renewTo === 'Platinum'}">
              {{ renewTo }}
            </span>
            </div>
          </div>
          <div v-if="!presentationsAboveHundred" class="body-2 black--text text--darken-1 pb-2 text-xs-center">
            <v-icon small>info</v-icon>
            Så länge nivån av de totala videpresentationerna underskrider 100 stycken så bjuder vi på Platinum helt kostnadsfritt.
          </div>
        </v-flex>

        <v-flex px-2 mb-4 xs12 md4>
          <v-card class="text-xs-center">
            <v-card-title class="primary lighten-3 white--text justify-center">
              <div class="myDisplay-1">
                Basic <v-icon v-if="currentPackage === 1" class="white--text" large>check_circle</v-icon>
              </div>
            </v-card-title>
            <v-card-text>
              <div style="font-weight:bold;margin-bottom:-2px" class="myDisplay-1 text-xs-center secondary--text">
                Gratis
              </div>
              <div style="visibility:hidden" class="body-2 text-xs-center pb-3">
                /mån.
              </div>
              <div class="subheading pb-2">
                0 förfrågningar
              </div>
              <div class="subheading pb-2">
                Dolda profiler
              </div>
              <div class="subheading pb-2">
                Obegränsade användare
              </div>
              <div class="subheading">
                0 annonser
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="pricePlan.renew === 1 && !freePlan" @click="changePricePlanHolder = 1, fakturaAdressModal = true" class="success title" round block flat>Välj</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex px-2 mb-4 xs12 md4>
          <v-card class="text-xs-center">
            <v-card-title class="yellow darken-2 white--text justify-center">
              <div class="myDisplay-1">
                Gold <v-icon v-if="currentPackage === 2" class="white--text" large>check_circle</v-icon>
              </div>
            </v-card-title>
            <v-card-text>
              <div style="font-weight:bold;margin-bottom:-2px" class="myDisplay-1 text-xs-center secondary--text">
                {{ prices.gold }} SEK
              </div>
              <div class="body-2 text-xs-center pb-3">
                /mån.
              </div>
              <div class="subheading pb-2">
                20 mötesförfrågningar / mån.
              </div>
              <div class="subheading pb-2">
                Obegränsade användare
              </div>
              <div class="subheading pb-2">
                5 annonser / mån.
              </div>
              <div class="subheading">
                Ingen bindningstid
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="pricePlan.renew === 2 && !freePlan" @click="changePricePlanHolder = 2, fakturaAdressModal = true" class="success title" block round flat>Välj</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex px-2 mb-4 xs12 md4>
          <v-card class="text-xs-center">
            <v-card-title class="grey lighten-2 secondary--text justify-center">
              <div class="myDisplay-1">
                Platinum <v-icon v-if="currentPackage === 3" class="success--text" large>check_circle</v-icon>
              </div>
            </v-card-title>
            <v-card-text>
              <div style="font-weight:bold;margin-bottom:-2px" class="myDisplay-1 secondary--text">
                <span v-if="!freePlan">{{ platinumPrice }} SEK</span>
                <span v-if="freePlan"><del>{{ platinumPrice }}</del> 0 SEK</span>
              </div>
              <div class="body-2 pb-3">
                /mån.
              </div>
              <div class="subheading pb-2">
                Obegränsade mötesförfrågningar
              </div>
              <div class="subheading pb-2">
                Obegränsade användare
              </div>
              <div class="subheading pb-2">
                Obegränsade annonser
              </div>
              <div class="subheading">
                Ingen bindningstid
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="pricePlan.renew === 3 || freePlan" @click="changePricePlanHolder = 3, fakturaAdressModal = true" class="success title" block round flat>Välj</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <div class="body-2 text-xs-center">
            <v-icon small>info</v-icon> Alla priser är ex. moms.
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <!--   Fakturerings Adress  -->
    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="700" v-model="fakturaAdressModal">
      <v-card>
        <v-card-title class="primary lighten-3 white--text justify-center">
          <div class="title">
            Faktureringsuppgifter
          </div>
          <div class="closeModal">
              <v-icon @click="fakturaAdressModal = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex pr-2 xs12 md6>
              <v-text-field
                label="Fakturaadress"
                v-model="pricePlan.invoice.adress"
              ></v-text-field>
              <v-text-field
                disabled
                label="VAT ID"
                v-model="pricePlan.invoice.vatid"
              ></v-text-field>
              <v-text-field
                label="Kontaktperson"
                v-model="pricePlan.invoice.ansvarig"
              ></v-text-field>
            </v-flex>
            <v-flex pl-2 xs12 md6>
              <v-text-field
                label="Mailadress (Fakturahantering)"
                v-model="pricePlan.invoice.mail"
              ></v-text-field>
              <v-text-field
                label="Telefonnummer"
                v-model="pricePlan.invoice.phoneNr"
              ></v-text-field>
              <v-text-field
                label="Företag"
                disabled
                v-model="pricePlan.invoice.corpName"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <div class="body-1">
                Valt paket: 
                <span style="padding:2px 5px;border-radius:5px;font-weight:bold" class="grey darken-1 white--text" v-if="changePricePlanHolder === 3">Platinum</span>
                <span style="padding:2px 5px;border-radius:5px;font-weight:bold" class="orange white--text" v-if="changePricePlanHolder === 2">Gold</span>
                <span style="padding:2px 5px;border-radius:5px;font-weight:bold" class="secondary white--text" v-if="changePricePlanHolder === 1">Basic</span>
              </div>
              <div class="body-1">
                Startdatum: <span class="body-2">{{ newPlanDate }}</span>
              </div>
              <div class="body-1">
                Förnyas: <span class="body-2">{{ newPlanTo }}</span>
              </div>
              <div class="body-1 pb-2">
                Pris: <span class="body-2">
                  <span v-if="changePricePlanHolder === 1">{{ prices.basic }} SEK/mån.</span>
                  <span v-if="changePricePlanHolder === 2">{{ prices.gold }} SEK/mån.</span>
                  <span v-if="changePricePlanHolder === 3">{{ prices.platinum }} SEK/mån.</span>
                </span>
              </div>
              <div class="caption pb-1">
                <v-icon small>info</v-icon> VAT ID och företagsnamn kan endast ändras från profilen.
              </div>
              <div class="caption pb-1">
                Vill du inte förnya ett betalpaket så väljer du paket basic efter du har valt ett paket.
              </div>
            </v-flex>
          </v-layout>
          <div style="margin-bottom:-20px;margin-top:-10px" class="body-1">
            <v-checkbox
              label="Jag förstår att detta är ett löpande avtal utan bindningstid."
              v-model="checkbox"
            ></v-checkbox>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn round flat @click="fakturaAdressModal = false" class="secondary lighten-2" block>Stäng</v-btn>
          <v-btn :disabled="confirmBtn" round flat @click="changePricePlan(changePricePlanHolder)" class="success" block>
            Bekräfta ändringar
            <v-icon class="check_circle ml-2">check_circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  PROCESSERAR ORDERN  -->
    <v-dialog max-width="450" v-model="processingOrder">
      <v-card>
        <v-card-title class="justify-center primary lighten-3">
          <div class="title white--text">
            Vänta medans vi registrerar din order...
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat block :loading="processingOrder"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  PROCESSERAR ORDERN  -->
    <v-dialog max-width="450" v-model="confirmation">
      <v-card>
        <v-card-title class="justify-center primary lighten-3">
          <div class="title white--text">
            Din order har bekräftats!
            <v-icon class="white--text ml-2">check_circle</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="body-1">
            <p>
              Din order har bekräftats och alla i kontot kommer inom kort bli notifierade via mail!
            </p>
            <p>
              {{ orderInfo }}
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmation = false" flat round block class="success lighten-2">
            OK!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <!--  Presentationer är under 100 stycken notifikation  -->
    <v-dialog max-width="450" v-model="presentationsAboveHundredNotification">
      <v-card>
        <v-card-title class="justify-center primary lighten-2">
          <div class="title white--text">
            Vi bjuder på denna!
            <v-icon class="white--text ml-2">thumb_up</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="body-1">
            <p>
              Eftersom den totala nivån av aktiva videopresentationer är under 100 stycken just nu så
              fortsätter vi erbjuda er all fortsatt rekrytering helt kostnadsfritt.
            </p>
            <p>
              Skulle det blir fler än 100 stycken så kommer ni behöva uppgradera erat paket.
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="presentationsAboveHundredNotification = false" flat round block class="success lighten-2 title">
            OK, tack!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </main>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      presentationsAboveHundredNotification: false,
      orderInfo: '',
      processingOrder: false,
      confirmation: false,
      checkbox: false,
      prices: {
        basic: 0,
        gold: 795,
        platinum: 1495
      },
      fakturaAdressModal: false,
      changePricePlanHolder: ''
    }
  },
  watch: {
    watchCorpObject: function () {
      if (this.$store.state.corpObject !== '') {
        this.updatePricesData()
      }
    }
  },
  methods: {
    test () {
      console.log(this.freePlan)
    },
    updatePricesData () {
      if (this.$store.state.corpObject.pricePlan.invoice.ansvarig === '--') {
        this.$store.state.corpObject.pricePlan.invoice.ansvarig = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName
      }
      if (this.$store.state.corpObject.pricePlan.invoice.mail === '--') {
        this.$store.state.corpObject.pricePlan.invoice.mail = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email
      }
      if (this.$store.state.corpObject.pricePlan.invoice.mail === '--') {
        this.$store.state.corpObject.pricePlan.invoice.mail = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email
      }
      if (this.$store.state.corpObject.pricePlan.invoice.phoneNr === '--') {
        this.$store.state.corpObject.pricePlan.invoice.phoneNr = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.phoneNr
      }
      if (this.$store.state.corpObject.pricePlan.invoice.adress === 'Ingen adress') {
        this.$store.state.corpObject.pricePlan.invoice.adress = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.adress
      }
      this.$store.state.corpObject.pricePlan.invoice.corpName = this.$store.state.corpObject.businessName
      this.$store.state.corpObject.pricePlan.invoice.vatid = this.$store.state.corpObject.orgNr
    },
    // Man ska kunna uppgradera mitt i en månad, men inte nedgradera. En nedgradering gäller för nästa månad
    changePricePlan (plan) {
      if (this.presentationsAboveHundred) {
        this.processingOrder = true
      }
      this.fakturaAdressModal = false
      if (this.pricePlan.trialUntil.replace(/-/g, '') < new Date().toISOString().substr(0, 10).replace(/-/g, '') && this.pricePlan.package === 1) {
        this.pricePlan.activated = new Date().toISOString().substr(0, 10)
      }
      this.pricePlan.pricePlanUpdateDate = new Date().toISOString().substr(0, 10)
      this.pricePlan.renew = plan
      // If Nedgradering
      if ((plan <= this.pricePlan.package || this.trialIsActive) && this.presentationsAboveHundred) {
        this.orderInfo = `Ditt valda paket kommer att gälla från och med nästa betalningsperiod. 
        Det nuvarande paketet gäller perioden ut.`
        if (plan === 1) {
          this.pricePlan.renewPrice = this.prices.basic
        } else if (plan === 2) {
          this.pricePlan.renewPrice = this.prices.gold
        } else if (plan === 3) {
          this.pricePlan.renewPrice = this.prices.platinum
        }
        this.$store.state.corpObject.pricePlan.renewDate = this.renewDate
      } else if (plan > this.pricePlan.package && this.presentationsAboveHundred) {
        // If uppgradering
        this.orderInfo = 'Ditt valda paket börjar gälla nu direkt och ni blir endast fakturerade för det valda paketet.'
        this.pricePlan.package = plan
        if (plan === 2) {
          this.pricePlan.price = this.prices.gold
          this.pricePlan.renewPrice = this.prices.gold
        } else if (plan === 3) {
          this.pricePlan.price = this.prices.platinum
          this.pricePlan.renewPrice = this.prices.platinum
        }
        this.$store.state.corpObject.pricePlan = this.pricePlan
        this.$store.state.corpObject.pricePlan.renewDate = new Date(new Date().setDate(new Date().getDate() + 31)).toISOString().substr(0, 10)
        let adminNotification = {
          notificationTo: 'Business',
          name: this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName,
          mail: this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email,
          msg: 'Företaget har uppgraderat paket, skicka till alla users, de finns users property här!',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'pp',
          corp: this.$store.state.corpObject.businessName
        }
        firebase.database().ref('admin').child('notifications')
          .push(adminNotification)
      } else {
        this.presentationsAboveHundredNotification = true
      }
      if (this.presentationsAboveHundred) {
        firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
          .update({pricePlan: this.pricePlan})
          .then(res => {
            this.processingOrder = false
            this.confirmation = true
          })
      }
    },
    renewDateNext () {
      let calculatedDate
      if ((this.pricePlan.activated.replace(/-/g, '') > this.pricePlan.trialUntil.replace(/-/g, '')) && (this.pricePlan.trialUntil.replace(/-/g, '') < new Date().toISOString().substr(0, 10).replace(/-/g, ''))) {
        calculatedDate = this.pricePlan.activated
      } else {
        calculatedDate = this.pricePlan.trialUntil
      }
      const date = new Date(calculatedDate)
      const addDaysFromTrial = new Date(new Date(new Date().setDate(calculatedDate.substr(8, 10))).toISOString().substr(0, 10))
      if (calculatedDate.replace(/-/g, '') > new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
        date.setDate(date.getDate() + 31)
        return date.toISOString().substr(0, 10)
      } else {
        addDaysFromTrial.setDate(addDaysFromTrial.getDate() + 31)
        return addDaysFromTrial.toISOString().substr(0, 10)
      }
    }
  },
  computed: {
    presentationsAboveHundred () {
      return this.$store.getters.presentationsAboveHundred
    },
    newPlanDate () {
      return (this.changePricePlanHolder > this.pricePlan.package && !this.freePlan) ? new Date().toISOString().substr(0, 10) : this.renewDate
    },
    newPlanTo () {
      return (this.changePricePlanHolder > this.pricePlan.package && !this.freePlan) ? new Date(new Date().setDate(new Date().getDate() + 31)).toISOString() : this.renewDateNext(62)
    },
    watchCorpObject () {
      return this.$store.state.corpObject
    },
    confirmBtn () {
      return !this.checkbox
    },
    platinumPrice () {
      var x = this.prices.platinum
      var h = x.toString().split('')
      h.splice(1, 0, '.')
      return h.join('')
    },
    pricePlan () {
      if (this.$store.state.corpObject !== '') {
        return this.$store.state.corpObject.pricePlan
      }
    },
    trialIsActive () {
      return this.pricePlan.trialUntil.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')
    },
    freePlan () {
      return this.$store.getters.freePlan
    },
    currentPackage () {
      if (this.freePlan) {
        return 3
      } else if (this.pricePlan.package === 3) {
        return 3
      } else if (this.pricePlan.package === 2) {
        return 2
      } else if (this.pricePlan.package === 1) {
        return 1
      }
    },
    endOfPeriod () {
      if (this.pricePlan.trialUntil.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
        // Om trial är aktiv
        return this.pricePlan.trialUntil
      } else {
        // Om trial ej är aktiv
        const deleteFromRenewDate = new Date(this.$store.state.corpObject.pricePlan.renewDate)
        return new Date(deleteFromRenewDate.setDate(deleteFromRenewDate.getDate() - 1)).toISOString().substr(0, 10)
      }
    },
    renewDate () {
      return this.$store.state.corpObject.pricePlan.renewDate
    },
    renewTo () {
      switch (this.pricePlan.renew) {
        case 1:
          return 'Basic'
        case 2:
          return 'Gold'
        case 3:
          return 'Platinum'
      }
    }
  },
  mounted () {
    if (this.$store.state.corpObject !== '') {
      if (this.$store.state.corpObject.pricePlan.invoice.ansvarig === '--') {
        this.$store.state.corpObject.pricePlan.invoice.ansvarig = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName
      }
      if (this.$store.state.corpObject.pricePlan.invoice.mail === '--') {
        this.$store.state.corpObject.pricePlan.invoice.mail = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email
      }
      if (this.$store.state.corpObject.pricePlan.invoice.mail === '--') {
        this.$store.state.corpObject.pricePlan.invoice.mail = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email
      }
      if (this.$store.state.corpObject.pricePlan.invoice.phoneNr === '--') {
        this.$store.state.corpObject.pricePlan.invoice.phoneNr = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.phoneNr
      }
      if (this.$store.state.corpObject.pricePlan.invoice.adress === 'Ingen adress') {
        this.$store.state.corpObject.pricePlan.invoice.adress = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.adress
      }
      this.$store.state.corpObject.pricePlan.invoice.corpName = this.$store.state.corpObject.businessName
      this.$store.state.corpObject.pricePlan.invoice.vatid = this.$store.state.corpObject.orgNr
    }
  }
}
</script>
