<template>
  <div>
    <div class="mt-8">
      <!-- TODO: List their GitHub code reviews that are assigned and also any DiffMachine assignments -->
      <h2 class="font-bold text-2xl mb-2">Incoming</h2>
      <p v-if="inbox.length === 0" class="text-lg">
        No code to review ... snack time!
      </p>
      <div
        v-for="item in inbox"
        :key="itemSlug(item)"
        class="w-2/3 flex items-center bg-dark-3 px-4 py-2 mb-4 border-dark-0 shadow dark-shadow rounded"
      >
        <router-link :to="`/pr/${item.owner}/${item.repo}/${item.number}`">
          <span
            :class="statusTextColor(item.status)"
            class="text-lg font-bold mr-4"
          >
            <font-awesome-icon :icon="statusIcon(item.status)" class="mr-2" />
            <span class="text-lg">{{ itemSlug(item) }}</span>
          </span>
          <span class="text-lg mr-2">{{ item.title }}</span>
        </router-link>
        <span class="flex-grow"><!-- spacer --></span>
        <span class="text-md"
          ><font-awesome-icon icon="history" class="mr-1" />{{
            renderTime(item.updated)
          }}</span
        >
      </div>
    </div>

    <div class="mt-8">
      <h2 class="font-bold text-2xl mb-2">Outgoing</h2>
      <!-- TODO: Actually render the outbox -->
      <p v-if="outbox.length === 0" class="text-lg">
        There's nothing here ... time to write some more code!
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import AuthModule from "../../store/modules/auth";
import { Github } from "../../plugins/github";

// TODO: Closed
type Status = "approved" | "pending" | "merged";

interface InboxItem {
  owner: string;
  repo: string;
  number: string;
  title: string;
  status: Status;
  updated: number;
}

@Component({
  components: {}
})
export default class Inbox extends Vue {
  public inbox: InboxItem[] = [];
  public outbox: InboxItem[] = [];

  private authModule = getModule(AuthModule, this.$store);
  private github: Github = new Github(this.authModule);

  async mounted() {
    // TODO: Loading
    const pulls = await this.github.getAssignedPulls();
    this.inbox = pulls.map((p: any) => {
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
    });
    console.log(pulls);
  }

  public statusTextColor(status: Status) {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "merged":
        return "text-blue-500";
    }
  }

  public statusIcon(status: Status) {
    switch (status) {
      case "approved":
        return "check";
      case "pending":
        return "pause-circle";
      case "merged":
        return "code-branch";
    }
  }

  public itemSlug(item: InboxItem) {
    return `${item.owner}/${item.repo}#${item.number}`;
  }

  public renderTime(time: number) {
    const d = new Date(time);
    const now = new Date();

    // TODO: Make these all consts
    const locale = navigator.language || "en";
    const dateTimeFormat = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric"
    });

    const timeFormat = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "numeric"
    });

    if (now.getTime() - d.getTime() < 24 * 60 * 60 * 1000) {
      return timeFormat.format(d);
    } else {
      return dateTimeFormat.format(d);
    }
  }
}
</script>

<style lang="postcss"></style>
