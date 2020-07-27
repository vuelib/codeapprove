import * as functions from "firebase-functions";
import * as axios from "axios";

const config = functions.config();
const ax = axios.default;
const qs = require("querystring");

export interface AccessTokenResponse {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  refresh_token_expires_in: string;
}

export async function exchangeCode(code: string): Promise<AccessTokenResponse> {
  const ghConfig = config.github;

  const tokenRes = await ax.post(
    `https://github.com/login/oauth/access_token?${qs.stringify({
      client_id: ghConfig.client_id,
      client_secret: ghConfig.client_secret,
      code,
    })}`
  );

  const res = qs.parse(tokenRes.data);
  if (res.error) {
    throw new Error(`Error: ${res.error} - ${res.error_description}`);
  }

  return res as AccessTokenResponse;
}

export async function exchangeRefreshToken(
  refresh_token: string
): Promise<AccessTokenResponse> {
  const ghConfig = config.github;

  const tokenRes = await ax.post(
    `https://github.com/login/oauth/access_token?${qs.stringify({
      client_id: ghConfig.client_id,
      client_secret: ghConfig.client_secret,
      grant_type: "refresh_token",
      refresh_token,
    })}`
  );

  const res = qs.parse(tokenRes.data);
  if (res.error) {
    throw new Error(`Error: ${res.error} - ${res.error_description}`);
  }

  return res as AccessTokenResponse;
}
