<template>
  <div class="overflow-hidden bg-yellow-100">
    <DiffLine
      v-for="(change, index) in changes"
      :key="index"
      :change="change"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DiffLine from "@/components/elements/DiffLine.vue";

import { Change } from "../../model/types";
import parseDiff from "parse-diff";

@Component({
  components: {
    DiffLine
  }
})
export default class TextDiff extends Vue {
  @Prop({ required: true }) public diff!: parseDiff.File;

  // TODO: What does multiple chunks mean?
  public changes: Change[] = this.diff.chunks[0].changes;
}
</script>

<style scoped lang="scss">
// None...
</style>
