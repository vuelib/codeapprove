<template>
  <div id="app">
    <!-- Page Header -->
    <div
      id="bar"
      class="flex items-center shadow-md text-white font-bold py-4 px-8 bg-blue-500"
    >
      <font-awesome-icon icon="code-branch" size="lg" class="mr-4" />
      <span class="text-xl">DiffMachine</span>
    </div>

    <!-- Page body -->
    <PullRequest />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ChangeEntry from "./components/ChangeEntry.vue";
import SectionBox from "./components/SectionBox.vue";
import PullRequest from "./components/PullRequest.vue";

@Component({
  components: {
    PullRequest
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
