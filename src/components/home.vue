<template>
  <div class="white">
    <section v-if="!$store.state.userIsNotLoggedIn" class="mainBackground">
    <v-container fill-height>
        <v-layout class="white--text" py-5 px-3 wrap>
          <!--   Följande kort är filtreringen, endast relevent för inloggade users   -->
          <v-flex class="white--text" xs12 md7>
            <div v-if="$store.state.corpObject !== '' && $store.state.theUserDBId !== ''" style="font-weight:bold" :class="{'display-1 mb-4' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 mb-4' : $vuetify.breakpoint.xsOnly}">
                Hej {{ $store.state.corpObject.users[$store.state.theUserDBId].user.fullName.split(' ')[0] }}, 
                kom igång och lär känna din nästa kollega nu!
            </div>
            <div v-if="$store.state.corpObject === ''" style="font-weight:bold" :class="{'display-1 mb-4' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 mb-4' : $vuetify.breakpoint.xsOnly}">
                Välkommen, kom igång och lär känna din nästa kollega nu!
            </div>
            <div class="title mb-4">
              Träffsäker, snabb, smidig och effektiv rekrytering med videopresentationer.
            </div>
            <div>
              <img @click="howItWorksVideo = true" style="max-width:300px" class="pointer" width="50%" src="@/assets/videosImage.png" alt="Video">
            </div>
          </v-flex>
          <v-flex xs12 md5>
            <v-layout class="white--text" row wrap>
              <v-flex text-xs-left xs12>
                <div class="title pb-3">
                  Filtrera jobbkandidater
                </div>
              </v-flex>
              <v-flex pr-1 xs6>
                  <v-autocomplete
                    dark
                    :items="getBranschMainArr"
                    v-model="$store.state.filterModels.bransch.main"
                    box
                    label="Bransch"
                  ></v-autocomplete>
                  </v-flex>
                  <v-flex pl-1 xs6>
                    <v-autocomplete
                      dark
                      :items="getBranschCategoryArr"
                      v-model="$store.state.choosedUnderCategory"
                      box
                      label="Kategori"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex pr-1 xs6>
                    <v-autocomplete
                      dark
                      :items="$store.state.filter.region"
                      v-model="$store.state.filterModels.region"
                      box
                      label="Region"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex pl-1 xs6>
                    <v-select
                      dark
                      :items="$store.state.filter.minExp"
                      v-model="$store.state.filterModels.minExp"
                      box
                      label="Yrkeserfarenhet"
                    ></v-select>
                  </v-flex>
                  <v-flex pr-1 xs6>
                    <v-select
                      dark
                      :items="$store.state.filter.utbildning"
                      v-model="$store.state.filterModels.utbildning"
                      box
                      label="Utbildning"
                    ></v-select>
                  </v-flex>
                  <v-flex pl-1 xs6>
                    <v-select
                      dark
                      :items="$store.state.filter.availability"
                      v-model="$store.state.filterModels.availability"
                      box
                      label="Tillgänglig senast"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-autocomplete
                      dark
                      box
                      chips
                      label="Tagga kompetenser (sorterar resultat)"
                      :items="$store.state.filter.competences"
                      v-model="$store.state.filterModels.competences"
                      multiple
                    >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :selected="data.selected"
                      :disabled="data.disabled"
                      :key="JSON.stringify(data.item)"
                      class="v-chip--select-multi"
                      @input="data.parent.selectItem(data.item)"
                      close
                    >
                      <v-avatar class="accent white--text">
                        {{ data.item.slice(0, 1).toUpperCase() }}
                      </v-avatar>
                      {{ data.item }}
                    </v-chip>
                  </template>
                </v-autocomplete>
                  <v-btn to="/marknaden" class="white--text" block large outline round>
                    SÖK
                  <v-icon class="ml-2">zoom_in</v-icon>
                </v-btn>
            </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
    </v-container>
    </section>

          <!--  Följande kort är till för EJ INLOGGADE Users  -->
    <section v-if="$store.state.userIsNotLoggedIn" class="mainBackground py-5">
      <v-container>
        <v-layout>
          <v-flex xs12>
              <v-layout align-center class="white--text" :px-5="$vuetify.breakpoint.smAndUp" :px-3="$vuetify.breakpoint.xsOnly" pb-5 row wrap>
                <v-flex xs12 sm8>
                  <div style="font-weight:bold" :class="{'display-2 mb-3' : $vuetify.breakpoint.smAndUp, 'myDisplay-1 mb-3' : $vuetify.breakpoint.xsOnly}">
                    Rekrytera effektivt med videopresentationer
                  </div>
                  <div v-if="$vuetify.breakpoint.smAndUp" style="font-weight:bold" class="display-1">
                    Kom igång med Jobflix för företag nu - gratis!
                  </div>
                  <div v-if="$vuetify.breakpoint.xsOnly" style="font-weight:bold;line-height:25px!important" class="title">
                    Kom igång med Jobflix för företag nu - gratis!
                  </div>
                  <div class="subheading pb-4 pt-3">
                    Lär känna personen innan du träffar den.
                    Skapa bevakningar och annonsera ut lediga tjänster utan extra kostnad. 
                    Kom igång och skapa ett gratis konto nu.
                  </div>
                </v-flex>
                <v-flex align-center :text-xs-center="$vuetify.breakpoint.smAndUp" xs12 sm4>
                  <img class="mt-4" width="90%" src="@/assets/videoImg.png" alt="Videorekrytering">
                </v-flex>
                <v-flex xs12>
                  <v-btn @click="signUpDialog = true" large flat round class="success white--text">
                    Skapa företagskonto
                    <v-icon class="ml-2">business</v-icon>
                  </v-btn>
                  <v-btn @click="howItWorksVideo = true" large outline round class="white white--text">
                    Varför använda Jobflix?
                    <v-icon medium>play_arrow</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
          </v-flex>
        </v-layout>
    </v-container>
    </section>

  <section class="white py-3">
    <v-container>
        <v-layout justify-center>
          <v-flex py-5 xs12>
              <v-layout align-center class="secondary--text text--lighten-1" :px-5="$vuetify.breakpoint.smAndUp" :px-3="$vuetify.breakpoint.xsOnly" row wrap>
                <v-flex xs12>
                  <div style="font-weight:bold" :class="{'display-1 mb-5' : $vuetify.breakpoint.smAndUp, 'display1Small mb-3' : $vuetify.breakpoint.xsOnly }">
                    Effektivare rekrytering med videos
                  </div>
                </v-flex>
                <v-flex :px-3="$vuetify.breakpoint.xsOnly" :px-4="$vuetify.breakpoint.smAndUp" xs12 md4>
                  <img height="160px" src="@/assets/video-icon.jpg" alt="Videorekrytering">
                  <div style="font-weight:bold" class="subheading my-4">
                    1. Kolla på videopresentationer.
                  </div>
                  <div v-if="$vuetify.breakpoint.smAndDown" class="text-xs-left">
                    <div class="body-2">Leta i marknaden</div>
                    <div class="body-1 pb-3">
                      Filtrera och leta efter kandidater i 'marknaden'.
                    </div>
                    <div class="body-2">Skapa bevakningar</div>
                    <div class="body-1 pb-3">
                      Skapa bevakningar och bli notifierad när matchande kandidater dyker upp.
                    </div>
                    <div class="body-2">Skicka mötesförfrågan</div>
                    <div class="body-1 pb-3">
                      Skicka inbjudan för telefon, video eller F2F möte med minst två olika tider.
                    </div>
                    <div class="body-2">Följ status</div>
                    <div class="body-1 pb-3">
                      Status för din inbjudan hittar du i <v-icon small>person_add</v-icon> ikonen i menyn.
                      
                    </div>
                  </div>
                </v-flex>
                <v-flex :px-3="$vuetify.breakpoint.xsOnly" :px-4="$vuetify.breakpoint.smAndUp" xs12 md4>
                  <img style="border-radius:50%" height="160px" src="@/assets/answer-invitation.jpg" alt="Rekrytring">
                  <div style="font-weight:bold" class="subheading my-4">
                    2. Kandidaten svarar på din inbjudan.
                  </div>
                  <div v-if="$vuetify.breakpoint.smAndDown" class="text-xs-left">
                    <div class="body-2">Kandidaten blir notifierad</div>
                    <div class="body-1 pb-3">
                      Kandidaten blir notifierad och väljer antingen att acceptera någon av dina tider, be om ny tid eller avböja.
                    </div>
                    <div class="body-2">Kandidaten har all nödvändig info</div>
                    <div class="body-1 pb-3">
                      I din inbjudan ingår företagsbeskrivning, jobbbeskrivning samt tid och plats för intervjun.
                    </div>
                    <div class="body-2">Du blir notifierad</div>
                    <div class="body-1 pb-3">
                      Så fort du fått svar inbjudan så blir du direkt notifierad över händelsen.
                    </div>
                  </div>
                </v-flex>
                <v-flex :px-3="$vuetify.breakpoint.xsOnly" :px-4="$vuetify.breakpoint.smAndUp" xs12 md4>
                  <img height="160px" src="@/assets/calendar-flat.png" alt="Kalender sök jobb">
                  <div style="font-weight:bold" class="subheading my-4">
                    3. Mötet hamnar i era kalendrar.
                  </div>
                  <div v-if="$vuetify.breakpoint.smAndDown" class="text-xs-left">
                    <div class="body-2">Mötet blir insatt i era kalendar</div>
                    <div class="body-1 pb-3">
                      Mötet hamnar i era kalendrar med all information samt kontaktuppgifter.
                    </div>
                    <div class="body-2">Ni skapar kontakt</div>
                    <div class="body-1 pb-3">
                      Ni skapar kontakt och kan därför skriva via meddelanden till varandra.
                    </div>
                    <div class="body-2">Klart!</div>
                    <div class="body-1 pb-3">
                      Jobflix hjälper till med att hitta rätt kompetenser till rätt tjänster. Efter mötet är bokat
                      så är vi inte med i processen längre.
                    </div>
                  </div>
                </v-flex>
              </v-layout>
          </v-flex>
        </v-layout>

              <v-layout style="margin-top:-50px" v-if="$vuetify.breakpoint.mdAndUp" class="secondary--text text--lighten-1" :px-5="$vuetify.breakpoint.smAndUp" :px-3="$vuetify.breakpoint.xsOnly" pb-5 row wrap>
                <v-flex :px-3="$vuetify.breakpoint.xsOnly" :px-4="$vuetify.breakpoint.smAndUp" xs12 md4>
                  <div class="text-xs-left">
                        <div class="body-2">Leta i marknaden</div>
                        <div class="body-1 pb-3">
                          Filtrera och leta efter kandidater i 'marknaden'.
                        </div>
                        <div class="body-2">Skapa bevakningar</div>
                        <div class="body-1 pb-3">
                          Skapa bevakningar och bli notifierad när matchande kandidater dyker upp.
                        </div>
                      <div class="body-2">Skicka mötesförfrågan</div>
                      <div class="body-1 pb-3">
                        Skicka inbjudan för telefon, video eller F2F möte med minst två olika tider.
                      </div>
                        <div class="body-2">Följ status</div>
                        <div class="body-1 pb-3">
                          Status för din förfrågan hittar du i <v-icon small>person_add</v-icon> ikonen i menyn.
                          
                        </div>
                  </div>
                </v-flex>
                <v-flex :px-3="$vuetify.breakpoint.xsOnly" :px-4="$vuetify.breakpoint.smAndUp" xs12 md4>
                  <div class="text-xs-left">
                        <div class="body-2">Kandidaten blir notifierad</div>
                        <div class="body-1 pb-3">
                          Kandidaten blir notifierad och väljer antingen att acceptera någon av
                          dina tider, be om ny tid eller avböja.
                        </div>
                          <div class="body-2">Kandidaten har all nödvändig info</div>
                          <div class="body-1 pb-3">
                            I din inbjudan ingår företagsbeskrivning, jobbbeskrivning samt tid och plats för intervjun.
                          </div>
                        <div class="body-2">Du blir notifierad</div>
                        <div class="body-1 pb-3">
                          Så fort du fått svar så blir du direkt notifierad över händelsen.
                        </div>
                  </div>
                </v-flex>
                <v-flex :px-3="$vuetify.breakpoint.xsOnly" :px-4="$vuetify.breakpoint.smAndUp" xs12 md4>
                  <div class="text-xs-left">
                        <div class="body-2">Mötet blir insatt i era kalendar</div>
                        <div class="body-1 pb-3">
                          Mötet hamnar i era kalendrar med all information samt kontaktuppgifter.
                        </div>
                        <div class="body-2">Ni skapar kontakt</div>
                        <div class="body-1 pb-3">
                          Ni skapar kontakt och kan därför skriva via meddelanden till varandra.
                        </div>
                    <div class="body-2">Klart!</div>
                    <div class="body-1 pb-3">
                      Jobflix hjälper till med att hitta rätt kompetenser till rätt tjänster. Efter mötet är bokat
                      så är vi inte med i processen längre.
                    </div>
                  </div>
                </v-flex>
        </v-layout>
    </v-container>
  </section>


  <section v-if="$store.state.userIsNotLoggedIn" class="mainBackground py-3">
    <v-container>
      <v-layout align-center px-3 py-5 class="white--text" row wrap>
        <v-flex xs12 md6>
          <div style="font-weight:bold" :class="{'display-1' : $vuetify.breakpoint.smAndUp, 'display1Small' : $vuetify.breakpoint.xsOnly }">
            Smidig och användarvänlig portal
          </div>
          <div class="subheading py-4">
            Jobflix erbjuder en användarportal som har ett enkelt och lättnavigerat användargränssnitt.
            Det blir lätt att hantera alla kandidater, och alla möten sparas automatiskt i kalendern med
            personens kontaktuppgifter.
          </div>
          <div class="subheading">
            Ni kan enkelt sätta upp bevakningar och bli notifierade när matchande kanididater dyker upp. Ni kan vara hur många
            användare som helst i ett företagskonto. Paketen är uppdelade i Basic, Guld och Platinum.
          </div>
        </v-flex>
        <v-flex :mt-4="$vuetify.breakpoint.smAndDown" text-xs-center xs12 md6>
          <img height="250px" src="@/assets/platform.png" alt="Rekryteringsplattform">
        </v-flex>
      </v-layout>
    </v-container>
  </section>


  <section v-if="$store.state.userIsNotLoggedIn" class="white py-3">
    <v-container>
      <v-layout align-center px-3 py-5 class="secondary--text" row wrap>
        <v-flex text-xs-center xs12 md6>
          <img src="@/assets/rekrytering.png" width="60%" alt="Rekrytering">
        </v-flex>
        <v-flex xs12 md6>
          <div style="font-weight:bold" :class="{'display-1' : $vuetify.breakpoint.smAndUp, 'display1Small' : $vuetify.breakpoint.xsOnly }">
            Rekrytering med störst träffsäkerhet
          </div>
          <div class="subheading pt-3">
            <p>
              Slipp sortera högar av CV'n och effektivisera era processer med upp till 50% med videorekrytering.
            </p>
            <p>
              I takt med att tekniken går framåt så blir det tuffare att rekrytera talanger med hjälp av traditionella
              textannonser. Video har redan blivit anammat av stora företag i rekryteringsprocesser. Trender pekar på att
              82% av all global internettrafik kommer bestå av videos inom några år!
            </p>
          </div>
          <div>
            <v-btn @click="signUpDialog = true" large class="my-4" flat outline round :block="$vuetify.breakpoint.xsOnly">
              Skapa företagskonto nu!
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>

  <section v-if="$store.state.userIsNotLoggedIn" class="mainBackground">
    <v-container>
      <v-layout align-center px-3 py-5 class="white--text" row wrap>
        <v-flex text-xs-center xs12>
          <div style="font-weight:bold" :class="{'display-1' : $vuetify.breakpoint.smAndUp, 'display1Small' : $vuetify.breakpoint.xsOnly }">
            Söker du jobb?
          </div>
          <div class="subheading pt-3">
            Visa vem du är för företag och öka dina chanser till drömjobbet!
          </div>
          <div>
            <a href="https://www.jobflix.se/" target="_blank">
              <v-btn large class="white white--text my-4" flat outline round :block="$vuetify.breakpoint.xsOnly">
                Till jobbportalen
                <v-icon class="ml-2">work</v-icon>
              </v-btn>
            </a>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>

    <!--******   Hur det fungerar video Modal    ******-->
    <v-dialog max-width="700" v-model="howItWorksVideo">
        <v-card>
          <v-layout align-center>
            <v-flex align-center text-xs-center>
              <div style="position:absolute;right:0;z-index:20">
                <v-btn @click="howItWorksVideo = false" small fab flat class="secondary pointer">
                    <v-icon large class="white--text">close</v-icon>
                </v-btn>
              </div>
                <video style="margin-bottom:-7px" width="100%" preload controls>
                  <source src="https://firebasestorage.googleapis.com/v0/b/instawork-814df.appspot.com/o/jobflix-videos%2FJobflix_Business.mp4?alt=media&token=933ba31f-377b-4304-94c1-0262d3afa70e" type="video/mp4">
                  Your browser does not support HTML5 video.
                </video>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '',
      howItWorksVideo: false
    }
  },
  watch: {
    branschModelWatch: function () {
      this.$store.state.choosedUnderCategory = ''
    },
    watchUndercategoryChange: function () {
      if (this.$store.state.choosedUnderCategory !== '' && this.$store.state.filterModels.bransch.main === '') {
        for (let i in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[i]) {
            if (this.$store.state.filter.bransch[i][ii] === this.watchUndercategoryChange) {
              this.$store.state.filterModels.bransch.main = this.$store.state.filter.bransch[i].main
              setTimeout(() => {
                this.$store.state.choosedUnderCategory = this.$store.state.filter.bransch[i][ii]
              }, 100)
            }
          }
        }
      }
    }
  },
  computed: {
    watchUndercategoryChange () {
      return this.$store.state.choosedUnderCategory
    },
    signUpDialog: {
      get () { return this.$store.getters.signUpDialogGetter },
      set (value) { this.$store.commit('signUpDialog', value) }
    },
    branschModelWatch () {
      return this.$store.state.filterModels.bransch.main
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
      if (this.$store.state.filterModels.bransch.main !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.$store.state.filter.bransch[i].main === this.$store.state.filterModels.bransch.main) {
            for (var ii in this.$store.state.filter.bransch[i]) {
              arr.push(this.$store.state.filter.bransch[i][ii])
            }
            arr.shift()
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
      return arr
    }
  }
}
</script>


<style scoped>
.hoverCard:hover {
  background-color: lightgrey!important;
}
.highLightCard {
  background-color: #d8ffab!important;
}
.sec_line{
	display: inline-block;
	height: 10px;
	width: 10px;
	border: 1px solid #3AB3DF;
	border-radius: 50%;
	position: relative;
}
.sec_line:after{
	position: absolute;
	content: "";
	left: 15px;
	top: 3.5px;
	height: 1px;
	width: 100px;
	background: #3AB3DF;
}
.sec_line:before{
	position: absolute;
	content: "";
	right: 15px;
	top: 3.5px;
	height: 1px;
	width: 100px;
	background: #3AB3DF;
}
</style>
