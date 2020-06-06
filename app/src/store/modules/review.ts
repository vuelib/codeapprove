import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import * as uuid from "uuid";
import {
  Review,
  Comment,
  CommentArgs,
  Thread,
  ThreadArgs
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

  @Action
  public newThread(opts: { args: ThreadArgs }): Thread {
    console.log(`newThread(${JSON.stringify(opts)})`);
    const thread: Thread = {
      id: uuid.v4(),
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
