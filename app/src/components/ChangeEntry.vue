<template>
  <div>
    <div class="flex">
      <span class="flex-shrink pr-2">x</span>
      <span class="flex-grow font-bold">{{ diff.from }}</span>
      <span class="flex-shrink pl-2 text-yellow-500">Changed</span>
      <span class="flex-shrink pl-2 text-green-500">+{{ diff.additions }}</span>
      <span class="flex-shrink pl-2 text-red-500">-{{ diff.deletions }}</span>
    </div>

    <!-- TODO: hide/show -->
    <hr class="my-2" />
    <TextDiff></TextDiff>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TextDiff from "./TextDiff.vue";

@Component({
  components: {
    TextDiff
  }
})
export default class ChangeEntry extends Vue {
  // TODO: Get data passed in
  public diff = require("../../data/diff.json")[0];
}
</script>

<style scoped lang="scss">
// TODO
</style>
