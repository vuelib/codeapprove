<template>
  <div class="errors">
    <div
      v-for="error in errors"
      :key="error"
      class="rounded bg-dark-5 border border-dark-0 dark-shadow text-red-400 text-lg px-5 py-4 mt-4"
    >
      <b><font-awesome-icon icon="exclamation-circle" class="mr-2" />Error:</b>
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import UIModule from "../../store/modules/ui";

@Component
export default class ErrorStack extends Vue {
  private uiModule = getModule(UIModule, this.$store);

  get errors() {
    return this.uiModule.errors;
  }
}
</script>

<style lang="postcss">
.errors {
  position: fixed;
  bottom: 24px;
  right: 24px;

  z-index: 100;
}
</style>
