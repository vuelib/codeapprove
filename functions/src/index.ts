import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as axios from "axios";

admin.initializeApp();

const config = functions.config();
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

/**
 * TODO: actually deploy the client secret
 */
export const oauth = functions.https.onRequest(async (request, response) => {
  const ghConfig = config.github;
  const code = request.query.code;

  console.log("Getting access tokens...");
  const tokenRes = await ax.post(
    `https://github.com/login/oauth/access_token?${qs.stringify({
      client_id: ghConfig.client_id,
      client_secret: ghConfig.client_secret,
      code,
    })}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const { access_token, expires_in } = qs.parse(tokenRes.data);

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
    photoURL: avatar_url
  });

  // TODO: Store the refresh token(s) and expiry info in the database
  const res = {
    access_token,
    expires_in,
    custom_token,
  };

  // TODO: There should probably be a special path here like /customauth
  // TODO: Don't hardcode the host
  response.redirect(`http://localhost:8080/signin?${qs.stringify(res)}`);
});
