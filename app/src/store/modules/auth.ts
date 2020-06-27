import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { authWithToken } from "../../plugins/github";
import { auth } from "../../plugins/firebase";
import { User } from "../../model/auth";

import * as firebase from "firebase/app";

// TODO: Namespacing?
@Module({
  name: "auth"
})
export default class AuthModule extends VuexModule {
  public signInKnown: boolean = false;
  public user: User | null = null;

  @Mutation
  restoreFromLocalStorage() {
    const userString = localStorage.getItem("user");
    if (userString == null) {
      this.user = null;
      return;
    }

    try {
      const user = JSON.parse(userString) as User;
      this.user = user;
      console.log("User restored");
    } catch (e) {
      console.log("Failed to parse user JSON");
      this.user = null;
    }

    this.signInKnown = true;
  }

  @Mutation
  setUser(u: User | null) {
    console.log(`auth.setUser(${u ? u.uid : null})`);

    this.signInKnown = true;
    this.user = u;

    localStorage.setItem("user", JSON.stringify(this.user));
    if (this.user) {
      authWithToken(this.user.githubToken);
    } else {
      authWithToken(null);
    }
  }

  get assertUser(): User {
    return this.user!;
  }

  get signedIn(): boolean {
    return !!this.user;
  }

  // TODO: Maybe this shouldn't be here if it doesn't directly touch the state
  @Action
  async startSignOut() {
    await auth().signOut();
  }
}
