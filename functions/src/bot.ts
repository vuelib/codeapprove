import { Application } from "probot";

export function bot(app: Application) {
  app.on("check_suite.requested", async (context) => {
    // A new check suite has been created. A check suite is a collection
    // of check runs for a commit. GitHub sends check_suite.requested
    // to all GitHub apps that are installed on each commit.
    //
    // A check run is an individual test that runs as part of a check suite.
    console.log("check_suite.requested", JSON.stringify(context));

    // TODO:
    // - Link to CodeApprove with details_url
    await context.github.checks.create({
      name: "CodeApprove",
      owner: context.repo().owner,
      repo: context.repo().repo,
      head_sha: context.payload.check_suite.head_sha,
      status: "in_progress",
    });
  });
}
