<template>
  <div id="app">
    <!-- Page Header -->
    <HeaderBar />
    <ProgressBar />

    <!-- Page body from router -->
    <div class="grid grid-cols-12">
      <router-view
        :key="$route.fullPath"
        class="mt-8 col-start-2 col-span-10"
      />
    </div>

    <!-- Errors -->
    <ErrorStack />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import HeaderBar from "@/components/elements/HeaderBar.vue";
import ProgressBar from "@/components/elements/ProgressBar.vue";
import ErrorStack from "@/components/elements/ErrorStack.vue";

import { auth } from "./plugins/firebase";
import AuthModule from "./store/modules/auth";

@Component({
  components: {
    HeaderBar,
    ProgressBar,
    ErrorStack
  }
})
export default class App extends Vue {
  authModule = getModule(AuthModule, this.$store);
  authUnsub?: firebase.Unsubscribe = undefined;

  created() {
    this.authUnsub = auth().onAuthStateChanged(user => {
      if (!user) {
        this.authModule.setUser(null);
      }
    });
  }

  destroyed() {
    this.authUnsub && this.authUnsub();
  }
}
</script>

<style lang="postcss">
body {
  @apply text-wht-brt bg-dark-1;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.btn:focus {
  outline: none;
}

textarea:focus,
input:focus {
  border: 1px solid rgba(66, 153, 225, 0.6);
  outline: none;
}

.dark-shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
}

.btn {
  @apply px-2 py-1;
  @apply rounded border;
  @apply bg-dark-1;
}

.btn-small {
  /** TODO: This should be applied to all icon buttons! */
  @apply flex flex-row items-center;
  @apply text-sm;
  @apply px-2;
  padding-top: 1px;
  padding-bottom: 1px;
}

.btn:hover {
  @apply bg-dark-5;
}

.btn-blue {
  @apply border-blue-500 text-blue-500;
}

.btn-blue:hover {
  @apply text-blue-400 text-blue-500;
}

.btn-red {
  @apply border-red-400 text-red-400;
}

.btn-red:hover {
  @apply text-red-400 text-red-400;
}

.btn-green {
  @apply border-green-500 text-green-500;
}

.btn-green:hover {
  @apply border-green-400 text-green-400;
}
</style>
