import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

// TODO: Namespacing?
@Module({
  name: "ui"
})
export default class UIModule extends VuexModule {
  public loading = false;
  public errors: string[] = [];

  @Action
  async addDisappearingError(err: string) {
    this.context.commit("addError", err);
    await new Promise(res => setTimeout(res, 5000));
    this.context.commit("dropError");
  }

  @Mutation
  addError(err: string) {
    this.errors.unshift(err);
  }

  @Mutation
  dropError() {
    this.errors.pop();
  }

  @Mutation
  beginLoading() {
    this.loading = true;
  }

  @Mutation
  endLoading() {
    this.loading = false;
  }
}
