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
      <v-btn v-if="0" @click="test" class="secondary" style="position:absolute;z-index:5">TEST fr. annonsera</v-btn>
      <v-layout :mt-3="$vuetify.breakpoint.lgAndUp" :wrap="$vuetify.breakpoint.mdAndDown" row>
        <v-flex :my-4="$vuetify.breakpoint.xsOnly" :mt-1="$vuetify.breakpoint.smAndUp" :mb-4="$vuetify.breakpoint.smAndUp" px-3 v-if="$vuetify.breakpoint.mdAndDown" xs12>
          <v-btn @click="showAdsSmall = !showAdsSmall" small block outline round>
            Alla dina annonser
            <v-icon>{{ showAdsSmall ? 'arrow_drop_up' : 'arrow_drop_down' }}</v-icon>
          </v-btn>
            <v-flex v-if="showAdsSmall" class="textPrio" xs12 py-3 px-2>
              <div class="title">Dina annonser</div>
              <div v-if="Object.keys(this.ads).length <= 1" class="body-1 pt-3">
                Du har för tillfället inga annonser ute.
              </div>
              <div v-bind:key="ad.id" v-for="ad in ads">
                <v-btn v-if="ad.id" @click="openAdInfo(ad)" :class="{'success lighten-1' : ad.lastDay >= new Date().toISOString().substr(0, 10), 'orange lighten-1' : ad.lastDay < new Date().toISOString().substr(0, 10), 'my-3' : true}" flat round block>
                  {{ ad.title.substr(0, 28) }}...
                  <v-spacer></v-spacer>
                  <span :class="{'body-2 success--text' : ad.applicants.length > 1, 'body-2 secondary--text' : ad.applicants.length <= 1, }"><v-icon small>person_add</v-icon> {{ Object.keys(ad.applicants).length - 1 }}</span>
                </v-btn>
              </div>
          </v-flex>
        </v-flex>
        <v-flex class="v-card white" py-3 px-2 :mr-2="$vuetify.breakpoint.mdAndUp" xs12 lg9>
          <v-layout row wrap>
            <v-flex xs12>
              <div class="title mb-3 text-xs-center">Skapa ny annons</div>
            </v-flex>
            <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-text-field
                v-model="newAdObj.title"
                box
                label="Titel *"
              ></v-text-field>
            </v-flex>
            <v-flex @click="kalenderWindow = true" :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-text-field
                class="pointer"
                v-model="newAdObj.lastDay"
                box
                label="Sista ansökningsdag (xxxx-xx-xx) *"
              ></v-text-field>
            </v-flex>
            <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                v-model="newAdObj.bransch"
                box
                label="Bransch *"
                :items="getBranschArr"
              ></v-autocomplete>
              <v-select
                v-model="newAdObj.omfattning"
                box
                label="Omfattning"
                :items="omfattningItems"
              ></v-select>
            </v-flex>
            <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-autocomplete
                v-model="newAdObj.underCategory"
                box
                label="Kategori"
                :items="getBranschCategoryArr"
              ></v-autocomplete>
              <v-autocomplete
                v-model="newAdObj.region"
                box
                label="Region *"
                :items="filter.region"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12>
              <v-autocomplete
                v-model="newAdObj.competences"
                box
                chips
                label="Specifika kompetenser (taggar)"
                :items="filter.competences"
                multiple
                class="mb-2"
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
            </v-flex>
            <v-flex xs12>
              <v-textarea
                auto-grow
                v-model="newAdObj.about"
                box
                label="Beskriv tjänsten, vem ni söker och vad ni erbjuder *"
              ></v-textarea>
            </v-flex>
            <v-flex v-if="newAdObj.videoUrl.i !== undefined" xs12>
              <video style="max-width:100%!important" preload playsinline width="400" height="250" controls>
                  <source :src="newAdObj.videoUrl.i" type="video/mp4">
                  Your browser does not support the video tag.
              </video>
            </v-flex>
            <v-flex xs12>
              <div class="caption grey lighten-4 px-1 pb-2">
                <v-icon small>info</v-icon> Att lägga till video är frivilligt. Lägg till om ni har en bra videopresentation.
              </div>
              <div>
            </div>
            <input 
              v-show="0" 
              type="file" 
              ref="fileInput" 
              accept="video/*"
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
              <v-btn @click="onPickFile" round flat class="secondary lighten-2">Lägg till video <v-icon class="ml-2">video_library</v-icon></v-btn>
              <v-btn @click="previewAd = true" round flat class="primary lighten-1">Förhansgranska <v-icon class="ml-2">zoom_in</v-icon></v-btn>
              <v-btn :disabled="!allowPublicera" @click="postToFirebase" round flat class="success lighten-1">Publicera <v-icon class="ml-2">cloud_upload</v-icon></v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.lgAndUp" class="textPrio v-card white" style="border-top:1px solid lightgrey" xs12 py-3 px-2 md3 ml-2>
          <div class="title">Dina annonser</div>
          <div v-if="Object.keys(this.ads).length <= 1" class="body-1 pt-3">
            Du har för tillfället inga annonser ute.
          </div>
          <div v-bind:key="ad.id" v-for="ad in ads">
            <v-btn v-if="ad.id" @click="openAdInfo(ad)" :class="{'success lighten-1' : ad.lastDay >= new Date().toISOString().substr(0, 10), 'orange lighten-1' : ad.lastDay < new Date().toISOString().substr(0, 10), 'my-3' : true}" flat round block>
              {{ ad.title.substr(0, 28) }}...
              <v-spacer></v-spacer>
              <span :class="{'body-2 success--text' : ad.applicants.length > 1, 'body-2 secondary--text' : ad.applicants.length <= 1, }"><v-icon small>person_add</v-icon> {{ Object.keys(ad.applicants).length - 1 }}</span>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>

      <!--   DIALOG FÖR FÖRHANDSGRANSKNING AV ANNONS  -->
      <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="1100" v-model="previewAd">
        <v-card>
          <v-card-title class="primary lighten-2 justify-center">
            <div class="title white--text">Förhandsgranska annons</div>
            <div class="closeModal">
              <v-icon @click="previewAd = false" large class="white--text pointer">close</v-icon>
            </div>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex pr-3 py-2 md8>
                <div class="title">{{ newAdObj.corp }}</div>
                <div class="title">{{ newAdObj.title }}</div>
                <div style="font-weight:bold" class="subheading grey--text text--darken-1 mb-2">{{ newAdObj.bransch }}</div>
                <v-chip class="mb-2" small v-bind:key="x" v-for="x in newAdObj.competences" label color="success" text-color="white">
                  <v-icon left>label</v-icon>{{ x }}
                </v-chip>
                <div class="body-2 pb-1">Om tjänsten:</div>
                <p v-bind:key="x" v-for="x in getRealAbout" :class="{'body-1' : x.length > 40, 'body-2' : x.length <= 40 }">
                  {{ x }}
                </p>
              </v-flex>
              <v-flex pl-1 py-2 md4>
                <v-btn v-if="$vuetify.breakpoint.mdAndUp" round large flat block class="primary darken-1 mb-4">Ansök nu</v-btn>
                <img :src="$store.state.corpObject.businessLogo.i" style="max-width:200px!important;max-height:140px!important" alt="Företagslogga">
                <v-flex v-if="newAdObj.videoUrl.i !== undefined" xs12>
                  <video preload playsinline width="250" height="150" controls>
                      <source :src="newAdObj.videoUrl.i" type="video/mp4">
                      Your browser does not support the video tag.
                  </video>
                </v-flex>
                <div class="body-2 pb-1 mt-3">Om arbetsgivaren:</div>
                <div v-bind:key="x" v-for="x in corpDescriptionArr" :class="{'body-1' : x.length > 40, 'body-2' : x.length <= 40 }">
                  <p>{{ x }}</p>
                </div>
                <div class="caption grey lighten-3 mt-2 black--text">
                  <v-icon small>info</v-icon> Företagsbeskrviningen samt loggan är hämtad från företagsprofilen som ni kan ändra i profilen.
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>


      <!--   DIALOG FÖR ANNONSHANTERARE  -->
      <div v-if="currentAd !== ''">
        <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="1100" v-model="openAdInfoModal">
          <v-card>
            <v-card-title class="primary lighten-2 justify-center">
              <div class="title white--text">{{ currentAd.title }}</div>
              <div class="closeModal">
                <v-icon @click="openAdInfoModal = false" large class="white--text pointer">close</v-icon>
              </div>
            </v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex pr-3 py-2 md8>
                  <div v-if="currentAd.lastDay < new Date().toISOString().substr(0, 10)" class="grey lighten-2 body-2 orange--text text--darken-3 py-2 px-2 mb-3">
                    <v-icon small class="primary--text">info</v-icon>
                    Sista ansökningsdagen har passerat för denna annons, den visas alltså inte just nu.
                    Du kan ändra datumet längst ner i "redigera". Annonser finns kvar här tills du väljer att ta bort den.
                  </div>
                  <div class="title">{{ currentAd.title }}</div>
                  <div style="font-weight:bold" class="subheading grey--text text--darken-1 mb-2">{{ currentAd.bransch }} <span v-show="currentAd.underCategory !== ''">> {{ currentAd.underCategory }}</span></div>
                  <v-chip class="mb-2" small v-bind:key="x" v-for="x in currentAd.competences" label color="success" text-color="white">
                    <v-icon left>label</v-icon>{{ x }}
                  </v-chip>
                  <v-flex my-4 xs12>
                    <v-btn medium v-if="$vuetify.breakpoint.smAndDown" :disabled="Object.keys(currentAd.applicants).length === 1" @click="showApplicants(currentAd)" style="font-weight:bold" round flat block :class="{'secondary lighten-4' : Object.keys(currentAd.applicants).length === 1, 'success lighten-1' : Object.keys(currentAd.applicants).length > 1 }">
                        Alla sökande
                       <v-icon class="ml-2" small>person_add</v-icon>&nbsp;{{ Object.keys(currentAd.applicants).length - 1 }}
                    </v-btn>
                  </v-flex>
                  <div class="body-2 pb-1">Om tjänsten:</div>
                  <p v-bind:key="x" v-for="x in currentAd.getRealAbout" :class="{'body-1' : x.length > 40, 'body-2' : x.length <= 40 }">
                    {{ x }}
                  </p>
                </v-flex>
                <v-flex pl-1 py-2 md4>
                  <v-btn v-if="$vuetify.breakpoint.mdAndUp" :disabled="Object.keys(currentAd.applicants).length === 1" @click="showApplicants(currentAd)" style="font-weight:bold" round large flat block :class="{'secondary lighten-4' : Object.keys(currentAd.applicants).length === 1, 'success lighten-1' : Object.keys(currentAd.applicants).length > 1 }">
                    Alla sökande
                    <v-icon class="ml-2" small>person_add</v-icon>&nbsp;{{ Object.keys(currentAd.applicants).length - 1 }}
                  </v-btn>
                  <div>
                    <img class="mt-3" :src="$store.state.corpObject.businessLogo.i" style="max-width:200px!important;max-height:140px!important" alt="Företagslogga">
                  </div>
                  <v-flex v-if="currentAd.videoUrl.i !== undefined" xs12>
                    <video preload playsinline width="250" height="150" controls>
                        <source :src="currentAd.videoUrl.i" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                  </v-flex>
                  <div class="body-2 pb-1 mt-3">Om arbetsgivaren:</div>
                  <div v-bind:key="x" v-for="x in corpDescriptionArr" :class="{'body-1' : x.length > 40, 'body-2' : x.length <= 40 }">
                    <p>{{ x }}</p>
                  </div>
                  <div class="caption grey lighten-3 mt-2 black--text">
                    <v-icon small>info</v-icon> Denna info är hämtad från företagsbeskrivningen i profilen.
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="editAdModal = true, editModalJustBeenOpened = 1" block flat round class="primary">Redigera <v-icon small class="ml-2">edit</v-icon></v-btn>
              <v-btn :loading="sendingUpdate" @click="editAd('delete')" block flat round class="secondary white--text">Ta bort <v-icon small class="ml-2">close</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!--  TEXT INFO UNDER  -->
      <v-layout class="mt-5 v-card white px-3 py-4" row wrap>
        <v-flex xs12>
          <div class="display-1 mb-3">Hur det fungerar</div>
          <p class="body-1">
            Annonseringsfunktionen ingår i guld och platinum paketet. 
            Det tillkommer inga extra kostnader att annonsera ut lediga tjänster. 
            Ni når ut till hela vårt nätverk av jobbsökande. 
            De hittar alla annonser när de besöker sidan “annonser” inne i jobbsökar portalen.
          </p>
          <p class="body-1">
            De som vill söka på en annons väljer att skicka en redan inspelad presentation med ett personligt meddelande. 
            Ni får då notifikation på att ni har fått en sökande på eran annons.
          </p>
          <p class="body-1">
            Ni hittar alla sökande inne på denna sida när ni klickar på er annons vid sidomenyn "Dina annonser".
            Där dyker alla sökandes videopresentationer upp 
            samt CV / profil med personligt meddelande. 
            Ni väljer då att skicka en mötesförfrågan till de ni är intresserade av på samma sätt som man gör på marknaden.
          </p>
          <p>
            Man måste ha minst guld paketet för att annonsera. Då ingår det upp till 5 nya annonser per månad. 
            Med platinum ingår det obegränsat med annonser. Det gäller för ett helt företag med obegränsat antal användare.
          </p>
        </v-flex>
      </v-layout>
    </v-container>

    <!--  UPLOAD NOTIFICATION MODAL  -->
    <v-dialog max-width="400" v-model="uploadIsDoneModal">
      <v-card-title class="success lighten-2">
            <div class="title white--text">
              Annonsen har laddats upp <v-icon class="white--text">check_circle</v-icon>
            </div>
      </v-card-title>
      <v-card-text class="white">
        <div class="body-1">
          Din annons finns tillgänglig för jobbsökande nu och du kommer bli notifierad när någon svarar på annonsen.
        </div>
      </v-card-text>
      <v-card-actions class="white">
        <v-btn round block outline @click="uploadIsDoneModal = false">OK!</v-btn>
      </v-card-actions>
    </v-dialog>

    <!--  DELETE NOTIFICATION MODAL  -->
    <v-dialog max-width="400" v-model="deleteNotification">
      <v-card-title class="primary lighten-3">
            <div class="title white--text">
              Annonsen har tagitst bort <v-icon class="white--text">check_circle</v-icon>
            </div>
      </v-card-title>
      <v-card-actions class="white">
        <v-btn block outline @click="deleteNotification = false">OK!</v-btn>
      </v-card-actions>
    </v-dialog>

    <!-- SendinginvitationDialog -->
    <v-dialog max-width="400" v-model="sendingInvitation">
      <v-card>
        <v-card-title class="primary lighten-3 justify-center white--text">
          <div class="title">Skickar din förfrågan...</div>
        </v-card-title>
        <v-card-actions>
          <v-btn :loading="sendingInvitation" flat block></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!--    REDIGERA ANNONS DIALOG    -->
    <div v-if="currentAd !== ''">
    <v-dialog max-width="900" v-model="editAdModal">
      <v-card>
        <v-card-title class="primary lighten-2 justify-center">
          <div class="title white--text">Redigera annons</div>
          <div class="closeModal">
            <v-icon @click="editAdModal = false" large class="white--text">close</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
              <v-flex pr-2 xs12 md6>
                <v-text-field
                  v-model="currentAd.title"
                  box
                  label="Titel"
                ></v-text-field>
                <v-select
                  v-model="currentAd.underCategory"
                  box
                  label="Kategori"
                  :items="getBranschCategoryArrEdit"
                ></v-select>
              </v-flex>
              <v-flex pl-2 xs12 md6>
                <v-select
                  v-model="currentAd.bransch"
                  box
                  label="Bransch"
                  :items="getBranschArr"
                ></v-select>
                <v-select
                  v-model="currentAd.region"
                  box
                  label="Min. erfarenhet"
                  :items="filter.region"
                ></v-select>
              </v-flex>
              <v-flex :pr-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
              <v-text-field
                class="pointer"
                v-model="currentAd.lastDay"
                box
                label="Sista ansökningsdag (xxxx-xx-xx)"
              ></v-text-field>
            </v-flex>
              <v-flex :pl-2="$vuetify.breakpoint.mdAndUp" xs12 md6>
                <v-combobox
                  v-model="currentAd.competences"
                  box
                  chips
                  label="Specifika kompetenser (taggar)"
                  :items="filter.competences"
                  multiple
                  class="mb-2"
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
                </v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  auto-grow
                  v-model="currentAd.about"
                  box
                  label="Beskriv tjänsten, vem ni söker och vad ni erbjuder"
                ></v-textarea>
              </v-flex>
              <v-flex xs12>
                <v-btn :disabled="updateButton" :loading="sendingUpdate" @click="editAd" round flat class="success lighten-1">Uppdatera <v-icon class="ml-2">cloud_upload</v-icon></v-btn>
              </v-flex>
            </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>

     <!-- Nedan är dialog för kalender -->
  <v-layout row justify-center>
    <v-dialog
      v-model="kalenderWindow"
      max-width="800"
      >
      <v-card>
        <v-card-title class="justify-center">
          <div class="title">Välj slutdatum</div>
        </v-card-title>
        <v-layout row wrap>
            <v-date-picker
            color="green lighten-2"
            v-model="newAdObj.lastDay"
            full-width
            :landscape="!this.$vuetify.breakpoint.smAndDown"
            class="my-3"
            event-color="primary"
            ></v-date-picker>
          </v-layout>

        <v-card-actions>
          <v-btn
            block
            style="margin-top:-18px"
            color="blue"
            flat="flat"
            @click="kalenderWindow = false"
          >
            Stäng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

  <!-- ***** * DIALOG FÖR ATT VISA ALLA SÖKANDE * ***** -->
  <div>
    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="700" v-model="showAllApplicantsModal">
      <v-card class="grey lighten-3">
        <v-card-title class="primary lighten-3 justify-center white--text">
          <div class="title">
            Sökande - {{ currentAd.title }}
          </div>
          <div class="closeModal">
            <v-icon @click="showAllApplicantsModal = false" class="pointer white--text" large>close</v-icon>
          </div>
        </v-card-title>
          <v-card class="mb-1 white" v-bind:key="x.theCampaign.id" v-for="x in currentApplicants">
            <v-card-title>
              <v-avatar
                size="26px"
              >
                <img
                  :src="x.theCampaign.profilePic"
                  alt="Profilbild"
                >
              </v-avatar>
              <div class="body-2 ml-2">
                {{ x.theCampaign.name }} -
                <span class="body-1">
                  {{ x.theCampaign.title }}
                </span>
              </div>
            </v-card-title>
            <div v-if="x.theCampaign.videoPlay" style="position:relative">
              <img style="min-height:200px" @click="x.theCampaign.videoPlay = false" class="pointer" :src="x.theCampaign.snapshot" width="100%" alt="Video snapshot">
              <v-btn @click="x.theCampaign.videoPlay = false" class="white hidden-sm-and-up" medium style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:30%" fab flat>
                <v-icon large class="secondary--text">play_arrow</v-icon>
              </v-btn>
              <v-btn @click="x.theCampaign.videoPlay = false" class="white hidden-xs-only" large style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:40%" fab flat>
                <v-icon large class="secondary--text">play_arrow</v-icon>
              </v-btn>
            </div>
            <div v-if="x.theCampaign.videoPlay" style="position:relative">
                <v-btn @click="x.theCampaign.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:37%" large fab flat class="white">
                  <v-icon large class="secondary--text">play_arrow</v-icon>
                </v-btn>
              <img style="min-height:200px" @click="x.theCampaign.videoPlay = false" :src="x.theCampaign.snapshot" width="100%" alt="Video snapshot">
            </div>
            <video v-show="!x.theCampaign.videoPlay" preload playsinline controls width="100%" :src="x.theCampaign.videoUrl.i"></video>
            <v-card-text>
              <v-chip small v-bind:key="c" v-for="c in x.theCampaign.competences" label color="success" text-color="white">
                <v-icon small class="pr-2">label</v-icon>{{ c }}
              </v-chip>
              <div class="body-2 grey--text text--darken-2 pt-1">
                    <span>{{ x.theCampaign.bransch }} <span v-bind:key="c" v-for="(c, index) in x.theCampaign.underCategory" v-show="x.theCampaign.underCategory.length > 0"><span v-show="index === 0">></span> {{ c }}<span v-show="index < x.theCampaign.underCategory.length - 1">,</span></span></span>
              </div>
                <span class="body-2 pr-2 success--text text--darken-1">
                  Region: <span class="grey--text text--darken-2" v-bind:key="c" v-for="(c, index) in x.theCampaign.region" v-show="x.theCampaign.region.length > 0"> {{ c }}<span v-show="index < x.theCampaign.region.length - 1">,</span></span>
                </span> |
                <span class="body-2 pl-2 success--text text--darken-1">
                  Nuvarande tjänst: <span class="body-2 grey--text text--darken-3">{{ x.theCampaign.nuvarande }}</span>
                </span>
                <div class="body-1">
                  <strong class="grey--text text--darken-2">Personligt meddelande:</strong> {{ x.msg }}
                </div>
            </v-card-text>
            <v-card-actions style="margin-top:-15px">
              <v-tooltip bottom>
                <v-btn slot="activator" small @click="sendInvitation(x)" block round class="success" flat>
                  <v-icon>send</v-icon>
                </v-btn>
                <span>Skapa inbjudan</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn slot="activator" small @click="showProfileFunc(x.theCampaign.profile)" block round class="primary ml-2" flat>
                  <v-icon>person</v-icon>
                </v-btn>
              <span>Visa profil</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <v-btn :loading="deletingApplicant" slot="activator" small @click="deleteApplicant(x.theCampaign.id)" block round class="secondary" flat>
                  <v-icon>close</v-icon>
                </v-btn>
                <span>Ta bort</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
      </v-card>
    </v-dialog>
  </div>

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
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

export default {
  data () {
    return {
      uploadingNewSnapshot: true,
      newAdObj: {
        title: '',
        bransch: '',
        underCategory: '',
        education: '',
        lastDay: '',
        omfattning: '',
        region: '',
        competences: [],
        about: '',
        getRealAbout: '',
        id: '',
        videoUrl: '',
        snapshot: '',
        applicants: ['xx'],
        corpDescription: '',
        active: true,
        businessDBId: this.$store.state.yourDatabaseString,
        userDBId: this.$store.state.theUserDBId,
        logo: '',
        corp: '',
        name: '',
        mail: ''
      },
      uploadingVideo: false,
      previewAd: false,
      valueDeterminate: '',
      fileUploadError: '',
      openAdInfoModal: false,
      currentAdOriginal: '',
      currentAd: '',
      uploadIsDoneModal: false,
      editAdModal: false,
      sendingUpdate: false,
      deleteNotification: false,
      omfattningItems: ['Alla', '100 %', '75 %', '50 %', '25 %'],
      kalenderWindow: false,
      showAllApplicantsModal: false,
      currentApplicants: '',
      currentProfiles: '',
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
      editModalJustBeenOpened: 0,
      showAdsSmall: false,
      deletingApplicant: false
    }
  },
  watch: {
    sendInvitationDialog: function () {
      if (this.sendInvitationDialog === false) {
        this.invitationStepper = 1
        this.invitationDate = []
      }
    },
    watchUndercategoryChange: function () {
      if (this.newAdObj.underCategory !== '' && this.newAdObj.bransch === '') {
        for (let i in this.$store.state.filter.bransch) {
          for (let ii in this.$store.state.filter.bransch[i]) {
            if (this.$store.state.filter.bransch[i][ii] === this.watchUndercategoryChange) {
              this.newAdObj.bransch = this.$store.state.filter.bransch[i].main
              setTimeout(() => {
                this.newAdObj.underCategory = this.$store.state.filter.bransch[i][ii]
              }, 100)
            }
          }
        }
      }
    },
    watchUploadVideoSnapshotUrl: function () {
      if (this.$store.state.adSnapshot.i !== undefined) {
        if (this.$store.state.adSnapshot.i.includes('http')) {
          // if (this.edit.value) {
          //   this.editCampaignObj.snapshot = this.$store.state.uploadVideoSnapshotUrlObject.i
          // } else {
          //   this.$store.state.uploadVideoSnapshotUrl = this.$store.state.uploadVideoSnapshotUrlObject.i
          //   this.snapshotUrl = this.$store.state.uploadVideoSnapshotUrlObject.i
          // }
          this.newAdObj.snapshot = this.$store.state.adSnapshot.i
          this.uploadingNewSnapshot = false
        }
      }
    }
  },
  methods: {
    test () {
      console.log(this.newAdObj)
    },
    showProfileFunc (profile) {
      if ((this.$store.state.corpObject.pricePlan.package === 1) && !this.$store.getters.freePlan) {
        // Om de har paket basic och trial är förbi
        this.basicPacketModal = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 2) && (this.$store.state.corpObject.pricePlan.sentRequests >= 20) && !this.$store.getters.freePlan) {
        // Om de har paket Guld, har skickat 20 förfrågningar och trial är förbi
        this.goldPacketModal = true
      } else {
        this.userProfileObj = profile
        this.showProfile = true
      }
    },
    deleteApplicant (user) {
      var global = this
      this.deletingApplicant = true
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/ads')
        .once('value', response => {
          const res = response.val()
          for (var i in res) {
            for (var ii in res[i].applicants) {
              if (res[i].applicants[ii].hasOwnProperty('theCampaign')) {
                if (res[i].applicants[ii].theCampaign.id === user) {
                  firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/ads/' + i + '/applicants/' + ii)
                    .remove()
                  .then(res => {
                    global.showAllApplicantsModal = false
                    global.openAdInfoModal = false
                    global.deletingApplicant = false
                  })
                }
              }
            }
          }
        })
      .catch(function (error) {
        console.log(error.message)
      })
    },
    sendInvitation (theUser) {
      var user = theUser.theCampaign
      if ((this.$store.state.corpObject.pricePlan.package === 1) && !this.$store.getters.freePlan) {
        // Om de har paket basic och trial är förbi
        this.basicPacketModal = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 2) && (this.$store.state.corpObject.pricePlan.sentRequests >= 20) && !this.$store.getters.freePlan) {
        // Om de har paket Guld, har skickat 20 förfrågningar och trial är förbi
        this.goldPacketModal = true
      } else if (theUser !== 1) {
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
          msg: 'Privatperson har fått intervjuerbjudande via annons!',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'fg'
        }
        let invitationObjectCopy = JSON.stringify(invitationObject)
        this.$store.commit('sendInvitationStore', JSON.parse(invitationObjectCopy))
        this.deleteApplicant(this.theInvUser.id)
      }
    },
    showApplicants (a) {
      var arr = []
      for (var i in a.applicants) {
        if (a.applicants[i].hasOwnProperty('campaign')) {
          if (a.applicants[i].hasOwnProperty('videoPlay')) {
            a.applicants[i].videoPlay = true
          }
          arr.push(a.applicants[i])
        }
      }
      this.currentApplicants = arr
      this.showAllApplicantsModal = true
    },
    editAd (what) {
      this.sendingUpdate = true
      var global = this
      this.currentAd.corpDescription = this.$store.state.corpObject.corpDescription
      var arr = this.currentAd.about.split(String.fromCharCode(10))
      var newArr = []
      arr.forEach(val => {
        if (val.length > 0) {
          newArr.push(val)
        }
      })
      this.currentAd.getRealAbout = newArr
      var theCorrectAd
      firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/ads')
        .once('value', response => {
          const res = response.val()
          for (var i in res) {
            if (res[i].id === global.currentAd.id) {
              theCorrectAd = i
            }
          }
          if (what === 'delete') {
            firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/ads/' + theCorrectAd)
              .remove()
            .then(res => {
              global.$store.commit('postToFirebaseAdsNode')
              global.editAdModal = false
              global.sendingUpdate = false
              global.deleteNotification = true
              global.openAdInfoModal = false
            })
          } else {
            firebase.database().ref('businessAccounts').child(global.$store.state.yourDatabaseString + '/corpInfo/users/' + global.$store.state.theUserDBId + '/user/ads/')
            .update({[theCorrectAd]: global.currentAd})
            .then(res => {
              global.$store.commit('postToFirebaseAdsNode')
              global.editAdModal = false
              global.sendingUpdate = false
              global.uploadIsDoneModal = true
              global.openAdInfoModal = false
            })
          }
        })
      .catch(function (error) {
        console.log(error.message)
      })
    },
    openAdInfo (ad) {
      this.editModalJustBeenOpened = 1
      this.currentAdOriginal = JSON.stringify(ad)
      this.currentAd = ad
      this.openAdInfoModal = true
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      this.uploadingVideo = true
      var global = this
      // Get file
      var file = event.target.files[0]
      // Create storage red
      var theUrl = new Date().getTime().toString()
      var storageRef = firebase.storage().ref('ads-videos/' + theUrl + file.name)
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
            return myStorage.ref('ads-videos/' + theUrl + file.name).getDownloadURL()
          }
          giveMe = getImageUrl()
          global.newAdObj.videoUrl = giveMe
          global.$store.state.uploadVideoUrl = giveMe
          global.uploadingVideo = false
        }
      )
      // SNAPSHOTTA VIDEON
      var fileReader = new FileReader()
      if (file.type.match('image')) {
        fileReader.readAsDataURL(file)
      } else {
        fileReader.onload = function () {
          var blob = new Blob([fileReader.result], {type: file.type})
          var url = URL.createObjectURL(blob)
          var video = document.createElement('video')
          var timeupdate = function () {
            if (snapImage()) {
              video.removeEventListener('timeupdate', timeupdate)
              video.pause()
            }
          }
          video.addEventListener('loadeddata', function () {
            if (snapImage()) {
              video.removeEventListener('timeupdate', timeupdate)
            }
          })
          var snapImage = function () {
            var canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
            var image = canvas.toDataURL()
            var success = image.length > 100
            if (success) {
              global.uploadSnapshotToFirebase(image)
              URL.revokeObjectURL(url)
            } else {
              // global.updateVideoBtn = false
            }
            return success
          }
          video.addEventListener('timeupdate', timeupdate)
          video.preload = 'metadata'
          video.src = url
          // Load video in Safari / IE11
          video.muted = true
          video.playsInline = true
          video.play()
        }
        fileReader.readAsArrayBuffer(file)
      }
    },
    uploadSnapshotToFirebase (image) {
      let global = this
      let nr = [2, 43, 25, 653, 323, 65, 'g4g', 's5df', 'a5s', 'we3f', 'gf5g', 'q5we', 13, 15, 16, 25, 65, 76, 5634, 35, 32, 'x1']
      let fileName = nr[Math.floor(Math.random() * 10)] + new Date().getTime() + this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName.split(' ')[1]
      let theImage = image.substr(22)
      let uploadTask = firebase.storage().ref('video-snapshots').child(fileName).putString(theImage, 'base64', {contentType: 'image/png'})
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // VISA INGET
        }, function (error) {
          console.log(error)
          global.uploadingNewSnapshot = false
        }, function () {
          // Upload completed successfully, now we can get the download URL
          var myStorage = firebase.storage()
          var giveMe
          var getImageUrl = function () {
            return myStorage.ref('video-snapshots').child(fileName).getDownloadURL()
          }
          giveMe = getImageUrl()
          global.$store.state.adSnapshot = giveMe
        }
      )
    },
    postToFirebase () {
      if ((this.$store.state.corpObject.pricePlan.package === 1) && (this.$store.state.corpObject.pricePlan.trialUntil.replace(/-/g, '') < new Date().toISOString().substr(0, 10).replace(/-/g, ''))) {
        // Om de har paket basic och trial är förbi
        this.basicPacketModal = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 2) && (this.$store.state.corpObject.pricePlan.ads >= 5) && (this.$store.state.corpObject.pricePlan.trialUntil.replace(/-/g, '') < new Date().toISOString().substr(0, 10).replace(/-/g, ''))) {
        // Om de har paket Guld, har skickat 20 förfrågningar och trial är förbi
        this.goldPacketModal = true
      } else {
        this.newAdObj.mail = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.email
        this.newAdObj.name = this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName
        this.newAdObj.logo = this.$store.state.corpObject.businessLogo.i
        this.newAdObj.corp = this.$store.state.corpObject.businessName
        this.newAdObj.corpDescription = this.$store.state.corpObject.corpDescription
        this.newAdObj.id = new Date().getTime()
        var arr = this.newAdObj.about.split(String.fromCharCode(10))
        var newArr = []
        arr.forEach(val => {
          if (val.length > 0) {
            newArr.push(val)
          }
        })
        this.newAdObj.getRealAbout = newArr
        firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/ads')
          .push(this.newAdObj)
        .then(res => {
          this.$store.commit('postToFirebaseAdsNode')
          this.uploadIsDoneModal = true
          this.newAdObj.title = ''
          this.newAdObj.bransch = ''
          this.newAdObj.underCategory = ''
          this.newAdObj.region = ''
          this.newAdObj.competences = []
          this.newAdObj.about = ''
          this.newAdObj.getRealAbout = ''
          this.newAdObj.videoUrl = ''
          this.newAdObj.lastDay = ''
          this.newAdObj.omfattning = ''
        })
        this.$store.state.corpObject.pricePlan.ads = (this.$store.state.corpObject.pricePlan.ads + 1)
        firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo')
          .update({pricePlan: this.$store.state.corpObject.pricePlan})
      }
    }
  },
  computed: {
    watchUploadVideoSnapshotUrl () {
      return this.$store.state.adSnapshot.i
    },
    watchUndercategoryChange () {
      return this.newAdObj.underCategory
    },
    updateButton () {
      return this.currentAdOriginal === JSON.stringify(this.currentAd)
    },
    showProfile: {
      get () { return this.$store.getters.userProfileObjGetter },
      set (value) { this.$store.commit('userProfileObjCommit', value) }
    },
    showUsersProfile: {
      get () { return this.$store.getters.showUsersProfileGetter },
      set (value) { this.$store.commit('showUsersProfileCommit', value) }
    },
    sendingInvitation: {
      get () { return this.$store.getters.sendingInvitationGetter },
      set (value) { this.$store.commit('sendingInvitationCommit', value) }
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
      if (this.invitationAd !== '' && this.$store.state.corpObject !== '') {
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
    appointmentsEventsDates () {
      return this.$store.state.appointmentsEventsDates
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
    jobbaAnnonser () {
      var arr = []
      if (this.$store.state.corpObject !== '') {
        for (var i in this.$store.state.corpObject.users) {
          for (var ii in this.$store.state.corpObject.users[i].user.ads) {
            if (this.$store.state.corpObject.users[i].user.ads[ii].hasOwnProperty('active')) {
              arr.push(this.$store.state.corpObject.users[i].user.ads[ii].title)
            }
          }
        }
      }
      return arr
    },
    currentUserName () {
      return this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName
    },
    corpDescriptionArr () {
      if (this.$store.state.corpObject !== '') {
        var arr = this.$store.state.corpObject.corpDescription.split(String.fromCharCode(10))
        var newArr = []
        arr.forEach(val => {
          if (val.length > 0) {
            newArr.push(val)
          }
        })
        return newArr
      }
    },
    getBranschArr () {
      var arr = []
      for (var i in this.$store.state.filter.bransch) {
        arr.push(this.$store.state.filter.bransch[i].main)
      }
      return arr
    },
    getBranschCategoryArr () {
      var arr = []
      if (this.newAdObj.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.$store.state.filter.bransch[i].main === this.newAdObj.bransch) {
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
      this.newAdObj.underCategory = ''
      arr.shift()
      return arr
    },
    getBranschCategoryArrEdit () {
      var arr = []
      if (this.currentAd.bransch !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.$store.state.filter.bransch[i].main === this.currentAd.bransch) {
            for (var ii in this.$store.state.filter.bransch[i]) {
              arr.push(this.$store.state.filter.bransch[i][ii])
            }
          }
        }
      }
      if (this.currentAd !== '' && this.editModalJustBeenOpened !== 1) {
        this.currentAd.underCategory = ''
      }
      this.editModalJustBeenOpened = 0
      arr.shift()
      return arr
    },
    allowPublicera () {
      if (this.newAdObj.videoUrl !== '') {
        if (this.newAdObj.videoUrl.hasOwnProperty('i')) {
          return this.newAdObj.title.length > 0 && this.newAdObj.bransch.length > 0 && this.newAdObj.about.length && this.newAdObj.lastDay !== '' && this.newAdObj.region !== '' && this.newAdObj.videoUrl.i !== undefined && !this.uploadingVideo && !this.uploadingNewSnapshot
        } else {
          return false
        }
      } else {
        return this.newAdObj.title.length > 0 && this.newAdObj.bransch.length > 0 && this.newAdObj.about.length && this.newAdObj.lastDay !== '' && this.newAdObj.region !== '' && !this.uploadingVideo
      }
    },
    getRealAbout () {
      var arr = this.newAdObj.about.split(String.fromCharCode(10))
      var newArr = []
      arr.forEach(val => {
        if (val.length > 0) {
          newArr.push(val)
        }
      })
      return newArr
    },
    filter () {
      return this.$store.state.filter
    },
    ads () {
      return this.$store.state.ads
    }
  },
  mounted () {
    if (this.$store.state.uploadVideoUrl !== '') {
      this.newAdObj.videoUrl = this.$store.state.uploadVideoUrl
    }
  }
}
</script>

