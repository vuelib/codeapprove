<template>
  <div id="app" class="py-8 px-4">
    <!-- PR general info -->
    <div class="mb-4 relative">
      <h3 class="font-bold text-xl">
        owner/repo (<a class="text-blue-500 hover:underline" href="#">#123</a>)
      </h3>
      <p>merge <code>ss-dev-branch</code> into <code>master</code></p>

      <span
        class="md:right-0 md:top-0 md:absolute bg-yellow-500 border-yellow-600 border-2 rounded-lg px-2 py-1"
      >
        Status: pending
      </span>

      <table class="table-auto mt-2">
        <tr>
          <td class="font-bold pr-2">reviewers</td>
          <td>johndoe, alicedoe</td>
        </tr>
        <tr>
          <td class="font-bold pr-2">cc'ed</td>
          <td>billdoe</td>
        </tr>
      </table>
    </div>

    <!-- PR description -->
    <SectionBox title="Description">
      Adding a new feature, to use it first you <code>something</code> then you
      <code>something else</code>.
    </SectionBox>

    <!-- Changes -->
    <SectionBox title="Changes">
      <ChangeEntry></ChangeEntry>
      <ChangeEntry></ChangeEntry>
    </SectionBox>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChangeEntry from "./components/ChangeEntry.vue";
import SectionBox from "./components/SectionBox.vue";

@Component({
  components: {
    ChangeEntry,
    SectionBox
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>