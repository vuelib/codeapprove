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
        class="md:right-0 md:top-0 md:absolute font-bold bg-yellow-500 text-yellow-800 rounded-lg px-2 py-1"
      >
        <font-awesome-icon icon="pause-circle" /> Pending
      </span>

      <table class="table-auto mt-2">
        <tr>
          <td class="font-bold pr-2">
            <font-awesome-icon icon="user-check" /> reviewers
          </td>
          <td>johndoe, alicedoe</td>
        </tr>
        <tr>
          <td class="font-bold pr-2"><font-awesome-icon icon="at" /> cc'ed</td>
          <td>billdoe</td>
        </tr>
      </table>
    </div>

    <!-- PR description -->
    <p class="font-bold text-gray-900 text-lg my-2">Description</p>
    <div>
      Adding a new feature, to use it first you <code>something</code> then you
      <code>something else</code>.
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
import ChangeEntry from "@/components/elements/ChangeEntry.vue";

import * as github from "../../plugins/github";
import parseDiff from "parse-diff";

@Component({
  components: {
    ChangeEntry
  }
})
export default class PullRequest extends Vue {
  public pr = require("../../../data/pr.json");
  public diffs: parseDiff.File[] = [];

  async mounted() {
    // TODO: Where should I load this?
    this.diffs = await github.getDiff(
      "hatboysam",
      "diffmachine",
      "c42f4578",
      "19aca319"
    );
  }
}
</script>

<style lang="scss">
// None ...
</style>
