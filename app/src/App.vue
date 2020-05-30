<template>
  <div id="app">
    <!-- Page Header -->
    <div
      id="bar"
      class="flex items-center shadow-md text-white font-bold py-4 px-8 bg-blue-800"
    >
      <font-awesome-icon icon="code-branch" size="lg" class="mr-4" />
      <span class="text-xl flex-grow">DiffMachine</span>
      <router-link v-if="!signedIn" to="/signin" exact-active-class="hidden"
        ><span class="text-md">Sign In</span>
      </router-link>
    </div>

    <!-- Page body from router -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ChangeEntry from "./components/elements/ChangeEntry.vue";
import SectionBox from "./components/elements/SectionBox.vue";
import PullRequest from "./components/pages/PullRequest.vue";

import { getModule } from "vuex-module-decorators";
import AuthStore from "./store/modules/auth";

@Component({
  components: {
    PullRequest
  }
})
export default class App extends Vue {
  private authStore = getModule(AuthStore, this.$store);

  get signedIn() {
    return this.authStore.signedIn;
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hidden {
  display: none;
}
</style>
