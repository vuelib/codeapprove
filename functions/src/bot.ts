import { Application } from "probot";

export function bot(app: Application) {
  app.on("check_suite", async (context) => {
    console.log("check_suite", JSON.stringify(context));
  });
}
