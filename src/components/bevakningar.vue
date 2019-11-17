<template>
  <main class="grey lighten-3 fill-height">
    <v-container class="noPaddingOnSmallScreenSizes">
      <v-btn v-if="0" @click="test">TEST fr. bevakningar.vue</v-btn>
      <v-layout :mt-3="$vuetify.breakpoint.lgAndUp" row wrap>
        <v-flex :my-4="$vuetify.breakpoint.xsOnly" :mt-1="$vuetify.breakpoint.smAndUp" :mb-4="$vuetify.breakpoint.smAndUp" px-3 xs12 v-if="$vuetify.breakpoint.smAndDown">
          <v-btn @click="showBevakningar = !showBevakningar" small block round outline>
            Dina bevakningar
            <v-icon class="ml-2">{{ showBevakningar ? 'arrow_drop_up' : 'arrow_drop_down'}}</v-icon>
          </v-btn>
          <div class="my-4 px-1" v-show="showBevakningar">
            <div class="title">
              Dina bevakningar
              <v-btn @click="showBevakning = 'Alla'" block flat :outline="showBevakning !== 'Alla'" small round :class="{'my-2 success lighten-1' : showBevakning === 'Alla', 'my-2 secondary' : showBevakning !== 'Alla'}" >
                Alla
                <v-spacer></v-spacer>
                <v-icon>folder_open</v-icon><span class="ml-2 body-2">{{ allPresentations.length }}</span>
              </v-btn>
              <div v-bind:key="x.id" v-for="x in bevakningar">
                <v-btn @click="showBevakning = x.name" :outline="showBevakning !== x.name" v-if="x.id" :class="{'my-2 success lighten-1' : showBevakning === x.name, 'my-2 secondary' : showBevakning !== x.name}" block flat small round>
                  {{ x.name }}
                  <v-spacer></v-spacer>
                  <v-icon>folder_open</v-icon><span class="ml-2 body-2">{{ Object.keys(x.presentations).length - 1 }}</span>
                </v-btn>
              </div>
            </div>
            <v-btn @click="openCreateNewDialog = true" block round small flat class="success lighten-1">Skapa ny bevakning <v-icon class="ml-2">add</v-icon></v-btn>
            <v-btn @click="editBevakning = true" block round small flat class="secondary lighten-1">Redigera en bevakning <v-icon class="ml-2">edit</v-icon></v-btn>
          </div>
        </v-flex>
        <v-flex :px-2="$vuetify.breakpoint.smAndUp" xs12 md8>
          <v-layout row wrap>
            <v-flex :class="{ 'px-2' : $vuetify.breakpoint.xsOnly }">
              <div class="text-xs-center textPrio" v-if="bevakningar.length <= 1">
                <v-icon small>info</v-icon> Du har inga bevakningar för tillfället.
              </div>
              <v-flex class="justify-center text-xs-center" v-if="currentBevakning === '' || currentBevakning.length === 0" xs12>
                <div class="display-1 py-4 textPrio">
                  Dina bevakningar
                </div>
                <div class="body-1 pb-4 textPrio">
                  Du har för tillfället inga nya presentationer som matchat dina bevakningar.<br>
                </div>
                <img width="300px" src="@/assets/bevakningar.png" alt="Bevakningar" />
            </v-flex>
            </v-flex>

      <!--  HÖR BÖRJAR VIDEORNA  -->
        <v-flex xs12>
         <v-layout v-bind:key="index" v-for="(user, index) in currentBevakning" wrap>
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
                  <v-btn @click="videoPlay(index), user.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:31%" large fab flat class="white">
                    <v-icon large class="secondary--text">play_arrow</v-icon>
                  </v-btn>
                <img style="min-height:200px" @click="videoPlay(index), user.videoPlay = false" :src="user.snapshot" width="100%" alt="Video snapshot">
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
              <v-btn :loading="deletingPre" @click="deletePresentation(user)" class="grey grey--text text--darken-2 darken-2" small outline round>
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
              <v-btn :loading="deletingPre" @click="deletePresentation(user)" class="grey grey--text text--darken-2 darken-2" small outline round>
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
        </v-flex>
      <!--  HÄR SLUTAR VIDEORNA   -->

          </v-layout>
        </v-flex>
        <v-flex pl-4 pr-3 v-if="$vuetify.breakpoint.mdAndUp" mb-3 xs12 md4>
          <div class="imSticky py-4" style="border-top:1px solid lightgrey">
            <div class="title mb-3">
              Dina bevakningar
              <v-btn @click="showBevakning = 'Alla'" block flat :outline="showBevakning !== 'Alla'" small round :class="{'my-2 success lighten-1' : showBevakning === 'Alla', 'my-2 secondary' : showBevakning !== 'Alla'}" >
                Alla
                <v-spacer></v-spacer>
                <v-icon>folder_open</v-icon><span class="ml-2 body-2">{{ allPresentations.length }}</span>
              </v-btn>
              <div v-bind:key="x.id" v-for="x in bevakningar">
                <v-btn @click="showBevakning = x.name" :outline="showBevakning !== x.name" v-if="x.id" :class="{'my-2 success lighten-1' : showBevakning === x.name, 'my-2 secondary' : showBevakning !== x.name}" block flat small round>
                  {{ x.name }}
                  <v-spacer></v-spacer>
                  <v-icon>folder_open</v-icon><span class="ml-2 body-2">{{ Object.keys(x.presentations).length - 1 }}</span>
                </v-btn>
              </div>
            </div>
            <v-btn @click="openCreateNewDialog = true" block round small flat class="success lighten-1">Skapa ny bevakning <v-icon class="ml-2">add</v-icon></v-btn>
            <v-btn @click="editBevakning = true" block round small flat class="secondary lighten-1">Redigera en bevakning <v-icon class="ml-2">edit</v-icon></v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <!--  SKAPA NY BEVAKNING  -->
    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="600" v-model="openCreateNewDialog">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">
            Skapa ny bevakning
          </div>
          <div class="closeModal">
            <v-icon @click="openCreateNewDialog = false" large class="white--text">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-text-field
                label="Namn på denna bevakning"
                box
                v-model="nyBevakning.name"
              ></v-text-field>
            </v-flex>
            <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                box
                label="Välj bransch"
                :items="getBranschMainArr"
                v-model="nyBevakning.bransch"
              ></v-autocomplete>
            </v-flex>
            <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                box
                label="Underkategori"
                :items="getBranschCategoryArr"
                v-model="nyBevakning.underCategory"
              ></v-autocomplete>
              <v-select
                box
                label="Välj erfarnehetsnivå"
                :items="filter.minExp"
                v-model="nyBevakning.minExp"
              ></v-select>
            </v-flex>
            <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                box
                label="Välj region"
                :items="filter.region"
                v-model="nyBevakning.region"
              ></v-autocomplete>
              <v-select
                box
                label="Välj utbildning"
                :items="filter.utbildning"
                v-model="nyBevakning.utbildning"
              ></v-select>
            </v-flex>
          </v-layout>
          <div class="body-1">
            <v-icon small>info</v-icon> Du kommer bli notifierad varenda gång någon matchar dina kriterier.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="openCreateNewDialog = false" flat round class="secondary lighten-2" block>Stäng <v-icon class="ml-2">close</v-icon></v-btn>
          <v-btn :disabled="!nyBevakningBtn" :loading="sendingNewBevakning" @click="createNewBevakning()" flat round class="success lighten-1" block>KLAR <v-icon class="ml-2">cloud_upload</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="400" v-model="newBevakningHasBeenUploaded">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">Din bevakning har laddats upp <v-icon class="white--text">check_circle</v-icon></div>
        </v-card-title>
        <v-card-actions>
          <v-btn round @click="newBevakningHasBeenUploaded = false" outline block>OK!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="400" v-model="newBevakningHasBeenUpdated">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">Din bevakning har uppdaterats <v-icon class="white--text">check_circle</v-icon></div>
        </v-card-title>
        <v-card-actions>
          <v-btn round @click="newBevakningHasBeenUpdated = false" outline block>OK!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  EDIT BEVAKNING  -->
     <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="600" v-model="editBevakning">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="title white--text">
            Redigera bevakning
          </div>
          <div class="closeModal">
            <v-icon @click="editBevakning = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text v-if="editBevakningChoosed === ''">
          <v-select
            box
            label="Välj bevakning"
            :items="bevakningarNames"
            v-model="bevakningarNamesModel"
          ></v-select>
          <v-btn flat @click="getEditBevakning(), bevakningHasBeenChoosed = true, editBevakningJustBeenOpened = 1" :disabled="bevakningarNamesModel === ''" round block :outline="bevakningarNamesModel === ''" small :class="{'secondary' : bevakningarNamesModel === '', 'success' : bevakningarNamesModel !== ''}">Välj</v-btn>
        </v-card-text>
        <v-card-text v-if="editBevakningChoosed !== ''">
          <v-layout row wrap>
            <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-text-field
                label="Namn på denna bevakning"
                box
                v-model="editBevakningChoosed.name"
              ></v-text-field>
            </v-flex>
            <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                box
                label="Välj bransch"
                :items="getBranschMainArr"
                v-model="editBevakningChoosed.bransch"
              ></v-autocomplete>
            </v-flex>
            <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                box
                label="Underkategori"
                :items="getBranschCategoryArrEdit"
                v-model="editBevakningChoosed.underCategory"
              ></v-autocomplete>
              <v-select
                box
                label="Välj erfarnehetsnivå"
                :items="filter.minExp"
                v-model="editBevakningChoosed.minExp"
              ></v-select>
            </v-flex>
            <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                box
                label="Välj region"
                :items="filter.region"
                v-model="editBevakningChoosed.region"
              ></v-autocomplete>
              <v-select
                box
                label="Välj utbildning"
                :items="filter.utbildning"
                v-model="editBevakningChoosed.utbildning"
              ></v-select>
            </v-flex>
          </v-layout>
          <div class="body-1">
            <v-icon small>info</v-icon> Du kommer bli notifierad varenda gång någon matchar dina kriterier.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!bevakningHasBeenChoosed" @click="editBevakning = false" flat round class="secondary lighten-2" block>Stäng <v-icon class="ml-2">close</v-icon></v-btn>
          <v-btn :disabled="!bevakningHasBeenChoosed" :loading="sendingNewBevakning" @click="updateBevakning(2)" flat round class="red lighten-1 white--text" block>Ta bort <v-icon class="ml-2">close</v-icon></v-btn>
          <v-btn :disabled="!bevakningHasBeenChoosed" :loading="sendingNewBevakning" @click="updateBevakning(1)" flat round class="success lighten-1" block>Uppdatera <v-icon class="ml-2">cloud_upload</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                          <div class="subheading success--text text--darken-2 pt-2">{{ $store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName }}</div>
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

       <!-- INVITATION SUCCESSFULLY SENT MODAL -->
      <v-dialog v-model="presentationIsDeleted" max-width="400">
        <v-card>
          <v-card-title class="primary lighten-3">
            <div class="title white--text">Presentationen har tagits bort <v-icon class="white--text">check_circle</v-icon></div>
          </v-card-title>
          <v-card-text>
            <div class="body-1">
              Presentationen har tagits bort från dina bevakningar.
              Den finns dock alltid tillgänglig på marknaden så länge 
              personen är jobbsökande och har kampanjen "aktiverad".
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="presentationIsDeleted = false" block outline round flat>OK!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

  </main>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      msg: 'whatever',
      openCreateNewDialog: false,
      nyBevakning: {
        name: '',
        id: '',
        region: '',
        minExp: '',
        utbildning: '',
        bransch: '',
        presentations: { initial: 'xx' },
        underCategory: '',
        businessDBId: this.$store.state.yourDatabaseString,
        userDBId: this.$store.state.theUserDBId
      },
      // New invitation
      invitationType: ['Personligt möte', 'Telefonmöte', 'Videomöte'],
      choosedInvitationType: 'Telefonmöte',
      invitationTime: ['5 dagar', '1 vecka', '2 veckor', '3 veckor', '1 månad', '2 månader', '3 månader', '6 månader'],
      choosedInvitationTime: '2 veckor',
      invitationMsg: 'Tack för en bra presentation! Vi tycker du har en lämplig och intressant profil för tjänsten vi försöker fylla. Vi skulle gärna vilja gå vidare med dig. Bekräfta ett av dessa datum. Funkar ingen av dessa så får du be oss skicka nya tider. Tack på förhand.',
      invitationAbout: '',
      invitationAdress: '',
      invitationAd: '',
      invitationDate: [],
      invitationStepper: 0,
      selectDates: ['07.00', '07.15', '07.30', '07.45', '08.00', '08.15', '08.30', '08.45', '09.00', '09.15', '09.30', '09.45', '10.00', '10.15', '10.30', '10.45', '11.00', '11.15', '11.30', '12.00', '12.15', '12.30', '12.45', '13.00', '13.15', '13.30', '13.45', '14.00', '14.15', '14.30', '14.45', '15.00', '15.15', '15.30', '15.45', '16.00', '16.15', '16.30', '16.45', '17.00', '17.15', '17.30', '17.45', '18.00', '18.15', '18.30', '18.45', '19.00', '19.15', '19.30', '19.45', '20.00', '20.15', '20.30', '20.45', '21.00'],
      theInvUser: '',
      // Invitation end
      newBevakningHasBeenUploaded: false,
      newBevakningHasBeenUpdated: false,
      sendingNewBevakning: false,
      currentBevakning: '',
      editBevakning: false,
      editBevakningChoosed: '',
      bevakningarNames: [],
      bevakningarNamesModel: '',
      showBevakning: 'Alla',
      bevakningHasBeenChoosed: false,
      sendInvitationDialog: false,
      allPresentations: '',
      profilesArr: '',
      presentationIsDeleted: false,
      editBevakningJustBeenOpened: 0,
      showBevakningar: false,
      deletingPre: false
    }
  },
  watch: {
    watchUndercategoryChange: function () {
      if (this.nyBevakning.underCategory !== '' && this.nyBevakning.bransch === '') {
        for (let i in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[i]) {
            if (this.$store.state.filter.bransch[i][ii] === this.watchUndercategoryChange) {
              this.nyBevakning.bransch = this.$store.state.filter.bransch[i].main
              setTimeout(() => {
                this.nyBevakning.underCategory = this.$store.state.filter.bransch[i][ii]
              }, 100)
            }
          }
        }
      }
    },
    bevakningar: function () {
      this.getBevakningsData()
    },
    editBevakning: function () {
      if (this.editBevakning === false) {
        this.editBevakningChoosed = ''
        this.bevakningHasBeenChoosed = false
      }
    },
    showBevakning: function () {
      this.getBevakningsData()
    },
    sendInvitationDialog: function () {
      if (this.sendInvitationDialog === false) {
        this.invitationStepper = 1
        this.invitationDate = []
      }
    }
  },
  methods: {
    test () {
      console.log(this.profilesArr)
    },
    videoPlay (index) {
      const playVideo = `playSmall${index}`
      document.querySelector(`#${playVideo}`).play()
    },
    getEditBevakning () {
      for (var i in this.$store.state.bevakningar) {
        if (this.$store.state.bevakningar[i].name === this.bevakningarNamesModel) {
          this.editBevakningChoosed = this.$store.state.bevakningar[i]
        }
      }
    },
    updateBevakning (doWhat) {
      var global = this
      var theDBBevakningId
      this.sendingNewBevakning = true
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/bevakningar')
        .once('value', response => {
          const res = response.val()
          for (var i in res) {
            if (res[i].id === global.editBevakningChoosed.id) {
              theDBBevakningId = i
            }
          }
          if (doWhat === 1) {
            firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/bevakningar/')
              .update({[theDBBevakningId]: global.editBevakningChoosed})
            .then(res => {
              global.sendingNewBevakning = false
              global.editBevakning = false
              global.newBevakningHasBeenUpdated = true
              global.$store.commit('pushToBevakningDBNode')
            })
          } else if (doWhat === 2) {
            firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/bevakningar/' + theDBBevakningId)
              .remove()
            .then(res => {
              global.sendingNewBevakning = false
              global.editBevakning = false
              global.newBevakningHasBeenUpdated = true
              global.$store.commit('pushToBevakningDBNode')
            })
          }
        })
      .catch(function (error) {
        console.log(error.message)
      })
    },
    createNewBevakning () {
      this.sendingNewBevakning = true
      this.nyBevakning.id = new Date().getTime()
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/bevakningar')
        .push(this.nyBevakning)
      .then(res => {
        this.sendingNewBevakning = false
        this.openCreateNewDialog = false
        this.newBevakningHasBeenUploaded = true
        this.$store.commit('pushToBevakningDBNode')
      })
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
          alert('Du har redan skickat en förfrågan till denna kampanj & användare. Du hittar denna på "hantera förfrågningar".')
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
          msg: 'Privatperson har fått intervjuerbjudande via bevakning!',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'fh'
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
      // SKAPA EN REMOVE FUNCTION MED FIREBASE OCH HITTA RÄTT ID
      this.deletingPre = true
      var presentationDBId
      var bevakningDBId
      var global = this
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user')
        .once('value', response => {
          const res = response.val()
          for (var i in res.bevakningar) {
            for (var ii in res.bevakningar[i].presentations) {
              if (res.bevakningar[i].presentations[ii].id === p.id) {
                bevakningDBId = i
                presentationDBId = ii
              }
            }
          }
          firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/bevakningar/' + bevakningDBId + '/presentations/' + presentationDBId)
            .remove()
          .then(res => {
            global.presentationIsDeleted = true
            global.deletingPre = false
          })
        })
        .catch(function (error) {
          console.log(error.message)
        })
    },
    getBevakningsData (val) {
      var currentBevakning = []
      var bevakningarNames = []
      for (var i in this.$store.state.bevakningar) {
        if (this.$store.state.bevakningar[i].hasOwnProperty('id')) {
          bevakningarNames.push(this.$store.state.bevakningar[i].name)
        }
        for (var ii in this.$store.state.bevakningar[i].presentations) {
          if (this.$store.state.bevakningar[i].presentations[ii].hasOwnProperty('id')) {
            if ((this.showBevakning === 'Alla') || (this.showBevakning === this.$store.state.bevakningar[i].name)) {
              if (this.$store.state.bevakningar[i].presentations[ii].hasOwnProperty('videoPlay')) {
                this.$store.state.bevakningar[i].presentations[ii].videoPlay = true
              }
              currentBevakning.push(this.$store.state.bevakningar[i].presentations[ii])
            }
          }
        }
      }
      this.bevakningarNames = bevakningarNames
      this.currentBevakning = currentBevakning
    }
  },
  computed: {
    watchUndercategoryChange () {
      return this.nyBevakning.underCategory
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
    nyBevakningBtn () {
      return this.nyBevakning.name !== '' && this.nyBevakning.region !== '' && this.nyBevakning.minExp !== '' && this.nyBevakning.utbildning !== '' && this.nyBevakning.bransch !== ''
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
    getBranschMainArr () {
      var arr = []
      for (var i in this.$store.state.filter.bransch) {
        arr.push(this.$store.state.filter.bransch[i].main)
      }
      return arr
    },
    getBranschCategoryArr () {
      var arr = []
      if (this.nyBevakning.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.$store.state.filter.bransch[i].main === this.nyBevakning.bransch) {
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
      this.nyBevakning.underCategory = ''
      arr.shift()
      return arr
    },
    getBranschCategoryArrEdit () {
      var arr = []
      if (this.editBevakningChoosed.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.$store.state.filter.bransch[i].main === this.editBevakningChoosed.bransch) {
            for (var ii in this.$store.state.filter.bransch[i]) {
              arr.push(this.$store.state.filter.bransch[i][ii])
            }
          }
        }
      }
      if (this.editBevakningJustBeenOpened !== 1 && this.editBevakningChoosed !== '') {
        this.editBevakningChoosed.underCategory = ''
      }
      this.editBevakningJustBeenOpened = 0
      arr.shift()
      return arr
    },
    bevakningar () {
      return this.$store.state.bevakningar
    },
    filter () {
      return this.$store.state.filter
    }
  },
  mounted () {
    var currentBevakning = []
    var bevakningarNames = []
    for (var i in this.$store.state.bevakningar) {
      if (this.$store.state.bevakningar[i].hasOwnProperty('id')) {
        bevakningarNames.push(this.$store.state.bevakningar[i].name)
      }
      for (var ii in this.$store.state.bevakningar[i].presentations) {
        if (this.$store.state.bevakningar[i].presentations[ii].hasOwnProperty('id')) {
          currentBevakning.push(this.$store.state.bevakningar[i].presentations[ii])
        }
      }
    }
    this.bevakningarNames = bevakningarNames
    this.currentBevakning = currentBevakning
    this.allPresentations = currentBevakning
  }
}
</script>

<style scoped>
@media only screen and (max-width:600px) {
  .noPaddingOnSmallScreenSizes {
    padding: 0px !important;
  }
}
</style>

