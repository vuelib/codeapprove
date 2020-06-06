export interface Review {
  // TODO: Pr metadata

  threads: Thread[];
  comments: Comment[];
}

export interface ThreadArgs {
  // TODO: It's much more complex than this
  file: string;
  side: "left" | "right";
  line: number;
}

export interface Thread extends ThreadArgs {
  id: string;
}

export interface CommentArgs {
  username: string;
  photoURL: string;
  text: string;
}

export interface Comment extends CommentArgs {
  id: string;
  threadId: string;
  timestamp: string;
}
