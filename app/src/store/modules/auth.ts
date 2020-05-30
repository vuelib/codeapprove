import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { auth } from "../../plugins/firebase";

@Module({
  name: "auth"
})
export default class Auth extends VuexModule {
  signedIn = false;

  @Mutation
  setSignedIn(x: boolean) {
    this.signedIn = x;
  }

  @Action
  async startSignOut() {
    await auth().signOut();
  }
}
