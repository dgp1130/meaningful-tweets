import { Application } from 'express';
import * as express from 'express';
import { Tweet } from './tweet';
import { TweetStore } from './tweet-store';

/** Serve tweet endpoints. */
export function serve(app: Application, { store }: { store: TweetStore }): void {
  // Tweet service uses JSON as a data exchange format.
  app.use(express.json());

  // `GET /tweets/list` returns a JSON list of all tweets.
  app.get('/tweets/list', async (_req, res) => {
    // Read all tweets from the data store.
    let tweets!: readonly Tweet[];
    try {
      tweets = await store.readTweets();
    } catch (err) {
      // Fail to read tweets from the data store, pass the error on to the client.
      res.status(500 /* HTTP Internal Server Error */)
          .end((err as Error).toString());
      return;
    }

    // Respond with tweets from data store.
    res.json(tweets);
  });

  // `POST /tweets/new` with `Content-Type: application/json` and a JSON tweet
  // in the request body posts the new tweet and makes it available to
  // `/tweets/list`.
  app.post('/tweets/new', async (req, res) => {
    // Validate the `Content-Type`. Expression requires `application/json` to
    // parse as an object.
    const contentType = req.header('Content-Type');
    if (contentType !== 'application/json') {
      res.status(400 /* HTTP Bad Request */)
          .end(`\`Content-Type: application/json\` is required on requests.`);
    }

    // Save the new tweet in the database.
    const tweet = req.body as Tweet;
    try {
      await store.saveTweet(tweet);
    } catch (err) {
      // Failed to save tweet to data store, pass the error back to the client.
      res.status(500 /* HTTP Internal Server Error */)
          .end((err as Error).toString());
      return;
    }

    // Successfully saved tweet.
    res.end();
  });
}
