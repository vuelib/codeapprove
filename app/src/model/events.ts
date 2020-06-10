import { Side } from "./review";

export const ADD_COMMENT_EVENT = "add-comment";

export interface AddCommentEvent {
  side: Side;
  line: number;

  content: string;
  resolve?: boolean;
}
