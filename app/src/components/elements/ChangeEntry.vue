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
    <div v-if="expanded" class="overflow-hidden bg-yellow-100">
      <template v-for="(chunk, i) in this.diff.chunks">
        <div
          :key="`chunk-${i}-content`"
          class="py-1 px-4 bg-blue-100 text-blue-500"
        >
          <pre>{{ chunk.content }}</pre>
        </div>
        <DiffLine
          v-for="(change, j) in changes"
          :key="`chunk-${i}-change-${j}`"
          :change="change"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DiffLine from "@/components/elements/DiffLine.vue";
import parseDiff from "parse-diff";

@Component({
  components: {
    DiffLine
  }
})
export default class ChangeEntry extends Vue {
  @Prop() diff!: parseDiff.File;

  public expanded = true;

  public toggle() {
    this.expanded = !this.expanded;
  }

  get changes() {
    // TODO: Multiple chunks
    return this.diff.chunks[0].changes;
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
