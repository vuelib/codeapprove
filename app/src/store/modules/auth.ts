import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module({
  name: "auth"
})
export default class Auth extends VuexModule {
  signedIn = false;

  @Mutation
  signIn() {
    this.signedIn = true;
  }

  @Mutation
  signOut() {
    this.signedIn = false;
  }
}
