import Vue from "vue";
import App from "./App.vue";

import "./assets/styles/index.css";

// Store
import store from "@/store";

// Router
import router from "@/plugins/router";

// Font awesome icons
import { initIconLibrary } from "@/plugins/icons";
initIconLibrary();

// Click outside plugin
// https://github.com/ndelvalle/v-click-outside
const vClickOutside = require("v-click-outside");
Vue.use(vClickOutside);

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
