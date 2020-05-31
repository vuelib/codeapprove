<template>
  <div>
    <p
      @mouseenter="onHover(true)"
      @mouseleave="onHover(false)"
      class="flex"
      v-bind:class="classObject"
    >
      <code class="flex-none no-select pl-2">{{ lineNumber }}</code>
      <code class="flex-none no-select px-2">{{ lineMarker }}</code>
      <code class="flex-grow">{{ lineContent }}</code>
      <button
        v-show="hovered"
        @click="drafting = true"
        class="flex-none self-center px-2 ml-2 rounded shadow bg-blue-500 hover:shadow-md hover:bg-blue-600 text-white"
      >
        <font-awesome-icon icon="comment" />
      </button>
    </p>

    <!-- TODO: Show comment thread? -->
    <CommentThread v-if="drafting" @cancel="drafting = false" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CommentThread from "./CommentThread.vue";
import { Change } from "../../model/types";

@Component({
  components: {
    CommentThread
  }
})
export default class DiffLine extends Vue {
  @Prop() public change!: Change;

  public hovered: boolean = false;
  public drafting: boolean = false;

  public onHover(hovered: boolean): void {
    this.hovered = hovered;
  }

  public get classObject(): object {
    return {
      // "bg-yellow-100": this.change.type === "normal",
      "bg-red-200": this.change.type === "del",
      "bg-green-200": this.change.type === "add"
    };
  }

  public get lineMarker(): string {
    switch (this.change.type) {
      case "normal":
        return " ";
      case "del":
        return "-";
      case "add":
        return "+";
    }

    console.warn(`Unknown change type: ${this.change.type}`);
    return " ";
  }

  public get lineContent(): string {
    if (this.change.type === "normal") {
      return this.change.content;
    } else {
      return this.change.content.substring(1);
    }
  }

  public get lineNumber(): number {
    return this.change.ln || this.change.ln1 || this.change.ln2!;
  }
}
</script>

<style scoped lang="scss">
.no-select {
  user-select: none;
}
</style>
