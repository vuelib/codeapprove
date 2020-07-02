<template>
  <div v-show="loading" class="slider">
    <div class="line"></div>
    <div class="subline inc"></div>
    <div class="subline dec"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import UIModule from "../../store/modules/ui";

@Component
export default class ProgressBar extends Vue {
  uiModule = getModule(UIModule, this.$store);

  get loading() {
    return this.uiModule.loading;
  }
}
</script>

<style lang="postcss">
.slider {
  width: 100%;
  height: 5px;
  overflow-x: hidden;
  position: relative;
}

.line {
  @apply bg-purple-400;
  position: absolute;
  opacity: 0.4;
  width: 150%;
  height: 5px;
}

.subline {
  @apply bg-purple-400;
  position: absolute;
  height: 5px;
}
.inc {
  animation: increase 2s infinite;
}
.dec {
  animation: decrease 2s 0.5s infinite;
}

@keyframes increase {
  from {
    left: -5%;
    width: 5%;
  }
  to {
    left: 130%;
    width: 100%;
  }
}
@keyframes decrease {
  from {
    left: -80%;
    width: 80%;
  }
  to {
    left: 110%;
    width: 10%;
  }
}
</style>
