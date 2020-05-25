import * as functions from 'firebase-functions';

/**
 * TODO: This needs security
 */
export const githubWebhook = functions.https.onRequest((request, response) => {
  console.log(`Incoming ${request.method} request`);
  console.log(`Headers`, JSON.stringify(request.headers));
  console.log(`Body`, JSON.stringify(request.body));

  // Event is in x-github-event

  response.send("Done");
});
