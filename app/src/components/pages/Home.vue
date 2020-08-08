<template>
  <div>
    <div class="grid grid-cols-2 px-16">
      <div class="flex inline-flex flex-col justify-center items-center p-16">
        <h1 class="text-6xl font-bold text-center">
          Faster, better code review <br />for teams on GitHub
        </h1>

        <!-- TODO: This should do something -->
        <button class="my-8 btn btn-cta btn-purple self-center">
          Get Started
        </button>
      </div>

      <div class="p-16">
        <img src="@/assets/undraw_code_review_l1q9.svg" />
      </div>
    </div>

    <div class="grid grid-cols-3 px-16">
      <div class="col-span-2 m-16 dark-shadow border-dark-0 rounded">
        <img src="@/assets/hero.png" />
      </div>

      <div class="flex flex-col justify-center m-16">
        <span class="text-purple-300 text-3xl"
          ><font-awesome-icon icon="keyboard" class="mr-3" />Fast</span
        >
        <p class="text-2xl">
          Navigate files and leave comments<br />with keyboard shortcuts.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 px-16">
      <div class="flex flex-col justify-center m-16 text-right">
        <span class="text-purple-300 text-3xl"
          ><font-awesome-icon icon="moon" class="mr-3" />Beautiful</span
        >
        <p class="text-2xl">
          Eye-saving dark theme looks great<br />next to your favorite editor.
        </p>
      </div>

      <div class="col-span-2 m-16 dark-shadow border-dark-0 rounded">
        <img src="@/assets/hero.png" />
      </div>
    </div>

    <div class="grid grid-cols-3 px-16">
      <div class="col-span-2 m-16 dark-shadow border-dark-0 rounded">
        <img src="@/assets/hero.png" />
      </div>

      <div class="flex flex-col justify-center m-16">
        <span class="text-purple-300 text-3xl"
          ><font-awesome-icon icon="tasks" class="mr-3" />Focused</span
        >
        <p class="text-2xl">
          Easily track which threads are resolved<br />and which are still
          pending.
        </p>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center my-8">
      <!-- TODO: This should do something -->
      <span class="text-4xl mb-8">Ready to get started?</span>
      <button class="btn btn-cta btn-purple">
        Sign Up Now
      </button>
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
