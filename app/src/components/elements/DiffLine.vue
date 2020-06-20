<template>
  <div class="w-full">
    <!-- Left -->
    <div
      class="ib relative w-1/2 align-top"
      :class="bgClass(rendered.left)"
      @mouseenter="hovered.left = true"
      @mouseleave="hovered.left = false"
    >
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
        :threadId="threads['left']"
        @cancel="drafting.left = false"
      />
    </div>

    <!-- Right -->
    <div
      class="ib relative w-1/2 align-top border-l border-gray-300"
      :class="bgClass(rendered.right)"
      @mouseenter="hovered.right = true"
      @mouseleave="hovered.right = false"
    >
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
        :threadId="threads['right']"
        @cancel="drafting.right = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import parseDiff from "parse-diff";

import CommentThread from "@/components/elements/CommentThread.vue";
import ReviewModule from "../../store/modules/review";
import { Comment, ThreadArgs, Thread } from "../../model/review";
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
  @Prop() public leftFile!: string;
  @Prop() public rightFile!: string;
  @Prop() public rendered!: RenderedChangePair;

  reviewModule = getModule(ReviewModule, this.$store);

  public threads: { [s in Side]: string | null } = {
    left: null,
    right: null
  };

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
    // TODO: Need to restore comment reactivity when starting a new thread.
    this.loadThreads();
  }

  private loadThreads() {
    this.threads.left = this.threadId("left");
    this.threads.right = this.threadId("right");

    if (this.threads.left) {
      this.comments.left = this.reviewModule.commentsByThread(
        this.threads.left
      );
    }

    if (this.threads.right) {
      this.comments.right = this.reviewModule.commentsByThread(
        this.threads.right
      );
    }
  }

  public showComments(side: Side) {
    return this.drafting[side] || this.comments[side].length > 0;
  }

  public threadId(side: Side): string | null {
    const change = side === "left" ? this.rendered.left : this.rendered.right;
    if (change.empty) {
      return null;
    }

    const file = side === "left" ? this.leftFile : this.rightFile;
    const args: ThreadArgs = {
      file,
      side,
      line: change.number
    };

    // TODO: Seriously need to optimize this!  Should be calculated inside out
    const thread: Thread | null = this.reviewModule.threadByArgs(args);
    return thread ? thread.id : null;
  }

  public bgClass(change: RenderedChange): string {
    switch (change.type) {
      case "del":
        return "bg-red-200";
      case "add":
        return "bg-green-200";
      default:
        return "";
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
