import Vue from "vue";

const BUS = new Vue();

type Callback<T> = (arg: T) => void;

import { Side } from "../model/review";

export const ADD_COMMENT_EVENT = "add-comment";
export interface AddCommentEvent {
  side: Side;
  line: number;
  content: string;
  resolve?: boolean;

  file: string;
  lineContent: string;
  sha: string;
}

export const NEW_COMMENT_EVENT = "new-comment";
export interface NewCommentEvent {
  threadId: string;
}

export function emit<T>(event: string, data: T) {
  BUS.$emit(event, data);
}

export function on<T>(event: string, fn: Callback<T>) {
  BUS.$on(event, fn);
}

export function off<T>(event: string, fn: Callback<T>) {
  BUS.$off(event, fn);
}
