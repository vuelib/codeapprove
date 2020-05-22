<template>
  <div class="mb-4">
    <p class="bold text-gray-800 text-lg my-2">{{ title }}</p>
    <div class="rounded shadow bg-white border border-gray-400">
      <!-- content -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SectionBox extends Vue {
  @Prop() private title!: string;
}
</script>

<style scoped lang="scss">
// TODO
</style>
