import * as events from "./events";

export function trackVisibility() {
  const supported =
    typeof document.hidden != "undefined" &&
    typeof document.onvisibilitychange !== "undefined" &&
    typeof document.addEventListener !== "undefined";

  if (!supported) {
    console.warn("This browser does not support the Page Visibility API");
    return;
  }

  // Handle page visibility change
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        events.emit(events.PAGE_VISIBILITY_EVENT, { visible: false });
      } else {
        events.emit(events.PAGE_VISIBILITY_EVENT, { visible: true });
      }
    },
    false
  );
}
