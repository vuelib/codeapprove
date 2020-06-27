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

  // TODO: This is not the way to do it
  public user: User | null = null;

  @Mutation
  setUser(u: User | null) {
    console.log(`auth.setUser(${u ? u.uid : null})`);
    this.signInKnown = true;
    this.user = u;

    if (u) {
      authWithToken(u.githubToken);
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
