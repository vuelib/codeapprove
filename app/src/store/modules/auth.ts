import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { auth } from "../../plugins/firebase";

import * as firebase from "firebase/app";

// TODO: Namespacing?
@Module({
  name: "auth"
})
export default class Auth extends VuexModule {
  user: firebase.User | undefined | null = undefined;

  @Mutation
  setUser(u: firebase.User | null) {
    console.log(`auth.setUser(${u ? u.uid : u})`);
    this.user = u;
  }

  get signedIn(): boolean {
    return !!this.user;
  }

  get signInKnown(): boolean {
    return this.user !== undefined;
  }

  // TODO: Maybe this shouldn't be here if it doesn't directly touch the state
  @Action
  async startSignOut() {
    await auth().signOut();
  }
}
