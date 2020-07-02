<template>
  <div class="rounded overflow-hidden my-2 border border-dark-0">
    <div
      class="flex p-2 font-bold items-center bg-dark-3 border-b border-dark-0"
    >
      <font-awesome-icon fixed-width @click="toggle" :icon="icon" />
      <!-- TODO: Show both file names when it's renamed -->
      <span class="ml-2">{{ title }}</span>
      <span class="text-sm text-purple-300 ml-4" v-if="allThreads.length > 0">
        {{ allThreads.length }}
        <font-awesome-icon icon="comment" size="sm" />
      </span>
      <span class="flex-grow"><!-- spacer --></span>
      <span class="text-right text-sm text-white-md mr-2">{{
        meta.additions + meta.deletions
      }}</span>
      <div
        class="w-12 rounded overflow-hidden"
        style="line-height: 12px; height: 12px;"
      >
        <div
          class="inline-block bg-green-400"
          :style="`height: 12px; width: ${additionPct}%`"
        ></div>
        <div
          class="inline-block bg-red-400"
          :style="`height: 12px; width: ${100 - additionPct}%`"
        ></div>
      </div>
    </div>
    <div v-if="loading" class="text-lg text-center bg-dark-2 text-brt-dim p-4">
      Loading...
    </div>
    <div
      v-if="loaded || expanded"
      v-show="expanded"
      class="bg-dark-4 overflow-hidden"
    >
      <template v-for="({ chunk, pairs }, i) in this.chunks">
        <div
          class="w-full border-b border-t border-blue-500"
          :key="`chunk-${i}`"
        >
          <pre class="w-full py-1 px-2 bg-dark-3 text-blue-500">{{
            chunk.content
          }}</pre>
        </div>

        <DiffLine
          v-for="(pair, j) in pairs"
          :key="`chunk-${i}-change-${j}`"
          :rendered="pair"
          :threads="getThreads(pair)"
          @add-comment="onAddComment(chunk, $event)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import parseDiff from "parse-diff";

import DiffLine from "@/components/elements/DiffLine.vue";

import AuthModule from "../../store/modules/auth";
import ReviewModule from "../../store/modules/review";
import { AddCommentEvent } from "../../model/events";

import {
  ThreadArgs,
  Thread,
  CommentArgs,
  Side,
  ThreadPair
} from "../../model/review";
import {
  ChangePair,
  zipChangePairs,
  renderPairs,
  RenderedChangePair,
  FileMetadata
} from "../../plugins/diff";

interface ChunkData {
  chunk: parseDiff.Chunk;
  pairs: RenderedChangePair[];
}

@Component({
  components: {
    DiffLine
  }
})
export default class ChangeEntry extends Vue {
  @Prop() meta!: FileMetadata;
  @Prop() chunks!: ChunkData[];

  public loading = false;
  public loaded = false;
  public expanded = false;

  private authModule = getModule(AuthModule, this.$store);
  private reviewModule = getModule(ReviewModule, this.$store);

  public getThreads(pair: RenderedChangePair): ThreadPair {
    const leftArgs: ThreadArgs = {
      side: "left",
      file: this.meta.from,
      line: pair.left.number
    };

    const rightArgs: ThreadArgs = {
      side: "right",
      file: this.meta.to,
      line: pair.right.number
    };

    return {
      left: this.reviewModule.threadByArgs(leftArgs),
      right: this.reviewModule.threadByArgs(rightArgs)
    };
  }

  public async onAddComment(chunk: parseDiff.Chunk, event: AddCommentEvent) {
    const file = event.side === "left" ? this.meta.from : this.meta.to;
    const threadArgs: ThreadArgs = {
      file,
      side: event.side,
      line: event.line
    };

    // TODO: Doing this inside the comment thread may help reactivity?
    let thread: Thread | null = this.reviewModule.threadByArgs(threadArgs);
    if (!thread) {
      thread = await this.reviewModule.newThread({ args: threadArgs });
    }

    const commentArgs: CommentArgs = {
      username: this.authModule.assertUser.username,
      photoURL: this.authModule.assertUser.photoURL,
      text: event.content
    };

    // Add comment
    await this.reviewModule.newComment({
      threadId: thread.id,
      args: commentArgs
    });

    // If resolution state specified, set that
    if (event.resolve != undefined) {
      this.reviewModule.setThreadResolved({
        threadId: thread.id,
        resolved: event.resolve
      });
    }
  }

  public toggle() {
    if (!this.expanded) {
      this.expand();
    } else {
      this.expanded = false;
    }
  }

  public expand() {
    if (this.loaded) {
      this.expanded = true;
      return;
    }

    // TODO: Add some benchmarking here!
    let totalLength = 0;
    this.chunks.forEach(c => (totalLength += c.pairs.length));
    const isLarge = totalLength >= 50;

    if (!isLarge) {
      this.expanded = true;
      this.loaded = true;
      return;
    }

    this.loading = true;
    this.nextRender(() => {
      this.expanded = true;
      this.loaded = true;
      this.loading = false;
    });
  }

  public collapse() {
    this.expanded = false;
  }

  /**
   * This is like a harder version of nextTick, see:
   * https://github.com/vuejs/vue/issues/9200
   */
  public nextRender(callback: FrameRequestCallback) {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  }

  get allThreads() {
    const l: Thread[] = this.reviewModule.threadsByFile(this.meta.from, "left");
    const r: Thread[] = this.reviewModule.threadsByFile(this.meta.to, "right");

    return [...l, ...r];
  }

  get additionPct() {
    const exact =
      this.meta.additions / (this.meta.additions + this.meta.deletions);
    if (exact === 0) {
      return 0;
    } else if (exact === 1) {
      return 100;
    } else {
      const asPct = Math.round(exact * 100);
      return Math.max(10, Math.min(asPct, 90));
    }
  }

  get icon() {
    if (this.expanded) {
      return "caret-down";
    } else {
      return "caret-right";
    }
  }

  get added() {
    return this.meta.from === "/dev/null";
  }

  get deleted() {
    return this.meta.to === "/dev/null";
  }

  get title() {
    if (this.meta.from === this.meta.to) {
      return this.meta.from;
    } else if (this.added) {
      return `${this.meta.to}`;
    } else if (this.deleted) {
      return `${this.meta.from}`;
    } else {
      return `${this.meta.from} -> ${this.meta.to}`;
    }
  }
}
</script>

<style scoped lang="scss">
// None
</style>
