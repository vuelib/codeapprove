import * as axios from "axios";
import parse from "parse-diff";

const ax = axios.default;

export async function getDiff(
  org: string,
  repo: string,
  base: string,
  head: string
) {
  // TODO: Should I be using octokit?
  // https://stackoverflow.com/a/49778096
  const url = `https://api.github.com/repos/${org}/${repo}/compare/${base}...${head}`;
  const res = await ax.get(url, {
    headers: {
      Accept: "application/vnd.github.v3.diff"
    }
  });

  return parse(res.data);
}
