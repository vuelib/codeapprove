export interface User {
  uid: string;
  email: string;
  username: string;
  photoURL: string;

  githubToken: string;
  githubExpiry: number;
}

export function createUser(
  u: firebase.User,
  githubToken: string,
  expiresIn: number
): User {
  const githubExpiry = new Date().getTime() + expiresIn;

  return {
    uid: u.uid,
    username: u.displayName!,
    email: u.email!,
    photoURL: u.photoURL!,
    githubToken,
    githubExpiry
  };
}

export function updateGithubToken(
  user: User,
  githubToken: string,
  expiresIn: number
): User {
  const githubExpiry = new Date().getTime() + expiresIn;

  user.githubToken = githubToken;
  user.githubExpiry = githubExpiry;

  return user;
}
