const util = require("util");
const fs = require('fs');

const Octokit = require("@octokit/rest");
const octokit = new Octokit();

let parse = require('parse-diff');

function getPR() {
  octokit.pulls.get({
    owner: "hatboysam",
    repo: "github-api-sandbox",
    pull_number: 1
  }).then(({ data }) => {
    console.log(JSON.stringify(data, undefined, 2));
  }).catch(e => {
    console.warn(e);
  });
}

function getDiff() {
  const data = fs.readFileSync('../data/diff.txt').toString();
  console.log(JSON.stringify(parse(data), undefined, 2));
}

// getPR();
getDiff();

