<template>
  <div class="messages">
    <div
      v-for="msg in messages"
      :key="msg.text"
      class="bubble border-dark-0 bg-dark-5 dark-shadow"
      :class="classObj(msg)"
    >
      <font-awesome-icon
        icon="times"
        class="absolute top-0 right-0 m-2 text-sm"
        @click="dismissMessage(msg)"
      />
      <b><font-awesome-icon :icon="msgIcon(msg)" class="mr-1"/></b>
      {{ msg.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import UIModule, { Message } from "../../store/modules/ui";

@Component
export default class MessageStack extends Vue {
  private uiModule = getModule(UIModule, this.$store);

  public dismissMessage(msg: Message) {
    this.uiModule.dismissMessage(msg);
  }

  public classObj(msg: Message) {
    return {
      "text-purple-300": msg.type === "alert",
      "text-red-400": msg.type === "error"
    };
  }

  public msgIcon(msg: Message) {
    return msg.type === "alert" ? "bell" : "exclamation-circle";
  }

  get messages() {
    return this.uiModule.messages;
  }
}
</script>

<style lang="postcss">
.messages {
  position: fixed;
  bottom: 24px;
  right: 24px;

  z-index: 100;
}

.bubble {
  @apply relative rounded border text-lg pl-6 pr-8 py-4 mt-4;
}
</style>
