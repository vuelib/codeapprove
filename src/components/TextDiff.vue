<template>
<div class="flex">
  <div class="flex-auto">
    <pre>
+ Hello
+ World
    </pre>
</div>
  <div class="flex-auto">
    <pre>
- Foo
- Bar
    </pre>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextDiff extends Vue {
  // @Prop() private msg!: string;
}
</script>

<style scoped lang="scss">
// TODO
</style>
