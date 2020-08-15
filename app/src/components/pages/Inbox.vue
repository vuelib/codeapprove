<template>
  <div v-if="loaded">
    <div class="mt-8">
      <!-- TODO: List their GitHub code reviews that are assigned and also any DiffMachine assignments -->
      <h2 class="font-bold text-2xl mb-2">Incoming</h2>
      <p v-if="inbox.length === 0" class="text-lg">
        No code to review ... snack time!
      </p>
      <InboxItem
        v-else
        v-for="item in inbox"
        :item="item"
        :key="itemKey(item)"
      />
    </div>

    <div class="mt-8">
      <h2 class="font-bold text-2xl mb-2">Outgoing</h2>
      <p v-if="outbox.length === 0" class="text-lg">
        There's nothing here ... time to write some more code!
      </p>
      <InboxItem
        v-else
        v-for="item in outbox"
        :item="item"
        :key="itemKey(item)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import InboxItem from "@/components/elements/InboxItem.vue";

import AuthModule from "../../store/modules/auth";
import UIModule from "../../store/modules/ui";

import { InboxItemData, Status, itemSlug } from "../../model/inbox";
import { Github, PullRequestNode } from "../../plugins/github";

@Component({
  components: {
    InboxItem
  }
})
export default class Inbox extends Vue {
  public inbox: InboxItemData[] = [];
  public outbox: InboxItemData[] = [];

  private authModule = getModule(AuthModule, this.$store);
  private uiModule = getModule(UIModule, this.$store);

  private github: Github = new Github(this.authModule);

  async mounted() {
    this.uiModule.beginLoading();

    const login = this.authModule.assertUser.username;
    const assigned = await this.github.getAssignedPulls(login);
    const outgoing = await this.github.getOutgoingPulls(login);

    this.inbox = assigned.map(this.nodeToItem);
    this.outbox = outgoing.map(this.nodeToItem);

    this.uiModule.endLoading();
  }

  get loaded() {
    return !this.uiModule.loading;
  }

  public itemKey(item: InboxItemData) {
    return itemSlug(item);
  }

  private nodeToItem(p: PullRequestNode): InboxItemData {
    // TODO: This is not right
    const status = p.closed ? "merged" : "pending";
    return {
      status,
      owner: p.repository.owner.login,
      repo: p.repository.name,
      number: `${p.number}`,
      title: p.title,
      updated: new Date(p.updatedAt).getTime()
    };
  }
}
</script>

<style lang="postcss"></style>
