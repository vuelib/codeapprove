export function isTopVisible(el: Element, padding: number = 0) {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top >= padding && rect.top + padding < windowHeight;
}

export function isBottomVisible(el: Element, padding: number = 0) {
  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.bottom >= padding && rect.bottom + padding < windowHeight;
}

export function makeTopVisible(el: Element, padding: number = 0) {
  if (isTopVisible(el, padding)) {
    return;
  }

  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  if (rect.top < padding) {
    window.scrollBy(0, -1 * (padding - rect.top));
  } else {
    window.scrollBy(0, rect.top - windowHeight + padding);
  }
}

export function newFunction() {
  console.log("Goodbye world!");
}

export function makeBottomVisible(el: Element, padding: number = 0) {
  if (isBottomVisible(el, padding)) {
    return;
  }

  const rect = el.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  console.log(
    "bottom",
    rect.bottom,
    "window",
    windowHeight,
    "padding",
    padding
  );
  if (rect.bottom < padding) {
    window.scrollBy(0, -1 * (padding - rect.bottom));
  } else {
    window.scrollBy(0, rect.bottom - windowHeight + padding);
  }
}

/**
 * This is like a harder version of nextTick, see:
 * https://github.com/vuejs/vue/issues/9200
 */
export function nextRender(callback: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}
