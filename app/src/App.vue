<template>
  <div id="app">
    <!-- Page Header -->
    <HeaderBar />

    <!-- Page body from router -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HeaderBar from "./components/elements/HeaderBar.vue";

import { getModule } from "vuex-module-decorators";
import AuthStore from "./store/modules/auth";

@Component({
  components: {
    HeaderBar
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
</style>
