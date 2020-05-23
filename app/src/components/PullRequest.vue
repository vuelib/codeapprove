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
    <SectionBox title="Description">
      <div class="p-2">
        Adding a new feature, to use it first you <code>something</code> then
        you <code>something else</code>.
      </div>
    </SectionBox>

    <!-- Changes -->
    <SectionBox title="Changes">
      <!-- TODO: Make this a loop -->
      <ChangeEntry />
      <hr border border-gray-500 />
      <ChangeEntry />
    </SectionBox>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ChangeEntry from "./ChangeEntry.vue";
import SectionBox from "./SectionBox.vue";

@Component({
  components: {
    ChangeEntry,
    SectionBox
  }
})
export default class PullRequest extends Vue {
  public pr = require("../../data/pr.json");
}
</script>

<style lang="scss">
// None ...
</style>
