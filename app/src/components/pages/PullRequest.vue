<template>
  <div v-if="loaded" v-hotkey="keymap" class="relative py-4 px-4">
    <HotkeyModal :map="keymap" />
    <div class="mb-4 flex flex-row items-center">
      <div>
        <h3 class="font-bold text-xl">
          {{ meta.owner }}/{{ meta.repo }} (<a
            class="text-purple-300 hover:underline"
            :href="
              `https://github.com/${meta.owner}/${meta.repo}/pull/${meta.number}`
            "
            target="_blank"
            >#{{ meta.number }}</a
          >)
        </h3>
        <p>
          merge <code>{{ prData.pr.head.ref }}</code> into
          <code>{{ prData.pr.base.ref }}</code>
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
      class="flex flex-row items-center rounded border border-dark-0 bg-dark-3 dark-shadow my-4 py-3"
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
        class="col-span-8 dark-shadow rounded border border-dark-0 overflow-hidden"
      >
        <div
          class="flex items-center px-4 py-1 bg-dark-3 font-bold border-b border-dark-0"
        >
          <font-awesome-icon icon="user-edit" class="mr-2" />
          <span>Description</span>
        </div>
        <div class="description-content bg-dark-2">
          <MarkdownContent class="px-4 pt-2 pb-4" :content="prData.pr.body" />
        </div>
      </div>

      <!-- Review info -->
      <div
        class="col-span-4 dark-shadow inline-block border-dark-0 overflow-hidden rounded border"
      >
        <div
          :class="isApproved ? 'text-green-400' : 'text-yellow-400'"
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

        <!-- Change selector -->
        <div
          class="flex items-center rounded bg-dark-3 border-dark-0 text-sm dark-shadow py-1 px-2"
        >
          <span class="mr-1 font-bold">Base:</span>
          <select
            class="bg-dark-4"
            @change="onBaseSelected($event.target.value)"
          >
            <option :value="prData.pr.base.ref">{{
              prData.pr.base.ref
            }}</option>
            <option
              v-for="commit in prData.commits"
              :key="commit.sha"
              :value="commit.sha"
              >{{ displayCommit(commit) }}</option
            >
          </select>
        </div>

        <button @click="collapseAll" class="btn btn-small btn-blue ml-2">
          Collapse All <font-awesome-icon icon="minus" class="ml-1" />
        </button>
      </div>

      <ChangeEntry
        v-for="(diff, index) in prData.diffs"
        ref="changes"
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
import HotkeyModal from "@/components/elements/HotkeyModal.vue";

import { Github, PullRequestData } from "../../plugins/github";
import { freezeArray } from "../../plugins/freeze";
import ReviewModule from "../../store/modules/review";
import UIModule from "../../store/modules/ui";
import {
  getFileMetadata,
  renderPairs,
  zipChangePairs
} from "../../plugins/diff";
import { Thread, Comment, ReviewMetadata } from "../../model/review";
import AuthModule from "../../store/modules/auth";
import { KeyMap } from "../elements/HotkeyModal.vue";
import { ChangeEntryAPI, ChunkData } from "../elements/ChangeEntry.vue";

@Component({
  components: {
    ChangeEntry,
    MarkdownContent,
    UserSearchModal,
    HotkeyModal
  }
})
export default class PullRequest extends Vue {
  // TODO: Put these in a "UI" object
  public usersearching = false;
  public loading = true;

  // TODO: These should be one state object
  public prData: PullRequestData | null = null;
  public meta!: ReviewMetadata;

  public activeFileIndex = -1;

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

    this.meta = {
      owner: params.owner,
      repo: params.repo,
      number: Number.parseInt(params.number)
    };

    // TODO: Call this again on base change?
    this.reviewModule.initializeReview(this.meta);
    this.prData = await this.github.getPullRequest(
      this.meta.owner,
      this.meta.repo,
      this.meta.number
    );

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
    this.usersearching = false;
    this.reviewModule.pushReviewer({ login: event.login, approved: false });
  }

  public collapseAll() {
    const changes = this.$refs.changes as ChangeEntryAPI[];
    for (const c of changes) {
      c.deactivate();
      c.collapse();
    }
    this.activeFileIndex = -1;
  }

  public async onBaseSelected(base: string) {
    this.uiModule.beginLoading();
    const diffs = await this.github.getDiff(
      this.meta.owner,
      this.meta.repo,
      base,
      this.prData!.pr.head.ref
    );
    this.prData!.diffs = freezeArray(diffs);
    this.uiModule.endLoading();
  }

  public displayCommit(commit: {
    sha: string;
    commit: { message: string };
  }): string {
    let shortMsg = commit.commit.message;
    if (shortMsg.length >= 25) {
      shortMsg = shortMsg.substring(0, 22) + "...";
    }

    return `${commit.sha.substring(0, 6)} ${shortMsg}`;
  }

  private onNextFile() {
    const prev = this.getCurrentChangeEntry();
    if (prev) {
      prev.deactivate();
    }

    if (this.activeFileIndex < this.prData!.diffs.length - 1) {
      this.activeFileIndex++;
    }

    const next = this.getCurrentChangeEntry()!;
    next.activate();
  }

  private onPrevFile() {
    const prev = this.getCurrentChangeEntry();
    if (prev) {
      prev.deactivate();
    }

    if (this.activeFileIndex > 0) {
      this.activeFileIndex--;
    }

    const next = this.getCurrentChangeEntry()!;
    next.activate();
  }

  private onToggleFile() {
    const ce = this.getCurrentChangeEntry()!;
    ce.toggle();
    ce.activate();
  }

  private getCurrentChangeEntry(): ChangeEntryAPI | undefined {
    if (this.activeFileIndex < 0) {
      return;
    }

    return (this.$refs.changes as ChangeEntryAPI[])[this.activeFileIndex];
  }

  get keymap(): KeyMap {
    return {
      "alt+j": {
        keydown: this.onNextFile,
        desc: "Select next file."
      },
      "alt+k": {
        keydown: this.onPrevFile,
        desc: "Select previous file."
      },
      "alt+x": {
        keydown: this.onToggleFile,
        desc: "Expand/collapse selected file."
      }
    };
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
    return this.prData != null;
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

  private renderChunkData(diff: parseDiff.File): ChunkData[] {
    const data = diff.chunks.map(chunk => {
      return {
        chunk,
        // TODO: Render and zip all at once
        pairs: renderPairs(zipChangePairs(chunk))
      };
    });

    return freezeArray(data);
  }
}
</script>

<style lang="postcss">
select {
  appearance: none;
}

.description-content {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
