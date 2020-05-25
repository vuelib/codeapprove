<template>
  <div class="flex overflow-hidden bg-yellow-100">
    <div class="flex-1">
      <template v-for="(change, index) in leftChanges">
        <DiffLine :key="change.content" :change="change" />
        <CommentThread :key="index" v-if="hasComment(index)" />
      </template>
    </div>
    <div class="flex-1">
      <!-- TODO: Comments -->
      <DiffLine
        :key="change.content"
        v-for="change in rightChanges"
        :change="change"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DiffLine from "./DiffLine.vue";
import CommentThread from "./CommentThread.vue";

@Component({
  components: {
    CommentThread,
    DiffLine
  }
})
export default class TextDiff extends Vue {
  // TODO: Get data passed in
  public diff = require("../../../data/diff.json")[0];
  // TODO: What does multiple chunks mean?
  public changes = this.diff.chunks[0].changes;

  public hasComment(line: number): boolean {
    return line === 2;
  }

  public get leftChanges() {
    return this.changes.filter((c: any) => {
      return c.type === "normal" || c.type === "del";
    });
  }

  public get rightChanges() {
    return this.changes.filter((c: any) => {
      return c.type === "normal" || c.type === "add";
    });
  }
}
</script>

<style scoped lang="scss">
// None...
</style>
