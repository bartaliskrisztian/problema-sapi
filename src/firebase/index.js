import firebase from 'firebase';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCIKhCbyfGe4g9cCVB-aiT3wf8JHnOy8aw",
    authDomain: "problema-sapi-59951.firebaseapp.com",
    databaseURL: "https://problema-sapi-59951.firebaseio.com",
    projectId: "problema-sapi-59951",
    storageBucket: "problema-sapi-59951.appspot.com",
    messagingSenderId: "92971631056",
    appId: "1:92971631056:web:fc0fedb8e47fd9372db9d5",
    measurementId: "G-6YSGCVK821"
  };
  
  firebase.initializeApp(firebaseConfig);

  let db = firebase.firestore();
  
  export default {
    firebase, db
  }
    
  