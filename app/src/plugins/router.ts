import Vue from "vue";
import VueRouter from "vue-router";

import PullRequest from "../components/pages/PullRequest.vue";

export function initRouter(): VueRouter {
  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      { path: "/pr", component: PullRequest }
      // { path: '/bar', component: Bar }
    ]
  });

  return router;
}
