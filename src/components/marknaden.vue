<template>
<div class="grey lighten-3">
  <!-- FÖR smAndDown Inloggad -->
<section v-if="!$store.state.userIsNotLoggedIn">
  <v-layout mx-3 v-if="$vuetify.breakpoint.smAndDown">
    <v-btn @click="showFilterSmall = !showFilterSmall" small round outline block class="mt-4">
          FILTRERA
    </v-btn>
  </v-layout>
  <v-navigation-drawer
      v-model="showFilterSmall"
      fixed
      right
      clipped
      app
      style="z-index:20!important"
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <v-flex px-2 py-3 class="black--text" xs12>
            <div class="title">Filter</div>
            <v-autocomplete
              :items="getBranschMainArr"
              v-model="filterModels.bransch.main"
              label="Bransch"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.bransch.main = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="getBranschCategoryArr"
              v-model="$store.state.choosedUnderCategory"
              label="Underkategori"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="$store.state.choosedUnderCategory = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="filter.region"
              v-model="filterModels.region"
              label="Region"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.region = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-select
              :items="filter.minExp"
              v-model="filterModels.minExp"
              label="Min. arbetslivserfarenhet"
            >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.minExp = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <v-select
              :items="filter.utbildning"
              v-model="filterModels.utbildning"
              label="Min. utbildning"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.utbildning = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <div class="subheading success--text text--darken-3">Antal träffar: {{ presentations.length }} av {{ presentationsAll.length }}</div>
            <v-btn @click="cleanFilter" block round flat class="secondary">Rensa filter</v-btn>
          </v-flex>
    </v-navigation-drawer>
  <v-layout v-if="$vuetify.breakpoint.smAndDown" wrap>
    <v-flex my-2 px-3 xs12>
      <v-layout my-5 wrap v-if="presentationsAll === ''" justify-center>
            <v-flex mb-2 xs8>
              <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
              <span class="jobflix-title">
                <v-icon class="black--text play-icon-title">play_arrow</v-icon>
                <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              </span>
            </h1>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-flex>
        </v-layout>
          <div v-show="presentationsAll !== ''" class="subheading secondary--text text--darken-3">Antal träffar: {{ presentations.length }} av {{ presentationsAll.length }}</div>
        <v-layout py-5 wrap v-if="presentations.length === 0 && presentationsAll !== ''">
          <v-flex xs12 class="title text-xs-center pb-3">
            Inga träffar på denna sökning tyvärr...
          </v-flex>
          <v-btn @click="cleanFilter" block round outline>Rensa filter</v-btn>
      </v-layout>
    </v-flex>
    <v-flex v-bind:key="index" v-for="(user, index) in presentations" xs12>
      <v-card v-if="presentations !== ''" class="white mb-1" style="border-radius:0px!important">
        <v-card-title>
          <v-avatar
            size="28px"
          >
            <img
              :src="user.profile.profilePic.i"
              alt="Avatar"
            >
          </v-avatar>
          <span class="pl-2 body-2">{{ user.name }}</span><span>&nbsp;- {{ user.title }}</span>
        </v-card-title>
        <div v-if="user.videoPlay" style="position:relative">
            <v-btn @click="playSmall(index), user.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:30%" medium fab flat class="white">
              <v-icon large class="secondary--text">play_arrow</v-icon>
            </v-btn>
          <img style="min-height:200px" @click="playSmall(index), user.videoPlay = false" :src="user.snapshot" width="100%" alt="Video snapshot">
        </div>
        <video :id="`playSmall${index}`" playsinline v-show="!user.videoPlay" @play="onVideoEvent(user, 0)" width="100%" preload controls>
            <source :src="user.videoUrl.i" type="video/mp4">
            Your browser does not support HTML5 video.
        </video>
        <v-card-text>
            <div class="body-2">
              <v-chip style="margin-top:-6px;margin-bottom:10px" small v-bind:key="x" v-for="x in user.competences" label color="green" text-color="white">
                <v-icon small class="mr-1">label</v-icon>{{ x }}
              </v-chip>
            </div>
            <div class="body-2 grey--text text--darken-2">
              <span class="body-2 green--text text--darken-3">{{ user.bransch }}</span>
              <span v-bind:key="x" v-show="user.underCategory.length > 0" v-for="(x, index) in user.underCategory">
                <span v-show="index === 0">></span> 
                {{ x }}<span v-show="index !== user.underCategory.length - 1">,</span>
              </span>
            </div>
            <div class="body-2 green--text text--darken-3">
              Nuvarande tjänst: <span class="body-2 grey--text text--darken-2">{{ user.nuvarande }}</span>
            </div>
            <div>
              <span class="body-1">
                {{ user.msg }}
              </span>
            </div>
        </v-card-text>
        <v-card-actions style="margin-top:-15px">
          <v-btn flat @click="sendInvitation(user)" round small class="success">
            <v-icon>send</v-icon>
          </v-btn>
          <v-btn flat @click="showProfile(user.profile), onProfileEvent(user, 1)" round small class="primary">
            <v-icon>person</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="savePresentation(user)" flat round small class="grey darken-2" outline>
            <v-icon class="grey--text text--darken-2">save_alt</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</section>

  <!-- FÖR smAndDown EJ Inloggad -->
<section v-if="$store.state.userIsNotLoggedIn">
  <v-layout mx-3 v-if="$vuetify.breakpoint.smAndDown">
    <v-btn @click="showFilterSmall = !showFilterSmall" small round outline block class="mt-4">
          Filtrera <v-icon>{{ showFilterSmall ? 'arrow_drop_up' : 'arrow_drop_down' }}</v-icon>
    </v-btn>
  </v-layout>
  <v-navigation-drawer
      v-model="showFilterSmall"
      fixed
      right
      clipped
      app
      style="z-index:20!important"
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <v-flex px-2 py-3 class="black--text" xs12>
            <div class="title">Filter</div>
            <v-autocomplete
              :items="getBranschMainArr"
              v-model="filterModels.bransch.main"
              label="Bransch"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.bransch.main = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="getBranschCategoryArr"
              v-model="$store.state.choosedUnderCategory"
              label="Underkategori"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="$store.state.choosedUnderCategory = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="filter.region"
              v-model="filterModels.region"
              label="Region"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.region = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-select
              :items="filter.minExp"
              v-model="filterModels.minExp"
              label="Min. arbetslivserfarenhet"
            >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.minExp = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <v-select
              :items="filter.utbildning"
              v-model="filterModels.utbildning"
              label="Min. utbildning"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.utbildning = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <div class="subheading success--text text--darken-3">Antal träffar: {{ presentations.length }} av {{ presentationsAll.length }}</div>
            <v-btn @click="cleanFilter" block round flat class="secondary">Rensa filter</v-btn>
          </v-flex>
    </v-navigation-drawer>
  <v-layout v-if="$vuetify.breakpoint.smAndDown" wrap>
    <v-flex my-2 px-3 xs12>
      <v-layout my-5 wrap v-if="presentationsAll === ''" justify-center>
            <v-flex mb-2 xs8>
              <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
              <span class="jobflix-title">
                <v-icon class="black--text play-icon-title">play_arrow</v-icon>
                <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              </span>
            </h1>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-flex>
        </v-layout>
          <div v-show="presentationsAll !== ''" class="subheading secondary--text text--darken-3">Antal träffar: {{ presentations.length }} av {{ presentationsAll.length }}</div>
        <v-layout py-5 wrap v-if="presentations.length === 0 && presentationsAll !== ''">
          <v-flex xs12 class="title text-xs-center pb-3">
            Inga träffar på denna sökning tyvärr...
          </v-flex>
          <v-btn @click="cleanFilter" block round outline>Rensa filter</v-btn>
      </v-layout>
    </v-flex>
    <v-flex v-bind:key="user.id" v-for="user in presentations" xs12>
      <v-card v-if="presentations !== ''" class="white mb-1" style="border-radius:0px!important">
        <v-card-title>
          <v-avatar
            size="28px"
          >
            <img
              :src="user.profile.profilePic.i"
              alt="Avatar"
              style="filter:blur(2px)"
            >
          </v-avatar>
          <span style="filter:blur(3px)" class="pl-2 body-2">{{ user.name }}</span><span>&nbsp;- {{ user.title }}</span>
        </v-card-title>
        <div style="position:relative">
            <v-btn style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:30%" medium fab flat class="white">
              <v-icon large class="secondary--text">play_arrow</v-icon>
            </v-btn>
          <img style="filter:blur(5px);min-height:200px" :src="user.snapshot" width="100%" alt="Video snapshot">
        </div>
        <v-card-text>
            <div class="body-2">
              <v-chip style="margin-top:-6px;margin-bottom:10px" small v-bind:key="x" v-for="x in user.competences" label color="green" text-color="white">
                <v-icon small class="mr-1">label</v-icon>{{ x }}
              </v-chip>
            </div>
            <div class="body-2 grey--text text--darken-2">
              <span class="body-2 green--text text--darken-3">{{ user.bransch }}</span>
              <span v-bind:key="x" v-show="user.underCategory.length > 0" v-for="(x, index) in user.underCategory">
                <span v-show="index === 0">></span> 
                {{ x }}<span v-show="index !== user.underCategory.length - 1">,</span>
              </span>
            </div>
            <div class="body-2 green--text text--darken-3">
              Nuvarande tjänst: <span class="body-2 grey--text text--darken-2">{{ user.nuvarande }}</span>
            </div>
            <div>
              <span class="body-1">
                {{ user.msg }}
              </span>
            </div>
        </v-card-text>
        <v-card-actions style="margin-top:-15px">
          <v-btn disabled flat round small class="success">
            <v-icon>send</v-icon>
          </v-btn>
          <v-btn flat @click="userProfileObj = user.profile, showUsersProfileBlurred = true" round small class="primary">
            <v-icon>person</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn disabled flat round small class="grey darken-2" outline>
            <v-icon class="grey--text text--darken-2">save_alt</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</section>

<!-- FÖR mdAndUp INLOGGAD -->
<section v-if="!$store.state.userIsNotLoggedIn">
  <v-container id="containerMdAndUp" v-if="$vuetify.breakpoint.mdAndUp" style="max-width:1200px!important">
    <v-btn style="position:absolute;z-index:5" v-if="0" @click="test">TEST fr. marknaden</v-btn>
    <v-layout mt-2 justify-center row wrap>

      <v-flex xs12 md8 px-2>
        <v-layout wrap v-if="presentationsAll === ''" justify-center>
            <v-flex mt-5 xs4>
              <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
              <span class="jobflix-title">
                <v-icon class="black--text play-icon-title">play_arrow</v-icon>
                <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              </span>
            </h1>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-flex>
        </v-layout>
        <v-layout justify-center py-5 wrap v-if="presentations.length === 0 && presentationsAll !== ''">
          <v-flex xs12 class="title text-xs-center pb-3">
            Inga träffar på denna sökning tyvärr . . .
          </v-flex>
          <v-btn @click="cleanFilter" round outline>Rensa filter</v-btn>
      </v-layout>
        <v-layout v-bind:key="index" v-for="(user, index) in presentations" wrap>
          <v-card v-if="presentations.length > 0" style="width:100%" class="mx-3 px-2 mb-2 hoverVideo">
            <v-card-title>
                  <v-avatar
                    size="28px"
                  >
                    <img
                      :src="user.profile.profilePic.i"
                      alt="Avatar"
                    >
                  </v-avatar>
                  <span class="pl-2 body-2">{{ user.name }}</span><span>&nbsp;- {{ user.title }}</span>
            </v-card-title>
            <v-divider class="pb-2"></v-divider>
            <div v-if="user.videoPlay" style="position:relative">
                <v-btn large @click="playVideo(index), user.videoPlay = false" style="position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;top:39%" fab flat class="white">
                  <v-icon large class="secondary--text">play_arrow</v-icon>
                </v-btn>
              <img style="min-height:200px" @click="playVideo(index), user.videoPlay = false" :src="user.snapshot" width="100%" alt="Video snapshot">
            </div>
            <video :id="`playBig${index}`" v-show="!user.videoPlay" @play="onVideoEvent(user, 0)" width="100%" preload controls>
              <source :src="user.videoUrl.i" type="video/mp4">
              Your browser does not support HTML5 video.
            </video>
              <v-card-text>
                <div class="body-2">
                  <v-chip v-bind:key="x" v-for="x in user.competences" small outline color="green" text-color="green">#{{ x }}</v-chip>
                </div>
                <div class="pt-1">
                  <span class="body-2 grey--text text--darken-2"><span class="grey--text text--darken-3">{{ user.bransch }}</span>
                    <span v-bind:key="x" v-for="(x, index) in user.underCategory" v-show="user.underCategory !== '' && user.underCategory !== undefined"><span v-show="index === 0">></span> {{ x }}<span v-show="index < user.underCategory.length - 1">,</span></span>
                  </span>
                </div>
                <span class="body-2 pr-1 success--text text--darken-1">
                  Nuvarande tjänst: <span class="body-2 grey--text text--darken-3">{{ user.nuvarande }}</span>
                </span>|
                <span class="body-2 pl-1 success--text text--darken-1">
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
            <v-card-actions>
              <v-btn flat @click="sendInvitation(user)" class="green white--text" small round>
                Skicka inbjudan <v-icon small class="ml-1 white--text">send</v-icon>
              </v-btn>
              <v-btn @click="showProfile(user.profile), onProfileEvent(user, 1)" class="blue blue--text" small outline round>
                CV/Profil <v-icon class="ml-1" small>person</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="savePresentation(user)" class="grey grey--text text--darken-2 darken-2" small outline round>
                Spara <v-icon class="ml-1">save_alt</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-flex>
      
        <v-flex md4 class="hidden-sm-and-down" px-3 py-1>
          <v-layout style="border-top:1px solid;border-bottom:1px solid" class="grey--text text--lighten-2 imSticky" py-2 pl-2 row wrap>
          <v-flex class="black--text" xs12>
            <div class="title">Filter</div>
            <v-autocomplete
              :items="getBranschMainArr"
              v-model="filterModels.bransch.main"
              label="Bransch"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.bransch.main = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="getBranschCategoryArr"
              v-model="$store.state.choosedUnderCategory"
              label="Underkategori"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="$store.state.choosedUnderCategory = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="filter.region"
              v-model="filterModels.region"
              label="Region"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.region = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-select
              :items="filter.minExp"
              v-model="filterModels.minExp"
              label="Min. arbetslivserfarenhet"
            >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.minExp = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <v-select
              :items="filter.utbildning"
              v-model="filterModels.utbildning"
              label="Min. utbildning"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.utbildning = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <v-select
              :items="$store.state.filter.availability"
              v-model="$store.state.filterModels.availability"
              label="Tillgänglig senast"
            >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="$store.state.filterModels.availability = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>

            <v-autocomplete
              chips
              label="Tagga kompetenser (sorterar resultat)"
              :items="filter.competences"
              v-model="filterModels.competences"
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
            <div class="subheading success--text text--darken-3">Antal träffar: {{ presentations.length }} av {{ presentationsAll.length }}</div>
            <v-btn @click="cleanFilter" block round outline>Rensa filter</v-btn>
          </v-flex>
            <v-flex v-if="comingAppointments.length > 0 && $vuetify.clientHeight > 750" class="black--text" pt-1 xs12>
              <div class="subheading grey--text text--darken-2 my-2">Kommande möten: ({{ comingAppointments.length }} st.)</div>
              <div v-bind:key="x.id" v-for="(x, index) in comingAppointments">
                <v-layout v-if="index < 6" style="border-radius:15px" class="v-card white" px-2 py-2 my-2 align-center row wrap>
                  <v-flex md2>
                    <v-avatar
                      size="40px"
                    >
                    <img :src="x.userCampaign.profilePic" alt="Profilbild">
                  </v-avatar>
                  </v-flex>
                  <v-flex style="line-height:15px" md3>
                    <div class="body-1">{{ x.userCampaign.name }}</div>
                  </v-flex>
                  <v-flex style="line-height:15px" md7>
                    <div class="body-1 pb-1">{{ x.type }}</div>
                    <div v-if="x.type === 'Personligt möte'" class="body-1 primary--text text--darken-3">{{ x.adress }}</div>
                    <div class="success--text text--darken-2">
                      <div class="body-2">Tid: {{ x.acceptedTime.date }} kl. {{ x.acceptedTime.time }}</div>
                    </div>
                  </v-flex>
                </v-layout>
              </div>
              <div class="body-1 grey--text">Öppna kalender för mer...</div>
              <v-divider></v-divider>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
  </v-container>
</section>

<!-- FÖR mdAndUp EJ INLOGGAD -->
<section v-if="$store.state.userIsNotLoggedIn">
  <v-container id="containerMdAndUp" v-if="$vuetify.breakpoint.mdAndUp" style="max-width:1200px!important">
    <v-btn style="position:absolute;z-index:5" v-if="0" @click="test">TEST fr. marknaden</v-btn>
    <v-layout mt-4 justify-center row wrap>

      <v-flex xs12 md8 px-2>
        <v-layout wrap v-if="presentationsAll === ''" justify-center>
            <v-flex mt-5 xs4>
              <h1 class="display-1 text-xs-center mb-3 primary--text text--darken-2">
              <span class="jobflix-title">
                <v-icon class="black--text play-icon-title">play_arrow</v-icon>
                <span class="black--text jobflix-title1">Job</span><span class="jobflix-title2">flix</span>
              </span>
            </h1>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-flex>
        </v-layout>
        <v-layout justify-center class="py-5" wrap v-if="presentations.length === 0 && presentationsAll !== ''">
          <v-flex xs12 class="title text-xs-center pb-3">
            Inga träffar på denna sökning tyvärr . . .
          </v-flex>
          <v-btn @click="cleanFilter" round outline>Rensa filter</v-btn>
      </v-layout>
        <v-layout v-bind:key="user.id" v-for="user in presentations" wrap>
          <v-card v-if="presentations.length > 0" style="width:100%" class="mx-3 px-2 mb-3 hoverVideo">
            <v-card-title>
                  <v-avatar
                    size="28px"
                  >
                    <img
                      :src="user.profile.profilePic.i"
                      alt="Avatar"
                      style="filter:blur(3px)"
                    >
                  </v-avatar>
                  <span style="filter:blur(3px)" class="pl-2 body-2">{{ user.name }}</span><span>&nbsp;- {{ user.title }}</span>
            </v-card-title>
            <v-divider class="pb-2"></v-divider>
            <!--  TESTAR  -->
            <img style="filter:blur(5px);min-height:200px" :src="user.snapshot" width="100%" alt="Video">
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
                  Nuvarande tjänst: <span style="filter:blur(3px)" class="body-2 grey--text text--darken-3">{{ user.nuvarande }}</span>
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
            <v-card-actions>
              <v-btn disabled flat class="green white--text" small round>
                Skicka inbjudan <v-icon small class="ml-1 white--text">send</v-icon>
              </v-btn>
              <v-btn @click="userProfileObj = user.profile, showUsersProfileBlurred = true" class="blue blue--text" small outline round>
                CV/Profil <v-icon small class="ml-1">person</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn disabled class="grey grey--text text--darken-2 darken-2" small outline round>
                Spara <v-icon class="ml-1">save_alt</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-flex>
      
        <v-flex md4 class="hidden-sm-and-down" px-3 py-1>
          <v-layout style="border-top:1px solid;border-bottom:1px solid" class="grey--text text--lighten-2 imSticky" py-2 pl-2 row wrap>
          <v-flex class="black--text" xs12>
            <div class="title">Filter</div>
            <v-autocomplete
              :items="getBranschMainArr"
              v-model="filterModels.bransch.main"
              label="Bransch"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.bransch.main = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="getBranschCategoryArr"
              v-model="$store.state.choosedUnderCategory"
              label="Underkategori"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="$store.state.choosedUnderCategory = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-autocomplete
              :items="filter.region"
              v-model="filterModels.region"
              label="Region"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.region = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-autocomplete>
            <v-select
              :items="filter.minExp"
              v-model="filterModels.minExp"
              label="Min. arbetslivserfarenhet"
            >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.minExp = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <v-select
              :items="filter.utbildning"
              v-model="filterModels.utbildning"
              label="Min. utbildning"
            >
              <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="filterModels.utbildning = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
            <v-select
              :items="$store.state.filter.availability"
              v-model="$store.state.filterModels.availability"
              label="Tillgänglig senast"
            >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="JSON.stringify(data.item)"
                    class="v-chip--select-multi"
                    @click="$store.state.filterModels.availability = ''"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>

            <v-autocomplete
              chips
              label="Tagga kompetenser (sorterar resultat)"
              :items="filter.competences"
              v-model="filterModels.competences"
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
            <div class="subheading success--text text--darken-3">Antal träffar: {{ presentations.length }} av {{ presentationsAll.length }}</div>
            <v-btn @click="cleanFilter" block round outline>Rensa filter</v-btn>
          </v-flex>
            <v-flex v-if="comingAppointments.length > 0 && $vuetify.clientHeight > 750" class="black--text" pt-1 xs12>
              <div class="subheading grey--text text--darken-2 my-2">Kommande möten: ({{ comingAppointments.length }} st.)</div>
              <div v-bind:key="x.id" v-for="(x, index) in comingAppointments">
                <v-layout v-if="index < 6" style="border-radius:15px" class="v-card white" px-2 py-2 my-2 align-center row wrap>
                  <v-flex md2>
                    <v-avatar
                      size="35px"
                    >
                    <img :src="x.userCampaign.profilePic" alt="Profilbild">
                  </v-avatar>
                  </v-flex>
                  <v-flex style="line-height:15px" md3>
                    <div class="body-1">{{ x.userCampaign.name }}</div>
                  </v-flex>
                  <v-flex style="line-height:15px" md7>
                    <div class="body-1 pb-1">{{ x.type }}</div>
                    <div v-if="x.type === 'Personligt möte'" class="body-1 primary--text text--darken-3">{{ x.adress }}</div>
                    <div class="success--text text--darken-2">
                      <div class="body-2">Tid: {{ x.acceptedTime.date }} kl. {{ x.acceptedTime.time }}</div>
                    </div>
                  </v-flex>
                </v-layout>
              </div>
              <div class="body-1 grey--text">Öppna kalender för mer...</div>
              <v-divider></v-divider>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
  </v-container>
</section>

          <!-- DIALOG för FÖRHANDSGRANSKNING AV PROFIL EJ INLOGGAD -->
            <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" v-model="showUsersProfileBlurred" width="950" >
              <v-card v-if="userProfileObj !== ''">
                <v-card-title class="mb-5" v-if="$store.state.userIsNotLoggedIn">
                  <div class="closeModal">
                    <v-btn @click="showUsersProfileBlurred = false" fab small flat class="secondary">
                      <v-icon large>close</v-icon>
                    </v-btn>
                  </div>
                </v-card-title>
                <div style="filter:blur(3px)">
                 <v-flex :px-2="$vuetify.breakpoint.mdAndUp" :py-2="$vuetify.breakpoint.mdAndUp" class="grey lighten-3" xs12>
                    <v-card>
                      <v-layout v-show="$vuetify.breakpoint.mdAndUp" row>
                      <v-flex xs12>
                        <v-img height="180px" width="100%" :src="userProfileObj.backgroundImg.i">
                        </v-img>
                      </v-flex>
                      </v-layout>
                      <v-layout py-2 row wrap>
                        <v-flex pl-1 v-show="$vuetify.breakpoint.mdAndUp" xs2>
                            <v-img
                              style="border:3px solid lightgray;margin-top:-50px;border-radius:10px;filter:blur(5px)"
                              width="135px"
                              contain
                              :src="userProfileObj.profilePic.i"
                            ></v-img>
                        </v-flex>
                        <v-flex v-show="$vuetify.breakpoint.smAndDown" xs12>
                          <v-img
                            width="100%"
                            height="100px"
                            :src="userProfileObj.backgroundImg.i"
                          ></v-img>
                            <img
                              style="border:3px solid lightgray;margin-top:0px;position:absolute;top:10px;left:16px;border-radius:10px;filter:blur(5px)"
                              :src="userProfileObj.profilePic.i"
                              height="95px"
                            >
                        </v-flex>
                      <v-flex pl-2 md9 xs12 :pr-2="$vuetify.breakpoint.mdAndDown">
                      <div class="text-xs-left display-1 pt-3" style="font-weight:bold;filter:blur(5px)">
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
                            <v-divider class="teal my-1"></v-divider>
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
                            <v-divider class="teal my-1"></v-divider>
                            <v-layout py-3 row wrap>
                              <v-flex style="position:relative" class="mb-3" v-bind:key="school.id" v-for="school in userProfileObj.education" xs12>
                                <div class="body-2 grey--text">
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
                </div>
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
                      <v-btn flat round @click="invitationStepper = 1" block class="secondary lighten-1">Tillbaka</v-btn>
                      <v-btn flat round @click="invitationStepper = 3" block class="success">Nästa</v-btn>
                      <v-btn flat round @click="sendInvitationDialog = false" block class="secondary">Avsluta</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="3">
                  <v-card>
                    <v-card-title class="justify-center">
                      <div style="margin-top:-10px" class="title">Sammanfattning</div>
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
                      <v-btn flat round @click="invitationStepper = 2" block class="secondary lighten-1">Tillbaka</v-btn>
                      <v-btn flat round @click="sendInvitation(1), sendInvitationDialog = false" block class="success">
                        Skicka
                        <v-icon small class="ml-1">send</v-icon>
                      </v-btn>
                      <v-btn flat round @click="sendInvitationDialog = false" block class="secondary">Avsluta</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
      </v-dialog>

      <v-dialog max-width="400px" v-model="savedPresentationModal">
        <v-card>
          <v-card-title class="success lighten-1 justify-center">
            <div class="title white--text">
              Sparad <v-icon class="white--text">check_circle</v-icon>
            </div>
          </v-card-title>
          <v-card-text class="py-3 px-3">
            Du hittar dina sparade presentationer i menyn när
            du klickar på "<v-icon>save_alt</v-icon>" ikonen.
          </v-card-text>
          <v-card-actions>
            <v-btn round @click="savedPresentationModal = false" flat outline block class="primary primary--text">Ok!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="canNotSavePresentation" max-width="400">
        <v-card>
          <v-card-title class="primary lighten-3 justify-center">
            <div class="title white--text">
              Du måste uppgradera
            </div>
          </v-card-title>
          <v-card-text>
            <div class="body-1">
              Du måste uppgradera till antingen Guld eller Platinum för att kunna spara presentationer.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn round @click="canNotSavePresentation = false" class="secondary lighten-1" flat block>OK!</v-btn>
            <v-btn round @click="$router.push('/prisplaner')" class="success lighten-1" flat block>Till prisplaner</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="waitForCorpObjectFirst" max-width="400">
        <v-card>
          <v-card-title>
            <div class="subheading text-xs-center">
              Testa igen om några sekunder, ditt företags data måste hämtas först . . .
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn @click="waitForCorpObjectFirst = false" round block outline>OK!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

</div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      waitForCorpObjectFirst: false,
      canNotSavePresentation: false,
      // userProfileObj: '',
      // showUsersProfile: false,
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
      showFilterSmall: false,
      savedPresentationModal: false,
      pageJustBeenLoaded: 0,
      showUsersProfileBlurred: false
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
    videoHasBeenViewed () {
      return this.$store.state.videoHasBeenViewed
    },
    profileHasBeenViewed () {
      return this.$store.state.profileHasBeenViewed
    },
    userProfileObj: {
      get () { return this.$store.getters.userProfileObjGetter },
      set (value) { this.$store.commit('userProfileObjCommit', value) }
    },
    showUsersProfile: {
      get () { return this.$store.getters.showUsersProfileGetter },
      set (value) { this.$store.commit('showUsersProfileCommit', value) }
    },
    presentationsAll: {
      get () { return this.$store.getters.presentationsAllGetter },
      set (value) { this.$store.commit('presentationsAllCommit', value) }
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
      if (this.$store.state.filterModels.bransch.main !== '') {
        for (var i in this.$store.state.filter.bransch) {
          if (this.$store.state.filter.bransch[i].main === this.$store.state.filterModels.bransch.main) {
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
      if (this.pageJustBeenLoaded === 1) {
        this.$store.state.choosedUnderCategory = ''
      }
      this.pageJustBeenLoaded = 1
      arr.shift()
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
    presentations () {
      var arr = []
      if (this.presentationsAll !== '') {
        this.presentationsAll.forEach((val, index) => {
          val.competencesMatches = 0
          if (val.status === '') {
            val.availability = 0
          } else if (val.status === 'Tillgänglig direkt') {
            val.availability = 1
          } else if (val.status === '1 månad') {
            val.availability = 2
          } else if (val.status === '3 månader') {
            val.availability = 3
          } else if (val.status === '6 månader') {
            val.availability = 4
          }
          if ((val.bransch === this.$store.state.filterModels.bransch.main || this.$store.state.filterModels.bransch.main === '') && (val.region.includes(this.$store.state.filterModels.region) || this.$store.state.filterModels.region === '' || this.$store.state.filterModels.region === 'Hela Sverige') && (val.underCategory.includes(this.$store.state.choosedUnderCategory) || this.$store.state.choosedUnderCategory === '' || this.$store.state.choosedUnderCategory === this.$store.state.filterModels.bransch.main)) {
            if (this.$store.state.filterModels.utbildning === 'Högskola') {
              if (val.highestEducation >= 3) {
                if (this.$store.state.filterModels.availability === 'Visa alla' || this.$store.state.filterModels.availability === '') {
                  if (val.availability >= 0) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === 'Tillgänglig direkt') {
                  if (val.availability === 1) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '1 månad') {
                  if (val.availability <= 2) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '3 månader') {
                  if (val.availability <= 3) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '6 månader') {
                  if (val.availability <= 4) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                }
              }
            } else if (this.$store.state.filterModels.utbildning === 'Yrkeshögskola') {
              if (val.highestEducation >= 2) {
                if (this.$store.state.filterModels.availability === 'Visa alla' || this.$store.state.filterModels.availability === '') {
                  if (val.availability >= 0) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === 'Tillgänglig direkt') {
                  if (val.availability === 1) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '1 månad') {
                  if (val.availability <= 2) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '3 månader') {
                  if (val.availability <= 3) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '6 månader') {
                  if (val.availability <= 4) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                }
              }
            } else if (this.$store.state.filterModels.utbildning === 'Gymnasium') {
              if (val.highestEducation >= 1) {
                if (this.$store.state.filterModels.availability === 'Visa alla' || this.$store.state.filterModels.availability === '') {
                  if (val.availability >= 0) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === 'Tillgänglig direkt') {
                  if (val.availability === 1) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '1 månad') {
                  if (val.availability <= 2) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '3 månader') {
                  if (val.availability <= 3) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '6 månader') {
                  if (val.availability <= 4) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                }
              }
            } else if (this.$store.state.filterModels.utbildning === 'Grundskola' || this.$store.state.filterModels.utbildning === 'Alla' || this.$store.state.filterModels.utbildning === '') {
              if (val.highestEducation >= 0) {
                if (this.$store.state.filterModels.availability === 'Visa alla' || this.$store.state.filterModels.availability === '') {
                  if (val.availability >= 0) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === 'Tillgänglig direkt') {
                  if (val.availability === 1) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '1 månad') {
                  if (val.availability <= 2) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '3 månader') {
                  if (val.availability <= 3) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                } else if (this.$store.state.filterModels.availability === '6 månader') {
                  if (val.availability <= 4) {
                    if (this.$store.state.filterModels.minExp === 'Visa alla' || this.$store.state.filterModels.minExp === '') {
                      arr.push(val)
                    } else if (this.$store.state.filterModels.minExp === '1 år') {
                      if (val.yearsExperience >= 1) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '2 år') {
                      if (val.yearsExperience >= 2) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '3 år') {
                      if (val.yearsExperience >= 3) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '4 år') {
                      if (val.yearsExperience >= 4) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '5 år') {
                      if (val.yearsExperience >= 5) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '8 år') {
                      if (val.yearsExperience >= 8) {
                        arr.push(val)
                      }
                    } else if (this.$store.state.filterModels.minExp === '10 år eller mer') {
                      if (val.yearsExperience >= 10) {
                        arr.push(val)
                      }
                    }
                  }
                }
              }
            }
          }
        })
        if (this.$store.state.filterModels.competences.length > 0) {
          for (var i in this.$store.state.filterModels.competences) {
            arr.forEach(val => {
              if (val.competences.includes(this.$store.state.filterModels.competences[i])) {
                val.competencesMatches = (val.competencesMatches + 1)
              }
            })
          }
          arr.sort((a, b) => {
            return b.competencesMatches - a.competencesMatches
          })
        } else {
          arr.sort((a, b) => {
            return b.timeStamp - a.timeStamp
          })
        }
      }
      return arr
    },
    filter () {
      return this.$store.state.filter
    },
    filterModels () {
      return this.$store.state.filterModels
    },
    comingAppointments () {
      var arr = []
      var time = []
      var theMonth
      var theDate = new Date().toString().split(' ').splice(1, 4)
      time.push(theDate[2])
      switch (theDate[0]) {
        case 'Jan':
          theMonth = '01'
          break
        case 'Feb':
          theMonth = '02'
          break
        case 'Mar':
          theMonth = '03'
          break
        case 'Apr':
          theMonth = '04'
          break
        case 'May':
          theMonth = '05'
          break
        case 'Jun':
          theMonth = '06'
          break
        case 'Jul':
          theMonth = '07'
          break
        case 'Aug':
          theMonth = '08'
          break
        case 'Sep':
          theMonth = '09'
          break
        case 'Oct':
          theMonth = '10'
          break
        case 'Nov':
          theMonth = '11'
          break
        case 'Dec':
          theMonth = '12'
          break
      }
      time.push(theMonth)
      time.push(theDate[1])
      var theTime = time.join(' ').replace(/ /g, '-')
      this.$store.state.comingAppointments.forEach(val => {
        if (val.acceptedTime.date >= theTime) {
          arr.push(val)
        }
      })
      arr.sort((a, b) => {
        return a.acceptedTime.date - b.acceptedTime.date
      })
      return arr
    },
    currentUserName () {
      return this.$store.state.corpObject.users[this.$store.state.theUserDBId].user.fullName
    },
    invitationDateObj () {
      var arr = []
      this.invitationDate.forEach((val, index) => {
        arr.push({})
        arr[index].date = val
        arr[index].time = '11.00'
      })
      return arr
    }
  },
  methods: {
    test () {
      console.log(this.$store.state.corpObject)
    },
    playVideo (index) {
      const playVideo = `playBig${index}`
      document.querySelector(`#${playVideo}`).play()
    },
    playSmall (index) {
      const playVideo = `playSmall${index}`
      document.querySelector(`#${playVideo}`).play()
    },
    cleanFilter () {
      // Rensa filter
      var cleanFilterModel = {
        region: '',
        minExp: '',
        utbildning: '',
        bransch: {
          initial: 0,
          main: ''
        },
        competences: [],
        availability: ''
      }
      this.$store.state.filterModels = cleanFilterModel
    },
    savePresentation (user) {
      let stat = 0
      if (this.$store.state.corpObject.pricePlan.package > 1 || this.$store.getters.freePlan) {
        for (var i in this.$store.state.savedPresentations) {
          if (this.$store.state.savedPresentations[i].id === user.id) {
            stat = 1
          }
        }
        if (stat === 0) {
          firebase.database().ref('businessAccounts').child(this.$store.state.yourDatabaseString + '/corpInfo/users/' + this.$store.state.theUserDBId + '/user/events/savedProfiles')
          .push(user)
          this.savedPresentationModal = true
        } else {
          alert('Du har redan sparat denna presentation')
        }
      } else {
        this.canNotSavePresentation = true
      }
    },
    sendInvitation (user) {
      if (this.$store.state.corpObject === '') {
        this.waitForCorpObjectFirst = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 1) && !this.$store.getters.freePlan) {
        // Om de har paket basic och trial är förbi
        this.basicPacketModal = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 2) && (this.$store.state.corpObject.pricePlan.sentRequests >= 20) && !this.$store.getters.freePlan) {
        // Om de har paket Guld, har skickat 20 förfrågningar och trial är förbi
        this.goldPacketModal = true
      } else if (user !== 1) {
        // Gör som vanligt om de antingen har platinum eller trial
        if (!user.invitationsUsers.includes(this.$store.state.user.id)) {
          this.sendInvitationDialog = true
          this.theInvUser = user
        } else {
          alert('Du har redan en förfrågan eller ett bokat möte via denna presentation.')
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
        invitationObject.logo = this.$store.state.corpObject.businessLogo.i
        let theDBKey = firebase.database().ref().push().key
        invitationObject.dbKey = theDBKey
        invitationObject.adminNotification = {
          notificationTo: 'Privatperson',
          name: invitationObject.userCampaign.name,
          mail: invitationObject.userCampaign.email,
          kampanj: invitationObject.userCampaign.campaignName,
          msg: 'Privatperson har fått intervjuerbjudande via marknaden!',
          time: new Date().toISOString().substr(0, 19).replace('T', ' '),
          id: new Date().getTime() + 'ff'
        }
        let invitationObjectCopy = JSON.stringify(invitationObject)
        this.$store.commit('sendInvitationStore', JSON.parse(invitationObjectCopy))
        this.sendInvitationDialog = false
      }
    },
    onProfileEvent (campaign, nr) {
      if (!this.profileHasBeenViewed.includes(campaign.id)) {
        this.profileHasBeenViewed.push(campaign.id)
        this.onVideoOrProfileEvent(campaign, nr)
      }
    },
    onVideoEvent (campaign, nr) {
      if (!this.videoHasBeenViewed.includes(campaign.id)) {
        this.videoHasBeenViewed.push(campaign.id)
        this.onVideoOrProfileEvent(campaign, nr)
      }
    },
    onVideoOrProfileEvent (campaign, nr) {
      if (!this.$store.state.corpObject.hasOwnProperty('admin') && !this.$store.state.corpObject.hasOwnProperty('fake') && this.$store.state.corpObject.businessName !== undefined) {
        var global = this
        var uniqueViewers
        var uniqueViews
        var campaignId
        var theNewNotification = []
        var notification = {date: new Date().toString().split(' ').splice(1, 4).join(' ')}
        var getRealNotifications
        if (nr === 0) {
          notification.msg = 'Någon på ' + global.$store.state.corpObject.businessName + ' har sett "' + campaign.campaignName + '"'
          uniqueViewers = 'uniqueVideoViewers'
          uniqueViews = 'uniqueVideoViews'
        } else if (nr === 1) {
          notification.msg = 'Någon på ' + global.$store.state.corpObject.businessName + ' har besökt din profil.'
          uniqueViewers = 'uniqueProfileViewers'
          uniqueViews = 'uniqueProfileViews'
        }
        firebase.database().ref('applicants').child(campaign.applicantDBId + '/profileInfo')
          .once('value', response => {
            const res = response.val()
            getRealNotifications = (res.events.notifications[0] + 1)
            res.events.notifications[0] = getRealNotifications
            res.events.notifications.splice(1, 0, notification)
            theNewNotification = res.events.notifications
            for (var y in res.campaigns) {
              if (res.campaigns[y].id === campaign.id) {
                campaignId = y
              }
            }
            if (!campaign[uniqueViewers].includes(global.$store.state.user.id) && campaignId !== undefined) {
              campaign[uniqueViews]++
              campaign[uniqueViewers].push(global.$store.state.user.id)
              global.updateStat(campaign, 'campaign', theNewNotification, campaign.applicantDBId, campaignId)
            } else if (campaignId !== undefined) {
              global.updateStat(campaign, 'x', theNewNotification, campaign.applicantDBId, 'xx')
            }
          })
        .catch(function (error) {
          console.log(error.message)
        })
      }
    },
    updateStat (campaign, what, theNewNotification, applicantDBId, campaignId) {
      if (what === 'campaign') {
        // Uppdatera kampanjdata
        firebase.database().ref('applicants').child(applicantDBId + '/profileInfo/campaigns/')
          .update({[campaignId]: campaign})
        firebase.database().ref('presentations').child(applicantDBId)
          .update({[campaignId]: campaign})
        // Uppdatera eventdata
        firebase.database().ref('applicants').child(applicantDBId + '/profileInfo/events/')
          .update({notifications: theNewNotification})
      } else {
        firebase.database().ref('applicants').child(applicantDBId + '/profileInfo/events/')
          .update({notifications: theNewNotification})
      }
    },
    showProfile (profile) {
      if (this.$store.state.corpObject === '') {
        this.waitForCorpObjectFirst = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 1) && !this.$store.getters.freePlan) {
        // Om de har paket basic och trial är förbi
        this.basicPacketModal = true
      } else if ((this.$store.state.corpObject.pricePlan.package === 2) && (this.$store.state.corpObject.pricePlan.sentRequests >= 20) && !this.$store.getters.freePlan) {
        // Om de har paket Guld, har skickat 20 förfrågningar och trial är förbi
        this.goldPacketModal = true
      } else {
        this.userProfileObj = profile
        this.showUsersProfile = true
      }
    }
  },
  created () {
    if (this.$store.state.user === null && this.$store.state.presentationsAll === '') {
      this.$store.commit('notLoggedInFunctions')
    }
  }
}
</script>
