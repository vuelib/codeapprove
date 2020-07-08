<template>
  <div
    :class="{ active: active }"
    class="rounded overflow-hidden my-2 dark-shadow border border-dark-0"
  >
    <!-- Bind hotkeys when active -->
    <div v-if="active && expanded" v-hotkey="hotKeyMap" />

    <div
      @click="toggle"
      class="flex p-2 font-bold items-center bg-dark-3 border-b border-dark-0"
    >
      <font-awesome-icon fixed-width :icon="icon" />
      <!-- TODO: Show both file names when it's renamed -->
      <span class="ml-2 text-wht-med">{{ title }}</span>
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
      <template v-for="{ chunk, pairs } in chunks">
        <div
          class="w-full border-b border-t border-blue-500"
          :key="chunk.content"
        >
          <pre class="w-full py-1 px-2 bg-dark-3 text-blue-500">{{
            chunk.content
          }}</pre>
        </div>

        <DiffLine
          v-for="(pair, j) in pairs"
          ref="difflines"
          :key="`${chunk.content}-pair-${j}`"
          :rendered="pair"
          :langs="langPair"
          :threads="getThreads(pair)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import parseDiff from "parse-diff";

import { ChangeEntryAPI, DiffLineAPI } from "../api";
import { EventEnhancer } from "../mixins/EventEnhancer";

import DiffLine from "@/components/elements/DiffLine.vue";
import AuthModule from "../../store/modules/auth";
import ReviewModule from "../../store/modules/review";
import { AddCommentEvent } from "../../plugins/events";
import { getFileLang } from "../../plugins/prism";

import {
  ThreadArgs,
  Thread,
  Side,
  ThreadPair,
  ThreadContentArgs
} from "../../model/review";
import {
  ChangePair,
  zipChangePairs,
  RenderedChangePair,
  FileMetadata
} from "../../plugins/diff";
import { KeyMap, CHANGE_ENTRY_KEY_MAP } from "../../plugins/hotkeys";

export interface ChunkData {
  chunk: parseDiff.Chunk;
  pairs: RenderedChangePair[];
}

@Component({
  components: {
    DiffLine
  }
})
export default class ChangeEntry extends Mixins(EventEnhancer)
  implements ChangeEntryAPI {
  @Prop() meta!: FileMetadata;
  @Prop() chunks!: ChunkData[];

  public active = false;
  public loading = false;
  public loaded = false;
  public expanded = false;

  public activeLineIndex = -1;

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

  public handleEvent(e: Partial<AddCommentEvent>) {
    console.log("ChangeEntry#handleEvent");
    const file = e.side === "left" ? this.meta.from : this.meta.to;
    e.file = file;
    this.bubbleUp(e);
  }

  get hotKeyMap(): KeyMap {
    return CHANGE_ENTRY_KEY_MAP(this);
  }

  // TODO: When we can expand between chunks this will be a problem
  get totalLength(): number {
    let totalLength = 0;
    this.chunks.forEach(c => (totalLength += c.pairs.length));
    return totalLength;
  }

  public activate() {
    this.active = true;
    this.$el.scrollIntoView({
      block: "center"
    });
  }

  public deactivate() {
    this.active = false;

    const line = this.getCurrentLine();
    if (line) {
      line.deactivate;
    }

    this.activeLineIndex = -1;
  }

  public toggle() {
    if (!this.expanded) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  public collapse() {
    this.expanded = false;
  }

  public expand() {
    if (this.loaded) {
      this.expanded = true;
      return;
    }

    // TODO: Add some benchmarking here!
    const isLarge = this.totalLength >= 50;

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

  public nextLine() {
    const prev = this.getCurrentLine();
    if (prev) {
      prev.deactivate();
    }

    if (this.activeLineIndex < this.totalLength - 1) {
      this.activeLineIndex++;
    }

    const next = this.getCurrentLine()!;
    next.activate();

    console.log("nextLine", this.activeLineIndex);
  }

  public prevLine() {
    const prev = this.getCurrentLine();
    if (prev) {
      prev.deactivate();
    }

    if (this.activeLineIndex > 0) {
      this.activeLineIndex--;
    }

    const next = this.getCurrentLine()!;
    next.activate();
  }

  public addLineComment() {
    const line = this.getCurrentLine();
    if (line) {
      line.addComment();
    }
  }

  public getCurrentLine(): DiffLineAPI | undefined {
    const lines = this.$refs.difflines as DiffLineAPI[];
    if (lines) {
      return lines[this.activeLineIndex];
    }
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

  public get langPair() {
    return {
      left: getFileLang(this.meta.from),
      right: getFileLang(this.meta.to)
    };
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

<style scoped lang="postcss">
.active {
  @apply border border-blue-500;
}
</style>
