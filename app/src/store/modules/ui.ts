import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

// TODO: Namespacing?
@Module({
  name: "ui"
})
export default class UIModule extends VuexModule {
  public loading = false;
  public errors: string[] = ["Something went wrong"];

  @Mutation
  beginLoading() {
    this.loading = true;
  }

  @Mutation
  endLoading() {
    this.loading = false;
  }
}
