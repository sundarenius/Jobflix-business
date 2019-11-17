<template>
  <v-app class="body">
    <div class="mainBackground fill-height" v-if="!loadTheSite">
      <!--  ANVÄND v-if="!loadTheSite under production -->
      <v-container fill-height>
        <v-layout justify-center align-center>
          <v-flex style="margin-top:-100px" xs7>
            <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
              <span class="jobflix-title">
                <v-icon class="white--text play-icon-title">play_arrow</v-icon>
                <span class="jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              </span>
            </h1>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </v-flex>
        </v-layout>
      </v-container>
      <!--  MODAL FÖR ATT MAN MÅSTE VARA FÖRETAGSKONTO  --> 
      <v-dialog
      v-model="logInAlert"
      width="400"
    >
      <v-card class="primary darken-2 white--text">
        <v-card-title class="title justify-center">
          <v-icon class="white--text mr-2">warning</v-icon> Du måste skapa företagskonto
          </v-card-title>
        <v-card-text>
          <div class="body-1">
            <p>
              Ditt konto är registrerat som jobbsökare.
              Du måste registrera ett företagskonto om du vill kunna logga in
              på denna portal.
            </p>
            <p>
              Vi hänvisar till www.jobflix.se där du hanterar ditt konto och presentationer.
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="logInAlert = false" flat class="success" round block>OK!</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>


    </div>
    <div v-if="loadTheSite">
      <!--  ANVÄND v-if="loadTheSite under production -->
    <!-- Inloggad Toolbar -->
    <v-toolbar
      class="mainBackground"
      v-if="userIsAuthenticatedAndIsABusinessAccount"
      dark
      flat
      fixed
      app
      clipped-left
      dense
      style="z-index:20"
    >
      <v-btn class="hidden-md-and-up" icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
        <v-toolbar-title class="pointer" @click="toHome">
          <span class="jobflix-title-loggedin">
            <v-icon class="white--text play-icon-title-loggedin">play_arrow</v-icon>
            <span class="white--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
          </span>
        </v-toolbar-title>
        <v-btn to="/marknaden" style="text-transform:none!important" class="right subheading ml-4 hidden-sm-and-down" flat>
          Marknaden
        </v-btn>
        <v-btn to="/bevakningar" style="text-transform:none!important" class="right subheading hidden-sm-and-down" flat>
          Bevakningar
        </v-btn>
        <v-btn to="/annonsera" style="text-transform:none!important" class="right subheading hidden-sm-and-down" flat>
          Annonsera
        </v-btn>
        <v-btn to="/prisplaner" style="text-transform:none!important" class="right subheading hidden-sm-and-down" flat>
          Prisplaner
        </v-btn>
      <v-spacer></v-spacer>
      <div @click="toSavedPresentations">
        <v-tooltip style="cursor:pointer" bottom class="hidden-sm-and-down">
          <v-badge :color="savedProfilesColor" slot="activator" :overlap="savedProfiles > 0" left>
            <span :class="{'white--text' : savedProfiles > 0, 'transparentText' : savedProfiles === 0}" slot="badge">{{ savedProfiles }}</span>
            <v-icon class="mr-4" medium>save_alt</v-icon>
          </v-badge>
          <span>Sparade presentationer</span>
        </v-tooltip>
      </div>
      <div @click="messagesDialog = true">
        <v-tooltip style="cursor:pointer" bottom class="hidden-sm-and-down">
          <v-badge :color="messagesColor" slot="activator" :overlap="messages > 0" left>
            <span :class="{'white--text' : messages > 0, 'transparentText' : messages === 0}" slot="badge">{{ messages }}</span>
            <v-icon class="mr-4" medium>mail</v-icon>
          </v-badge>
          <span>Meddelanden</span>
        </v-tooltip>
      </div>
      <div @click="kalenderWindow = true">
      <v-tooltip style="cursor:pointer" bottom class="hidden-sm-and-down">
        <v-badge :color="appointmentColor" slot="activator" :overlap="appointments > 0" left>
          <span :class="{'white--text' : appointments > 0, 'transparentText' : appointments === 0}" slot="badge">{{ appointments }}</span>
          <v-icon class="mr-4" medium>today</v-icon>
        </v-badge>
        <span>Kalender</span>
        </v-tooltip>
      </div>
      <div @click="requestDialog = true">
        <v-tooltip style="cursor:pointer" bottom class="hidden-sm-and-down">
          <v-badge :color="invitesColor" slot="activator" :overlap="pendingRequests > 0" left>
            <span :class="{'white--text' : pendingRequests > 0, 'transparentText' : pendingRequests === 0}" slot="badge">{{ pendingRequests }}</span>
            <v-icon class="mr-4" medium>person_add</v-icon>
          </v-badge>
          <span>Hantera förfrågningar</span>
        </v-tooltip>
      </div>
      <div @click="notificationsDialog = true, zeroNotifications()">
        <v-tooltip style="cursor:pointer" bottom class="hidden-sm-and-down">
          <v-badge :color="notificationsColor" slot="activator" :overlap="notifications > 0" left>
            <span :class="{'white--text' : notifications > 0, 'transparentText' : notifications === 0}" slot="badge">{{ notifications }}</span>
            <v-icon class="mr-4" medium>notifications</v-icon>
          </v-badge>
          <span>Händelser</span>
        </v-tooltip>
      </div>
      <div @click="toProfil">
        <v-tooltip style="cursor:pointer" bottom class="hidden-sm-and-down">
            <v-icon slot="activator" class="mr4" medium>person_outline</v-icon>
          <span>Profil</span>
        </v-tooltip>
      </div>

      <v-menu offset-y>
        <v-btn
          slot="activator"
          flat
          fab
          small
        >
          <v-icon large class="text--lighten-2">arrow_drop_down</v-icon>
        </v-btn>
        <v-layout justify-center class="white" style="z-index:5;width:200px" wrap>
          <v-flex class="grey lighten-4" text-xs-center py-1 xs12>
            <div class="caption">Hantera</div>
          </v-flex>
          <v-flex @click="onLogout" style="cursor:pointer;border-top:1px solid lightgrey" class="hoverDropMenu" text-xs-center py-2 xs12>
            <div class="caption primary--text text--darken-2">Logga ut</div>
          </v-flex>
          <v-flex @click="$router.push('/profil')" style="cursor:pointer;border-top:1px solid lightgrey" class="hoverDropMenu" text-xs-center py-2 xs12>
            <div class="caption primary--text text--darken-2">Profil</div>
          </v-flex>
          <v-flex @click="$router.push('/prisplaner')" style="cursor:pointer;border-top:1px solid lightgrey" class="hoverDropMenu" text-xs-center py-2 xs12>
            <div class="caption primary--text text--darken-2">Prisplaner</div>
          </v-flex>
        </v-layout>
      </v-menu>
    </v-toolbar>

    <!-- EJ INLOGGAD TOOLBAR -->
    <v-toolbar
      v-if="!userIsAuthenticatedAndIsABusinessAccount"
      class="mainBackground"
      light
      fixed
      app
      flat
      clipped-left
    >
        <v-toolbar-title class="pointer" @click="toHome">
          <span class="jobflix-title">
            <v-icon class="white--text play-icon-title">play_arrow</v-icon>
            <span class="white--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
          </span>
          <span class="white--text">| Business</span>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="hidden-md-and-up white--text" icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
        <v-btn outline round to="/marknaden" style="text-transform:none!important" class="right white white--text hidden-sm-and-down">
          Marknaden
        </v-btn>
        <v-btn @click="logInModal = true" medium outline round style="text-transform:none!important" class="white white--text hidden-xs-only" flat>
          <v-icon class="mr-2">lock</v-icon> Logga in
        </v-btn>
        <a href="https://www.jobflix.se/" target="_blank">
          <v-btn medium style="text-transform:none!important" class="white white--text hidden-xs-only" round outline>
            <v-icon class="mr-2">person</v-icon> För jobbsökande
          </v-btn>
        </a>
    </v-toolbar>
    <v-content class="marginBottomSmall" style="min-height:86vh!important">
      <!-- Olika alerts för ändringar i företagsinfo / Nya users -->
      <div style="position:sticky;top:48px;z-index:5">
        <v-alert
          :value="businessInfoWasModified[0]"
          class="secondary--text yellow"
          type="warning"
          >
          <span class="body-2 mr-2">{{ businessInfoWasModified[1] }}</span>
        <v-btn href="mailto:support@jobflix.se?Subject=Ny%20användare" small flat class="red white--text">Anmäl till support</v-btn>
        <v-btn @click="businessInfoWasModifiedFunction" small flat class="success">OK!</v-btn>
        <div class="body-1">
          Ladda om sidan och gå till profilen för att granska.
        </div>
      </v-alert>
      <v-alert
          :value="newUserWasAdded[0]"
          class="secondary--text yellow"
          type="warning"
          >
        <span class="body-2 mr-2">{{ newUserWasAdded[1] }}</span>
        <v-btn href="mailto:support@jobflix.se?Subject=Ny%20användare" small flat class="red white--text">Anmäl till support</v-btn>
        <v-btn @click="newUserWasAddedFunction" small flat class="success">OK!</v-btn>
      </v-alert>
      </div>

      <v-btn class="orange lighten-3" flat small style="position:absolute" v-if="0" @click="test">TEST FROM VUE.APP</v-btn>
      <transition name="component-fade" mode="out-in">
          <router-view/>
      </transition>
        <v-footer
              height="auto"
              color="secondary--text"
            >
            <v-layout wrap>
              <v-flex xs12>
                <v-layout
              class="grey lighten-4"
              justify-center
              row
              wrap
            >
            <v-container>
              <v-layout :my-4="$vuetify.breakpoint.xsOnly" px-3 row wrap>
                <v-flex xs12 sm6>
                  <div style="font-weight:bold" class="subheading secondary--text pb-1">
                    Kategorier
                  </div>
                  <span class="body-2 pb-1">
                    <a href="https://business.jobflix.se/">För arbetsgivare
                      <v-icon small>business</v-icon>
                    </a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2 pb-1">
                    <a target="_blank" href="https://www.jobflix.se">För jobbsökande
                      <v-icon small>work</v-icon>
                    </a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2">
                    <a target="_blank" href="https://info.jobflix.se/faq">FAQ
                      <v-icon small>help</v-icon>
                    </a>
                  </span>
                </v-flex>
                <v-flex :mt-3="$vuetify.breakpoint.xsOnly" xs12 sm6>
                  <div style="font-weight:bold" class="subheading pb-1 secondary--text">
                  Övrigt
                  </div>
                  <span class="body-2">
                    <a target="_blank" href="https://info.jobflix.se">Om Jobflix</a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2 py-1">
                    <a target="_blank" href="https://info.jobflix.se/kontakt">Press</a>
                  </span>
                  <span class="px-1">|</span>
                  <span class="body-2">
                    <a target="_blank" href="https://info.jobflix.se/kontakt">Kontakt</a>
                  </span>
                </v-flex>
                </v-layout>
                </v-container>
              </v-layout>
              </v-flex>

              <v-flex class="white lighten-3 white--text" xs12>
              <v-layout wrap>
                <v-container style="margin-top:-15px;margin-bottom:-15px">
                  <v-layout py-3 px-2 row wrap>
                    <v-flex xs12>
                      <span class="body-1 secondary--text">
                        <span class="jobflix-title" style="font-size:13px !important;position:relative">
                          <v-icon style="position:absolute;left:3px;top:-1.3px" small class="black--text">play_arrow</v-icon>
                          <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
                      </span>
                        &copy; {{ new Date().getFullYear() }}</span>
                         <a target="_blank" href="https://info.jobflix.se/userterms">
                            <v-btn small class="secondary--text" flat round>
                              Villkor
                            </v-btn>
                         </a>
                         <a target="_blank" href="https://info.jobflix.se/policy">
                            <v-btn small class="secondary--text" flat round>
                              Sekretesspolicy
                            </v-btn>
                         </a>
                         <a target="_blank" href="https://info.jobflix.se/faq">
                          <v-btn small class="secondary--text" flat round>
                            Hjälp
                          </v-btn>
                        </a>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-layout>
              </v-flex>
            </v-layout>
          </v-footer>
    </v-content>
    <v-navigation-drawer
      temporary
      v-model="rightDrawer"
      fixed
      app
      style="max-width:240px;z-index:25"
    >
    <v-toolbar class="mainBackground darken-4" dense fixed>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon class="white--text">menu</v-icon>
      </v-btn>
      <v-toolbar-title @click="toHome">
        <span class="jobflix-title">
          <v-icon class="white--text play-icon-title">play_arrow</v-icon>
          <span style="color:#fff!important" class="jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
        </span>
      </v-toolbar-title>
    </v-toolbar>
      <div v-if="$store.state.userIsNotLoggedIn">
        <v-btn to="/marknaden" style="margin-top:60px" flat block>
          Marknaden
          <v-spacer></v-spacer>
          <v-icon>people</v-icon>
        </v-btn>
        <v-divider></v-divider>
        <v-btn @click="logInModal = true" flat block>
          Logga in
          <v-spacer></v-spacer>
          <v-icon>lock</v-icon>
        </v-btn>
        <v-divider></v-divider>
        <v-btn @click="signUpDialog = true" flat block>
          Skapa företagskonto
          <v-spacer></v-spacer>
          <v-icon>business</v-icon>
        </v-btn>
        <v-divider></v-divider>
        <v-btn flat block>
          För jobbsökande
          <v-spacer></v-spacer>
          <v-icon>work</v-icon>
        </v-btn>
        <v-divider></v-divider>
      </div>
      <div v-if="!$store.state.userIsNotLoggedIn">
        <v-btn to="/marknaden" style="margin-top:60px" flat block>
          Marknaden
          <v-spacer></v-spacer>
          <v-icon>people</v-icon>
        </v-btn>
      <v-divider></v-divider>
        <v-btn to="/bevakningar" flat block>
          Bevakningar
          <v-spacer></v-spacer>
          <v-icon>alarm_on</v-icon>
        </v-btn>
      <v-divider></v-divider>
        <v-btn to="/annonsera" flat block>
          Annonsera
          <v-spacer></v-spacer>
          <v-icon>cloud_upload</v-icon>
        </v-btn>
      <v-divider></v-divider>
        <v-btn to="/prisplaner" flat block>
          Prisplaner
          <v-spacer></v-spacer>
          <v-icon>business</v-icon>
        </v-btn>
      <v-divider></v-divider>
        <v-btn to="/sparade" flat block>
          Sparade presentationer
          <v-spacer></v-spacer>
          <v-icon>save_alt</v-icon>
        </v-btn>
      <v-divider></v-divider>
     </div>
    </v-navigation-drawer>


     <v-dialog max-width="400" v-model="forgotPasswordModel">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">
            Begär nytt lösenord.
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            outline
            label="Din registrerade e-mail"
            v-model="lostPasswordEmail"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="sendNewPassword" :disabled="!lostPasswordEmail.length > 0" block class="primary">Begär nytt lösenord</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="500" v-model="lookForInbox">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center">
          <div class="title white--text">
            Ett mail har skickats till {{ lostPasswordEmail }}
            <v-icon class="white--text">check_circle</v-icon>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn block @click="lookForInbox = false" flat>Stäng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-bottom-nav
      v-if="userIsAuthenticatedAndIsABusinessAccount"
      class="hidden-md-and-up white"
      :value="true"
      fixed
      height="50"
      style="z-index:10"
      >
      <v-layout pt-1 justify-center align-center>

        <v-flex @click="toHome" text-xs-center xs2>
          <v-icon class="grey--text text--darken-1" flat value="market" medium>home</v-icon>
        </v-flex>

        <v-flex @click="messagesDialog = true" text-xs-center xs2>
            <v-badge :color="messagesColor" slot="activator" :overlap="messages > 0" left>
              <span :class="{'white--text' : messages > 0, 'transparentText' : messages === 0}" slot="badge">{{ messages }}</span>
              <v-icon medium>mail</v-icon>
            </v-badge>
          </v-flex>

        <v-flex @click="kalenderWindow = true" text-xs-center xs2>
            <v-badge :overlap="appointments > 0" :color="appointmentColorSmall" left>
              <span class="white--text" slot="badge">{{ appointments }}</span>
              <v-icon class="grey--text text--darken-2" flat value="calendar" medium>today</v-icon>
            </v-badge>
        </v-flex>

        <v-flex @click="requestDialog = true" text-xs-center xs2>
              <v-badge :overlap="pendingRequests > 0" :color="invitesColorSmall" left>
                <span class="white--text" slot="badge">{{ pendingRequests }}</span>
                <v-icon class="grey--text text--darken-2" flat value="requests" medium>person_add</v-icon>
              </v-badge>
        </v-flex>

          <v-flex @click="notificationsDialog = true, zeroNotifications()" text-xs-center xs2>
              <v-badge :overlap="notifications > 0" :color="notificationsColorSmall" left>
                <span class="white--text" slot="badge">{{ notifications }}</span>
                <v-icon class="grey--text text--darken-2" flat value="notifications" medium>notifications</v-icon>
              </v-badge>
          </v-flex>

          <v-flex @click="toProfil" text-xs-center xs2>
              <v-icon class="grey--text text--darken-2" flat value="market" medium>person_outline</v-icon>
          </v-flex>

      </v-layout>
    </v-bottom-nav>


      <div v-if="!userIsAuthenticatedAndIsABusinessAccount && $vuetify.breakpoint.xsOnly" style="position:fixed;bottom:0px;height:56px;z-index:11;width:100vw" class="secondary lighten-1">
      <v-layout row>
        <v-flex text-xs-center xs6>
            <v-btn
            large
            class="secondary--text text--lighten-4 caption ml-4"
            flat
            @click="logInModal = true"
            >
            <v-layout wrap>
                <v-flex xs12>
                  <v-icon>lock</v-icon>
                </v-flex>
                <v-flex xs12>
                  <div>Logga in</div>
                </v-flex>
              </v-layout>
          </v-btn>
        </v-flex>
        <v-flex text-xs-center xs6>
            <v-btn
              large
              class="secondary--text text--lighten-4 caption mr-4"
              flat
              @click="tillHuvudportalen"
            >
              <v-layout wrap>
                <v-flex xs12>
                  <v-icon>work</v-icon>
                </v-flex>
                <v-flex xs12>
                  <div>För jobbsökande</div>
                </v-flex>
              </v-layout>
            </v-btn>
        </v-flex>
      </v-layout>
    </div>

  <!-- Nedan är dialog för kalender -->
  <v-layout row justify-center>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.xsOnly"
      v-model="kalenderWindow"
      max-width="800"
      >
      <v-card>
        <v-layout @click="openBookedMeetings" row wrap>
            <v-card-title class="title">
              Kalender / Bokade möten
              <div class="closeModal">
                <v-icon @click="kalenderWindow = false" large class="secondary--text pointer">close</v-icon>
              </div>
            </v-card-title>
            <v-date-picker
            color="green lighten-2"
            v-model="date"
            full-width
            :landscape="!this.$vuetify.breakpoint.smAndDown"
            class="my-3"
            :events="appointmentsEventsDates"
            event-color="primary"
            ></v-date-picker>
          </v-layout>
          <v-layout class="grey lighten-4" px-3 py-2 row wrap>
            <v-flex xs12>
              <div class="title pb-3">
                Kommande möten: {{ appointments }}
              </div>
            </v-flex>
            <v-flex @click="date = m.acceptedTime.date, bokatMote = true" v-bind:key="index" v-for="(m, index) in comingAppointmentsEvents" xs12 md5>
              <v-layout class="v-card white pointer" mb-1 mr-2 v-if="index <= 3" align-center px-2 py-2 row wrap>
                <v-flex pl-1 xs2>
                  <v-avatar
                      size="30px"
                    >
                    <img :src="m.userCampaign.profilePic" alt="Profilbild">
                  </v-avatar>
                </v-flex>
                <v-flex xs10>
                  <div class="body-2">
                    {{ m.userCampaign.name }}
                  </div>
                  <div class="body-1">
                    {{ m.userCampaign.title }}
                  </div>
                  <div class="body-1">
                    Datum: <span class="body-2 success--text text--darken-2">{{ m.acceptedTime.date }} kl. {{ m.acceptedTime.time }}</span>
                  </div>
                  <div class="body-1">
                    {{ m.type }}
                    <span v-if="m.type === 'Personligt möte'">{{ m.adress }}</span>
                  </div>
                  <div class="body-1">
                      Tel: {{ m.userCampaign.phoneNr }}
                  </div> 
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <v-btn block @click="showAllAppointments = !showAllAppointments" flat small>
                Visa fler
                <v-icon>{{ showAllAppointments ? 'arrow_drop_up' : 'arrow_drop_down' }}</v-icon>
              </v-btn>
              <v-layout row wrap v-show="showAllAppointments">
                <v-flex @click="date = m.acceptedTime.date, bokatMote = true" v-bind:key="index" v-for="(m, index) in comingAppointmentsEvents" xs12 md5>
                  <v-layout v-if="index > 3" class="v-card white pointer" mr-2 mb-1 align-center px-2 py-2 row wrap>
                    <v-flex pl-1 xs2>
                      <v-avatar
                          size="30px"
                        >
                        <img :src="m.userCampaign.profilePic" alt="Profilbild">
                      </v-avatar>
                    </v-flex>
                    <v-flex xs10>
                      <div class="body-2">
                        {{ m.userCampaign.name }}
                      </div>
                      <div class="body-1">
                        {{ m.userCampaign.title }}
                      </div>
                      <div class="body-1">
                        Datum: <span class="body-2 success--text text--darken-2">{{ m.acceptedTime.date }} kl. {{ m.acceptedTime.time }}</span>
                      </div>
                      <div class="body-1">
                        {{ m.type }}
                        <span v-if="m.type === 'Personligt möte'">{{ m.adress }}</span>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>

  <!-- Nedan är för öppnade kalenderdatum -->
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" v-model="bokatMote" width="650" >
      <v-card>
        <v-card-title class="headline primary white--text lighten-2" primary-title>
          {{date}} - Bokade möten:&nbsp;<span class="white--text">{{ bookedMeetingsThisDay.length }}</span>
        <div class="closeModal">
          <v-icon @click="bokatMote = false" large class="white--text">close</v-icon>
        </div>
        </v-card-title>
        <v-card-text class="grey lighten-3">
          <div v-bind:key="index" v-for="(m, index) in bookedMeetingsThisDay">
            <v-card class="my-3 white">
              <v-layout align-center py-2 px-2 row wrap>
                <v-flex md6>
                  <div class="body-1">Namn:&nbsp;<span class="body-2">{{ m.userCampaign.name }}</span></div>
                  <div class="body-1">Mötestyp:&nbsp;<span class="body-2">{{ m.type }}</span></div>
                  <div v-if="m.type === 'Personligt möte'" class="body-1">
                    Adress:&nbsp;
                    <span class="body-2">{{ m.adress }}</span></div>
                  <div class="body-1">Tid:&nbsp;<span class="body-2">{{ m.acceptedTime.time }}</span></div>
                </v-flex>
                <v-flex md6>
                  <div class="body-1">Titel:&nbsp;<span class="body-2">{{ m.userCampaign.title }}</span></div>
                  <div class="body-1">Mobilnummer:&nbsp;<span class="body-2">{{ m.userCampaign.phoneNr }}</span></div>
                  <div class="body-1">Mail:&nbsp;<span class="body-2">{{ m.userCampaign.email }}</span></div>
                </v-flex>
                <v-flex mt-1 xs12>
                  <v-btn @click="m.readMore = !m.readMore" outline block flat small round>Visa mer <v-icon>{{ !m.readMore ? 'arrow_drop_down' : 'arrow_drop_up'}}</v-icon></v-btn>
                </v-flex>
                <v-flex v-show="m.readMore" xs12>
                  <div class="body-2 pt-2">Meddelande:&nbsp;
                    <div class="body-1">{{ m.msg }}</div>
                  </div>
                  <div class="body-2 pt-2">Om tjänsten:&nbsp;
                    <div class="body-1">{{ m.about }}</div>
                  </div>
                  <v-btn flat round @click="userProfileObj = m.userCampaign.profile, showUsersProfile = true" class="success mt-3">Visa profil <v-icon small class="ml-1">person</v-icon></v-btn>
                  <v-btn @click="messageWho = m, messagesDialog = true" flat round class="success mt-3">Skicka meddelande <v-icon small class="ml-2">message</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn block color="primary" flat @click="bokatMote = false">
            Stäng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG FÖR REQUESTS -->
    <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" max-width="700" v-model="requestDialog">
      <v-card class="grey lighten-3 black--text">
        <v-card-title class="justify-center primary lighten-2 white--text">
          <v-layout wrap>
            <v-flex text-xs-center xs12>
              <div class="title">Skickade förfrågningar 
                <v-icon class="ml-1 white--text">person_add</v-icon>
                <span v-show="pendingRequests > 0">({{ pendingRequests }} under behandling)</span></div>
            </v-flex>
          </v-layout>
          <div class="closeModal">
            <v-icon @click="requestDialog = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-flex v-if="isThereAnyAnsweredReq" xs12>
                <v-btn style="margin-top:0px" @click="cleanRequests" v-if="isThereAnyAnsweredReq" round flat small class="mb-3 white--text secondary lighten-2">
                  Rensa färdiga förfrågningar <v-icon small class="white--text ml-2">close</v-icon>
                </v-btn>
            </v-flex>
            <div class="caption mb-1">
              Förfrågningar som har passerat "Svar senast" datumet tas automatiskt bort.
            </div>
          <div v-if="invitesArr === '' || invitesArr.length === 1" class="body-1 px-3 pb-5">
            <v-icon small class="primary--text" medium>info</v-icon>
            Du har inte skickat några förfrågningar.
            Du följer status på alla dina skickade förfrågningar från denna ruta.
            Så vad väntar du på? Se till att skicka iväg några förfrågningar nu!
          </div>
          <!--   HÄR BÖRJAR KORTET PÅ FÖRFRÅGAN   -->
            <v-card style="position:relative" v-bind:key="index" v-for="(inv, index) in invitesArr">
              <v-layout v-if="typeof(inv) !== 'number'" mb-3 justify-center align-center px-2 py-2 row wrap>
                <v-flex mt-1 xs2 sm1>
                  <v-avatar
                    style="margin-top:-7px"
                    size="35"
                    color="grey lighten-4"
                  >
                    <img :src="inv.userCampaign.profilePic" alt="Profilepicture">
                  </v-avatar>
                </v-flex>
                <v-flex :pl-1="$vuetify.breakpoint.smAndDown" :pl-3="$vuetify.breakpoint.mdAndUp" xs6 sm4 md3>
                  <div class="body-2">{{ inv.userCampaign.name }}</div>
                  <div class="body-2">{{ inv.userCampaign.title }}</div>
                  <div class="caption">Svar senast: {{ latestAnswerDate(inv) }}</div>
                </v-flex>
                <v-flex :pl-3="$vuetify.breakpoint.mdAndUp" xs4 sm2 md3>
                  <div v-show="$vuetify.breakpoint.mdAndUp" class="body-2">Status:</div>
                  <div v-if="inv.accepted === 0" class="body-1">Ej besvarad <v-icon class="grey--text text--darken-3" small>close</v-icon></div>
                  <div v-if="inv.accepted === 1" class="body-2">Accepterat <v-icon class="success--text text--darken-1" small>check_circle</v-icon></div>
                  <div v-if="inv.accepted === 2" class="body-1">Vill ha ny tid <v-icon class="success--text text--darken-3" small>access_time</v-icon></div>
                  <div v-if="inv.accepted === 3" class="body-1">Avböjt <v-icon style="font-weight:bold" class="red--text text--darken-3" small>close</v-icon></div>
                  <div class="body-2 grey--text text--darken-2">{{ inv.type }}</div>
                </v-flex>
                <!--  GÖM NEDANSTÅENDE FÖR SMALL SCREENS   -->
                <v-flex xs12 v-if="$vuetify.breakpoint.xsOnly">
                    <v-btn @click="inv.readMore = !inv.readMore" block outline round small>
                      Visa mer
                      <v-icon class="ml-2">{{ !inv.readMore ? 'arrow_drop_down' : 'arrow_drop_up'}}</v-icon>
                    </v-btn>
                </v-flex>
                
                  <v-flex xs12 sm4 :class="{'text-xs-center py-1' : $vuetify.breakpoint.smAndDown}" :pl-3="$vuetify.breakpoint.mdAndUp" v-show="inv.readMore || $vuetify.breakpoint.smAndUp">
                    <div class="body-2">Skickade tider:</div>
                    <div v-bind:key="index" v-for="(x, index) in inv.dates" :class="{'body-1' : inv.acceptedTime.date !== x.date, 'body-2 success--text text--darken-2' : inv.acceptedTime.date === x.date && inv.accepted === 1}">{{ x.date }} kl. {{ x.time }}
                      <v-icon v-if="inv.acceptedTime.date === x.date && inv.accepted === 1" class="success--text" small>check_circle</v-icon>
                    </div>
                  </v-flex>
                <v-flex xs12 v-show="inv.readMore || $vuetify.breakpoint.mdAndUp">
                  <v-flex class="grey lighten-4" v-if="inv.accepted === 1">
                    <div class="body-1 pl-3 py-2">
                      <v-icon class="primary--text" small>info</v-icon>
                      Detta möte finns nu sparad i din kalender som du hittar i menyn.
                    </div>
                  </v-flex>
                  <v-flex class="primary lighten-5" my-2 v-if="(inv.accepted === 2 || inv.accepted === 3) && inv.answerMsg !== 'Meddelande...'" xs12>
                    <div class="body-2 py-2 pl-3 black--text text--darken-3">Meddelande:&nbsp; 
                      <span class="body-1 black--text">{{ inv.answerMsg }}</span></div>
                  </v-flex>
                  <v-layout row>
                    <v-flex v-if="inv.accepted !== 0" :pr-2="$vuetify.breakpoint.smAndDown" :px-3="$vuetify.breakpoint.mdAndUp" :xs6="inv.accepted === 2" :xs12="inv.accepted === 1">
                      <v-btn flat round @click="openInCalendar(inv)" medium v-if="inv.accepted === 1" block class="success lighten-1">Öppna i kalender</v-btn>
                      <v-btn flat round @click="sendNewTimeModal = true, sendNewTimeToWho = inv" medium v-if="inv.accepted === 2" block class="success lighten-1">Skicka ny tid</v-btn>
                    </v-flex>
                    <v-flex v-if="inv.accepted === 2 || inv.accepted === 0" :pl-2="$vuetify.breakpoint.smAndDown && inv.accepted !== 0" :px-1="$vuetify.breakpoint.mdAndUp" xs6 :xs12="inv.accepted === 0">
                      <v-btn @click="userProfileObj = inv.userCampaign.profile, showUsersProfile = true" flat round medium block class="primary lighten-1">Se profil</v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG FÖR Notifikationer -->
    <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" max-width="650" v-model="notificationsDialog">
      <v-card class="grey lighten-3 black--text">
        <v-card-title class="justify-center primary lighten-2 white--text">
          <div class="title">Notifikationer <v-icon class="white--text">notifications</v-icon></div>
          <div class="closeModal">
            <v-icon @click="notificationsDialog = false" class="white--text" large>close</v-icon>
          </div>
        </v-card-title>
          <v-card-text v-bind:key="i" v-for="(x, i) in notificationsArr">
            <div style="margin-top:-12px!important" v-if="x.msg" class="px-1">
              <div class="body-2">{{ x.msg }}</div>
              <div class="body-1 py-1"><v-icon small class="primary--text">access_time</v-icon> {{ notificationTime(x.time) }}</div>
              <v-divider></v-divider>
            </div>
          </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG FÖR Meddelanden -->
    <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" max-width="900" v-model="messagesDialog">
      <v-card class="grey lighten-3 secondary--text">
        <v-card-title class="justify-center primary lighten-2 white--text">
          <div class="title">Meddelanden <v-icon class="orange--text text--lighten-3">messages</v-icon></div>
          <div class="closeModal">
            <v-icon @click="messagesDialog = false" large class="white--text pointer">close</v-icon>
          </div>
        </v-card-title>
          <v-layout style="min-height:300px" row>
            <v-flex style="border-right:1px solid black;position:relative" xs12 md4>
              <div class="grey lighten-2 title px-3 py-3">
                Dina kontakter
                <v-tooltip style="position:absolute;right:8px;top:17px;cursor:help" bottom>
                  <v-icon slot="activator" class="primary--text">help</v-icon>
                  <span>En kontakt skapas automatiskt med den du har bokat möte med.</span>
                </v-tooltip>
              </div>
              <div @click="messagePerson(x, 1), messageWho = x, openSmallMsg = true" :class="{'grey lighten-3' : index % 2 === 0 && !x.readMore, 'white' : index % 2 !== 0 && !x.readMore, 'primary lighten-5' : x.readMore }" v-bind:key="index" v-for="(x, index) in uniqueAppointmentsEvents">
                <div @click="scrollToBottomMsg" style="cursor:pointer" class="py-2 pl-3">
                  <v-avatar
                    :size="25"
                    color="grey lighten-4"
                  >
                    <img :src="x.userCampaign.profilePic" alt="Profilbild">
                  </v-avatar>
                <v-badge :color="badgeColorMsg(x)" right>
                <span :class="{'white--text' : badgeColorTextMsg(x), 'transparentText' : !badgeColorTextMsg(x)}" overlap slot="badge">{{ isThereAnyNewMsg(x) }}</span>
                <span style="margin-top:-10px" :class="{'pl-2 body-1' : !x.readMore, 'pl-2 body-2' : x.readMore}">{{ x.userCampaign.name }}</span>
                </v-badge>
                </div>
                <v-divider></v-divider>
              </div>
            </v-flex>
            <v-flex v-if="$vuetify.breakpoint.mdAndUp" style="position:relative;border:2px solid white" px-4 py-3 xs12 md8>
              <div v-if="messageWho !== ''" style="font-weight:bold" class="subheading primary--text">{{ messageWho.userCampaign.name }}</div>
              <div id="messageContainer" style="overflow-y:auto;max-height:400px;margin-bottom:70px">
              <v-layout mt-1 v-bind:key="index" v-for="(x, index) in currentMessageArr.msg" :justify-end="x.from === 'business'" :justify-start="x.from === 'applicant'">
                <v-flex mr-2 xs6>
                  <div :class="{'body-1 primary lighten-4 px-2 py-2' : x.from === 'business', 'body-1 white px-2 py-2' : x.from === 'applicant'}" style="border-radius:10%">
                    {{ x.msg }}
                  </div>
                </v-flex>
              </v-layout>
              </div>
              <div>
                <div style="position:absolute;bottom:0px;left:5px" class="writeMessage">
                  <v-text-field
                    color="primary"
                    placeholder="Skriv ditt meddelande..."
                    v-model="theMessage"
                  >
                  </v-text-field>
                </div>
                <div>
                  <v-tooltip style="position:absolute;bottom:10px;right:55px" bottom>
                    <v-btn @click="sendMessage" slot="activator" small flat fab><v-icon medium class="primary--text">send</v-icon></v-btn>
                    <span>Skicka meddelande</span>
                  </v-tooltip>
                </div>
              </div>
            </v-flex>
          </v-layout>
      </v-card>
    </v-dialog>

  <!-- Skriva meddelanden för small screens  -->
  <div v-if="$vuetify.breakpoint.smAndDown">
    <v-dialog fullscreen v-model="openSmallMsg">
      <v-card class="mainBackgroundLight" style="position:relative">
        <v-layout>
           <v-flex px-2 py-3 xs12>
              <v-card-title class="white justify-center">
                <div v-if="messageWho !== ''" style="font-weight:bold" class="subheading primary--text">{{ messageWho.userCampaign.name }}</div>
                <div class="closeModal">
                  <v-btn @click="openSmallMsg = false" fab small flat>
                    <v-icon class="primary--text text--darken-2" x-large>close</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <div id="messageContainer" style="overflow-y:auto;max-height:400px;margin-bottom:70px">
              <v-layout mt-1 v-bind:key="index" v-for="(x, index) in currentMessageArr.msg" :justify-end="x.from === 'business'" :justify-start="x.from === 'applicant'">
                <v-flex mr-2 xs6>
                  <div :class="{'body-1 primary lighten-4 px-2 py-2' : x.from === 'business', 'body-1 success lighten-4 px-2 py-2' : x.from === 'applicant'}" style="border-radius:10%">
                    {{ x.msg }}
                  </div>
                </v-flex>
              </v-layout>
              </div>
              <div>
                <div style="position:absolute;bottom:0px;left:5px" class="writeMessage">
                  <v-text-field
                    color="primary"
                    placeholder="Skriv ditt meddelande..."
                    v-model="theMessage"
                  >
                  </v-text-field>
                </div>
                <div>
                  <v-tooltip style="position:absolute;bottom:15px;right:25px" bottom>
                    <v-btn @click="sendMessage" slot="activator" small flat fab><v-icon medium class="primary--text">send</v-icon></v-btn>
                    <span>Skicka meddelande</span>
                  </v-tooltip>
                </div>
              </div>
            </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>

  <!--  DIALOG FÖR ATT SKICKA NY TID  -->
  <v-dialog max-width="650" v-model="sendNewTimeModal">
    <v-card>
      <v-card-title class="primary lighten-3 justify-center">
        <div class="title white--text">
          Skicka ny tid <v-icon class="white--text">access_time</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
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
            <div style="border-radius:10px" v-bind:key="index" v-for="(x, index) in invitationDateObj" class="v-card success lighten-4 my-2 text-xs-center px-2 py-2">
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
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn flat round class="secondary" block @click="sendNewTimeModal = false">Avbryt</v-btn>
        <v-btn flat round :loading="sendNewTimeLoading" @click="sendNewTime(), sendNewTimeLoading = true" class="success" block>Skicka ny tid</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- NEW TIME WAS SENT MODAL -->
  <v-dialog max-width="400" v-model="sendNewTimeWasSuccesful">
    <v-card>
      <v-card-title class="primary lighten-3 justify-center">
        <div class="title white--text">
          Dina nya tider har skickats <v-icon class="white--text">check_circle</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="body-1">
          Användaren har blivit notifierad och du följer responsen i "requests".
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn round @click="sendNewTimeWasSuccesful = false" block outline class="secondary">Tack!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <!-- DIALOG för FÖRHANDSGRANSKNING AV PROFIL INLOGGAD -->
            <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" v-model="showUsersProfile" width="950">
              <v-card v-if="userProfileObj !== ''">
                 <v-flex :px-2="$vuetify.breakpoint.mdAndUp" :py-2="$vuetify.breakpoint.mdAndUp" class="grey lighten-3" xs12>
                    <v-card>
                      <v-layout v-show="$vuetify.breakpoint.mdAndUp" row>
                      <v-flex xs12>
                        <v-img height="180px" width="100%" :src="userProfileObj.backgroundImg.i">
                        </v-img>
                        <div class="closeModal">
                          <v-btn flat fab small class="secondary">
                            <v-icon @click="showUsersProfile = false" large class="white--text">close</v-icon>
                          </v-btn>
                        </div>
                      </v-flex>
                      </v-layout>
                      <v-layout :py-2="$vuetify.breakpoint.smAndUp" row wrap>
                        <v-flex pl-1 v-show="$vuetify.breakpoint.mdAndUp" xs2>
                            <v-img
                              style="border:3px solid lightgray;margin-top:-50px;border-radius:10px"
                              width="135px"
                              contain
                              :src="userProfileObj.profilePic.i"
                            ></v-img>
                        </v-flex>
                        <v-flex style="position:relative" v-show="$vuetify.breakpoint.smAndDown" xs12>
                          <div class="closeModal">
                            <v-btn @click="showUsersProfile = false" small fab flat style="z-index:20" class="secondary">
                              <v-icon medium class="white--text">close</v-icon>
                            </v-btn>
                          </div>
                          <v-img
                            width="100%"
                            height="100px"
                            :src="userProfileObj.backgroundImg.i"
                          ></v-img>
                            <img
                              style="border:3px solid lightgray;margin-top:0px;position:absolute;bottom:-6px;left:16px;border-radius:10px"
                              :src="userProfileObj.profilePic.i"
                              height="100px"
                            >
                        </v-flex>
                      <v-flex pl-2 md9 xs12 :pr-2="$vuetify.breakpoint.mdAndDown">
                      <div class="text-xs-left display-1 pt-3" style="font-weight:bold">
                        {{ userProfileObj.fullName }}
                      </div>
                        <div v-if="userProfileObj.title !== 'Skriv in din titel / titlar.' && userProfileObj.title !== ''" class="teal--text body-2 py-1">{{ userProfileObj.title }}</div>

                        <div v-if="userProfileObj.description !== 'Beskriv med 1 till 2 meningar vad du gör för något och vad för typ av tjänster du söker.' && userProfileObj.description !== ''" class="body-1">{{ userProfileObj.description }}</div>

                        <div v-if="userProfileObj.externLink.includes('http')" class="body-2 pt-1" style="margin-bottom:-7px">
                          <a target="_blank" :href="userProfileObj.externLink">{{ userProfileObj.externLink }}</a>
                        </div>

                      <div class="pt-2 mb-2">
                        <v-chip small v-bind:key="x" v-for="x in userProfileObj.competences" label color="success" text-color="white">
                          <v-icon small class="pr-1">label</v-icon>{{ x }}
                        </v-chip>
                      </div>
                      </v-flex>
                      </v-layout>
                      </v-card>

                      <v-card class="mt-2">
                        <v-layout py-2 px-3 row wrap>
                          <v-flex :pr-5="$vuetify.breakpoint.mdAndUp" md8 xs12>
                            <div class="title py-2 black--text"><v-icon class="black--text">work</v-icon> Erfarenhet</div>
                            <v-divider class="teal mt-1"></v-divider>
                            <v-layout py-3 row wrap>
                              <v-flex v-bind:key="exp.id" v-for="exp in userProfileObj.experience" style="position:relative" class="mb-3" xs12>
                                <div style="font-weight:bold" class="subheading grey--text">
                                  {{ exp.businessName }}
                                </div>
                              
                                <div class="subheading black--text" style="font-weight:bold">
                                  {{ exp.workTitle }}
                                </div>
                                <div class="grey--text py-1">
                                  <v-icon small>calendar_today</v-icon> <span>{{ exp.workPeriod }}</span>
                                </div>
                                <div v-bind:key="i" v-for="(x, i) in exp.descriptionArr">
                                  <p v-if="exp.description.length > 1" style="margin-bottom:-10px" :class="{'body-1' : true, 'pb-2' : !exp.competences.length > 0, 'pb-3' : exp.descriptionArr.length > 1 && i !== exp.descriptionArr.length - 1}">
                                    {{ x }}
                                  </p>
                                </div>
                                <div v-if="exp.competences.length > 0" class="pt-3 mb-2">
                                  <v-chip small v-bind:key="x" v-for="x in exp.competences" label color="success" text-color="white">
                                    <v-icon small class="pr-1">label</v-icon>{{ x }}
                                  </v-chip>
                                </div>
                                <v-divider :class="{'mt-2' : !exp.competences.length > 0}"></v-divider>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                
                        <!-- Utbildning -->
                          <v-flex md4 xs12>
                            <div class="title py-2 black--text"><v-icon class="black--text">school</v-icon> Utbildning</div>
                            <v-divider class="teal mt-1"></v-divider>
                            <v-layout py-3 row wrap>
                              <v-flex style="position:relative" class="mb-3" v-bind:key="school.id" v-for="school in userProfileObj.education" xs12>
                                <div style="font-weight:bold" class="body-2 grey--text">
                                  {{ school.schoolName }}
                                </div>
                                <div class="subheading black--text" style="font-weight:bold">
                                  {{ school.subject }}
                                </div>
                                <div class="grey--text py-1">
                                  <v-icon small>calendar_today</v-icon> <span>{{ school.eduPeriod }}</span>
                                </div>
                                <div class="pt-1 mb-2">
                                  <v-chip small v-bind:key="x" v-for="x in school.competences" label color="success" text-color="white">
                                    <v-icon small class="pr-1">label</v-icon>{{ x }}
                                  </v-chip>
                                </div>
                                <v-divider></v-divider>
                              </v-flex>
                            </v-layout>
                          </v-flex>

                        </v-layout>
                      </v-card>

                    </v-flex>
              </v-card>
            </v-dialog>

          <!--  LOGGA IN MODAL  -->
            <v-dialog max-width="500" v-model="logInModal">
              <v-card>
                <v-layout wrap>
                  <v-flex text-xs-center xs12>
                      <div v-if="wrongCredentialsMsg !== null">
                        <v-alert style="width:100%" type="error" v-model="wrongCredentials">{{ wrongCredentialsMsg }}</v-alert>
                      </div>
                      <v-card-title class="justify-center pt-4">
                          <div style="font-weight:bold" class="myDisplay-1">Logga in</div>
                          <div class="closeModal">
                            <v-icon @click="logInModal = false" large>close</v-icon>
                          </div>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <form>
                            <v-layout row>
                              <v-flex xs12>
                                <v-text-field 
                                  name="email" 
                                  label="Mail" 
                                  id="mail"
                                  v-model="email"
                                  type="email"
                                  append-icon="mail"
                                  outline></v-text-field>
                              </v-flex>
                            </v-layout>
                            <v-layout row>
                              <v-flex xs12>
                                <v-text-field 
                                  name="password" 
                                  label="Lösenord" 
                                  id="password"
                                  v-model="password"
                                  type="password"
                                  append-icon="vpn_key"
                                  outline></v-text-field>
                              </v-flex>
                            </v-layout>
                          </form>
                        </v-container>
                      </v-card-text>
                      <v-card-actions style="margin-top:-30px" class="mx-3">
                        <v-btn round flat large :loading="loadingLogin" :disabled="!loggaInDisabled" type="submit" @click="onLogin" block class="success">Logga in</v-btn>
                      </v-card-actions>
                      <v-card-text>
                        <v-divider style="margin-top:-15px"></v-divider>
                        <div @click="forgotPasswordModel = true" class="body-2 primary--text pt-3" style="cursor:pointer">Har du glömt ditt lösenord?</div>
                        <v-btn @click="signUpDialog = true" flat class="primary mt-3" round><v-icon class="mr-2" medium>work</v-icon> Skapa nytt konto</v-btn>
                      </v-card-text>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-dialog>

    <!-- SIGNUP DIALOG -->
    <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" width="500" v-model="signUpDialog">
      <div style="margin-bottom:-5px" v-if="wrongSignUp">
        <v-alert style="width:100%" type="error" v-model="wrongSignUp">{{ wrongSignUpMsg }}</v-alert>
      </div>
      <div class="title white py-4 text-xs-center">Skapa företagskonto</div>
      <div style="position:relative">
        <div class="secondary--text" style="z-index:5;position:absolute;right:10px;top:-65px">
          <v-icon @click="signUpDialog = false" large>close</v-icon>
        </div>
      </div>
      <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Företagets uppgifter</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">Personligt</v-stepper-step>

          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">

                <v-container class="pt-3 pb-4">

                  <form>
                    <v-layout row wrap>
                      <div class="body-2 pb-2">
                        Om ditt företag redan är registerat så skapas du som ny användare i det företaget, förutsatt
                        <v-tooltip bottom>
                          <a slot="activator" href="https://sv.wikipedia.org/wiki/Momsregistreringsnummer" target="_blank">
                            <span class="pointer orange--text text--darken-3">att VAT-ID är rätt.
                            <v-icon class="orange--text text--darken-3" small>info</v-icon></span>
                          </a>
                          <span>https://sv.wikipedia.org/wiki/Momsregistreringsnummer</span>
                        </v-tooltip>
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

              <v-btn
                class="primary lighten-1"
                @click="e1 = 2"
                block
                :disabled="!firstStepSignUpBtn"
                round
                flat
                >
                Nästa
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
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

                      <v-layout wrap row>
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
                          <v-flex xs12>
                            <div class="body-2" style="margin-top:10px;margin-bottom:-15px">
                              <a target="_blank" href="https://info.jobflix.se/userterms">Allmäna villkor</a>
                            </div>
                            <v-checkbox
                              label="Jag godkänner de allmäna villkoren"
                              v-model="gdrpAccept"
                            ></v-checkbox>
                          </v-flex>
                      </v-layout>
                    </form>
                </v-container>

              <v-btn
                class="success lighten-1"
                @click="onSignUp"
                block
                :disabled="!registerNewAccBtn"
                :loading="loading"
                round
                flat
                >
                Registrera
              </v-btn>

              <v-btn @click="e1 = 1" block flat> <v-icon>arrow_back</v-icon>  Tillbaka</v-btn>
            </v-stepper-content>

          </v-stepper-items>
        </v-stepper>
      </v-dialog>

      <v-dialog v-model="welcomeModal" max-width="600">
        <v-card>
          <v-card-title class="primary lighten-3 justify-center">
            <div style="font-weight:bold" class="display-1 white--text">
              Välkommen till Jobflix!
            </div>
          </v-card-title>
          <v-card-text>
            <p>
              Ta dig en titt runt portalen för att få en snabb överblick.
              Redigera gärna i er profil med rätt kontaktuppgifter innan du börjar skicka mötesförfrågningar. Se även
              till att det finns en företagsbeskrivning i profilen.
            </p>
            <p>
              När du känner dig redo så är det bara att gå in på marknaden och börja kolla på videopresentationer.
              Ni kan även skapa bevakningar och annonsera ut lediga tjänster.
              Du kommer bli notifierad via mail när du fått svar.
            </p>
            <p>
              Ni har <strong>Platinum helt kostnadsfritt</strong> fram till
              <strong class="success--text">
                {{ new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().substr(0, 10).replace('T', ' ') }}
              </strong>.
              Efter det så får ni själva avgöra om ni vill uppgradera erat paket, annars går ni per automatik
              ner på gratispaket. Läs mer under sidan "Prisplaner".
            </p>
            <p>
              Vi bjuder alltid på Platinum <strong>helt kostnadsfritt</strong> så länge den 
              totala nivån av aktiva videopresentationer underskrider 100 stycken. Lycka till! :)
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="welcomeModal = false" block round flat class="success title lighten-1">OK!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- INVITATION SUCCESSFULLY SENT MODAL -->
      <v-dialog v-model="invitationWasSuccessfullySent" max-width="400">
        <v-card>
          <v-card-title class="success lighten-2 justify-center">
            <div class="title white--text">Din förfrågan har skickats <v-icon class="white--text">check_circle</v-icon></div>
          </v-card-title>
          <v-card-text>
            <div class="body-1">
              Din förfrågan har nu skickats och användaren har blivit notifierad.
              Du kan se och hantera alla dina förfrågningar i "requests" som du hittar i menyn.
              Du kommer bli notifierad så fort användaren har besvarat din förfrågan.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn round @click="invitationWasSuccessfullySent = false" block outline flat>Okej, tack!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card style="position:fixed;top:50px;left:5px;z-index:30" v-if="sendingInvitation">
        <v-card-title class="primary lighten-3 justify-center white--text">
          <div class="body-2">Skickar din förfrågan...</div>
        </v-card-title>
        <v-card-actions>
          <v-btn :loading="sendingInvitation" flat block></v-btn>
        </v-card-actions>
      </v-card>

    <!--  PAKET BASIC BEGRÄSNING  -->
      <v-dialog max-width="500" v-model="basicPacketModal">
        <v-card>
          <v-card-title class="justify-center primary lighten-3">
            <div class="white--text title">
              Ni behöver uppgradera eran prisplan
            </div>
          </v-card-title>
          <v-card-text>
            <div class="subheading">
              Det går tyvärr inte att skicka förfrågningar eller annonsera med paket Basic. Ni måste uppgradera till antingen
              Guld eller Platinum.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="basicPacketModal = false" to="/prisplaner" round class="success lighten-1" flat block>Till prisplaner</v-btn>
            <v-btn @click="basicPacketModal = false" round class="secondary lighten-1" flat block>Stäng!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--  PAKET GOLD BEGRÄSNING  -->
      <v-dialog max-width="500" v-model="goldPacketModal">
        <v-card>
          <v-card-title class="justify-center primary lighten-3">
            <div class="white--text title">
              Ni har överskridit nivån för guldpaketet
            </div>
          </v-card-title>
          <v-card-text>
            <div class="subheading">
              <p>
                Ni kan endast skicka upp till 20 förfrågningar och skapa 5 annonser / fakturaperiod med GOLD.
              </p>
              <p>
                Uppgradera till Platinum för att få obegränsat med förfrågningar &amp; annonsering.
              </p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="goldPacketModal = false" to="/prisplaner" round class="success lighten-1" flat block>Till prisplaner</v-btn>
            <v-btn @click="goldPacketModal = false" round class="secondary lighten-1" flat block>Stäng!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


  </div>
  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      gdrpAccept: false,
      menuItems: [
        { icon: 'home', text: 'Marknaden', tooltip: 'Marknaden', badge: 0, badgeColor: 'inherit' },
        { icon: 'message', text: 'Meddelanden', tooltip: 'Meddelanden', badge: 2, badgeColor: 'green' },
        { icon: 'today', text: 'Kalender', tooltip: 'Kalender', badge: 3, badgeColor: 'green' },
        { icon: 'person_add', text: 'Förfrågningar', tooltip: 'Hantera förfrågningar', badge: 10, badgeColor: 'blue' },
        { icon: 'notifications_none', text: 'Notifikationer', tooltip: 'Händelser', badge: 6, badgeColor: 'red' },
        { icon: 'person_outline', text: 'Profil', tooltip: 'Profil', badge: 0, badgeColor: 'inherit' }
      ],
      loadTheSite: false,
      date: '',
      rightDrawer: false,
      title: 'JOBFLIX',
      messages: 0,
      appointmentsEventsDates: [],
      appointmentsEvents: [],
      appointments: 0,
      bookedMeetingsThisDay: [],
      savedProfiles: 0,
      invitesArr: '',
      notifications: 0,
      notificationsArr: [],
      logInAlert: false,
      userIsAuthenticatedAndIsABusinessAccount: false,
      bokatMote: false,
      kalenderWindow: false,
      requestDialog: false,
      notificationsDialog: false,
      messagesDialog: false,
      theMessage: '',
      messageWho: '',
      realMessagesArr: '',
      currentMessageArr: '',
      openSmallMsg: false,
      sendNewTimeModal: false,
      sendNewTimeToWho: '',
      selectDates: ['07.00', '07.15', '07.30', '07.45', '08.00', '08.15', '08.30', '08.45', '09.00', '09.15', '09.30', '09.45', '10.00', '10.15', '10.30', '10.45', '11.00', '11.15', '11.30', '12.00', '12.15', '12.30', '12.45', '13.00', '13.15', '13.30', '13.45', '14.00', '14.15', '14.30', '14.45', '15.00', '15.15', '15.30', '15.45', '16.00', '16.15', '16.30', '16.45', '17.00', '17.15', '17.30', '17.45', '18.00', '18.15', '18.30', '18.45', '19.00', '19.15', '19.30', '19.45', '20.00', '20.15', '20.30', '20.45', '21.00'],
      invitationDate: [],
      sendNewTimeLoading: false,
      sendNewTimeWasSuccesful: false,
      isLoadFirebaseDataActive: 0,
      // Logga in data
      email: '',
      password: '',
      // Slut på logga in data
      // Sign up data
      confirmPassword: '',
      passwordSignUp: '',
      mailSignUp: '',
      fullname: '',
      employersNr: '',
      orgNr: '',
      businessName: '',
      e1: 0,
      // Slut på sign up data
      forgotPasswordModel: false,
      lostPasswordEmail: '',
      lookForInbox: false,
      showAllAppointments: false,
      count: 0,
      welcomeModalCount: 0
    }
  },
  watch: {
    welcomeModal: function () {
      if (this.welcomeModal === false && this.welcomeModalCount === 1) {
        this.welcomeModalFalseForever()
      }
      this.welcomeModalCount++
    },
    invitesArr: function () {
      if (this.invitesArr.length > 1 || Object.keys(this.invitesArr).length > 1) {
        var daysToAdd
        var newRequests = { 0: '0' }
        var passedReqFound = 0
        for (var i in this.invitesArr) {
          switch (this.invitesArr[i].deadline) {
            case '5 dagar':
              daysToAdd = 5
              break
            case '1 vecka':
              daysToAdd = 7
              break
            case '2 veckor':
              daysToAdd = 14
              break
            case '3 veckor':
              daysToAdd = 21
              break
            case '1 månad':
              daysToAdd = 31
              break
            case '2 månader':
              daysToAdd = 60
              break
            case '3 månader':
              daysToAdd = 90
              break
            case '6 månader':
              daysToAdd = 180
              break
          }
          // Använd bara time för att göra beräkningar o se om den är outdated
          var time = new Date(this.invitesArr[i].dateAndTimeAtSend).setDate((new Date(this.invitesArr[i].dateAndTimeAtSend).getDate() + daysToAdd))
          if (time < new Date().getTime()) {
            passedReqFound = 1
          } else {
            if (this.invitesArr[i].hasOwnProperty('dbKey')) {
              newRequests[this.invitesArr[i].dbKey] = this.invitesArr[i]
            } else {
              newRequests[i] = this.invitesArr[i]
            }
          }
        }
        if (passedReqFound === 1) {
          firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/')
            .update({requests: newRequests})
        }
      }
    },
    userIsNotLoggedIn: function () {
      if (!this.$store.state.userIsNotLoggedIn) {
        this.loadTheSite = false
      } else {
        this.loadTheSite = true
      }
    },
    userIsAuthenticated: function () {
      if (this.userIsAuthenticated === true) {
        this.updateCorpInfo()
      }
    },
    sendNewTimeModal: function () {
      if (this.sendNewTimeModal === false) {
        this.invitationDate = []
      }
    },
    currentMessageArr: function () {
      this.scrollToBottomMsg()
    },
    realMessagesArr: function () {
      if (this.messageWho !== '') {
        this.messagePerson(this.messageWho, 0)
      }
    },
    date: function () {
      this.bookedMeetingsThisDay = []
      this.appointmentsEvents.forEach(val => {
        if (val.acceptedTime.date === this.date) {
          this.bookedMeetingsThisDay.push(val)
        }
      })
    },
    kalenderWindow: function () {
      if (this.kalenderWindow === true) {
        this.date = new Date().toISOString().substr(0, 10)
      }
    },
    logInAlert: function () {
      if (this.logInAlert === false) {
        this.onLogout()
      }
    },
    yourDatabaseString: function () {
      this.loadFirebaseData()
    },
    messagesDialog: function () {
      if (this.messagesDialog === true) {
        this.scrollToBottomMsg()
      }
    },
    watchAppointmentsObject: function () {
      this.deleteOldAppointments()
    }
  },
  methods: {
    test () {
      console.log(this.$store.getters.freePlan)
    },
    deleteOldAppointments () {
      let newObj = {'xx': 0}
      let foundOldAppointments = 0
      for (let i in this.appointmentsEvents) {
        var date = this.appointmentsEvents[i].acceptedTime.date.replace(/-/g, '/')
        if (new Date(date).getTime() > new Date().setDate((new Date().getDate() - 40))) {
          newObj[i] = this.appointmentsEvents[i]
        } else {
          foundOldAppointments = 1
        }
      }
      if (foundOldAppointments === 1) {
        firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/')
          .update({appointments: newObj})
      }
    },
    notificationTime (time) {
      if (time.substr(0, 10).replace(/-/g, '') === new Date().toISOString().substr(0, 10).replace(/-/g, '') && time.substr(11, 2) === new Date().toISOString().substr(11, 2)) {
        return 'Alldeles nyss'
      } else if (time.substr(0, 10).replace(/-/g, '') === new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
        return 'idag'
      } else {
        return time
      }
    },
    tillHuvudportalen () {
      window.location = 'https://www.jobflix.se/'
    },
    welcomeModalFalseForever () {
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/')
        .update({welcomeModal: false})
      // Notifiera new user till admin notifications och maila
      let adminNotification = {
        businessUser: this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName,
        corp: this.$store.state.corpObject.businessName,
        emailTo: this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email,
        id: new Date().getTime() + 'su',
        msg: 'Företagsanvändare har signat upp ett konto precis',
        notificationTo: 'Business',
        time: new Date().toISOString().substr(0, 19).replace('T', ' ')
      }
      firebase.database().ref('admin').child('notifications')
        .push(adminNotification)
    },
    sendNewPassword () {
      firebase.auth().sendPasswordResetEmail(this.lostPasswordEmail)
      .then(function () {
        this.forgotPasswordModel = false
        this.lookForInbox = true
      })
      .catch(err => {
        console.log(err)
      })
    },
    onSignUp () {
      this.$store.dispatch('signUserUp', {email: this.mailSignUp, password: this.passwordSignUp, businessName: this.businessName, orgNr: this.orgNr, employersNr: this.employersNr, userName: this.fullname})
    },
    onLogin () {
      // Vuex
      this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
    },
    latestAnswerDate (req) {
      // Gör om denna att räkna från dagens req skickades, inte från new Date() 'alltså idag. Knas ...
      var daysToAdd
      switch (req.deadline) {
        case '5 dagar':
          daysToAdd = 5
          break
        case '1 vecka':
          daysToAdd = 7
          break
        case '2 veckor':
          daysToAdd = 14
          break
        case '3 veckor':
          daysToAdd = 21
          break
        case '1 månad':
          daysToAdd = 31
          break
        case '2 månader':
          daysToAdd = 60
          break
        case '3 månader':
          daysToAdd = 90
          break
        case '6 månader':
          daysToAdd = 180
          break
      }
      // Använd bara time för att göra beräkningar o se om den är outdated
      var time = new Date(req.dateAndTimeAtSend).setDate((new Date(req.dateAndTimeAtSend).getDate() + daysToAdd))
      // Gör om till läsbar string
      return new Date(time).toString().split(' ').splice(1, 3).join(' ')
    },
    businessInfoWasModifiedFunction () {
      var arr = [false]
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/')
        .update({businessInfoWasModified: arr})
    },
    newUserWasAddedFunction () {
      var arr = [false]
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/')
        .update({newUserWasAdded: arr})
    },
    sendNewTime () {
      this.$store.state.sendingInvitation = true
      this.sendNewTimeToWho.dates = this.invitationDateObj
      this.sendNewTimeToWho.accepted = 0
      const global = this
      firebase.database().ref('applicants').child(global.sendNewTimeToWho.userCampaign.applicantDBId + '/profileInfo/events/requests')
        .push(global.sendNewTimeToWho)
        .then(res => {
          global.$store.state.sendingInvitation = false
          global.sendNewTimeLoading = false
          global.sendNewTimeModal = false
          global.sendNewTimeWasSuccesful = true
        })
      // Uppdatera i business- side
      firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/events/requests/')
        .update({[global.sendNewTimeToWho.dbKey]: global.sendNewTimeToWho})
      // TILLFÄLLIG LÖSNING SOM SKICKAR NOTIFIKATION TILL ADMIN START **************
      let adminNotification = {
        notificationTo: 'Privatperson',
        name: global.sendNewTimeToWho.userCampaign.name,
        mail: global.sendNewTimeToWho.userCampaign.email,
        kampanj: global.sendNewTimeToWho.userCampaign.campaignName,
        msg: 'Privatperson har fått en ny tid!',
        time: new Date().toISOString().substr(0, 19).replace('T', ' '),
        id: new Date().getTime() + 'aa'
      }
      firebase.database().ref('admin').child('notifications')
        .push(adminNotification)
      // TILLFÄLLIG LÖSNING SOM SKICKAR NOTIFIKATION TILL ADMIN SLUT **************
    },
    badgeColorMsg (x) {
      let result = 'transparent'
      if (Object.keys(this.realMessagesArr).length > 1) {
        for (var i in this.realMessagesArr) {
          if (this.realMessagesArr[i].applicantUserId === x.userCampaign.userId) {
            this.realMessagesArr[i].newMessageForBusiness > 0 ? result = 'primary' : result = 'transparent'
          }
        }
      }
      return result
    },
    badgeColorTextMsg (x) {
      for (var i in this.realMessagesArr) {
        if (this.realMessagesArr[i].applicantUserId === x.userCampaign.userId) {
          return this.realMessagesArr[i].newMessageForBusiness > 0
        }
      }
    },
    isThereAnyNewMsg (x) {
      var value = 0
      for (var i in this.realMessagesArr) {
        if (this.realMessagesArr[i].applicantUserId === x.userCampaign.userId) {
          value = this.realMessagesArr[i].newMessageForBusiness
        }
      }
      return value
    },
    sendMessage () {
      var applicantUser
      if (this.messageWho !== '') {
        applicantUser = this.messageWho.userCampaign.userId
      }
      var conversionExists = 0
      var theConversionId
      var global = this
      var newMsgApplicantNotification
      if (applicantUser !== undefined && this.theMessage.length > 0) {
        // Ny message obj
        var newMessageObj = {
          newMessageForBusiness: 0,
          newMessageForApplicant: 1,
          businessUserId: this.$store.state.user.id,
          applicantUserId: applicantUser,
          businessDBId: this.$store.state.yourDatabaseString,
          businessUserDBId: this.$store.state.theUserDBId,
          applicantDBId: this.messageWho.userCampaign.applicantDBId,
          msg: [{
            msg: this.theMessage,
            from: 'business'
          }]
        }
        // Denna dunkar vi upp i existing surr
        var pushExisting = {
          from: 'business',
          msg: this.theMessage
        }
        // AdminNotification
        let adminNotification = {
          name: this.messageWho.userCampaign.name,
          mail: this.messageWho.userCampaign.email,
          msg: 'Du har fått ett nytt meddelande, logga in för att se meddelandet.',
          notificationTo: 'Privatperson',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'bb'
        }
        // Kolla om konversationen finns eller om det ska läggas upp en ny + Lägg upp för business Sidan
        firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/messages')
        .once('value', response => {
          const res = response.val()
          for (var i in res) {
            if (res[i].applicantUserId === applicantUser) {
              conversionExists = 1
              theConversionId = i
              break
            }
          }
          if (conversionExists === 1) {
            firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/events/messages/' + theConversionId + '/msg')
              .push(pushExisting)
          } else {
            firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/events/messages')
              .push(newMessageObj)
          }
          // Dunka upp till applicantens messages
          var applicantsDBMessageId
          firebase.database().ref('applicants').child(global.messageWho.userCampaign.applicantDBId)
          .once('value', res => {
            const response = res.val()
            // Om konversen existerar
            if (conversionExists === 1) {
              for (var ii in response.profileInfo.events.messages) {
                if (response.profileInfo.events.messages[ii].businessUserId === global.$store.state.user.id) {
                  applicantsDBMessageId = ii
                  newMsgApplicantNotification = response.profileInfo.events.messages[ii].newMessageForApplicant
                  firebase.database().ref('applicants').child(global.messageWho.userCampaign.applicantDBId + '/profileInfo/events/messages/' + applicantsDBMessageId + '/msg')
                    .push(pushExisting)
                  newMsgApplicantNotification = (newMsgApplicantNotification + 1)
                  firebase.database().ref('applicants').child(global.messageWho.userCampaign.applicantDBId + '/profileInfo/events/messages/' + applicantsDBMessageId)
                    .update({newMessageForApplicant: newMsgApplicantNotification})
                }
              }
            } else {
              // Surret är nytt och måste dunkas upp även hos applicanten
              firebase.database().ref('applicants').child(global.messageWho.userCampaign.applicantDBId + '/profileInfo/events/messages')
                .push(newMessageObj)
            }
            // Dunka upp till admin notifikationer
            firebase.database().ref('admin').child('notifications')
              .push(adminNotification)
          })
          .catch(function (error) {
            console.log(error.message)
          })
        })
          .catch(function (error) {
            console.log(error.message)
          })
        // Nollställ theMessage
        this.theMessage = ''
      } else {
        alert('Du måste välja en användare som du ska meddela till först')
      }
    },
    scrollToBottomMsg () {
      var global = this
      setTimeout(function () {
        var container = global.$el.querySelector('#messageContainer')
        container.scrollTop = container.scrollHeight
      }, 100)
    },
    messagePerson (x, nr) {
      var found = 0
      this.appointmentsEvents.forEach(val => {
        if (val.id === x.id) {
          val.readMore = true
        } else {
          val.readMore = false
        }
      })
      for (var i in this.realMessagesArr) {
        if (this.realMessagesArr[i].applicantUserId === x.userCampaign.userId) {
          this.currentMessageArr = this.realMessagesArr[i]
          found = 1
        }
      }
      if (found === 0) {
        this.currentMessageArr = ''
      }
      // Nollställ msg notifications för denna surr
      if (Object.keys(this.realMessagesArr).length > 1 && nr === 1) {
        var theMessageDBId
        var zero = 0
        var global = this
        firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/messages')
        .once('value', response => {
          const res = response.val()
          for (var i in res) {
            if (res[i].applicantUserId === x.userCampaign.userId) {
              theMessageDBId = i
            }
          }
          firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/events/messages/' + theMessageDBId)
            .update({newMessageForBusiness: zero})
        })
          .catch(function (error) {
            console.log(error.message)
          })
      }
    },
    cleanRequests () {
      var newArr = [0]
      for (var i in this.invitesArr) {
        if (this.invitesArr[i].accepted === 0 || this.invitesArr[i].accepted === 2) {
          newArr.push(this.invitesArr[i])
        }
      }
      // Dunka upp till firebase
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/')
        .update({requests: newArr})
    },
    openInCalendar (inv) {
      this.date = inv.acceptedTime.date
      this.bokatMote = true
    },
    loadFirebaseData () {
      var global = this
      if (global.userIsAuthenticatedAndIsABusinessAccount && !global.logInAlert) {
        global.loadTheSite = true
        global.isLoadFirebaseDataActive = 1
        const database = firebase.database()
        database.ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user').on('value', response => {
          global.$store.state.corpObject.users[global.$store.state.theUserDBId].user = response.val()
          global.invitesArr = response.val().events.requests
          global.notifications = response.val().events.notifications[0]
          global.notificationsArr = response.val().events.notifications
          global.savedProfiles = Object.keys(response.val().events.savedProfiles).length - 1
          global.realMessagesArr = response.val().events.messages
          global.$store.state.ads = response.val().ads
          global.$store.state.savedPresentations = response.val().events.savedProfiles
          var newMessagesTotal = 0
          for (var m in response.val().events.messages) {
            if (response.val().events.messages[m].hasOwnProperty('newMessageForBusiness')) {
              newMessagesTotal = (newMessagesTotal + response.val().events.messages[m].newMessageForBusiness)
            }
          }
          global.messages = newMessagesTotal
          global.appointmentsEventsDates = []
          var appointmentsEvents = []
          for (var x in response.val().events.appointments) {
            if (response.val().events.appointments[x].accepted === 1 && response.val().events.appointments[x].acceptedTime !== '') {
              appointmentsEvents.push(response.val().events.appointments[x])
              global.appointmentsEventsDates.push(response.val().events.appointments[x].acceptedTime.date)
              global.$store.state.appointmentsEventsDates.push(response.val().events.appointments[x].acceptedTime.date)
            }
          }
          var arrLength = global.appointmentsEventsDates.filter(val => {
            return val >= new Date().toISOString().substr(0, 10)
          })
          global.$store.state.bevakningar = response.val().bevakningar
          global.appointments = arrLength.length
          global.appointmentsEvents = appointmentsEvents
          global.$store.state.comingAppointments = appointmentsEvents
        })
        // Watch Priceplan och uppdatera när det är ny fakturaperiod
        if (!this.$store.getters.freePlan && this.$store.state.corpObject.pricePlan.renewDate.replace(/-/g, '') <= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
          this.$store.state.corpObject.pricePlan.sentRequests = 0
          this.$store.state.corpObject.pricePlan.ads = 0
          this.$store.state.corpObject.pricePlan.package = this.$store.state.corpObject.pricePlan.renew
          this.$store.state.corpObject.pricePlan.price = this.$store.state.corpObject.pricePlan.renewPrice
          this.$store.state.corpObject.pricePlan.renewDate = this.renewDate()
          firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/')
            .update({pricePlan: this.$store.state.corpObject.pricePlan})
        }
        if (this.count === 0) {
          this.updateLastLogIn()
        }
        this.count++
      }
    },
    updateLastLogIn () {
      // Updatera lastLogIn
      const giveMeDate = new Date().toISOString().substr(0, 19).replace('T', ' ')
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/')
        .update({lastLogIn: giveMeDate})
    },
    endOfPeriod () {
      if (this.$store.state.corpObject.pricePlan.trialUntil.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
        // Om trial är aktiv
        return this.pricePlan.trialUntil
      } else {
        // Om trial ej är aktiv
        const deleteFromRenewDate = new Date(this.$store.state.corpObject.pricePlan.renewDate)
        return new Date(deleteFromRenewDate.setDate(deleteFromRenewDate.getDate() - 1)).toISOString().substr(0, 10)
      }
    },
    renewDate () {
      if (this.$store.state.corpObject.pricePlan.trialUntil.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')) {
        // Om trial är aktiv
        const addDaysFromTrial = new Date(this.$store.state.corpObject.pricePlan.trialUntil)
        return new Date(addDaysFromTrial.setDate(addDaysFromTrial.getDate() + 1)).toISOString().substr(0, 10)
      } else {
        // Om trial ej är aktiv
        const addDayFromEndOfPeriod = new Date(this.endOfPeriod())
        let theDay = new Date(addDayFromEndOfPeriod.setDate(addDayFromEndOfPeriod.getDate() + 32)).toISOString().substr(8, 10)
        let theDate = new Date().toISOString().substring(0, 8) + theDay.substr(0, 2)
        let result = new Date(theDate)
        this.$store.state.corpObject.pricePlan.renewDate = new Date(result.setDate(result.getDate() + 30)).toISOString().substr(0, 10)
        return this.$store.state.corpObject.pricePlan.renewDate
      }
    },
    zeroNotifications () {
      if (this.notificationsArr[0] > 0) {
        this.notificationsArr[0] = 0
        if (this.notificationsArr.length > 21) {
          this.notificationsArr.splice(21)
        }
        firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/')
          .update({notifications: this.notificationsArr})
      }
    },
    openBookedMeetings (e) {
      if (e.path.length > 15) {
        if (e.path[9].className.includes('v-picker--date')) {
          this.bokatMote = true
        }
      }
    },
    onLogout () {
      this.$store.dispatch('logout')
    },
    toHome () {
      return this.$router.push('/')
    },
    toMarket () {
      return this.$router.push('/marknaden')
    },
    toProfil () {
      return this.$router.push('/profil')
    },
    toSavedPresentations () {
      return this.$router.push('/sparade')
    },
    updateCorpInfo () {
      var global = this
      var corpObject
      var userAndBusinessExists = 0
      var businessExists = 0
      var theBusiness
      // Om business eller user precis är signed up
      if (this.$store.state.corpInfo.orgNr !== '') {
        // Se till att fullName är stor bokstav först
        let theWord
        let splitName = this.$store.state.userInfo.userName.split(' ')
        let newName = []
        splitName.forEach((val, index) => {
          theWord = val[0].toUpperCase()
          theWord += val.substr(1).toLowerCase()
          newName.push(theWord)
        })
        this.$store.state.userInfo.userName = newName.join().replace(/,/g, ' ')
        // Gör samma men för företagsNamnet
        let splitBusinessName = this.$store.state.corpInfo.businessName.split(' ')
        let newBusinessName = []
        splitBusinessName.forEach((val, index) => {
          if (val === 'ab' || val === 'AB' || val === 'Ab' || val === 'aB') {
            theWord = val.toUpperCase()
            newBusinessName.push(theWord)
          } else {
            theWord = val[0].toUpperCase()
            theWord += val.substr(1).toLowerCase()
            newBusinessName.push(theWord)
          }
        })
        this.$store.state.corpInfo.businessName = newBusinessName.join().replace(/,/g, ' ')
        var newNotification = {
          msg: 'Välkommen till Jobflix Business! Se dig runt och lär känna portalen. Se till att fixa din profil innan du skickar förfrågningar.',
          id: new Date().getTime(),
          time: new Date().toISOString().substr(0, 19).replace('T', ' ')
        }
        var pushNewUser = {
          welcomeModal: true,
          fullName: this.$store.state.userInfo.userName,
          userId: this.$store.state.user.id,
          email: this.$store.state.userInfo.email,
          phoneNr: 'Inget nummer',
          adress: 'Ingen adress',
          lastLogIn: new Date().toISOString().substr(0, 19).replace('T', ' '),
          businessInfoWasModified: [false],
          newUserWasAdded: [false],
          ads: {
            initial: 'xx'
          },
          bevakningar: {
            initital: 'xx'
          },
          events: {
            savedProfiles: [0],
            messages: [0],
            appointments: [0],
            requests: [0],
            notifications: [ 1, newNotification ]
          }
        }
        corpObject = {
          users: [
            {
              user: {
                welcomeModal: true,
                fullName: this.$store.state.userInfo.userName,
                userId: this.$store.state.user.id,
                email: this.$store.state.userInfo.email,
                businessInfoWasModified: [false],
                newUserWasAdded: [false],
                lastLogIn: new Date().toISOString().substr(0, 19).replace('T', ' '),
                phoneNr: 'Inget nummer',
                adress: 'Ingen adress',
                ads: {
                  initial: 'xx'
                },
                bevakningar: {
                  initital: 'xx'
                },
                events: {
                  savedProfiles: [0],
                  messages: [0],
                  appointments: [0],
                  requests: [0],
                  notifications: [ 1, newNotification ]
                }
              }
            }
          ],
          businessLogo: {
            i: 'https://business.jobflix.se/images/company-logo.png'
          },
          website: '#',
          registered: new Date().toISOString().substr(0, 19).replace('T', ' '),
          corpDescription: 'Ingen beskrivning av detta företag',
          businessName: this.$store.state.corpInfo.businessName,
          employeeSize: this.$store.state.corpInfo.employeeSize,
          orgNr: this.$store.state.corpInfo.orgNr,
          country: 'Sweden',
          pricePlan: {
            activated: '0000-00-00',
            ads: 0,
            invoice: {
              adress: 'Ingen adress',
              ansvarig: '--',
              corpName: '--',
              mail: '--',
              phoneNr: '--',
              vatid: '--'
            },
            package: 1,
            price: 0,
            renew: 1,
            renewDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().substr(0, 10).replace('T', ' '),
            renewPrice: 0,
            sentRequests: 0,
            trialUntil: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().substr(0, 10).replace('T', ' ')
          }
          // Byt trialUntil mot denna efter Beta: 14 dagars trial
          //  trialUntil: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().substr(0, 10).replace('T', ' '),
        }
        // Kolla OM både business och user redan finns
        firebase.database().ref('businessUsers')
          .once('value', response => {
            const res = response.val()
            // first.join(' ') === second.join(' ')
            for (let i in res) {
              // Kolla businessName utan AB
              var xLow = global.$store.state.corpInfo.businessName.toLowerCase().split(' ')
              var yLow = res[i].e.toLowerCase().split(' ')
              var first = []
              var second = []
              var theResult = false
              if (yLow.includes(xLow[0])) {
                xLow.forEach(val => {
                  if (val !== 'ab') {
                    first.push(val)
                  }
                })
                yLow.forEach(val => {
                  if (val !== 'ab') {
                    second.push(val)
                  }
                })
                first.join(' ') === second.join(' ') ? theResult = true : theResult = false
              }
              if ((res[i].d === global.$store.state.corpInfo.orgNr) || theResult) {
                businessExists = 1
                theBusiness = res[i].b
                break
              }
            }
             // Om både user & Business är nya
            if (businessExists === 0 && userAndBusinessExists === 0) {
              let theDBKey = firebase.database().ref().push().key
              global.notifications = 1
              global.notificationsArr = { 0: 1, initital: newNotification }
              global.$store.state.corpObject = corpObject
              global.userIsAuthenticatedAndIsABusinessAccount = true
              global.loadTheSite = true
              global.$store.state.theUserDBId = 0
              firebase.database().ref('businessAccounts').child(theDBKey + '/corpInfo')
                .set(corpObject)
              .then(res => {
                global.$store.state.yourDatabaseString = theDBKey
                // Hämta ny data och släng upp DB ID'n
                let newUserToBusinessDb = {
                  a: global.$store.state.user.id,
                  b: global.$store.state.yourDatabaseString,
                  c: global.$store.state.theUserDBId,
                  d: global.$store.state.corpInfo.orgNr,
                  e: global.$store.state.corpInfo.businessName
                }
                firebase.database().ref('businessUsers').child(global.$store.state.user.id)
                  .set(newUserToBusinessDb)
                global.$store.commit('loggedInFunctions')
              })
            } else if (businessExists === 1 && userAndBusinessExists === 0) {
              // Om User är new men Business exists
              firebase.database().ref('businessAccounts').child(theBusiness + '/corpInfo/users/' + this.$store.state.user.id + '/user')
              .set(pushNewUser)
              .then(function (response) {
                global.notificationsArr = { 0: 1, initital: newNotification }
                global.notifications = 1
                // Hämta DB id'n och dunka upp till Vuex Store
                firebase.database().ref('businessAccounts').child(theBusiness + '/corpInfo')
                  .once('value', response => {
                    const res = response.val()
                    let newUserCorpObject
                    global.$store.state.corpObject = res
                    for (var i in res.users) {
                      if (res.users[i].user.userId === global.$store.state.user.id) {
                        global.$store.state.theUserDBId = global.$store.state.user.id
                        global.$store.state.yourDatabaseString = theBusiness
                      }
                      if (res.users[i].user.userId !== global.$store.state.theUserDBId) {
                        let arr = [true, pushNewUser.fullName + ' har lagts till som ny användare.']
                        res.users[i].user.newUserWasAdded = arr
                        newUserCorpObject = res
                        firebase.database().ref('businessAccounts').child(theBusiness)
                          .update({corpInfo: newUserCorpObject})
                      }
                    }
                    global.userIsAuthenticatedAndIsABusinessAccount = true
                    global.loadTheSite = true
                    let newUserToBusinessDb = {
                      a: global.$store.state.user.id,
                      b: global.$store.state.yourDatabaseString,
                      c: global.$store.state.theUserDBId,
                      d: res.orgNr,
                      e: res.businessName
                    }
                    firebase.database().ref('businessUsers').child(global.$store.state.user.id)
                      .set(newUserToBusinessDb)
                    global.$store.commit('loggedInFunctions')
                  })
                  .catch(function (error) {
                    console.log(error.message)
                  })
              })
              .catch(function (error) {
                console.log(error)
              })
            }
          })
          .catch(function (error) {
            console.log(error.message)
          })
      }
      // OM user & business redan var Signed Up & Loggar in
      let found = 0
      if (this.$store.state.corpInfo.orgNr === '') {
        firebase.database().ref('businessUsers').child(global.$store.state.user.id).once('value', response => {
          const res = response.val()
          if (res === null) {
            global.logInAlert = true
          } else if (res.a === global.$store.state.user.id) {
            found = 1
            global.$store.state.theUserDBId = res.c
            global.userIsAuthenticatedAndIsABusinessAccount = true
            global.loadTheSite = true
            firebase.database().ref('businessAccounts').child(res.b).once('value', data => {
              const result = data.val()
              corpObject = result.corpInfo
              global.$store.state.corpObject = corpObject
              // IMportedat fixa
              global.$store.state.corpObject.users[res.c].user = corpObject.users[res.c].user
              global.invitesArr = corpObject.users[res.c].user.events.requests
              global.notifications = corpObject.users[res.c].user.events.notifications[0]
              global.notificationsArr = corpObject.users[res.c].user.events.notifications
              global.savedProfiles = Object.keys(corpObject.users[res.c].user.events.savedProfiles).length - 1
              global.realMessagesArr = corpObject.users[res.c].user.events.messages
              global.$store.state.ads = corpObject.users[res.c].user.ads
              global.$store.state.savedPresentations = corpObject.users[res.c].user.events.savedProfiles
              var newMessagesTotal = 0
              for (var m in corpObject.users[res.c].user.events.messages) {
                if (corpObject.users[res.c].user.events.messages[m].hasOwnProperty('newMessageForBusiness')) {
                  newMessagesTotal = (newMessagesTotal + corpObject.users[res.c].user.events.messages[m].newMessageForBusiness)
                }
              }
              global.messages = newMessagesTotal
              global.appointmentsEventsDates = []
              var appointmentsEvents = []
              for (var x in corpObject.users[res.c].user.events.appointments) {
                if (corpObject.users[res.c].user.events.appointments[x].accepted === 1 && corpObject.users[res.c].user.events.appointments[x].acceptedTime !== '') {
                  appointmentsEvents.push(corpObject.users[res.c].user.events.appointments[x])
                  global.appointmentsEventsDates.push(corpObject.users[res.c].user.events.appointments[x].acceptedTime.date)
                  global.$store.state.appointmentsEventsDates.push(corpObject.users[res.c].user.events.appointments[x].acceptedTime.date)
                }
              }
              var arrLength = global.appointmentsEventsDates.filter(val => {
                return val >= new Date().toISOString().substr(0, 10)
              })
              global.$store.state.bevakningar = corpObject.users[res.c].user.bevakningar
              global.appointments = arrLength.length
              global.appointmentsEvents = appointmentsEvents
              global.$store.state.comingAppointments = appointmentsEvents
              // Importerad
              global.$store.state.yourDatabaseString = res.b
              global.$store.commit('loggedInFunctions')
            })
          }
          if (found === 0) {
            global.logInAlert = true
          }
        })
        .catch(err => {
          console.log('Error with data fr updatecorpinfo: ', err)
        })
      }
      this.$store.state.userInfo.userName = ''
    }
  },
  computed: {
    watchAppointmentsObject () {
      return this.appointmentsEvents
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
    sendingInvitation: {
      get () { return this.$store.getters.sendingInvitationGetter },
      set (value) { this.$store.commit('sendingInvitationCommit', value) }
    },
    invitationWasSuccessfullySent: {
      get () { return this.$store.getters.invitationWasSuccessfullySentGetter },
      set (value) { this.$store.commit('invitationWasSuccessfullySentCommit', value) }
    },
    welcomeModal: {
      get () { return this.$store.getters.welcomeModal },
      set (value) { this.$store.commit('welcomeModalCommit', value) }
    },
    comingAppointmentsEvents () {
      const arr = this.appointmentsEvents.filter(val => {
        val.readMore = false
        return val.acceptedTime.date >= new Date().toISOString().substr(0, 10)
      })
      arr.sort((a, b) => {
        return a.acceptedTime.date.replace(/-/g, '') - b.acceptedTime.date.replace(/-/g, '')
      })
      return arr
    },
    registerNewAccBtn () {
      return this.fullname !== '' && this.mailSignUp !== '' && this.passwordSignUp.length >= 6 && (this.passwordSignUp === this.confirmPassword) && (this.gdrpAccept)
    },
    employers () {
      return this.$store.state.employeeSize
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
    firstStepSignUpBtn () {
      return this.businessName !== '' && this.orgNr !== '' && this.employersNr !== ''
    },
    passIsLongerThanSix () {
      return this.passwordSignUp.length >= 6 ? '' : 'Lösenordet måste vara minst 6 tecken långt'
    },
    comparePasswords () {
      return this.passwordSignUp !== this.confirmPassword ? 'Lösenorden matchar inte!' : 'Bra, lösenorden matchar!'
    },
    loading () {
      return this.$store.state.loadingUser
    },
    logInModal: {
      get () { return this.$store.getters.logInModalGetter },
      set (value) { this.$store.commit('logInModal', value) }
    },
    signUpDialog: {
      get () { return this.$store.getters.signUpDialogGetter },
      set (value) { this.$store.commit('signUpDialog', value) }
    },
    loadingLogin () {
      return this.$store.state.loadingUser
    },
    loggaInDisabled () {
      return this.email !== '' && this.password.length >= 6
    },
    wrongCredentials () {
      return this.wrongCredentialsMsg !== 'Inget felmeddelande' && this.loggaInDisabled
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
    userIsNotLoggedIn () {
      return this.$store.state.userIsNotLoggedIn
    },
    businessInfoWasModified () {
      if (this.userIsAuthenticated && this.$store.state.corpObject !== '' && this.$store.state.theUserDBId !== '') {
        return this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.businessInfoWasModified
      } else {
        return [false]
      }
    },
    newUserWasAdded () {
      if (this.userIsAuthenticated && this.$store.state.corpObject !== '' && this.$store.state.theUserDBId !== '') {
        return this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.newUserWasAdded
      } else {
        return [false]
      }
    },
    uniqueAppointmentsEvents () {
      var allIds = []
      var arr = []
      this.appointmentsEvents.forEach(val => {
        if (!allIds.includes(val.userCampaign.userId)) {
          allIds.push(val.userCampaign.userId)
          arr.push(val)
        }
      })
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
    isThereAnyAnsweredReq () {
      var x = false
      for (var i in this.invitesArr) {
        if (this.invitesArr[i].accepted === 1 || this.invitesArr[i].accepted === 3) {
          x = true
        }
      }
      return x
    },
    yourDatabaseString () {
      return this.$store.state.yourDatabaseString
    },
    pendingRequests () {
      var pending = 0
      for (var i in this.invitesArr) {
        if (this.invitesArr[i].accepted === 0 || this.invitesArr[i].accepted === 2) {
          pending++
        }
      }
      return pending
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined && this.$store.state.user !== null
    },
    messagesColor () {
      return this.messages ? 'red' : 'transparent!important'
    },
    appointmentColor () {
      return this.appointments ? 'success' : 'transparent!important'
    },
    appointmentColorSmall () {
      return this.appointments ? 'red' : 'white'
    },
    invitesColor () {
      return this.pendingRequests ? 'success' : 'transparent!important'
    },
    invitesColorSmall () {
      return this.pendingRequests ? 'red' : 'white'
    },
    notificationsColor () {
      return this.notifications ? 'red' : 'transparent!important'
    },
    notificationsColorSmall () {
      return this.notifications ? 'red' : 'white'
    },
    savedProfilesColor () {
      return this.savedProfiles ? 'primary' : 'transparent!important'
    }
  },
  mounted () {
    if (this.$store.state.userIsNotLoggedIn) {
      this.loadTheSite = true
    }
    // Nedanstående kod behövs bara för att få igång loadFirebaseData efter "hot reload" under development
    if ((this.$store.state.user !== undefined || this.$store.state.user !== null) && this.$store.state.corpObject !== '') {
      if (this.userIsAuthenticatedAndIsABusinessAccount === false) {
        this.userIsAuthenticatedAndIsABusinessAccount = true
        this.loadFirebaseData()
      }
    }
    // Slut på "development mode" kod
  },
  created () {
    // Created
  }
}
</script>

<style>
.v-badge__badge {
  font-size: 8pt !important;
  font-weight: bold !important;
  height: 19px !important;
  width: 19px !important;
  margin-top: 4px !important;
  margin-left: 3px !important;
}
.body {
  background-color: #f6f5f6 !important;
}
.qfade-enter-active, .component-qfade-leave-active {
  transition: opacity 1.0s ease;
}
.qfade-enter, .component-qfade-leave-to {
  opacity: 0;
}
.title {
  line-height: 25px!important;
}
.justifiedText {
  text-align: justify !important;
}
.myDisplay-1 {
  font-size: 30px;
  line-height: 35px;
}
.title {
  line-height: 30px!important;
}
.display-2 {
  font-weight: bold!important;
}
.pointer {
  cursor: pointer;
}
.backgroundIMG1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  min-height: 480px;
  height: 740px;
  box-sizing: border-box;
  padding: 48px 48px 32px;
  overflow: hidden;
  -webkit-transform-origin: 100%;
  transform-origin: 100%;
}
.mainBackgroundLight {
  background: #dfe9f3; /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #dfe9f3 0%, white 100%); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #dfe9f3 0%, white 100%); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.mainBackgroundFADED {
  background: #4b6cb7; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #4b6cb7 , #182848); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #4b6cb7 , #182848); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.mainBackground {
  background: #4b6cb7; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #4b6cb7 , #182848); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #4b6cb7 , #182848); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.transparentText {
  color: transparent!important;
}
a {
  text-decoration: none !important;
}
.writeMessage {
  position: absolute;
  width: 100%;
  max-width: 530px;
  bottom:0;
}
.hoverDropMenu:hover {
  background-color: #b6d5e4;
}
.jobflix-title-loggedin {
  padding-right: 1px;
  padding-left: 15px;
  border-radius: 3px;
  font-family: unset;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 22px;
  letter-spacing: 2px;
  position: relative;
}
.jobflix-title {
  padding-right: 1px;
  padding-left: 15px;
  border-radius: 3px;
  font-family: unset;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 26px;
  letter-spacing: 2px;
  position: relative;
}
.jobflix-title1 {
  color: #fff;
}
.jobflix-title2 {
  color: #FF9800;
}
.play-icon-title-loggedin {
  position: absolute;
  z-index: 2;
  left: -4px;
  top: -1px;
}
.play-icon-title {
  position: absolute;
  z-index: 2;
  left: -3px;
  top: 1px;
}
.v-btn {
  text-transform: none!important;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .1s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.v-toolbar__title:not(:first-child) {
  margin-left: 0!important;
}
.v-card, .v-dialog, .v-menu__content {
  border-radius: 5px!important;
}
.imSticky {
  position: sticky !important;
  top:75px;
}
.v-btn--active:before, .v-btn:focus:before, .v-btn:hover:before {
  background-color: orange!important;
}
.closeModal {
  position: absolute;
  top: 10px;
  right: 10px;
}
.textPrio {
  position:relative;
  z-index: 5;
}
.container {
  max-width: 1264px!important;
}
video {
  max-height: 450px!important;
}
img {
  max-height: 450px!important;
}
.display-2 {
  line-height: 55px!important;
}
.display1Small {
  font-size: 25px !important;
}
@media only screen and (max-width: 600px) {
    .container {
        padding: 0px !important;
    }
    .v-card, .v-dialog, .v-menu__content {
      border-radius: 0px!important;
    }
    .noPaddingOnSmallScreenSizes {
      padding: 0px !important;
    }
    .maxBGImgHeight {
      max-height: 110px !important;
    }
    .display-1 {
      font-size: 28px !important;
      line-height: 35px !important;
    }
    img {
      max-height: 200px!important;
    }
    video {
      max-height: 300px!important;
    }
}
@media only screen and (max-width: 960px) {
    .sneBackground {
      display: none;
    }
    .marginBottomSmall {
      margin-bottom: 53px!important;
    }
    .selectDatesMarginTop {
      margin-top: 80px!important;
    }
    img {
      max-height: 200px!important;
    }
    video {
      max-height: 300px!important;
    }
}
</style>
