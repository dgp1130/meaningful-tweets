/** @fileoverview In-memory implementation of a tweet database. */

import { Tweet } from './tweet';
import { TweetStore } from './tweet-store';

/** In-memory implementation of a tweet data store. */
export class InMemoryTweetStore implements TweetStore {
  // In-memory store of all tweets.
  private readonly tweets: Tweet[] = [];

  async readTweets(): Promise<readonly Tweet[]> {
    return this.tweets;
  }

  async saveTweet(tweet: Tweet): Promise<void> {
    this.tweets.push(tweet);
  }
}
