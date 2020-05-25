import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretRight,
  faCaretDown,
  faPauseCircle,
  faUserCheck,
  faAt,
  faPaperPlane,
  faCheck,
  faCodeBranch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export function initIconLibrary() {
  Vue.component("font-awesome-icon", FontAwesomeIcon);
  library.add(
    faCaretRight,
    faCaretDown,
    faPauseCircle,
    faUserCheck,
    faAt,
    faPaperPlane,
    faCheck,
    faCodeBranch
  );
}
