<template>
  <div id="app">
    <!-- Page Header -->
    <HeaderBar />

    <!-- Page body from router -->
    <div class="grid grid-cols-12">
      <router-view class="mt-8 col-start-2 col-span-10" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import HeaderBar from "@/components/elements/HeaderBar.vue";

import { auth } from "./plugins/firebase";
import AuthModule from "./store/modules/auth";

@Component({
  components: {
    HeaderBar
  }
})
export default class App extends Vue {
  authModule = getModule(AuthModule, this.$store);
  authUnsub?: firebase.Unsubscribe = undefined;

  created() {
    this.authUnsub = auth().onAuthStateChanged(user => {
      this.authModule.setUser(user);
    });
  }

  destroyed() {
    this.authUnsub && this.authUnsub();
  }
}
</script>

<style lang="postcss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.btn {
  @apply px-2 py-1;
  @apply rounded shadow border;
}

.btn:hover {
  @apply shadow-none;
  @apply border-white text-white;
}

.btn-blue {
  @apply border-blue-500 text-blue-500;
}

.btn-blue:hover {
  @apply bg-blue-500;
}

.btn-red {
  @apply border-red-400 text-red-400;
}

.btn-red:hover {
  @apply bg-red-400;
}

.btn-green {
  @apply border-green-500 text-green-500;
}

.btn-green:hover {
  @apply bg-green-500;
}
</style>
