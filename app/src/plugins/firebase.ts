import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

export function auth(): firebase.auth.Auth {
  return app().auth();
}

export function functions(): firebase.functions.Functions {
  const functions = app().functions();
  if (process.env.NODE_ENV !== "production") {
    functions.useFunctionsEmulator("http://localhost:5001");
  }
  return functions;
}

function app(): firebase.app.App {
  const devConfig = {
    apiKey: "AIzaSyD4q0LrrYH6MTq3YQTqBKyrSiDlkwXEMgg",
    authDomain: "codeapprove-dev.firebaseapp.com",
    databaseURL: "https://codeapprove-dev.firebaseio.com",
    projectId: "codeapprove-dev",
    storageBucket: "codeapprove-dev.appspot.com",
    messagingSenderId: "533117593232",
    appId: "1:533117593232:web:2a88fbd5279226937b9a15",
    measurementId: "G-ZDHW48NFJY"
  };

  const prodConfig = {
    apiKey: "AIzaSyCbvfm75CxBT13fSDSa4GQN3o_LLzVKJO0",
    authDomain: "codeapprove-prod.firebaseapp.com",
    databaseURL: "https://codeapprove-prod.firebaseio.com",
    projectId: "codeapprove-prod",
    storageBucket: "codeapprove-prod.appspot.com",
    messagingSenderId: "433773763706",
    appId: "1:433773763706:web:a8a422eacff49dea72afc3",
    measurementId: "G-5DQ43FZZ3R"
  };

  if (firebase.apps.length === 0) {
    const firebaseConfig =
      process.env.NODE_ENV === "production" ? prodConfig : devConfig;
    firebase.initializeApp(firebaseConfig);
  }

  return firebase.app();
}
