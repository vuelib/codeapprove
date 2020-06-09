<template>
  <tr>
    <!-- Left -->
    <td :class="bgClass(left)">
      <code class="line-number">{{ lineNumber("left", left) }}</code>
    </td>
    <td
      class="relative"
      :class="bgClass(left)"
      @mouseenter="hovered.left = true"
      @mouseleave="hovered.left = false"
    >
      <code class="line-marker">{{ lineMarker(left) }}</code>
      <pre class="line-content">{{ lineContent(left) }}</pre>
      <button
        v-show="hovered.left"
        @click="beginDrafting('left')"
        class="comment-button"
      >
        <font-awesome-icon icon="comment" />
      </button>
    </td>

    <!-- Right -->
    <td :class="bgClass(right)">
      <code class="line-number">{{ lineNumber("right", right) }}</code>
    </td>
    <td
      class="relative"
      :class="bgClass(right)"
      @mouseenter="hovered.right = true"
      @mouseleave="hovered.right = false"
    >
      <code class="line-marker">{{ lineMarker(right) }}</code>
      <pre class="line-content">{{ lineContent(right) }}</pre>
      <button
        v-show="hovered.right"
        @click="beginDrafting('right', true)"
        class="comment-button"
      >
        <font-awesome-icon icon="comment" />
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import parseDiff from "parse-diff";

type Side = "left" | "right";

@Component({
  components: {}
})
export default class DiffLine extends Vue {
  @Prop() public left?: parseDiff.Change;
  @Prop() public right?: parseDiff.Change;

  public hovered: { [s in Side]: boolean } = {
    left: false,
    right: false
  };

  public beginDrafting(side: Side) {
    this.$emit("drafting", { side });
  }

  public bgClass(change?: parseDiff.Change): string {
    if (!change) {
      return "";
    }

    switch (change.type) {
      case "del":
        return "bg-red-200";
      case "add":
        return "bg-green-200";
      default:
        return "";
    }
  }

  public lineMarker(change?: parseDiff.Change): string {
    if (!change) {
      return " ";
    }

    switch (change.type) {
      case "del":
        return "-";
      case "add":
        return "+";
      default:
        return " ";
    }
  }

  public lineContent(change?: parseDiff.Change): string {
    if (!change) {
      return "";
    }

    // Remove the + or the - from the start
    // TODO: Why is this the case for "normal" lines
    return change.content.substring(1);
  }

  public lineNumber(side: Side, change?: parseDiff.Change): string {
    if (!change) {
      return "";
    }

    switch (change.type) {
      case "add":
        return `${change.ln}`;
      case "del":
        return `${change.ln}`;
      default:
        return side === "left" ? `${change.ln1}` : `${change.ln2}`;
    }
  }
}
</script>

<style scoped lang="postcss">
.no-select {
  user-select: none;
}

.line-content {
  @apply inline-block whitespace-pre-wrap;
}

.line-number {
  @apply overflow-hidden text-center no-select pl-2;
}

.line-marker {
  @apply inline-block w-4 pr-2 text-center no-select;
}

.comment-button {
  @apply absolute top-0 right-0;
  @apply px-2 ml-2 rounded shadow bg-blue-500 text-white;
}

.comment-button:hover {
  @apply shadow-md bg-blue-600;
}
</style>
