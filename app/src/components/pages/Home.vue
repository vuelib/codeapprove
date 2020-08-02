<template>
  <div>
    <div class="flex flex-col">
      <h1 class="text-6xl font-bold text-center">
        Faster, better code review <br />for teams on GitHub
      </h1>

      <!-- TODO: This should do something -->
      <button class="my-8 btn btn-cta btn-purple self-center">
        Get Started
      </button>

      <div
        class="w-3/4 self-center rounded-t-lg dark-shadow border border-dark-0 overflow-hidden"
      >
        <img src="@/assets/hero.png" />
      </div>
    </div>

    <div class="w-full mt-16 mb-16 grid grid-cols-11 gap-4">
      <div
        :class="'col-start-2'"
        class="col-span-3 rounded border border-dark-0 dark-shadow bg-dark-2 p-6 flex flex-col"
      >
        <span class="text-purple-300 text-2xl mb-1"
          ><font-awesome-icon icon="keyboard" class="mr-3" />Fast</span
        >
        <p class="text-xl">
          Navigate files and leave comments with keyboard shortcuts.
        </p>
      </div>

      <div
        class="col-span-3 rounded border border-dark-0 dark-shadow bg-dark-2 p-6 flex flex-col"
      >
        <span class="text-purple-300 text-2xl mb-1"
          ><font-awesome-icon icon="tasks" class="mr-3" />Focused</span
        >
        <p class="text-xl">
          Easily track which threads are resolved and which are still pending.
        </p>
      </div>

      <div
        class="col-span-3 rounded border border-dark-0 dark-shadow bg-dark-2 p-6 flex flex-col"
      >
        <span class="text-purple-300 text-2xl mb-1"
          ><font-awesome-icon icon="moon" class="mr-3" />Beautiful</span
        >
        <p class="text-xl">
          Eye-saving dark theme looks great next to your favorite editor.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Home extends Vue {
  async mounted() {}
}
</script>

<style lang="postcss"></style>
