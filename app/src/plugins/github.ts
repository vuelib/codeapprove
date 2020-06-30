import { Octokit } from "@octokit/rest";
import {
  SearchUsersResponseData,
  UsersGetAuthenticatedResponseData
} from "@octokit/types";
import parse from "parse-diff";

const PREVIEWS = ["machine-man-preview"];

export class Github {
  private unauthed: Octokit = new Octokit({ previews: PREVIEWS });
  private authed: Octokit;

  constructor(token: string | null) {
    // TODO: What about token refresh?
    if (token != null) {
      this.authed = new Octokit({ auth: token, previews: PREVIEWS });
    } else {
      this.authed = new Octokit({ previews: PREVIEWS });
    }
  }

  async me(): Promise<UsersGetAuthenticatedResponseData> {
    const res = await this.authed.users.getAuthenticated();
    return res.data;
  }

  async searchUsers(
    owner: string,
    repo: string,
    prefix: string
  ): Promise<SearchUsersResponseData> {
    // TODO: Prefer users from the same repo!
    const res = await this.unauthed.search.users({
      q: prefix
    });

    return res.data;
  }

  async getPullRequest(owner: string, repo: string, pull_number: number) {
    const pr = await this.authed.pulls.get({
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

    return {
      pr: pr.data,
      diffs
    };
  }

  async getDiff(
    owner: string,
    repo: string,
    base: string,
    head: string
  ): Promise<parse.File[]> {
    const res = await this.unauthed.repos.compareCommits({
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
    return parse(data);
  }
}
