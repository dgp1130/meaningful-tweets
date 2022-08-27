import { Tweet } from './tweet';

/** A data store of tweets. */
export interface TweetStore {
  /** Reads all tweets from the store. */
  readTweets(): Promise<readonly Tweet[]>;

  /** Stores the given tweet into the database. */
  saveTweet(tweet: Tweet): Promise<void>;
}
