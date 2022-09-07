import { MongoClient, ServerApiVersion } from 'mongodb';
import { Tweet } from './tweet';
import { TweetStore } from './tweet-store';

/** A data store of tweets using a real MongoDB database. */
export class MongoTweetStore implements TweetStore {
  constructor(private readonly mongoUri: string) { }

  async readTweets(): Promise<readonly Tweet[]> {
    return await connectToDb(this.mongoUri, async (client) => {
      // Read all tweets from the database.
      const tweets = client.db('tweet-db').collection('tweets');
      return await tweets.find().toArray() as unknown as Tweet[];
    });
  }

  async saveTweet(tweet: Tweet): Promise<void> {
    await connectToDb(this.mongoUri, async (client) => {
      // Insert new tweet into the database.
      const tweets = client.db('tweet-db').collection('tweets');
      await tweets.insertOne(tweet);
    });
  }
}

/**
 * Utility function to connect to the MongoDB database and perform an action
 * with its client.
 */
async function connectToDb<T>(uri: string, callback: (client: MongoClient) => Promise<T>):
    Promise<T> {
  // Connect to the database.
  const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
  await new Promise<void>((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // Invoke the callback to perform an action on the database.
  let result: T;
  try {
    result = await callback(client);
  } finally {
    // Close the connection afterwards, even if the callback fails.
    client.close();
  }

  // Return the callback's result for convenience.
  return result;
}
