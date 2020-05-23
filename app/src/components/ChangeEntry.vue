<template>
  <div>
    <div class="flex p-2 font-bold items-center bg-gray-200">
      <font-awesome-icon fixed-width @click="toggle" :icon="icon" />
      <span class="flex-grow pl-2d">{{ diff.from }}</span>
      <span class="flex-shrink px-2 bg-yellow-400 text-yellow-800 rounded"
        >modified</span
      >
      <span class="flex-shrink mx-1 px-2 rounded bg-green-400 text-green-800"
        >+{{ diff.additions }}</span
      >
      <span class="flex-shrink mx-1 px-2 rounded bg-red-400 text-red-800"
        >-{{ diff.deletions }}</span
      >
    </div>
    <TextDiff v-show="expanded" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TextDiff from "./TextDiff.vue";

@Component({
  components: {
    TextDiff
  }
})
export default class ChangeEntry extends Vue {
  // TODO: Get data passed in
  public diff = require("../../data/diff.json")[0];
  public expanded = true;

  public toggle() {
    this.expanded = !this.expanded;
  }

  get icon() {
    if (this.expanded) {
      return "caret-down";
    } else {
      return "caret-right";
    }
  }
}
</script>

<style scoped lang="scss">
// TODO
</style>
