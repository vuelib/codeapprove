import { Octokit } from "@octokit/rest";
import parse from "parse-diff";

const octokit = new Octokit();

export async function getPullRequest(
  owner: string,
  repo: string,
  pull_number: number
) {
  const pr = await octokit.pulls.get({
    owner,
    repo,
    pull_number
  });

  const diffs = await getDiff(owner, repo, pr.data.base.ref, pr.data.head.ref);

  return {
    pr: pr.data,
    diffs
  };
}

export async function getDiff(
  owner: string,
  repo: string,
  base: string,
  head: string
): Promise<parse.File[]> {
  const res = await octokit.repos.compareCommits({
    owner,
    repo,
    base,
    head,
    headers: {
      accept: "application/vnd.github.v3.diff"
    }
  });

  // The strange header changes the response type
  const data = (res.data as unknown) as string;
  return parse(data);
}
