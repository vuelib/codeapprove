<template>
  <div
    class="w-full py-1 px-2 flex items-center text-blue-500 border-b border-t border-blue-500"
  >
    <pre class="inline bg-dark-3">@@ {{ text }} @@</pre>
    <span class="flex-grow"></span>
    <a v-if="showAbove" @click.stop="expandAbove"
      ><code class="ml-2">+above</code></a
    >
    <a @click.stop="expandBelow"><code class="ml-2">+below</code></a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ChunkHeader } from "../../plugins/diff";
import * as parseDiff from "parse-diff";

@Component
export default class ChunkHeaderBar extends Vue {
  @Prop() chunk!: parseDiff.Chunk;

  get text() {
    const leftEnd = this.chunk.oldStart + this.chunk.oldLines - 1;
    const rightEnd = this.chunk.newStart + this.chunk.newLines - 1;
    return `${this.chunk.oldStart}-${leftEnd}, ${this.chunk.newStart}-${rightEnd}`;
  }

  get showAbove() {
    return this.chunk.oldStart > 1 && this.chunk.newStart > 1;
  }

  public expandAbove() {
    this.$emit("expand-above");
  }

  public expandBelow() {
    this.$emit("expand-below");
  }
}
</script>

<style scoped lang="postcss">
a {
  @apply cursor-pointer;
}

a:hover {
  @apply underline text-blue-400;
}
</style>
