export interface Config {
  github: {
    client_id: string;
    redirect: string;
  };
}

export const config: Config = {
  github: {
    client_id: "",
    redirect: ""
  }
};

if (process.env.NODE_ENV !== "production") {
  // DEV CONFIG
  config.github.client_id = "Iv1.3bfe017ea9365f15";
  config.github.redirect = "http://localhost:5000/oauth";
} else {
  // PROD CONFIG
  config.github.client_id = "Iv1.6163c34dcb65f972";
  config.github.redirect = "https://diffmachine.com/oauth";
}
