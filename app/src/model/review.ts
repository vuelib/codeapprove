export interface Review {
  // TODO: Pr metadata

  threads: Thread[];
  comments: Comment[];
}

export interface Thread {
  id: string;

  // TODO: It's much more complex than this
  side: "left" | "right";
  line: number;
}

export interface Comment {
  id: string;
  threadId: string;
  timestamp: string;

  username: string;
  profileURL: string;
  text: string;
}
