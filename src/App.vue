<template>
  <div id="app" class="py-8 px-4">
    <!-- PR general info -->
    <div class="mb-4 relative">
      <h3 class="font-bold text-xl">
        owner/repo (<a class="text-blue-500 hover:underline" href="#">#123</a>)
      </h3>
      <p>merge <code>ss-dev-branch</code> into <code>master</code></p>

      <span class="md:right-0 md:top-0 md:absolute bg-yellow-500 border-yellow-600 border-2 rounded-lg px-2 py-1">
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
      Adding a new feature, to use it first you <code>something</code> then you <code>something else</code>.
    </SectionBox>

    <!-- Changes -->
    <SectionBox title="Changes">
        <div class="flex">
          <span class="flex-shrink pr-2">x</span>
          <span class="flex-grow font-bold">app/src/main/longer/Bar.java</span>
          <span class="flex-shrink pl-2 text-red-500">Deleted</span>
          <span class="flex-shrink pl-2 text-green-500">+0</span>
          <span class="flex-shrink pl-2 text-red-500">-546</span>
        </div>
        
        <hr class="my-2" />

        <!-- TODO: hide/show -->
        <FileDiff />
    </SectionBox>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FileDiff from './components/FileDiff.vue';
import SectionBox from './components/SectionBox.vue';

@Component({
  components: {
    FileDiff,
    SectionBox,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
