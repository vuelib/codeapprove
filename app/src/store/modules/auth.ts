import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { auth } from "../../plugins/firebase";

import * as firebase from "firebase/app";

// TODO: Namespacing?
@Module({
  name: "auth"
})
export default class AuthModule extends VuexModule {
  public signInKnown: boolean = false;
  public user: firebase.User | null = null;

  @Mutation
  setUser(u: firebase.User | null) {
    console.log(`auth.setUser(${u ? u.uid : u})`);
    this.signInKnown = true;
    this.user = u;
  }

  get username(): string {
    // TODO: real one from the api
    return this.user!.providerData[0]!.displayName!;
  }

  get photoURL(): string {
    // TODO: Ever null?
    // TODO: Make a CDN-cached API to get this from GitHub
    return this.user!.photoURL!;
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
