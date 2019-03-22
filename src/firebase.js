import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

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

export { db, firebase }
