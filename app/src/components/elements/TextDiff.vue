<template>
  <div class="flex overflow-hidden bg-yellow-100">
    <div class="flex-1">
      <template v-for="(change, index) in leftChanges">
        <DiffLine :key="index" :change="change" />
      </template>
    </div>
    <div class="flex-1">
      <DiffLine
        v-for="(change, index) in rightChanges"
        :key="index"
        :change="change"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DiffLine from "@/components/elements/DiffLine.vue";

import { Change } from "../../model/types";

@Component({
  components: {
    DiffLine
  }
})
export default class TextDiff extends Vue {
  // TODO: Get data passed in
  public diff = require("../../../data/diff.json")[0];
  // TODO: What does multiple chunks mean?
  public changes: Change[] = this.diff.chunks[0].changes;

  public get leftChanges() {
    return this.changes.filter(c => {
      return c.type === "normal" || c.type === "del";
    });
  }

  public get rightChanges() {
    return this.changes.filter(c => {
      return c.type === "normal" || c.type === "add";
    });
  }
}
</script>

<style scoped lang="scss">
// None...
</style>
