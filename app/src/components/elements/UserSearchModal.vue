<template>
  <div
    @keyup="keyHandler"
    id="searchbox"
    class="w-auto shadow-lg bg-white border border-gray-400 rounded"
  >
    <div class="font-bold px-2">
      Search
    </div>
    <div class="p-2 border-t border-b border-gray-400">
      <input
        ref="searchField"
        type="text"
        v-model="query"
        class="w-full"
        placeholder="Type a username..."
      />
    </div>
    <div>
      <span class="p-2" v-if="items.length === 0 && query">
        No results...
      </span>
      <ul class="w-full" v-else>
        <li
          v-for="(item, index) in items"
          :key="item.login"
          class="cursor-pointer"
          :class="{ active: index === activeIndex }"
          @mouseover="activeIndex = index"
          @click.prevent="selectItem(index)"
        >
          <div class="py-1 px-1">
            <img
              :src="item.avatar_url"
              class="border border-gray-500 rounded-full inline avatar mr-2"
            /><span>{{ item.login }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as github from "../../plugins/github";
import { KeyObject } from "crypto";

@Component
export default class UserSearchModal extends Vue {
  public query: string = "";
  public activeIndex = 0;
  public items: any[] = [];

  private searchFn: Function = () => {};

  mounted() {
    (this.$refs.searchField as any).focus();

    this.searchFn = this.debounce(async () => {
      if (!this.query || this.query.length === 0) {
        return;
      }

      const res = await github.searchUsers("", "", this.query);

      this.items = res.items.slice(0, 10);
      this.activeIndex = 0;
    }, 300);
  }

  @Watch("query")
  async onQuery() {
    if (this.query === "") {
      this.items = [];
    }

    this.searchFn();
  }

  public keyHandler(event: KeyboardEvent) {
    const ARROW_DOWN = 40;
    const ARROW_UP = 38;
    const ENTER = 13;

    switch (event.keyCode) {
      case ARROW_UP:
        if (this.activeIndex > 0) {
          this.activeIndex--;
        }
        break;
      case ARROW_DOWN:
        if (this.activeIndex < this.items.length - 1) {
          this.activeIndex++;
        }
        break;
      case ENTER:
        this.selectItem(this.activeIndex);
        break;
    }
  }

  public selectItem(index: number) {
    const item = this.items[index];
    this.emitSelection({ login: item.login });
  }

  public emitSelection(event: { login: string }) {
    this.$emit("selected", event);
  }

  private debounce(func: Function, waitFor: number): Function {
    let timeout: any = undefined;

    const debounced = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(), waitFor);
    };

    return debounced;
  }
}
</script>

<style scoped lang="postcss">
#searchbox {
  min-width: 240px;
}

.avatar {
  height: 20px;
  width: 20px;
}

.active {
  @apply font-bold border-t border-b border-gray-400 bg-gray-200;
}
</style>
