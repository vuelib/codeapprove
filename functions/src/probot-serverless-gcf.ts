/**
 * A rewrite of https://github.com/probot/serverless-gcf with more modern deps
 */
import * as functions from "firebase-functions";
import { createProbot, Application, Probot } from "probot";
import { findPrivateKey } from "probot/lib/private-key";

export interface ProbotConfig {
  id: number;
  privateKey: string;
  webhookSecret: string;
}

let probot: Probot | undefined;
type ProbotFn = (app: Application) => any;

function loadProbot(config: ProbotConfig, appFn: ProbotFn): Probot {
  process.env.PRIVATE_KEY = config.privateKey;
  const probot = createProbot({
    id: config.id,
    secret: config.webhookSecret,
    cert: findPrivateKey() || undefined,
  });
  delete process.env.PRIVATE_KEY;

  probot.load(appFn);
  return probot;
}

export function serverless(config: ProbotConfig, appFn: ProbotFn) {
  return async (
    request: functions.https.Request,
    response: functions.Response
  ) => {
    probot = probot || loadProbot(config, appFn);

    // 🤖 A friendly message
    if (request.method === "GET" && request.path === "/probot") {
      response.status(200).send({ message: "Hello from Probot!" });
      return;
    }

    // Determine incoming webhook event type
    const name = request.get("x-github-event") || request.get("X-GitHub-Event");
    const id =
      request.get("x-github-delivery") || request.get("X-GitHub-Delivery");

    if (!name || !id) {
      response.status(500).send({ message: "Missing event or event id." });
      return;
    }

    // Do the thing
    console.log(
      `Received event ${name}${
        request.body.action ? "." + request.body.action : ""
      }`
    );
    if (name) {
      try {
        await probot.receive({
          name,
          id,
          payload: request.body,
        });
        response.status(200).send(JSON.stringify({ message: "Executed" }));
      } catch (err) {
        console.error(err);
        response.status(500).send(JSON.stringify({ message: err }));
      }
    } else {
      console.error(request);
      response.sendStatus(400);
    }
  };
}
