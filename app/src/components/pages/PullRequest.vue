<template>
  <div v-if="loaded" class="py-4 px-4">
    <div class="mb-4 flex flex-row items-center">
      <div>
        <h3 class="font-bold text-xl">
          {{ pr.head.repo.full_name }}
          (<a
            class="text-purple-300 hover:underline"
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
        v-if="!drafts.length && !userHasApproved"
        class="btn btn-green"
        @click="setMyApproval(true)"
      >
        Quick Approve
        <font-awesome-icon icon="check" />
      </button>

      <button
        v-if="userHasApproved"
        class="btn btn-red"
        @click="setMyApproval(false)"
      >
        Undo Approval
        <font-awesome-icon icon="times" />
      </button>
    </div>

    <div
      v-if="drafts.length"
      class="flex flex-row items-center rounded border border-dark-0 bg-dark-3 my-4 py-3"
    >
      <span class="ml-4 font-bold text-yellow-400"
        ><font-awesome-icon icon="paper-plane" class="mr-1" /> You have
        {{ drafts.length }} draft comments</span
      >
      <span class="flex-grow"><!-- spacer --></span>
      <!-- TODO: Discard is unimplemented -->
      <button class="btn btn-red ml-2">Discard</button>
      <!-- TODO: This should not unset approval if already approved -->
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
        class="col-span-8 shadow rounded border border-dark-0 overflow-hidden"
      >
        <div
          class="flex items-center px-4 py-1 bg-dark-3 font-bold border-b border-dark-0"
        >
          <font-awesome-icon icon="user-edit" class="mr-2" />
          <span>Description</span>
        </div>
        <MarkdownContent class="bg-dark-2 p-4" :content="pr.body" />
      </div>

      <!-- Review info -->
      <div
        :class="isApproved ? 'container-green' : 'container-yellow'"
        class="col-span-4 shadow inline-block border-dark-0 overflow-hidden rounded border"
      >
        <div
          :class="isApproved ? 'content-green' : 'content-yellow'"
          class="flex items-center px-4 py-1 bg-dark-3 font-bold border-dark-0 border-b"
        >
          <!-- TODO: Variable icon and styling -->
          <font-awesome-icon
            :icon="isApproved ? 'check' : 'pause-circle'"
            class="mr-2"
          />
          <span>Status: {{ statusText }}</span>
        </div>
        <div class="bg-dark-2 p-4">
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
                      :icon="didApprove(reviewer) ? 'check' : 'circle'"
                      :class="
                        didApprove(reviewer)
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      "
                      class="ml-1"
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

import { Github } from "../../plugins/github";
import ReviewModule from "../../store/modules/review";
import UIModule from "../../store/modules/ui";
import {
  getFileMetadata,
  renderPairs,
  zipChangePairs
} from "../../plugins/diff";
import { Thread, Comment, ReviewMetadata } from "../../model/review";
import AuthModule from "../../store/modules/auth";

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

  // TODO: These should be one state object
  public pr: PullsGetResponseData | null = null;
  public diffs: parseDiff.File[] = [];

  private authModule = getModule(AuthModule, this.$store);
  private reviewModule = getModule(ReviewModule, this.$store);
  // TODO: This could be a mixin and expose a withLoading() hook
  private uiModule = getModule(UIModule, this.$store);

  private github!: Github;

  async mounted() {
    this.github = new Github(this.authModule.assertUser.githubToken);
    this.uiModule.beginLoading();

    // TODO: Need to watch for route changes
    // https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes
    const params = this.$route.params;

    const meta: ReviewMetadata = {
      owner: params.owner,
      repo: params.repo,
      number: Number.parseInt(params.number)
    };

    this.reviewModule.initializeReview(meta);
    const { pr, diffs } = await this.github.getPullRequest(
      meta.owner,
      meta.repo,
      meta.number
    );
    this.pr = Object.freeze(pr);
    this.diffs = diffs;

    this.uiModule.endLoading();
  }

  public setMyApproval(approved: boolean) {
    this.reviewModule.pushReviewer({
      login: this.authModule.assertUser.username,
      approved
    });
  }

  public async sendDrafts(approve: boolean) {
    this.setMyApproval(approve);
    await this.reviewModule.sendDraftComments({ approve });
  }

  public onReviewerSelected(event: { login: string }) {
    console.log("onReviewerSelected", event);
    this.usersearching = false;
    this.reviewModule.pushReviewer({ login: event.login, approved: false });
  }

  get userHasApproved() {
    return (
      this.reviewModule.review.reviewers[
        this.authModule.assertUser.username
      ] === true
    );
  }

  get isApproved() {
    return this.hasSomeApproval && !this.hasUnresolved;
  }

  get hasSomeApproval() {
    return Object.values(this.reviewModule.review.reviewers).some(x => x);
  }

  get hasUnresolved() {
    return this.numUnresolvedThreads > 0;
  }

  get statusText() {
    if (this.reviewers.length === 0) {
      return "Needs Review";
    }

    if (this.hasSomeApproval) {
      if (this.hasUnresolved) {
        return "Needs Resolution";
      } else {
        return "Approved";
      }
    } else {
      return "Needs Approval";
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
    // TODO: Draft comments affect this right now, they should not
    const unresolved: Thread[] = this.reviewModule.review.threads.filter(
      x => !x.resolved
    );
    return unresolved.length;
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
  /* @apply border-yellow-300; */
}

.content-yellow {
  /* @apply border-yellow-300 bg-yellow-200 text-yellow-400; */
  @apply text-yellow-400;
}

.container-green {
  /* @apply border-green-400; */
}

.content-green {
  /* @apply border-green-300 bg-green-200 text-green-400; */
  @apply text-green-400;
}
</style>
