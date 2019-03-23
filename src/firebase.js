import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyB5oX0M426zN27uuy7ao07e_5nYg6rHx3o',
  authDomain: 'react-chat-app-29c23.firebaseapp.com',
  databaseURL: 'https://react-chat-app-29c23.firebaseio.com',
  projectId: 'react-chat-app-29c23',
  storageBucket: 'react-chat-app-29c23.appspot.com',
  messagingSenderId: '477384814248'
}
firebase.initializeApp(config)

const db = firebase.firestore()
const rtdb = firebase.database()

export function setupPresence (user) {
  const isOfflineForRTDB = {
    state: 'offline',
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }

  const isOnlineForRTDB = {
    state: 'online',
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }

  const isOfflineForFirestore = {
    state: 'offline',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }

  const isOnlineForFirestore = {
    state: 'online',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }

  const rtdbRef = rtdb.ref(`/status/${user.uid}`)
  const userDoc = db.doc(`/users/${user.uid}`)

  rtdb.ref('.info/connected').on('value', async (snapshot) => {
    if (snapshot.val() === false) {
      userDoc.update({
        status: isOfflineForFirestore
      })
      return
    }
    await rtdbRef.onDisconnect().set(isOfflineForRTDB)

    rtdbRef.set(isOnlineForRTDB)
    userDoc.update({
      status: isOnlineForFirestore
    })
  })
}

export { db, firebase }
