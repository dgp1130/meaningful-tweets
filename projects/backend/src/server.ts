import { env } from 'process';
import * as cors from 'cors';
import * as express from 'express';
import { MongoTweetStore } from './mongo-tweet-store';
import { serve as serveTweets } from './tweet-service';

const app = express();

// Allow CORS access from any origin.
// Since tweets are public anyways, we can serve to all origins. If content is
// authenticated, user-specific content, consider restricting to the frontend
// origin.
app.use(cors());

// Get database name and credentials from environment variables.
const MONGO_DB_URI = env['MONGO_DB_URI'];
if (!MONGO_DB_URI) throw new Error('${MONGO_DB_URI} environment variable is required.');

// Serve tweets as defined in `./tweets.ts`.
serveTweets(app, { store: new MongoTweetStore(MONGO_DB_URI) });

// Bind server to the `$PORT` environment variable.
const port = parseInt(env['PORT'] ?? '8000');
app.listen(port, () => {
  console.log(`Listening on port: ${port}.`);
});
