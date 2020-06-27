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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import HeaderBar from "@/components/elements/HeaderBar.vue";
import ProgressBar from "@/components/elements/ProgressBar.vue";

import { auth } from "./plugins/firebase";
import AuthModule from "./store/modules/auth";

@Component({
  components: {
    HeaderBar,
    ProgressBar
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

.btn {
  @apply px-2 py-1;
  @apply rounded shadow border;
  @apply bg-white;
}

.btn-small {
  /** TODO: This should be applied to all icon buttons! */
  @apply flex flex-row items-center;
  @apply text-sm;
  @apply px-1;
  padding-top: 1px;
  padding-bottom: 1px;
}

.btn:hover {
  @apply shadow-none;
  @apply border-white text-white;
}

.btn-blue {
  @apply border-blue-500 text-blue-500;
}

.btn-blue:hover {
  @apply border-blue-600 bg-blue-500;
}

.btn-red {
  @apply border-red-400 text-red-400;
}

.btn-red:hover {
  @apply border-red-500 bg-red-400;
}

.btn-green {
  @apply border-green-500 text-green-500;
}

.btn-green:hover {
  @apply border-green-600 bg-green-500;
}
</style>
