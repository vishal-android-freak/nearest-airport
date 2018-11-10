import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCh_v8Ug7VwpJGJBrZyMJqnO8pbyp9RAY4",
    authDomain: "airports-222008.firebaseapp.com",
    databaseURL: "https://airports-222008.firebaseio.com",
    projectId: "airports-222008",
    storageBucket: "airports-222008.appspot.com",
    messagingSenderId: "522583867627"
};

const app = firebase.initializeApp(config);
export default app;