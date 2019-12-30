<template>
  <div>
    <div class="flex">
      <span class="flex-shrink pr-2">x</span>
      <span class="flex-grow font-bold">app/src/main/longer/Bar.java</span>
      <span class="flex-shrink pl-2 text-red-500">Deleted</span>
      <span class="flex-shrink pl-2 text-green-500">+0</span>
      <span class="flex-shrink pl-2 text-red-500">-546</span>
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
  // @Prop() private msg!: string;
}
</script>

<style scoped lang="scss">
// TODO
</style>
