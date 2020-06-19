import { Octokit } from "@octokit/rest";
import parse from "parse-diff";

const octokit = new Octokit();

export async function getDiff(
  owner: string,
  repo: string,
  base: string,
  head: string,
) {
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
  const data = res.data as unknown as string;
  return parse(data);
}
