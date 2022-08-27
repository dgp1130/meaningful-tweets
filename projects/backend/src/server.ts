import { env } from 'process';
import * as cors from 'cors';
import * as express from 'express';
import { InMemoryTweetStore } from './in-memory-tweet-store';
import { serve as serveTweets } from './tweet-service';

const app = express();

// Allow CORS access from any origin.
// Since tweets are public anyways, we can serve to all origins. If content is
// authenticated, user-specific content, consider restricting to the frontend
// origin.
app.use(cors());

// Serve tweets as defined in `./tweets.ts`.
serveTweets(app, { store: new InMemoryTweetStore() });

// Bind server to the `$PORT` environment variable.
const port = parseInt(env['PORT'] ?? '8000');
app.listen(port, () => {
  console.log(`Listening on port: ${port}.`);
});
