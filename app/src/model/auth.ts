import * as firebase from "firebase/app";
import { Github } from "../plugins/github";

export interface User {
  uid: string;
  email: string;
  username: string;
  photoURL: string;

  githubToken: string;
}

export async function createUser(
  u: firebase.User,
  githubToken: string
): Promise<User> {
  const github = new Github(githubToken);
  const ghUser = await github.me();

  return {
    uid: u.uid,
    username: ghUser.login,
    email: u.email!,
    photoURL: u.photoURL!,
    githubToken
  };
}
