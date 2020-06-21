<template>
  <div v-if="loaded" class="py-4 px-4">
    <div class="mb-4 flex flex-row items-center">
      <div>
        <h3 class="font-bold text-xl">
          {{ pr.head.repo.full_name }}
          (<a
            class="text-blue-500 hover:underline"
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

      <span
        class="font-bold bg-yellow-500 text-yellow-800 rounded-lg px-2 py-1"
      >
        <font-awesome-icon icon="pause-circle" /> Pending
      </span>
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
        class="col-span-4 shadow inline-block rounded border border-gray-400 overflow-hidden"
      >
        <div
          class="flex items-center px-4 py-1 bg-gray-200 font-bold border-b border-gray-400"
        >
          <font-awesome-icon icon="thumbs-up" class="mr-2" />
          <span>Review</span>
        </div>
        <div class="p-4">
          <table class="table-auto">
            <tr>
              <td class="font-bold pr-2">
                <font-awesome-icon icon="user-check" /> reviewers
              </td>
              <td>
                <span v-for="reviewer in reviewers" :key="reviewer">{{
                  reviewer
                }}</span>
              </td>
            </tr>
            <tr>
              <td class="font-bold pr-2">
                <font-awesome-icon icon="comment" /> comments
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
    MarkdownContent
  }
})
export default class PullRequest extends Vue {
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
    // TODO: Use the approval state somehow
    await this.reviewModule.sendDraftComments({ approve });
  }

  get reviewers(): string[] {
    return Object.keys(this.reviewModule.review.reviewers);
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

<style lang="scss">
// None ...
</style>
