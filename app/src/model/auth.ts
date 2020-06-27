import * as firebase from "firebase/app";

export interface User {
  uid: string;
  email: string;
  username: string;
  photoURL: string;

  githubToken: string;
}

export function createUser(u: firebase.User, githubToken: string): User {
  return {
    uid: u.uid,

    username: "unknown",
    email: u.email!,
    // TODO: Get this from GitHub
    photoURL: u.photoURL!,

    githubToken
  };
}
