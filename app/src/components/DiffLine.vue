<template>
  <!-- TODO: Better key -->
  <!-- TODO: I think each line should be a component -->
  <p v-bind:class="classObject">
    <code class="no-select pl-2">{{ lineNumber }}</code>
    <code class="no-select px-2">{{ lineMarker }}</code>
    <code>{{ lineContent }}</code>
  </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DiffLine extends Vue {
  // TODO: types
  @Prop() public change: any;

  public get classObject(): object {
    return {
      // "bg-yellow-100": this.change.type === "normal",
      "bg-red-200": this.change.type === "del",
      "bg-green-200": this.change.type === "add"
    };
  }

  public get lineMarker(): string {
    if (this.change.type === "normal") {
      return " ";
    } else if (this.change.type === "del") {
      return "-";
    } else {
      return "+";
    }
  }

  public get lineContent(): string {
    if (this.change.type === "normal") {
      return this.change.content;
    } else {
      return this.change.content.substring(1);
    }
  }

  public get lineNumber(): number {
    return this.change.ln || this.change.ln1 || this.change.ln2;
  }
}
</script>

<style scoped lang="scss">
.no-select {
  user-select: none;
}
</style>
