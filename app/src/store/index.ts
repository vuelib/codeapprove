import Vue from "vue";
import Vuex from "vuex";

import AuthModule from "@/store/modules/auth";
import ReviewModule from "@/store/modules/review";
import UIModule from "@/store/modules/ui";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: AuthModule,
    review: ReviewModule,
    ui: UIModule
  }
});
