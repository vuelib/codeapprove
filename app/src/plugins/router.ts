import Vue from "vue";
import VueRouter from "vue-router";

import PullRequest from "@/components/pages/PullRequest.vue";
import SignIn from "@/components/pages/SignIn.vue";

Vue.use(VueRouter);

// TODO: Block some paths based on sign in
export default new VueRouter({
  routes: [
    { path: "/pr/:owner/:repo/:number", component: PullRequest },
    { path: "/signin", component: SignIn }
  ]
});
