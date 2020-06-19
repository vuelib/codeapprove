<template>
  <div v-if="loaded" class="py-4 px-4">
    <div class="mb-4 relative">
      <h3 class="font-bold text-xl">
        {{ pr.head.repo.full_name }}
        (<a class="text-blue-500 hover:underline" href="#">#{{ pr.number }}</a
        >)
      </h3>
      <p>
        merge <code>{{ pr.head.ref }}</code> into
        <code>{{ pr.base.ref }}</code>
      </p>

      <span
        class="right-0 top-0 absolute font-bold bg-yellow-500 text-yellow-800 rounded-lg px-2 py-1"
      >
        <font-awesome-icon icon="pause-circle" /> Pending
      </span>
    </div>

    <!-- TODO: Make this work -->
    <div
      class="flex flex-row items-center rounded border border-yellow-500 bg-yellow-200 my-4 py-3"
    >
      <span class="ml-4 font-bold text-yellow-800"
        ><font-awesome-icon icon="paper-plane" class="mr-1" /> You have 7 unsent
        drafts</span
      >
      <span class="flex-grow"><!-- spacer --></span>
      <button class="btn btn-red ml-2">Discard</button>
      <button class="btn btn-blue ml-2">Send</button>
      <button class="btn btn-green ml-2 mr-2">Send + Approve</button>
    </div>

    <!-- Description, reviewers, etc -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-4 p-4 rounded border border-gray-400">
        <table class="table-auto">
          <tr>
            <td class="font-bold pr-2">
              <font-awesome-icon icon="user-check" /> reviewers
            </td>
            <td>johndoe, alicedoe</td>
          </tr>
          <tr>
            <td class="font-bold pr-2">
              <font-awesome-icon icon="at" /> cc'ed
            </td>
            <td>billdoe</td>
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

      <div class="col-span-8 p-4 rounded border border-gray-400">
        <MarkdownContent :content="pr.body" />
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
        :diff="diff"
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

    github
      .getPullRequest("hatboysam", "diffmachine", 5)
      .then(({ pr, diffs }) => {
        this.pr = pr;
        this.diffs = diffs;
      })
      .then(() => {
        this.uiModule.endLoading();
      });
  }

  get loaded() {
    return this.pr != null;
  }

  get numThreads() {
    return this.reviewModule.review.threads.length;
  }

  get numUnresolvedThreads() {
    return this.reviewModule.review.threads.filter(x => !x.resolved).length;
  }
}
</script>

<style lang="scss">
// None ...
</style>
