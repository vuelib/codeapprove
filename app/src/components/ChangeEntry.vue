<template>
  <div>
    <div class="flex p-2 items-center">
      <font-awesome-icon fixed-width @click="toggle" :icon="icon" />
      <span class="flex-grow pl-2 font-bold">{{ diff.from }}</span>
      <span class="flex-shrink pl-2 text-yellow-500">Changed</span>
      <span class="flex-shrink pl-2 text-green-500">+{{ diff.additions }}</span>
      <span class="flex-shrink pl-2 text-red-500">-{{ diff.deletions }}</span>
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
