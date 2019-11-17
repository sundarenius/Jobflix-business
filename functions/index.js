const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const SENDGRID_API_KEY = functions.config().sendgrid.key

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)

exports.notificationsMail = functions.database.ref('/admin/notifications/{pushId}')
  .onCreate(event => {
    const user = event.val()
    if (user.msg !== 'Företagsanvändare har signat upp ett konto precis' && user.msg !== 'Privatperson har signat upp ett konto precis' && user.msg !== 'Företaget har uppgraderat paket, skicka till alla users, de finns users property här!') {
      if (user.hasOwnProperty('mail')) {
        return sgMail.send({
          to: user.mail,
          from: 'noreply@jobflix.se',
          subject: user.time,
          substitutionWrappers: ['{{', '}}'],
          substitutions: {
            name: user.name,
            body: user.msg
          },
          templateId: 'd-5b931a2a011b401787ba8c786157c939'
        })
      } else if (user.hasOwnProperty('emailTo')) {
        return sgMail.send({
          to: user.emailTo,
          from: 'noreply@jobflix.se',
          subject: user.time,
          substitutionWrappers: ['{{', '}}'],
          substitutions: {
            name: user.businessUser,
            body: user.msg
          },
          templateId: 'd-5b931a2a011b401787ba8c786157c939'
        })
      }
    } else if (user.msg === 'Företagsanvändare har signat upp ett konto precis') {
      return sgMail.send({
        to: user.emailTo,
        from: 'noreply@jobflix.se',
        subject: user.time,
        substitutionWrappers: ['{{', '}}'],
        substitutions: {
          name: user.businessUser,
          body: user.msg
        },
        templateId: 'd-6784240f1f8948a2b72b24a56736374a'
      })
    } else if (user.msg === 'Privatperson har signat upp ett konto precis') {
      return sgMail.send({
        to: user.mail,
        from: 'noreply@jobflix.se',
        subject: user.time,
        substitutionWrappers: ['{{', '}}'],
        substitutions: {
          name: user.name,
          body: user.msg
        },
        templateId: 'd-f686c2ed150f44ba93ad0f235440956d'
      })
    }
    return null
  })

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
