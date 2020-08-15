export interface Config {
  github: {
    app_id: number;
    app_url: string;
    client_id: string;
    redirect: string;
  };
}

export const config: Config = {
  github: {
    app_id: 0,
    app_url: "",
    client_id: "",
    redirect: ""
  }
};

if (process.env.NODE_ENV !== "production") {
  // DEV CONFIG
  config.github = {
    app_id: 70622,
    app_url: "https://github.com/apps/codeapprove-dev",
    client_id: "Iv1.3bfe017ea9365f15",
    redirect: "http://localhost:5000/oauth"
  };
} else {
  // PROD CONFIG
  config.github = {
    app_id: 66242,
    app_url: "https://github.com/apps/codeapprove",
    client_id: "Iv1.6163c34dcb65f972",
    redirect: "https://codeapprove.com/oauth"
  };
}
