<template>
  <div class="flex">
    <div class="flex-auto">
      <pre
        v-bind:key="change.content"
        v-for="change in left"
        v-bind:class="lineClass(change)"
        >{{ fullLine(change) }}</pre
      >
    </div>
    <div class="flex-auto">
      <!-- TOOD: Better key -->
      <pre
        v-bind:key="change.content"
        v-for="change in right"
        v-bind:class="lineClass(change)"
        >{{ fullLine(change) }}</pre
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TextDiff extends Vue {
  // TODO: Get data passed in
  public diff = require("../../data/diff.json")[0];
  // TODO: What does multiple chunks mean?
  public changes = this.diff.chunks[0].changes;
  public left = this.changes.filter((c: any) => {
    return c.type === "normal" || c.type === "del";
  });
  public right = this.changes.filter((c: any) => {
    return c.type === "normal" || c.type === "add";
  });

  // TODO: Number and marker shoud not be selectable
  fullLine(c: any): string {
    return ` ${this.lineNumber(c)} ${this.lineMarker(c)} ${this.lineContent(
      c
    )}`;
  }

  // TODO: this can't be the clean way to style by data...
  lineClass(c: any): string {
    if (c.type === "normal") {
      return "bg-gray-200";
    } else if (c.type === "del") {
      return "bg-red-200";
    } else {
      return "bg-green-200";
    }
  }

  lineMarker(c: any): string {
    if (c.type === "normal") {
      return "";
    } else if (c.type === "del") {
      return "-";
    } else {
      return "+";
    }
  }

  lineContent(c: any): string {
    if (c.type === "normal") {
      return c.content;
    } else {
      return c.content.substring(1);
    }
  }

  lineNumber(c: any): number {
    return c.ln || c.ln1 || c.ln2;
  }
}
</script>

<style scoped lang="scss">
// TODO
</style>
