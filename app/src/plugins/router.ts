import Vue from "vue";
import VueRouter from "vue-router";

import PullRequest from "../components/pages/PullRequest.vue";
import SignIn from "../components/pages/SignIn.vue";

export function initRouter(): VueRouter {
  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      { path: "/pr", component: PullRequest },
      { path: "/signin", component: SignIn }
    ]
  });

  return router;
}
