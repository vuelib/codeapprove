<template>
  <div class="rounded overflow-hidden my-2 border border-gray-400">
    <div
      class="flex p-2 font-bold items-center bg-gray-200 border-b border-gray-400"
    >
      <font-awesome-icon fixed-width @click="toggle" :icon="icon" />
      <span class="flex-grow pl-2d">{{ diff.from }}</span>
      <span class="flex-shrink mx-1 px-2 rounded bg-green-400 text-green-800"
        >+{{ diff.additions }}</span
      >
      <span class="flex-shrink mx-1 px-2 rounded bg-red-400 text-red-800"
        >-{{ diff.deletions }}</span
      >
    </div>
    <div v-show="expanded" class="overflow-hidden bg-yellow-100">
      <template v-for="(chunk, i) in this.diff.chunks">
        <div
          class="w-full border-b border-t border-blue-200"
          :key="`chunk-${i}`"
        >
          <pre class="w-full py-1 px-4 bg-blue-100 text-blue-500">{{
            chunk.content
          }}</pre>
        </div>

        <DiffLine
          v-for="(pair, j) in changePairs(chunk)"
          :key="`chunk-${i}-change-${j}`"
          :leftFile="fileName('left')"
          :rightFile="fileName('right')"
          :left="pair.left"
          :right="pair.right"
          @add-comment="onAddComment(chunk, pair, $event)"
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

interface ChangePair {
  left?: parseDiff.Change;
  right?: parseDiff.Change;
}

@Component({
  components: {
    DiffLine
  }
})
export default class ChangeEntry extends Vue {
  @Prop() diff!: parseDiff.File;

  public expanded = true;

  private authModule = getModule(AuthModule, this.$store);
  private reviewModule = getModule(ReviewModule, this.$store);

  public fileName(side: Side): string {
    return side === "left" ? this.diff.from! : this.diff.to!;
  }

  public async onAddComment(
    chunk: parseDiff.Chunk,
    pair: ChangePair,
    event: AddCommentEvent
  ) {
    console.log("ChangeEntry:onAddComment", event);

    const file = this.fileName(event.side);
    const threadArgs: ThreadArgs = {
      file,
      side: event.side,
      line: event.line
    };

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

  /**
   * Zip the list of changes from a chunk into an array of pairs ready to be diffed side-by-side.
   */
  public changePairs(chunk: parseDiff.Chunk): ChangePair[] {
    const res: ChangePair[] = [];

    let i = 0;
    while (i < chunk.changes.length) {
      const change = chunk.changes[i];

      // Del followed by add means the lines "match"
      if (i < chunk.changes.length - 1) {
        const next = chunk.changes[i + 1];
        if (change.type === "del" && next.type === "add") {
          res.push({
            left: change,
            right: next
          });

          // Extra increment
          i += 2;
          continue;
        }
      }

      if (change.type === "del") {
        res.push({ left: change, right: undefined });
      } else if (change.type === "add") {
        res.push({ left: undefined, right: change });
      } else {
        res.push({ left: change, right: change });
      }

      i++;
    }

    return res;
  }

  public toggle() {
    this.expanded = !this.expanded;
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
