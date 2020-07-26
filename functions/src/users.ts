import * as admin from "firebase-admin";

export interface User {
  login: string;
  refresh_token: string;
  refresh_token_expires: number;
}

export async function saveUser(
  id: string,
  login: string,
  refresh_token: string,
  refresh_token_expires_in: string
) {
  const refresh_token_expires =
    new Date().getTime() + Number.parseInt(refresh_token_expires_in) * 1000;
  const user: User = {
    login,
    refresh_token,
    refresh_token_expires,
  };

  await admin.firestore().doc(`/users/${id}`).set(user);
}

export async function getUser(id: string): Promise<User> {
  const res = await admin.firestore().doc(`/users/${id}`).get();
  return res.data() as User;
}
