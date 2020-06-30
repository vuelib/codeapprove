<template>
  <div class="errors">
    <div
      v-for="error in errors"
      :key="error"
      class="rounded bg-red-200 border border-red-500 text-red-700 text-lg px-3 py-2"
    >
      <font-awesome-icon icon="exclamation-circle" class="mr-2" /><b>Error:</b>
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
}
</style>
