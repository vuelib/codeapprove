<template>
  <div class="border border-gray-400 bg-white">
    <!-- <div class="flex p-2">
      <img class="flex-shrink mr-4 mt-1" style="height: 32px; width: 32px;" />
      <div class="flex-grow">
        <div class="flex">
          <span class="flex-grow font-bold">username</span>
          <font-awesome-icon class="mx-1 text-gray-500" icon="check" />
        </div>
        <span>I think there will be a bug here if you do this.</span>
      </div>
    </div>
    <hr class="border border-gray-200" /> -->
    <div class="flex p-2">
      <img class="flex-none mr-2" style="height: 32px; width: 32px;" />
      <textarea
        class="flex-grow py-1 px-2 mr-1 rounded border bg-gray-100 border-gray-300"
        placeholder="Reply...?"
      />
    </div>
    <div class="flex flex-row-reverse px-2 pb-2">
      <button class="ml-2 btn btn-blue">
        Send <font-awesome-icon icon="paper-plane" class="self-end mx-1" />
      </button>
      <button class="btn btn-red" @click.prevent="onCancel()">
        Cancel
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CommentThread extends Vue {
  // TODO: Data

  public onCancel() {
    this.$emit("cancel");
  }
}
</script>

<style scoped lang="postcss">
.btn {
  @apply px-2 py-1;
  @apply rounded shadow border;
}

.btn:hover {
  @apply shadow-none;
  @apply border-white text-white;
}

.btn-blue {
  @apply border-blue-500 text-blue-500;
}

.btn-blue:hover {
  @apply bg-blue-500;
}

.btn-red {
  @apply border-red-400 text-red-400;
}

.btn-red:hover {
  @apply bg-red-400;
}
</style>
