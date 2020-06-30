<template>
  <div class="flex flex-col items-center">
    <div
      class="max-w-sm text-center inline-flex flex-col items-center m-8 rounded overflow-hidden border shadow-lg border-gray-300"
    >
      <div class="w-full font-bold text-lg text-white bg-blue-800 p-2 m-0">
        Sign In
      </div>
      <div class="p-4">
        <p>
          CodeApprove needs access to your GitHub account in order to perform
          code review.
        </p>

        <!-- TODO: This is a nuts style -->
        <a :href="githubUrl" target="_self"
          ><button
            class="inline-flex items-center bg-gray-900 hover:bg-black border-gray-700 border hover:border-transparent shadow hover:shadow-none rounded-lg mt-8 mb-4 px-4 py-2 text-white"
          >
            <font-awesome-icon :icon="['fab', 'github']" size="lg" />
            <span class="ml-2 font-bold">Sign In with GitHub</span>
          </button></a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import * as firebase from "firebase/app";
import { config } from "../../plugins/config";
import { auth } from "../../plugins/firebase";

import { getModule } from "vuex-module-decorators";

import { User, createUser } from "../../model/auth";
import AuthModule from "../../store/modules/auth";
import UiModule from "../../store/modules/ui";
import UIModule from "../../store/modules/ui";

@Component({
  components: {}
})
export default class SignIn extends Vue {
  private authModule = getModule(AuthModule, this.$store);
  private uiModule = getModule(UIModule, this.$store);

  async mounted() {
    if (this.$route.query.custom_token) {
      this.signInCustom(
        this.$route.query.custom_token as string,
        this.$route.query.access_token as string
      );
    }
  }

  private async signInCustom(customToken: string, accessToken: string) {
    this.uiModule.beginLoading();
    try {
      const result = await auth().signInWithCustomToken(customToken);
      if (result.user) {
        // TODO: Store the expiry
        const user: User = createUser(result.user, accessToken);
        this.authModule.setUser(user);

        // TODO: Real routing after sign-in
        this.$router.push("/pr/hatboysam/diffmachine/5");
      } else {
        this.authModule.setUser(null);
      }
    } catch (e) {
      console.warn(`Sign in failure: ${e}`);
      this.authModule.setUser(null);
    }
    this.uiModule.endLoading();
  }

  get githubUrl() {
    return `https://github.com/login/oauth/authorize?client_id=${config.github.client_id}&redirect_uri=${config.github.redirect}`;
  }
}
</script>

<style lang="scss">
// None ...
</style>
