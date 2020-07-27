import * as functions from "firebase-functions";

export interface GithubConfig {
  app_id: number;
  client_id: string;
  client_secret: string;
  webhook_secret: string;
}

export function github() {
  return functions.config().github as GithubConfig;
}
