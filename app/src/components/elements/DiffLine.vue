<template>
  <div class="w-full">
    <!-- Left -->
    <div
      class="ib relative w-1/2"
      :class="bgClass(left)"
      @mouseenter="hovered.left = true"
      @mouseleave="hovered.left = false"
    >
      <div class="ib line-number-gutter">
        <code class="line-number">{{ lineNumberString("left") }}</code>
      </div>
      <div class="ib">
        <code class="line-marker">{{ lineMarker(left) }}</code>
        <pre class="line-content">{{ lineContent(left) }}</pre>
      </div>

      <button
        v-show="left && hovered.left"
        @click="drafting.left = true"
        class="comment-button"
      >
        <font-awesome-icon icon="comment" />
      </button>
    </div>

    <!-- Right -->
    <div
      class="ib relative w-1/2"
      :class="bgClass(right)"
      @mouseenter="hovered.right = true"
      @mouseleave="hovered.right = false"
    >
      <div class="ib line-number-gutter">
        <code class="line-number">{{ lineNumberString("right") }}</code>
      </div>
      <div class="ib">
        <code class="line-marker">{{ lineMarker(right) }}</code>
        <pre class="line-content">{{ lineContent(right) }}</pre>
      </div>

      <button
        v-show="right && hovered.right"
        @click="drafting.right = true"
        class="comment-button"
      >
        <font-awesome-icon icon="comment" />
      </button>
    </div>

    <!-- Left comments -->
    <CommentThread
      v-if="drafting.left"
      class="ib w-1/2"
      :side="'left'"
      :line="lineNumber('left', left)"
      :threadId="threadId('left')"
      @cancel="drafting.left = false"
    />
    <div v-if="drafting.left && !drafting.right" class="ib w-1/2"></div>

    <!-- Right comments -->
    <div v-if="drafting.right && !drafting.left" class="ib w-1/2"></div>
    <CommentThread
      v-if="drafting.right"
      class="ib w-1/2"
      :side="'right'"
      :line="lineNumber('right', right)"
      :threadId="threadId('right')"
      @cancel="drafting.right = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import parseDiff from "parse-diff";

import CommentThread from "@/components/elements/CommentThread.vue";
import ReviewModule from "../../store/modules/review";
import { ThreadArgs, Thread } from "../../model/review";

type Side = "left" | "right";

@Component({
  components: {
    CommentThread
  }
})
export default class DiffLine extends Vue {
  @Prop() public leftFile!: string;
  @Prop() public rightFile!: string;

  @Prop() public left?: parseDiff.Change;
  @Prop() public right?: parseDiff.Change;

  reviewModule = getModule(ReviewModule, this.$store);

  public hovered: { [s in Side]: boolean } = {
    left: false,
    right: false
  };

  public drafting: { [s in Side]: boolean } = {
    left: false,
    right: false
  };

  public threadId(side: Side): string | undefined {
    const change = side === "left" ? this.left : this.right;
    if (!change) {
      return undefined;
    }

    const file = side === "left" ? this.leftFile : this.rightFile;
    const args: ThreadArgs = {
      file,
      side,
      line: this.lineNumber(side, change)
    };

    const thread: Thread | null = this.reviewModule.threadByArgs(args);
    return thread ? thread.id : undefined;
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

  public lineNumberString(side: Side): string {
    let change = side === "left" ? this.left : this.right;

    if (!change) {
      return "";
    }

    return `${this.lineNumber(side, change)}`;
  }

  public lineNumber(side: Side, change: parseDiff.Change): number {
    switch (change.type) {
      case "add":
        return change.ln;
      case "del":
        return change.ln;
      default:
        return side === "left" ? change.ln1 : change.ln2;
    }
  }
}
</script>

<style scoped lang="postcss">
.ib {
  @apply inline-block;
}

.no-select {
  user-select: none;
}

.line-content {
  @apply inline-block whitespace-pre-wrap;
}

.line-number-gutter {
  min-width: 3rem;
  text-align: right;
}

.line-number {
  @apply px-2 no-select overflow-hidden;
}

.line-marker {
  @apply inline-block px-1 text-center no-select;
  min-width: 1rem;
}

.comment-button {
  @apply absolute top-0 right-0;
  @apply px-2 ml-2 rounded shadow bg-blue-500 text-white;
}

.comment-button:hover {
  @apply shadow-md bg-blue-600;
}
</style>
