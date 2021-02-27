import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBPm69xplEEZn5V3Uq9_HmLK-yJ_h8Y8QQ",
    authDomain: "barterapp-c5a9d.firebaseapp.com",
    databaseURL: "https://barterapp-c5a9d.firebaseio.com",
    projectId: "barterapp-c5a9d",
    storageBucket: "barterapp-c5a9d.appspot.com",
    messagingSenderId: "166574889162",
    appId: "1:166574889162:web:251f619088effc481abc33"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();