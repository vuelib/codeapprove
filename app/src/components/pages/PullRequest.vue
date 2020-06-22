<template>
  <div v-if="loaded" class="py-4 px-4">
    <div class="mb-4 flex flex-row items-center">
      <div>
        <h3 class="font-bold text-xl">
          {{ pr.head.repo.full_name }}
          (<a
            class="text-blue-600 hover:underline"
            :href="
              `https://github.com/${pr.head.repo.full_name}/pull/${pr.number}`
            "
            target="_blank"
            >#{{ pr.number }}</a
          >)
        </h3>
        <p>
          merge <code>{{ pr.head.ref }}</code> into
          <code>{{ pr.base.ref }}</code>
        </p>
      </div>

      <span class="flex-grow"><!-- spacer --></span>

      <button
        v-if="!drafts.length"
        class="btn btn-green mx-4"
        @click="sendDrafts(true)"
      >
        Quick Approve
        <font-awesome-icon icon="check" />
      </button>
    </div>

    <div
      v-if="drafts.length"
      class="flex flex-row items-center rounded border border-yellow-500 bg-yellow-200 my-4 py-3"
    >
      <span class="ml-4 font-bold text-yellow-800"
        ><font-awesome-icon icon="paper-plane" class="mr-1" /> You have
        {{ drafts.length }} draft comments</span
      >
      <span class="flex-grow"><!-- spacer --></span>
      <!-- TODO: Discard is unimplemented -->
      <button class="btn btn-red ml-2">Discard</button>
      <button class="btn btn-blue ml-2" @click.prevent="sendDrafts(false)">
        Send
      </button>
      <button class="btn btn-green ml-2 mr-2" @click.prevent="sendDrafts(true)">
        Send + Approve
      </button>
    </div>

    <!-- Description, reviewers, etc -->
    <div class="grid grid-cols-12 gap-4 items-start">
      <!-- Description -->
      <div
        class="col-span-8 shadow rounded border border-gray-400 overflow-hidden"
      >
        <div
          class="flex items-center px-4 py-1 bg-gray-200 font-bold border-b border-gray-400"
        >
          <font-awesome-icon icon="user-edit" class="mr-2" />
          <span>Description</span>
        </div>
        <MarkdownContent class="p-4" :content="pr.body" />
      </div>

      <!-- Review info -->
      <div
        :class="{
          'container-yellow': !isApproved,
          'container-green': isApproved
        }"
        class="col-span-4 shadow inline-block overflow-hidden rounded border"
      >
        <div
          :class="{
            'content-yellow': !isApproved,
            'content-green': isApproved
          }"
          class="flex items-center px-4 py-1 font-bold border-b"
        >
          <!-- TODO: Variable icon and styling -->
          <font-awesome-icon
            :icon="isApproved ? 'check' : 'pause-circle'"
            class="mr-2"
          />
          <span>Status: {{ statusText }}</span>
        </div>
        <div class="p-4">
          <table class="table-auto">
            <tr>
              <td class="font-bold align-top">
                <div class="inline-flex items-center mr-2">
                  <font-awesome-icon icon="user-check" class="mr-1" /> reviewers
                </div>
              </td>
              <td>
                <div>
                  <p v-for="reviewer in reviewers" :key="reviewer">
                    {{ reviewer }}
                    <font-awesome-icon
                      v-if="didApprove(reviewer)"
                      icon="check"
                      class="text-green-500 ml-2"
                      size="xs"
                    />
                    <font-awesome-icon
                      v-else
                      icon="circle"
                      class="text-yellow-500 ml-2"
                      size="xs"
                    />
                  </p>
                  <a
                    class="text-blue-600 hover:underline cursor-pointer pr-1"
                    @click.stop="usersearching = true"
                    >(add)</a
                  >
                </div>
                <UserSearchModal
                  class="absolute"
                  v-if="usersearching"
                  v-click-outside="() => (usersearching = false)"
                  @selected="onReviewerSelected"
                />
              </td>
            </tr>
            <tr>
              <td class="font-bold align-top">
                <div class="inline-flex items-center mr-2">
                  <font-awesome-icon icon="comment" class="mr-1" /> comments
                </div>
              </td>
              <td>
                {{ numThreads }} threads ({{ numUnresolvedThreads }} unresolved)
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <!-- Changes -->
    <div class="mt-8">
      <div class="flex flex-row items-center">
        <span class="font-bold text-lg">Changes</span>
        <span class="flex-grow"><!-- spacer --></span>

        <!-- TODO: Make these work -->
        <button class="btn btn-small btn-blue ml-2">
          Expand <font-awesome-icon icon="plus" class="ml-1" />
        </button>
        <button class="btn btn-small btn-blue ml-2">
          Collapse <font-awesome-icon icon="minus" class="ml-1" />
        </button>
      </div>

      <ChangeEntry
        v-for="(diff, index) in diffs"
        :key="`${index}-change`"
        :meta="getMetadata(diff)"
        :chunks="renderChunkData(diff)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import { PullsGetResponseData } from "@octokit/types";

import parseDiff from "parse-diff";

import MarkdownContent from "@/components/elements/MarkdownContent.vue";
import ChangeEntry from "@/components/elements/ChangeEntry.vue";
import UserSearchModal from "@/components/elements/UserSearchModal.vue";

import * as github from "../../plugins/github";
import ReviewModule from "../../store/modules/review";
import UIModule from "../../store/modules/ui";
import {
  getFileMetadata,
  renderPairs,
  zipChangePairs
} from "../../plugins/diff";

@Component({
  components: {
    ChangeEntry,
    MarkdownContent,
    UserSearchModal
  }
})
export default class PullRequest extends Vue {
  // TODO: Put these in a "UI" object
  public usersearching = false;
  public loading = true;

  public pr: PullsGetResponseData | null = null;
  public diffs: parseDiff.File[] = [];

  private reviewModule = getModule(ReviewModule, this.$store);
  private uiModule = getModule(UIModule, this.$store);

  async mounted() {
    this.uiModule.beginLoading();

    // TODO: can use await
    github
      .getPullRequest("hatboysam", "diffmachine", 5)
      .then(({ pr, diffs }) => {
        this.pr = Object.freeze(pr);
        this.diffs = diffs;
      })
      .then(() => {
        this.uiModule.endLoading();
      });
  }

  public async sendDrafts(approve: boolean) {
    // TODO: Need the real state!
    this.reviewModule.pushReviewer({ login: "todoname", approved: approve });
    await this.reviewModule.sendDraftComments({ approve });
  }

  public onReviewerSelected(event: { login: string }) {
    console.log("onReviewerSelected", event);
    this.usersearching = false;
    this.reviewModule.pushReviewer({ login: event.login, approved: false });
  }

  get isApproved() {
    return Object.values(this.reviewModule.review.reviewers).some(x => x);
  }

  get statusText() {
    if (this.reviewers.length === 0) {
      return "Needs Review";
    }

    if (this.isApproved) {
      return "Approved";
    } else {
      return "Pending";
    }
  }

  get reviewers(): string[] {
    return Object.keys(this.reviewModule.review.reviewers);
  }

  public didApprove(login: string): boolean {
    return this.reviewModule.review.reviewers[login] || false;
  }

  get loaded() {
    return this.pr != null;
  }

  get drafts() {
    return this.reviewModule.drafts;
  }

  get numThreads() {
    return this.reviewModule.review.threads.length;
  }

  get numUnresolvedThreads() {
    return this.reviewModule.review.threads.filter(x => !x.resolved).length;
  }

  private getMetadata(diff: parseDiff.File) {
    return Object.freeze(getFileMetadata(diff));
  }

  private renderChunkData(diff: parseDiff.File) {
    // TODO: Freeze the whole thing
    return diff.chunks.map(chunk => {
      return Object.freeze({
        chunk,
        // TODO: Render and zip all at once
        pairs: renderPairs(zipChangePairs(chunk))
      });
    });
  }
}
</script>

<style lang="postcss">
.container-yellow {
  @apply border-yellow-700;
}

.content-yellow {
  @apply bg-yellow-500 text-yellow-900;
}

.container-green {
  @apply border-green-700;
}

.content-green {
  @apply border-green-700 bg-green-500 text-green-900;
}
</style>
