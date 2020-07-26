import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as axios from "axios";

import * as github from "./github";
import * as users from "./users";

admin.initializeApp();

const ax = axios.default;
const qs = require("querystring");

/**
 * TODO: This needs security
 */
export const githubWebhook = functions.https.onRequest(
  async (request, response) => {
    console.log(`Incoming ${request.method} request`);
    console.log(`Headers`, JSON.stringify(request.headers));
    console.log(`Body`, JSON.stringify(request.body));

    // Event is in x-github-event

    response.send("Done");
  }
);

export const getGithubToken = functions.https.onCall(async (data, ctx) => {
  if (!(ctx.auth && ctx.auth.uid)) {
    throw new Error("Unauthenticated");
  }

  const user = await users.getUser(ctx.auth.uid);
  const token = await github.exchangeRefreshToken(user.refresh_token);

  // Save updated token to the database
  await users.saveUser(
    ctx.auth.uid,
    user.login,
    token.refresh_token,
    token.refresh_token_expires_in
  );

  return {
    access_token: token.access_token,
    // String, in seconds
    expires_in: token.expires_in,
  };
});

/**
 * TODO: actually deploy the client secret
 */
export const oauth = functions.https.onRequest(async (request, response) => {
  const code = request.query.code as string;

  console.log("Getting access tokens...");
  const {
    access_token,
    refresh_token,
    refresh_token_expires_in,
  } = await github.exchangeCode(code);

  const userRes = await ax.get(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  const { id, login, avatar_url } = userRes.data;
  console.log("signed in as ", id, login);

  const userId = `${id}`;
  const custom_token = await admin.auth().createCustomToken(userId, {
    login,
  });

  await admin.auth().updateUser(userId, {
    displayName: login,
    photoURL: avatar_url,
  });

  await users.saveUser(userId, login, refresh_token, refresh_token_expires_in);

  const res = {
    custom_token,
  };

  // TODO: There should probably be a special path here like /customauth
  // TODO: Don't hardcode the host
  response.redirect(`http://localhost:8080/signin?${qs.stringify(res)}`);
});
