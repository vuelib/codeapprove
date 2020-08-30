<template>
  <span @mouseover="hovered = true" @mouseleave="hovered = false">
    <font-awesome-icon
      v-if="hovered && canRemove"
      icon="times"
      class="cursor-pointer"
      size="xs"
      @click.stop="removeClicked"
    />
    <font-awesome-icon
      v-else
      :icon="approved ? 'check' : 'circle'"
      :class="approved ? 'text-green-500' : 'text-yellow-500'"
      size="xs"
    />
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

@Component
export default class UserReviewIcon extends Vue {
  @Prop() approved!: boolean;
  @Prop() canRemove!: boolean;

  public hovered = false;

  public removeClicked() {
    this.$emit("remove-clicked");
  }
}
</script>

<style lang="postcss"></style>
