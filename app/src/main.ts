import Vue from "vue";
import App from "./App.vue";

import "./assets/styles/index.css";

// Font awesome icons
import { initIconLibrary } from "./plugins/icons";
initIconLibrary();

// Router
import { initRouter } from "./plugins/router";
const router = initRouter();

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
