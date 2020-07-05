import { Component, Vue } from "vue-property-decorator";

@Component
export class EventEnhancer<T> extends Vue {
  public bubbleUp(e: Partial<T>) {
    const parent: any = this.$parent;
    if (typeof parent.handleEvent === "function") {
      parent.handleEvent(e);
      return;
    }

    console.warn("EventEnhancer does not have a parent to bubble up to", e);
  }

  public handleEvent(e: Partial<T>) {
    // Child class implements this
  }
}
