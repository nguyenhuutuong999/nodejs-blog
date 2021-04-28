var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dtuparking.firebaseio.com",
});

var firebase = admin.database();

module.exports = firebase;
