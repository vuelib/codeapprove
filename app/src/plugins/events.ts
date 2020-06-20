import Vue from "vue";

const BUS = new Vue();

type Callback<T> = (arg: T) => void;

const NEW_COMMENT_EVENT = "new-comment";
export interface NewCommentEvent {
  threadId: string;
}

export function emitNewComment(evt: NewCommentEvent) {
  BUS.$emit(NEW_COMMENT_EVENT, evt);
}

export function onNewComment(fn: Callback<NewCommentEvent>) {
  BUS.$on(NEW_COMMENT_EVENT, fn);
}

export function offNewComment(fn: Callback<NewCommentEvent>) {
  BUS.$off(NEW_COMMENT_EVENT, fn);
}
