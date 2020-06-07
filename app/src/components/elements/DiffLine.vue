<template>
  <div>
    <!-- LEFT SIDE -->
    <div class="inline-block w-1/2">
      <div
        @mouseenter="hovered.left = true"
        @mouseleave="hovered.left = false"
        class="flex w-full relative"
        :class="bgClass('left')"
      >
        <code class="line-number">{{ lineNumber("left") }}</code>
        <code class="line-marker">{{ lineMarker("left") }}</code>
        <pre class="line-content">{{ lineContent("left") }}</pre>
        <button
          v-show="hovered.left"
          @click="drafting.left = true"
          class="comment-button"
        >
          <font-awesome-icon icon="comment" />
        </button>
      </div>

      <CommentThread v-if="drafting.left" @cancel="drafting.left = false" />
    </div>

    <!-- RIGHT SIDE -->
    <div class="inline-block w-1/2">
      <div
        @mouseenter="hovered.right = true"
        @mouseleave="hovered.right = false"
        class="flex w-full relative"
        v-bind:class="bgClass('right')"
      >
        <code class="line-number">{{ lineNumber("right") }}</code>
        <code class="line-marker">{{ lineMarker("right") }}</code>
        <pre class="line-content">{{ lineContent("right") }}</pre>
        <button
          v-show="hovered.right"
          @click="drafting.right = true"
          class="comment-button"
        >
          <font-awesome-icon icon="comment" />
        </button>
      </div>

      <CommentThread v-if="drafting.right" @cancel="drafting.right = false" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CommentThread from "./CommentThread.vue";
import parseDiff from "parse-diff";

type Side = "left" | "right";

@Component({
  components: {
    CommentThread
  }
})
export default class DiffLine extends Vue {
  @Prop() public change!: parseDiff.Change;

  public hovered: { [s in Side]: boolean } = {
    left: false,
    right: false
  };
  public drafting: { [s in Side]: boolean } = {
    left: false,
    right: false
  };

  public bgClass(side: Side): string {
    if (this.change.type === "add") {
      if (side === "left") {
        return "bg-yellow-100";
      } else {
        return "bg-green-200";
      }
    }

    if (this.change.type === "del") {
      if (side === "left") {
        return "bg-red-200";
      } else {
        return "bg-yellow-100";
      }
    }

    return "";
  }

  public get classObject(): object {
    return {
      "bg-red-200": this.change.type === "del",
      "bg-green-200": this.change.type === "add"
    };
  }

  public lineMarker(side: Side): string {
    if (side === "right" && this.change.type === "add") {
      return "+";
    }

    if (side === "left" && this.change.type === "del") {
      return "-";
    }

    return "";
  }

  public lineContent(side: Side): string {
    if (side === "left" && this.change.type === "add") {
      return "";
    }

    if (side === "right" && this.change.type === "del") {
      return "";
    }

    // Remove the + or the - from the start
    // TODO: Why is this the case for "normal" lines
    return this.change.content.substring(1);
  }

  public lineNumber(side: Side): number {
    if (this.change.type === "add" || this.change.type === "del") {
      return this.change.ln;
    }

    if (side === "left") {
      return this.change.ln1;
    } else {
      return this.change.ln2;
    }
  }
}
</script>

<style scoped lang="postcss">
.no-select {
  user-select: none;
}

.line-content {
  @apply flex-grow whitespace-pre-wrap;
}

.line-number {
  @apply flex-none overflow-hidden w-8 text-center no-select pl-2;
}

.line-marker {
  @apply flex-none w-8 text-center no-select px-2;
}

.comment-button {
  @apply absolute top-0 right-0;
  @apply px-2 ml-2 rounded shadow bg-blue-500 text-white;
}

.comment-button:hover {
  @apply shadow-md bg-blue-600;
}
</style>
