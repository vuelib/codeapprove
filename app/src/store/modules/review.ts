import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Review } from "@/model/review";

// TODO: Namespacing?
@Module({
  name: "review"
})
export default class ReviewModule extends VuexModule {
  public reviews: Record<string, Review> = {};
}
