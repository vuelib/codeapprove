<template>
  <div class="flex flex-col items-center">
    <div
      class="max-w-sm text-center inline-flex flex-col items-center m-8 rounded overflow-hidden border shadow-lg border-gray-300"
    >
      <div class="w-full font-bold text-lg text-white bg-blue-800 p-2 m-0">
        Sign In
      </div>
      <div class="p-4">
        <p>
          DiffMachine needs access to your GitHub account in order to perform
          code review.
        </p>

        <!-- TODO: This is a nuts style -->
        <button
          class="inline-flex items-center bg-gray-800 hover:bg-gray-900 border-gray-700 border hover:border-transparent shadow hover:shadow-none rounded-lg mt-8 mb-4 px-4 py-2 text-white"
        >
          <font-awesome-icon :icon="['fab', 'github']" size="lg" />
          <span class="ml-2 font-bold">Sign In with GitHub</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class SignIn extends Vue {}
</script>

<style lang="scss">
// None ...
</style>