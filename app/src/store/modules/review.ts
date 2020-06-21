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
import * as events from "../../plugins/events";

// TODO: Namespacing?
@Module({
  name: "review"
})
export default class ReviewModule extends VuexModule {
  public review: Review = {
    metadata: {
      owner: "hatboysam",
      repo: "diffmachine",
      number: 5
    },
    threads: [],
    comments: []
  };

  get drafts() {
    return this.review.comments.filter(x => x.draft);
  }

  get commentsByThread() {
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
    return (args: ThreadArgs | null) => {
      if (args === null) {
        return null;
      }
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

    // TODO: Is there a way I could automate this?
    events.emitNewComment({ threadId: comment.threadId });
  }

  @Mutation
  public setThreadResolved(opts: { threadId: string; resolved: boolean }) {
    const thread = this.review.threads.find(x => x.id === opts.threadId);
    if (thread) {
      thread.resolved = opts.resolved;
    }
  }

  @Mutation
  public removeDraftStatus() {
    for (const comment of this.review.comments) {
      comment.draft = false;
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
  public async newComment(opts: {
    threadId: string;
    args: CommentArgs;
  }): Promise<Comment> {
    console.log(`newComment(${JSON.stringify(opts)})`);
    const comment: Comment = {
      id: uuid.v4(),
      threadId: opts.threadId,
      timestamp: new Date().toISOString(),
      draft: true,
      ...opts.args
    };

    // TODO: Network and shit
    this.context.commit("pushComment", comment);
    return comment;
  }

  @Action
  public async sendDraftComments(opts: { approve: boolean }) {
    // TODO: Network and shit
    this.context.commit("removeDraftStatus");
  }
}
