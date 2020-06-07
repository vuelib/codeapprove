<template>
  <div v-html="renderMd(content)" class="md"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import marked from "marked";

marked.setOptions({
  gfm: true,
  breaks: true
});

@Component
export default class MarkdownContent extends Vue {
  @Prop() content!: string;

  public renderMd(text: string) {
    return marked(text);
  }
}
</script>

<style scoped lang="postcss">
/** 
 * The >>> selectors are needed in order to style within v-html 
 */

.md >>> ul {
  @apply list-disc;
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 36px;
}

.md >>> ol {
  @apply list-decimal;
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 36px;
}

.md >>> a {
  @apply text-blue-500;
}

.md >>> a:hover {
  @apply text-blue-600;
  text-decoration: underline;
}
</style>
