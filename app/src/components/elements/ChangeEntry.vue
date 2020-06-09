<template>
  <div>
    <div class="flex p-2 font-bold items-center bg-gray-200">
      <font-awesome-icon fixed-width @click="toggle" :icon="icon" />
      <span class="flex-grow pl-2d">{{ diff.from }}</span>
      <span class="flex-shrink mx-1 px-2 rounded bg-green-400 text-green-800"
        >+{{ diff.additions }}</span
      >
      <span class="flex-shrink mx-1 px-2 rounded bg-red-400 text-red-800"
        >-{{ diff.deletions }}</span
      >
    </div>
    <div v-if="expanded" class="overflow-hidden bg-yellow-100">
      <table class="table-fixed w-full">
        <colgroup>
          <col width="50" />
          <col />
          <col width="50" />
          <col />
        </colgroup>

        <template v-for="(chunk, i) in this.diff.chunks">
          <tr :key="`chunk-${i}`">
            <td colspan="4">
              <pre class="w-full py-1 px-4 bg-blue-100 text-blue-500">{{
                chunk.content
              }}</pre>
            </td>
          </tr>

          <!-- TODO: We have to do all this terrible drafting state stuff because we can't have multiple rows in DiffLine -->
          <template v-for="(pair, j) in changePairs(chunk)">
            <DiffLine
              :key="`chunk-${i}-change-${j}`"
              :left="pair.left"
              :right="pair.right"
              @drafting="setDrafting($event.side, i, j, true)"
            />

            <!-- Left comment -->
            <tr
              :key="`chunk-${i}-comment-${j}-left`"
              v-if="isDrafting('left', i, j)"
            >
              <td colspan="2">
                <CommentThread @cancel="setDrafting('left', i, j, false)" />
              </td>
              <td colspan="2"></td>
            </tr>

            <!-- Right comment -->
            <tr
              :key="`chunk-${i}-comment-${j}-right`"
              v-if="isDrafting('right', i, j)"
            >
              <td colspan="2"></td>
              <td colspan="2">
                <CommentThread @cancel="setDrafting('right', i, j, false)" />
              </td>
            </tr>
          </template>
        </template>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DiffLine from "@/components/elements/DiffLine.vue";
import CommentThread from "@/components/elements/CommentThread.vue";
import parseDiff from "parse-diff";

interface ChangePair {
  left?: parseDiff.Change;
  right?: parseDiff.Change;
}

@Component({
  components: {
    DiffLine,
    CommentThread
  }
})
export default class ChangeEntry extends Vue {
  @Prop() diff!: parseDiff.File;

  public expanded = true;
  public drafting: Set<string> = new Set();

  public changePairs(chunk: parseDiff.Chunk): ChangePair[] {
    const res: ChangePair[] = [];

    let i = 0;
    while (i < chunk.changes.length) {
      const change = chunk.changes[i];

      // Del followed by add means the lines "match"
      if (i < chunk.changes.length - 1) {
        const next = chunk.changes[i + 1];
        if (change.type === "del" && next.type === "add") {
          res.push({
            left: change,
            right: next
          });

          // Extra increment
          i += 2;
          continue;
        }
      }

      if (change.type === "del") {
        res.push({ left: change, right: undefined });
      } else if (change.type === "add") {
        res.push({ left: undefined, right: change });
      } else {
        res.push({ left: change, right: change });
      }

      i++;
    }

    return res;
  }

  public isDrafting(side: string, i: number, j: number): boolean {
    const key = `${i}-${j}-${side}`;
    return this.drafting.has(key);
  }

  public setDrafting(side: string, i: number, j: number, state: boolean) {
    const key = `${i}-${j}-${side}`;

    // Terrible reactivity trick
    if (state) {
      this.drafting = new Set(this.drafting.add(key));
    } else {
      this.drafting.delete(key);
      this.drafting = new Set(this.drafting);
    }
  }

  public toggle() {
    this.expanded = !this.expanded;
  }

  get icon() {
    if (this.expanded) {
      return "caret-down";
    } else {
      return "caret-right";
    }
  }
}
</script>

<style scoped lang="scss">
// TODO
</style>
