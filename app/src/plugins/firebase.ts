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
  if (firebase.apps.length === 0) {
    const firebaseConfig = {
      apiKey: "AIzaSyBmH_WRBDxaY80B_aNNEG1S2UTmZFl6uUY",
      authDomain: "diff-machine.firebaseapp.com",
      databaseURL: "https://diff-machine.firebaseio.com",
      projectId: "diff-machine",
      storageBucket: "diff-machine.appspot.com",
      messagingSenderId: "1094714775999",
      appId: "1:1094714775999:web:94f80e1047609bb9a0e90a"
    };
    firebase.initializeApp(firebaseConfig);
  }

  return firebase.app();
}
