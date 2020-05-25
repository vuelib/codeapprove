<template>
  <div class="border border-gray-400 bg-white">
    <div class="flex p-2">
      <img class="flex-shrink mr-4 mt-1" style="height: 32px; width: 32px;" />
      <div class="flex-grow">
        <div class="flex">
          <span class="flex-grow font-bold">username</span>
          <font-awesome-icon class="mx-1 text-gray-500" icon="check" />
        </div>
        <span>I think there will be a bug here if you do this.</span>
      </div>
    </div>
    <hr class="border border-gray-200" />
    <div class="flex items-center p-2">
      <img class="flex-shrink mr-4" style="height: 32px; width: 32px;" />
      <input
        class="flex-grow py-1 px-2 mr-1 rounded border bg-gray-100 border-gray-300"
        placeholder="Reply...?"
      />
      <!-- TODO: Make this a real button -->
      <font-awesome-icon icon="paper-plane" class="mx-1 text-blue-500" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CommentThread extends Vue {
  // TODO: Data
}
</script>

<style scoped lang="scss">
// None...
</style>
