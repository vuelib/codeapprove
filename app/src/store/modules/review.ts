import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import * as uuid from "uuid";
import {
  Review,
  Comment,
  CommentArgs,
  Thread,
  ThreadArgs,
  threadMatch
} from "@/model/review";

// TODO: Namespacing?
@Module({
  name: "review"
})
export default class ReviewModule extends VuexModule {
  // TODO: Gonna need more than one!
  public review: Review = {
    threads: [],
    comments: []
  };

  get comments() {
    return (threadId: string) => {
      return this.review.comments.filter(x => x.threadId === threadId);
    };
  }

  get threadById() {
    return (threadId: string) => {
      return this.review.threads.find(x => x.id === threadId) || null;
    };
  }

  get threadByArgs() {
    return (args: ThreadArgs) => {
      return this.review.threads.find(t => threadMatch(t, args)) || null;
    };
  }

  @Mutation
  public pushThread(thread: Thread) {
    console.log(`pushThread(${thread.id})`);
    this.review.threads.push(thread);
  }

  @Mutation
  public pushComment(comment: Comment) {
    console.log(`pushComment(${comment.id})`);
    this.review.comments.push(comment);
  }

  @Mutation
  public setThreadResolved(opts: { threadId: string; resolved: boolean }) {
    const thread = this.review.threads.find(x => x.id === opts.threadId);
    if (thread) {
      thread.resolved = opts.resolved;
    }
  }

  @Action
  public newThread(opts: { args: ThreadArgs }): Thread {
    console.log(`newThread(${JSON.stringify(opts)})`);
    const thread: Thread = {
      id: uuid.v4(),
      resolved: false,
      ...opts.args
    };

    // TODO: Network and shit
    this.context.commit("pushThread", thread);
    return thread;
  }

  @Action
  public newComment(opts: { threadId: string; args: CommentArgs }): Comment {
    console.log(`newComment(${JSON.stringify(opts)})`);
    const comment: Comment = {
      id: uuid.v4(),
      threadId: opts.threadId,
      timestamp: new Date().toISOString(),
      ...opts.args
    };

    // TODO: Network and shit
    this.context.commit("pushComment", comment);
    return comment;
  }
}
