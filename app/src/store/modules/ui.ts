import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

export interface Message {
  type: "error" | "alert";
  text: string;
}

// TODO: Namespacing?
@Module({
  name: "ui"
})
export default class UIModule extends VuexModule {
  public loading = false;

  public messages: Message[] = [];

  @Action
  async addDisappearingError(text: string) {
    const err = {
      type: "error",
      text
    };

    this.context.commit("addMessage", err);
    await new Promise(res => setTimeout(res, 5000));
    this.context.commit("dismissMessage", err);
  }

  @Mutation
  addMessage(message: Message) {
    if (this.messages.indexOf(message) > 0) {
      return;
    }

    this.messages.unshift(message);
  }

  @Mutation
  dismissMessage(msg: Message) {
    const ind = this.messages.indexOf(msg);
    if (ind >= 0) {
      this.messages.splice(ind, 1);
    }
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
