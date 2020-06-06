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
          <div v-html="renderMd(comment.text)"></div>
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
            <div
              class="w-full"
              v-if="renderDraft"
              v-html="renderMd(draftComment)"
            ></div>
          </div>
        </div>
        <div
          v-show="focused || comments.length === 0"
          class="flex flex-row-reverse px-2 pb-2"
        >
          <button
            v-if="!resolved"
            class="ml-2 btn btn-green"
            @click.prevent="onSubmit(true)"
          >
            Save + Resolve
            <font-awesome-icon icon="check" class="self-end mx-1" />
          </button>
          <button
            v-else
            class="ml-2 btn btn-green"
            @click.prevent="onSubmit(false)"
          >
            Save + Reopen
            <font-awesome-icon icon="exclamation" class="self-end mx-1" />
          </button>

          <button class="ml-2 btn btn-blue" @click.prevent="onSubmit()">
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import * as firebase from "firebase/app";
import marked from "marked";

import { Thread, ThreadArgs, Comment, CommentArgs } from "../../model/review";
import AuthModule from "../../store/modules/auth";
import ReviewModule from "../../store/modules/review";
import { auth } from "../../plugins/firebase";

// TODO: Can I centralize this somewhere?
marked.setOptions({
  gfm: true,
  breaks: true
});

@Component({})
export default class CommentThread extends Vue {
  authModule = getModule(AuthModule, this.$store);
  reviewModule = getModule(ReviewModule, this.$store);

  focused = false;
  forceExpand = false;

  // TODO: This should be passed in from somewhere
  thread: Thread | null = null;

  textFocus = false;
  renderDraft = false;
  draftComment: string = "";

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

    return this.reviewModule.comments(this.thread.id);
  }

  public renderMd(text: string) {
    return marked(text);
  }

  public async onSubmit(resolve?: boolean) {
    if (!this.thread) {
      // TODO: This should come in from the outside
      const args: ThreadArgs = {
        file: "README.md",
        side: "left",
        line: 1
      };
      this.thread = await this.reviewModule.newThread({ args });
    }

    const args: CommentArgs = {
      username: this.authModule.username,
      photoURL: this.authModule.photoURL,
      text: this.draftComment
    };

    // Add comment
    await this.reviewModule.newComment({
      threadId: this.thread.id,
      args
    });

    // If resolution state specified, set that
    if (resolve != undefined) {
      this.reviewModule.setThreadResolved({
        threadId: this.thread.id,
        resolved: resolve
      });
    }

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
      // TODO: Should the v-show even be external?
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

.btn {
  @apply px-2 py-1;
  @apply rounded shadow border;
}

.btn:hover {
  @apply shadow-none;
  @apply border-white text-white;
}

.btn-blue {
  @apply border-blue-500 text-blue-500;
}

.btn-blue:hover {
  @apply bg-blue-500;
}

.btn-red {
  @apply border-red-400 text-red-400;
}

.btn-red:hover {
  @apply bg-red-400;
}

.btn-green {
  @apply border-green-500 text-green-500;
}

.btn-green:hover {
  @apply bg-green-500;
}
</style>
