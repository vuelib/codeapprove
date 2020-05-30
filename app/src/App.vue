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
import { getModule } from "vuex-module-decorators";

import HeaderBar from "./components/elements/HeaderBar.vue";

import { auth } from "./plugins/firebase";
import AuthStore from "./store/modules/auth";

@Component({
  components: {
    HeaderBar
  }
})
export default class App extends Vue {
  authStore = getModule(AuthStore, this.$store);
  authUnsub?: firebase.Unsubscribe = undefined;

  created() {
    this.authUnsub = auth().onAuthStateChanged(user => {
      this.authStore.setUser(user);
    });
  }

  destroyed() {
    this.authUnsub && this.authUnsub();
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
