<template>
  <div class="rounded overflow-hidden my-2 border border-gray-400">
    <div
      class="flex p-2 font-bold items-center bg-gray-200 border-b border-gray-400"
    >
      <font-awesome-icon fixed-width @click="toggle" :icon="icon" />
      <!-- TODO: Show both file names when it's renamed -->
      <span class="flex-grow pl-2d">{{ meta.from }}</span>
      <span class="flex-shrink mx-1 px-2 rounded bg-green-400 text-green-800"
        >+{{ meta.additions }}</span
      >
      <span class="flex-shrink mx-1 px-2 rounded bg-red-400 text-red-800"
        >-{{ meta.deletions }}</span
      >
    </div>
    <div
      v-if="eager || expanded"
      v-show="expanded"
      class="overflow-hidden bg-yellow-100"
    >
      <template v-for="({ chunk, pairs }, i) in this.chunks">
        <div
          class="w-full border-b border-t border-blue-200"
          :key="`chunk-${i}`"
        >
          <pre class="w-full py-1 px-4 bg-blue-100 text-blue-500">{{
            chunk.content
          }}</pre>
        </div>

        <DiffLine
          v-for="(pair, j) in pairs"
          :key="`chunk-${i}-change-${j}`"
          :leftFile="meta.from"
          :rightFile="meta.to"
          :rendered="pair"
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

import { ThreadArgs, Thread, CommentArgs, Side } from "../../model/review";
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

  // TODO: This should depend on the number of additions and the file name
  public eager = false;
  public expanded = false;

  private authModule = getModule(AuthModule, this.$store);
  private reviewModule = getModule(ReviewModule, this.$store);

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
      username: this.authModule.username,
      photoURL: this.authModule.photoURL,
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
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.eager = true;
    }
  }

  get icon() {
    if (this.expanded) {
      return "caret-down";
    } else {
      return "caret-right";
    }
  }
}
</script>

<style scoped lang="scss">
// None
</style>
