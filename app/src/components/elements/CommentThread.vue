<template>
  <div class="border border-gray-400 bg-white">
    <div
      v-if="resolved && !forceExpand"
      class="flex items-center px-2 py-1 text-gray-600"
    >
      <span class="italic flex-grow">Comment resolved</span>
      <font-awesome-icon
        @click="forceExpand = true"
        icon="eye"
        class="hover:text-gray-800 cursor-pointer"
      />
    </div>
    <div v-else>
      <!-- Thread -->
      <div v-for="(comment, index) in comments" :key="index" class="flex p-2">
        <img class="flex-none avatar mt-1 mr-4" :src="comment.photoURL" />
        <div class="flex-grow">
          <p class="font-bold">
            {{ comment.username }}
          </p>
          <MarkdownContent :content="comment.text" />
        </div>
      </div>

      <!-- Form -->
      <!-- TODO: Handle focus out -->
      <div @focusin="focused = true">
        <div class="flex p-2">
          <img class="flex-none avatar mr-4" :src="authModule.user.photoURL" />
          <div
            :class="{ border: !renderDraft, 'border-gray-400': !renderDraft }"
            class="flex-grow relative py-1 px-2 rounded bg-white"
          >
            <font-awesome-icon
              v-show="typing"
              @click="renderDraft = !renderDraft"
              :icon="renderDraft ? 'keyboard' : 'magic'"
              class="absolute m-1 right-0 text-gray-600 hover:text-gray-800 cursor-pointer"
            />
            <textarea
              class="w-full overflow-hidden"
              v-show="!renderDraft"
              v-model="draftComment"
              :rows="typing ? '4' : '1'"
              placeholder="Reply...?"
              @focus="textFocus = true"
              @blur="textFocus = false"
            />
            <MarkdownContent
              class="w-full"
              v-if="renderDraft"
              :content="draftComment"
            />
          </div>
        </div>
        <div
          v-show="focused || comments.length === 0"
          class="flex flex-row-reverse px-2 pb-2"
        >
          <button
            v-if="!resolved"
            class="ml-2 btn btn-green"
            @click.prevent="addComment(true)"
          >
            Save + Resolve
            <font-awesome-icon icon="check" class="self-end mx-1" />
          </button>
          <button
            v-else
            class="ml-2 btn btn-green"
            @click.prevent="addComment(false)"
          >
            Save + Reopen
            <font-awesome-icon icon="exclamation" class="self-end mx-1" />
          </button>

          <button class="ml-2 btn btn-blue" @click.prevent="addComment()">
            Save
          </button>
          <button class="btn btn-red" @click.prevent="onCancel()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import * as firebase from "firebase/app";

import MarkdownContent from "@/components/elements/MarkdownContent.vue";
import { AddCommentEvent, ADD_COMMENT_EVENT } from "../../model/events";
import {
  Thread,
  ThreadArgs,
  Comment,
  CommentArgs,
  Side
} from "../../model/review";
import AuthModule from "../../store/modules/auth";
import ReviewModule from "../../store/modules/review";
import { auth } from "../../plugins/firebase";

@Component({
  components: {
    MarkdownContent
  }
})
export default class CommentThread extends Vue {
  @Prop() side!: Side;
  @Prop() line!: number;
  @Prop() threadId?: string;

  authModule = getModule(AuthModule, this.$store);
  reviewModule = getModule(ReviewModule, this.$store);

  thread: Thread | null = null;

  focused = false;
  forceExpand = false;
  textFocus = false;
  renderDraft = false;
  draftComment: string = "";

  mounted() {
    this.checkThread();
  }

  updated() {
    this.checkThread();
  }

  // TODO: This smells
  private checkThread() {
    if (this.threadId) {
      this.thread = this.reviewModule.threadById(this.threadId);
    }
  }

  get typing() {
    return this.textFocus || this.draftComment.length > 0;
  }

  get resolved(): boolean {
    return this.thread != null && this.thread.resolved;
  }

  get comments(): Comment[] {
    if (!this.thread) {
      return [];
    }

    return this.reviewModule.commentsByThread(this.thread.id);
  }

  public async addComment(resolve?: boolean) {
    const event: AddCommentEvent = {
      content: this.draftComment,
      side: this.side,
      line: this.line,
      resolve
    };

    // Note: this emits from the PARENT which means DiffLine emits the event
    this.$parent.$emit(ADD_COMMENT_EVENT, event);

    // TODO: Need some kind of "pending" state until the thing hits the server

    // Reset local state
    this.draftComment = "";
    this.renderDraft = false;
    this.focused = false;
    if (resolve === true) {
      this.forceExpand = false;
    }
  }

  public onCancel() {
    if (this.comments.length > 0) {
      this.focused = false;
    } else {
      this.$emit("cancel");
    }
  }
}
</script>

<style scoped lang="postcss">
.avatar {
  @apply rounded;
  height: 32px;
  width: 32px;
}
</style>
