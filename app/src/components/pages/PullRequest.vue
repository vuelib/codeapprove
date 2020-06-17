<template>
  <div class="py-4 px-4">
    <!-- PR general info -->
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
        <p>
          Adding a new feature, to use it first you <code>something</code> then
          you <code>something else</code>.
        </p>
      </div>
    </div>

    <!-- Changes -->
    <p class="font-bold text-gray-900 text-lg my-2">Changes</p>
    <ChangeEntry
      v-for="(diff, index) in diffs"
      :key="`${index}-change`"
      :diff="diff"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import parseDiff from "parse-diff";

import ChangeEntry from "@/components/elements/ChangeEntry.vue";

import * as github from "../../plugins/github";
import ReviewModule from "../../store/modules/review";

@Component({
  components: {
    ChangeEntry
  }
})
export default class PullRequest extends Vue {
  public pr = require("../../../data/pr.json");
  public diffs: parseDiff.File[] = [];

  private reviewModule = getModule(ReviewModule, this.$store);

  async mounted() {
    // TODO: Where should I load this?
    this.diffs = await github.getDiff(
      "hatboysam",
      "diffmachine",
      "c42f4578",
      "19aca319"
    );
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
