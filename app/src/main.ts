import Vue from "vue";
import App from "./App.vue";

import "./assets/styles/index.css";

// Font awesome icons
import { initIconLibrary } from "@/plugins/icons";
initIconLibrary();

// Router
import router from "@/plugins/router";

// Store
import store from "@/store";

Vue.config.productionTip = false;

// Enable performance tracing in dev
if (process.env.NODE_ENV !== "production") {
  Vue.config.devtools = true;
  Vue.config.performance = true;
}

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
