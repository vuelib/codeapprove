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
        <img class="flex-shrink mr-4 mt-1" style="height: 32px; width: 32px;" />
        <div class="flex-grow">
          <div class="flex">
            <span class="flex-grow font-bold">{{ comment.username }}</span>
          </div>
          <span>{{ comment.text }}</span>
        </div>
      </div>

      <!-- Form -->
      <!-- TODO: Handle focus out -->
      <div @focusin="focused = true">
        <div class="flex p-2">
          <img
            class="flex-none rounded mr-2"
            :src="authModule.user.photoURL"
            style="height: 32px; width: 32px;"
          />
          <textarea
            class="flex-grow py-1 px-2 mr-1 rounded border bg-white border-gray-400"
            v-model="draftComment"
            rows="1"
            placeholder="Reply...?"
          />
        </div>
        <div
          v-show="focused || comments.length === 0"
          class="flex flex-row-reverse px-2 pb-2"
        >
          <button class="ml-2 btn btn-green" @click.prevent="onSubmit(true)">
            Send + Resolve
            <font-awesome-icon icon="check" class="self-end mx-1" />
          </button>
          <button class="ml-2 btn btn-blue" @click.prevent="onSubmit(false)">
            Send
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
import AuthModule from "../../store/modules/auth";
import * as firebase from "firebase/app";

interface Comment {
  username: string;
  text: string;
}

@Component({})
export default class CommentThread extends Vue {
  authModule = getModule(AuthModule, this.$store);

  focused = false;
  forceExpand = false;

  // TODO: Real state
  resolved = false;
  comments: Comment[] = [];

  draftComment: string = "";

  public onSubmit(resolved: boolean) {
    this.comments.push({
      username: this.authModule.username,
      text: this.draftComment
    });

    this.resolved = resolved;
    this.draftComment = "";
    this.focused = false;
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
