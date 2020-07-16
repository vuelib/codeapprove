import { Octokit } from "@octokit/rest";
import {
  SearchUsersResponseData,
  UsersGetAuthenticatedResponseData,
  PullsGetResponseData,
  PullsListCommitsResponseData
} from "@octokit/types";
import parseDiff from "parse-diff";
import { freezeArray } from "./freeze";

const PREVIEWS = ["machine-man-preview"];

export interface PullRequestData {
  pr: PullsGetResponseData;
  commits: PullsListCommitsResponseData;
  diffs: parseDiff.File[];
}

export class Github {
  private octokit: Octokit;

  constructor(token: string | null) {
    // TODO: What about token refresh?
    if (token != null) {
      this.octokit = new Octokit({ auth: token, previews: PREVIEWS });
    } else {
      this.octokit = new Octokit({ previews: PREVIEWS });
    }
  }

  async me(): Promise<UsersGetAuthenticatedResponseData> {
    const res = await this.octokit.users.getAuthenticated();
    return res.data;
  }

  async searchUsers(
    owner: string,
    repo: string,
    prefix: string
  ): Promise<SearchUsersResponseData> {
    // TODO: Prefer users from the same repo!
    const res = await this.octokit.search.users({
      q: prefix
    });

    return res.data;
  }

  async getPullRequest(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<PullRequestData> {
    const pr = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number
    });

    const diffs = await this.getDiff(
      owner,
      repo,
      pr.data.base.ref,
      pr.data.head.ref
    );

    const commits = await this.octokit.pulls.listCommits({
      owner,
      repo,
      pull_number
    });

    // TODO: Diff should be separate
    return {
      pr: Object.freeze(pr.data),
      commits: freezeArray(commits.data),
      diffs: freezeArray(diffs)
    };
  }

  async getDiff(
    owner: string,
    repo: string,
    base: string,
    head: string
  ): Promise<parseDiff.File[]> {
    const res = await this.octokit.repos.compareCommits({
      owner,
      repo,
      base,
      head,
      mediaType: {
        format: "diff"
      }
    });

    // The strange header changes the response type
    const data = (res.data as unknown) as string;
    return parseDiff(data);
  }
}
