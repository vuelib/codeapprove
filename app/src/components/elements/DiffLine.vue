<template>
  <div class="w-full">
    <!-- Left -->
    <div
      class="ib relative w-1/2 align-top"
      @mouseenter="hovered.left = true"
      @mouseleave="hovered.left = false"
    >
      <div class="shim" :class="bgClass(rendered.left)"></div>
      <code class="line-number">{{ lineNumberString(rendered.left) }}</code>
      <code class="line-marker">{{ rendered.left.marker }}</code>
      <code class="line-content">{{ rendered.left.content }}</code>

      <button
        v-show="!rendered.left.empty && hovered.left && !showComments('left')"
        @click="drafting.left = true"
        class="comment-button"
      >
        <font-awesome-icon icon="comment" />
      </button>

      <CommentThread
        v-if="showComments('left')"
        class="w-full"
        :side="'left'"
        :line="rendered.left.number"
        :threadId="getThreadId('left')"
        @cancel="drafting.left = false"
      />
    </div>

    <!-- Right -->
    <div
      class="ib relative w-1/2 align-top border-l border-dark-0"
      @mouseenter="hovered.right = true"
      @mouseleave="hovered.right = false"
    >
      <div class="shim" :class="bgClass(rendered.right)"></div>
      <code class="line-number">{{ lineNumberString(rendered.right) }}</code>
      <code class="line-marker">{{ rendered.right.marker }}</code>
      <code class="line-content">{{ rendered.right.content }}</code>

      <button
        v-show="
          !rendered.right.empty && hovered.right && !showComments('right')
        "
        @click="drafting.right = true"
        class="comment-button"
      >
        <font-awesome-icon icon="comment" />
      </button>

      <CommentThread
        v-if="showComments('right')"
        class="w-full"
        :side="'right'"
        :line="rendered.right.number"
        :threadId="getThreadId('right')"
        @cancel="drafting.right = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import parseDiff from "parse-diff";

import CommentThread from "@/components/elements/CommentThread.vue";
import ReviewModule from "../../store/modules/review";
import { Comment, ThreadArgs, Thread, ThreadPair } from "../../model/review";
import {
  RenderedChangePair,
  renderChange,
  RenderedChange
} from "../../plugins/diff";

type Side = "left" | "right";

@Component({
  components: {
    CommentThread
  }
})
export default class DiffLine extends Vue {
  @Prop() public threads!: ThreadPair;
  @Prop() public rendered!: RenderedChangePair;

  reviewModule = getModule(ReviewModule, this.$store);

  public comments: { [s in Side]: Comment[] } = {
    left: [],
    right: []
  };

  public hovered: { [s in Side]: boolean } = {
    left: false,
    right: false
  };

  public drafting: { [s in Side]: boolean } = {
    left: false,
    right: false
  };

  mounted() {
    this.loadComments();
  }

  public loadComments() {
    this.comments = {
      left: this.getComments("left"),
      right: this.getComments("right")
    };
  }

  public showComments(side: Side) {
    return this.drafting[side] || this.comments[side].length > 0;
  }

  public getComments(side: Side) {
    const threadId = this.getThreadId(side);
    if (threadId != null) {
      return this.reviewModule.commentsByThread(threadId);
    }
    return [];
  }

  public getThreadId(side: Side): string | null {
    // TODO: Seriously need to optimize this!  Should be calculated inside out
    const thread = this.threads[side];
    return thread === null ? null : thread.id;
  }

  public bgClass(change: RenderedChange): string {
    switch (change.type) {
      case "del":
        return "bg-red-500";
      case "add":
        return "bg-green-500";
      default:
        return "hidden";
    }
  }

  public lineNumberString(change: RenderedChange): string {
    if (change.empty) {
      return "";
    }

    return change.number.toString();
  }
}
</script>

<style scoped lang="postcss">
.shim {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

  opacity: 0.25;
}

.ib {
  @apply inline-block;
}

.no-select {
  user-select: none;
}

.line-content {
  @apply whitespace-pre-wrap;
}

.line-number {
  @apply px-2 no-select overflow-hidden;
  min-width: 3rem;
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
