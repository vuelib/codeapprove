import Vue from "vue";
import App from "./App.vue";

import "./assets/styles/index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretRight,
  faCaretDown,
  faPauseCircle,
  faUserCheck,
  faAt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.component("font-awesome-icon", FontAwesomeIcon);
library.add(faCaretRight, faCaretDown, faPauseCircle, faUserCheck, faAt);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
