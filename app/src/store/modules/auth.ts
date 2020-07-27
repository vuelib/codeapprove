import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { auth, functions } from "../../plugins/firebase";
import { User } from "../../model/auth";

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
  }

  @Mutation
  updateGithubToken(opts: { githubToken: string; expiresIn: number }) {
    console.log("updateGithubToken", `expiresIn=${opts.expiresIn}`);
    const githubExpiry = new Date().getTime() + opts.expiresIn;
    this.user!.githubToken = opts.githubToken;
    this.user!.githubExpiry = githubExpiry;
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

  @Action
  async refreshGithubAuth() {
    console.log("refreshGithubAuth");
    const tokenRes = await functions().httpsCallable("getGithubToken")();
    const access_token = tokenRes.data.access_token;
    const expires_in = Number.parseInt(tokenRes.data.expires_in) * 1000;
    this.context.commit("updateGithubToken", {
      githubToken: access_token,
      expiresIn: expires_in
    });
  }
}
