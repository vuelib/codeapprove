<template>
  <div class="flex overflow-hidden bg-yellow-100">
    <div class="flex-1">
      <template v-for="(change, index) in leftChanges">
        <DiffLine :key="change.content" :change="change" />

        <!-- TODO: comment thread should be a component -->
        <div
          class="border border-gray-400 bg-white"
          v-if="hasComment(index)"
          :key="index"
        >
          <div class="flex p-2">
            <img
              class="flex-shrink mr-4 mt-1"
              style="height: 32px; width: 32px;"
            />
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
    </div>
    <div class="flex-1">
      <DiffLine
        :key="change.content"
        v-for="change in rightChanges"
        :change="change"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DiffLine from "./DiffLine.vue";

@Component({
  components: {
    DiffLine
  }
})
export default class TextDiff extends Vue {
  // TODO: Get data passed in
  public diff = require("../../data/diff.json")[0];
  // TODO: What does multiple chunks mean?
  public changes = this.diff.chunks[0].changes;

  public hasComment(line: number): boolean {
    return line === 2;
  }

  public get leftChanges() {
    return this.changes.filter((c: any) => {
      return c.type === "normal" || c.type === "del";
    });
  }

  public get rightChanges() {
    return this.changes.filter((c: any) => {
      return c.type === "normal" || c.type === "add";
    });
  }
}
</script>

<style scoped lang="scss">
// None...
</style>
