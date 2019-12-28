<template>
  <div class="shadow mb-4">
    <div class="bg-gray-200 font-bold rounded-t border-2 border-gray-600 px-2 py-1">
      {{title}}
    </div>
    <div class="bg-white px-2 py-2 border-2 border-gray-500 border-t-0">
      <!-- content -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SectionBox extends Vue {
  @Prop() private title!: string;
}
</script>

<style scoped lang="scss">
// TODO
</style>
