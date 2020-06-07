<template>
  <div>
    <div class="flex p-2 font-bold items-center bg-gray-200">
      <font-awesome-icon fixed-width @click="toggle" :icon="icon" />
      <span class="flex-grow pl-2d">{{ diff.from }}</span>
      <span class="flex-shrink mx-1 px-2 rounded bg-green-400 text-green-800"
        >+{{ diff.additions }}</span
      >
      <span class="flex-shrink mx-1 px-2 rounded bg-red-400 text-red-800"
        >-{{ diff.deletions }}</span
      >
    </div>
    <TextDiff v-show="expanded" :diff="diff" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TextDiff from "@/components/elements/TextDiff.vue";
import parseDiff from "parse-diff";

@Component({
  components: {
    TextDiff
  }
})
export default class ChangeEntry extends Vue {
  @Prop() diff!: parseDiff.File;

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
