<template>
  <div
    id="bar"
    class="flex items-center shadow-md text-white font-bold py-4 px-8 bg-blue-800"
  >
    <font-awesome-icon icon="code-branch" size="lg" class="mr-4" />
    <span class="text-xl flex-grow">DiffMachine</span>
    <router-link v-if="!signedIn" to="/signin" exact-active-class="hidden"
      ><span class="text-md">Sign In</span>
    </router-link>

    <button v-if="signedIn" @click="signOut()">
      <span class="text-md">Sign Out</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { getModule } from "vuex-module-decorators";
import AuthStore from "../../store/modules/auth";

@Component
export default class HeaderBar extends Vue {
  private authStore = getModule(AuthStore, this.$store);

  // TODO: Could this be mapState ?
  get signedIn() {
    return this.authStore.signedIn;
  }

  public async signOut() {
    await this.authStore.startSignOut();
    this.$router.push("/signin");
  }
}
</script>

<style lang="scss">
.hidden {
  display: none;
}
</style>
