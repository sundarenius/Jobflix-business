import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    adSnapshot: {i: ''},
    getLatestsProfileInfoOnce: 0,
    userProfileObj: '',
    showUsersProfile: false,
    videoHasBeenViewed: [],
    profileHasBeenViewed: [],
    presentationsAll: '',
    basicPacketModal: false,
    goldPacketModal: false,
    sendingInvitation: false,
    invitationWasSuccessfullySent: false,
    userIsNotLoggedIn: false,
    signUpDialog: false,
    logInModal: false,
    ads: '',
    choosedUnderCategory: '',
    filter: {
      region: [],
      minExp: [],
      utbildning: [],
      bransch: [],
      competences: [],
      availability: []
    },
    filterModels: {
      region: '',
      minExp: '',
      utbildning: '',
      bransch: {
        initial: 0,
        main: ''
      },
      competences: [],
      availability: ''
    },
    bevakningar: '',
    user: null,
    loadingUser: false,
    authError: null,
    corpObject: '',
    corpInfo: {
      businessName: '',
      employeeSize: '',
      orgNr: ''
    },
    userInfo: {
      userName: '',
      email: ''
    },
    countries: ['Sweden', 'Finland', 'Norway', 'Denmark', 'Poland', 'UK', 'Iceland', 'USA'],
    employeeSize: ['1 - 10', '10 - 20', '20 - 50', '50 - 100', '100 - 200', '200 - 500', '500 - 1.000', '1.000 eller mer'],
    appointmentsEventsDates: [],
    comingAppointments: [],
    savedPresentations: [],
    yourDatabaseString: '',
    theUserDBId: '',
    uploadVideoUrl: ''
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loadingUser = payload
    },
    setError (state, payload) {
      state.authError = payload
    },
    clearError (state) {
      state.error = null
    },
    userEmail (state, payload) {
      state.userInfo.email = payload
    },
    userName (state, payload) {
      state.userInfo.userName = payload
    },
    businessName (state, payload) {
      state.corpInfo.businessName = payload
    },
    orgNr (state, payload) {
      state.corpInfo.orgNr = payload
    },
    employeersSize (state, payload) {
      state.corpInfo.employeeSize = payload
    },
    signUpDialog (state, payload) {
      state.signUpDialog = payload
    },
    logInModal (state, payload) {
      state.logInModal = payload
    },
    userProfileObjCommit (state, payload) {
      state.userProfileObj = payload
    },
    showUsersProfileCommit (state, payload) {
      state.showUsersProfile = payload
    },
    welcomeModalCommit (state, payload) {
      state.corpObject.users[state.theUserDBId].user.welcomeModal = payload
    },
    presentationsAllCommit (state, payload) {
      state.presentationsAll = payload
    },
    basicPacketModalCommit (state, payload) {
      state.basicPacketModal = payload
    },
    goldPacketModalCommit (state, payload) {
      state.goldPacketModal = payload
    },
    sendingInvitationCommit (state, payload) {
      state.sendingInvitation = payload
    },
    invitationWasSuccessfullySentCommit (state, payload) {
      state.invitationWasSuccessfullySent = payload
    },
    notLoggedInFunctions (state) {
      const arr = []
      const theUrl = 'https://instawork-814df.firebaseio.com/presentationsOffical.json'
      fetch(theUrl)
      .then(res => {
        return res.json()
      })
      .then(data => {
      // firebase.database().ref('presentationsOffical').once('value', response => {
        // const res = response.val()
        const res = data
        for (var x in res) {
          for (var xx in res[x]) {
            if (res[x][xx].active) {
              arr.push(res[x][xx])
            }
          }
        }
        state.presentationsAll = arr
        const url = 'https://prisio-b9e89.firebaseio.com/filter.json'
        fetch(url)
        .then(res => {
          return res.json()
        })
        .then(data => {
          const res = data
          state.filter.region = res.region
          state.filter.minExp = res.minExp
          state.filter.utbildning = res.education
          state.filter.bransch = res.categories
          res.tags.sort()
          state.filter.competences = res.tags
          state.filter.availability = res.availability
        })
        .catch(function (error) {
          console.log(error)
        })
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    loggedInFunctions (state) {
      state.presentationsAll = ''
      const arr = []
      firebase.database().ref('presentations').once('value', response => {
        const res = response.val()
        for (var x in res) {
          for (var xx in res[x]) {
            if (res[x][xx].active) {
              res[x][xx].videoPlay = true
              arr.push(res[x][xx])
              if (Object.keys(state.presentationsAll).length >= 100 && state.corpObject.pricePlan.trialUntil.replace(/-/g, '') < new Date().toISOString().substr(0, 10).replace(/-/g, '') && state.corpObject.pricePlan.package === 1) {
                res[x][xx].name = 'Censurerat Namn'
                res[x][xx].profile.fullName = 'Censurerat Namn'
              }
            }
          }
        }
        state.presentationsAll = arr
        const url = 'https://prisio-b9e89.firebaseio.com/filter.json'
        fetch(url)
        .then(res => {
          return res.json()
        })
        .then(data => {
          const res = data
          state.filter.region = res.region
          state.filter.minExp = res.minExp
          state.filter.utbildning = res.education
          state.filter.bransch = res.categories
          res.tags.sort()
          state.filter.competences = res.tags
          state.filter.availability = res.availability
        })
        .catch(function (error) {
          console.log(error)
        })
      })
    },
    updateBusinessUserDB (state) {
      let newObj
      firebase.database().ref('businessUsers').once('value', response => {
        const res = response.val()
        for (let i in res) {
          if (res[i].b === state.yourDatabaseString) {
            res[i].d = state.corpObject.orgNr
            res[i].e = state.corpObject.businessName
            newObj = res[i]
            firebase.database().ref('businessUsers').update({[i]: newObj})
          }
        }
      })
    },
    pushToBevakningDBNode (state) {
      firebase.database().ref('bevakningar').child(state.user.id)
        .set(state.corpObject.users[state.theUserDBId].user.bevakningar)
    },
    postToFirebaseAdsNode (state) {
      firebase.database().ref('ads').child(state.user.id)
        .set(state.corpObject.users[state.theUserDBId].user.ads)
    },
    sendInvitationStore (state, invitationObject) {
      state.sendingInvitation = true
      // Släng in requesten till applicanten
      let sendToApplicant = firebase.database().ref('applicants').child(invitationObject.userCampaign.applicantDBId + '/profileInfo/events/requests')
        .push(invitationObject)
      // För företags usern
      let corpUserRequests = state.corpObject.users[state.theUserDBId].user.events.requests
      // Kolla om requests är objekt, är den array så gör vi om den till objekt
      if (corpUserRequests.splice) {
        let obj = {}
        corpUserRequests.forEach((val, index) => {
          if (val.hasOwnProperty('dbKey')) {
            obj[val.dbKey] = val
          } else {
            obj[index] = val
          }
        })
        obj[invitationObject.dbKey] = invitationObject
        corpUserRequests = obj
      } else {
        corpUserRequests[invitationObject.dbKey] = invitationObject
      }
      // corpUserRequests[0]++
      let updateBusiness = firebase.database().ref('businessAccounts').child(state.yourDatabaseString + '/corpInfo/users/' + state.theUserDBId + '/user/events/')
        .update({requests: corpUserRequests})
      Promise.all([sendToApplicant, updateBusiness])
      .then(res => {
        state.sendingInvitation = false
        state.invitationWasSuccessfullySent = true
      })
      // Denna hämtar kampanjId once för att se om kampanjen är kvar och isåfall lägga till userId i kampanjen
      firebase.database().ref('applicants').child(invitationObject.userCampaign.applicantDBId)
      .once('value', response => {
        const res = response.val()
        // Function för att uppdatera 'applicantens' kampanj med företagarens userId
        for (var y in res.profileInfo.campaigns) {
          if (res.profileInfo.campaigns[y].id === invitationObject.userCampaign.id) {
            firebase.database().ref('applicants').child(invitationObject.userCampaign.applicantDBId + '/profileInfo/campaigns/')
              .update({[y]: invitationObject.userCampaign})
          }
        }
      })
      .catch(function (error) {
        console.log(error.message)
      })
      // TILLFÄLLIG LÖSNING SOM SKICKAR NOTIFIKATION TILL ADMIN START **************
      firebase.database().ref('admin').child('notifications')
        .push(invitationObject.adminNotification)
      // TILLFÄLLIG LÖSNING SOM SKICKAR NOTIFIKATION TILL ADMIN SLUT **************
      // Uppdaterar antal requests skickade om Guldpaket är aktivt
      if (state.corpObject.pricePlan.package === 2) {
        state.corpObject.pricePlan.sentRequests = (state.corpObject.pricePlan.sentRequests + 1)
        firebase.database().ref('businessAccounts').child(state.yourDatabaseString + '/corpInfo/')
          .update({pricePlan: state.corpObject.pricePlan})
      }
      // Kolla om videon finns i bevakningar, annonser eller i sparade presentationer o ta bort **************
      let campaignWasFound = 0
      for (let i in state.corpObject.users[state.theUserDBId].user.ads) {
        if (state.corpObject.users[state.theUserDBId].user.ads[i].hasOwnProperty('id')) {
          for (let ii in state.corpObject.users[state.theUserDBId].user.ads[i].applicants) {
            if (state.corpObject.users[state.theUserDBId].user.ads[i].applicants[ii].hasOwnProperty('campaign')) {
              if (state.corpObject.users[state.theUserDBId].user.ads[i].applicants[ii].theCampaign.id === invitationObject.userCampaign.id) {
                delete state.corpObject.users[state.theUserDBId].user.ads[i].applicants[ii]
                campaignWasFound = 1
              }
            }
          }
        }
      }
      for (let i in state.corpObject.users[state.theUserDBId].user.bevakningar) {
        if (state.corpObject.users[state.theUserDBId].user.bevakningar[i].hasOwnProperty('id')) {
          for (let ii in state.corpObject.users[state.theUserDBId].user.bevakningar[i].presentations) {
            if (state.corpObject.users[state.theUserDBId].user.bevakningar[i].presentations[ii].hasOwnProperty('id')) {
              if (state.corpObject.users[state.theUserDBId].user.bevakningar[i].presentations[ii].id === invitationObject.userCampaign.id) {
                delete state.corpObject.users[state.theUserDBId].user.bevakningar[i].presentations[ii]
                campaignWasFound = 1
              }
            }
          }
        }
      }
      for (let i in state.corpObject.users[state.theUserDBId].user.events.savedProfiles) {
        if (state.corpObject.users[state.theUserDBId].user.events.savedProfiles[i].hasOwnProperty('id')) {
          if (state.corpObject.users[state.theUserDBId].user.events.savedProfiles[i].id === invitationObject.userCampaign.id) {
            delete state.corpObject.users[state.theUserDBId].user.events.savedProfiles[i]
            campaignWasFound = 1
          }
        }
      }
      if (campaignWasFound === 1) {
        let newUserObj = state.corpObject.users[state.theUserDBId].user
        firebase.database().ref('businessAccounts').child(state.yourDatabaseString + '/corpInfo/users/' + state.theUserDBId)
          .update({user: newUserObj})
      }
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      commit('userEmail', payload.email)
      commit('userName', payload.userName)
      commit('businessName', payload.businessName)
      commit('orgNr', payload.orgNr)
      commit('employeersSize', payload.employersNr)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            commit('signUpDialog', false)
            const newUser = {
              id: user.user.uid
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.user.uid
            }
            commit('setUser', newUser)
            commit('logInModal', false)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            // commit('logInModal', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      location.reload()
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    freePlan (state) {
      return Object.keys(state.presentationsAll).length < 100 ||
      state.corpObject.pricePlan.trialUntil.replace(/-/g, '') >= new Date().toISOString().substr(0, 10).replace(/-/g, '')
    },
    presentationsAboveHundred (state) {
      return Object.keys(state.presentationsAll).length >= 100
    },
    showUsersProfileGetter (state) {
      return state.showUsersProfile
    },
    userProfileObjGetter (state) {
      return state.userProfileObj
    },
    invitationWasSuccessfullySentGetter (state) {
      return state.invitationWasSuccessfullySent
    },
    basicPacketModalGetter (state) {
      return state.basicPacketModal
    },
    goldPacketModalGetter (state) {
      return state.goldPacketModal
    },
    presentationsAllGetter (state) {
      return state.presentationsAll
    },
    sendingInvitationGetter (state) {
      return state.sendingInvitation
    },
    logInModalGetter (state) {
      return state.logInModal
    },
    signUpDialogGetter (state) {
      return state.signUpDialog
    },
    welcomeModal (state) {
      if (state.corpObject !== '' && state.theUserDBId !== '') {
        return state.corpObject.users[state.theUserDBId].user.welcomeModal
      }
    }
  }
})
