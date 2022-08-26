import { InjectionToken } from '@angular/core';
import { Tweet } from './tweet';

/** A service to fetch and post tweets from a backend. */
export interface TweetService {
  /** Fetch tweets from the backend. */
  fetchTweets(): Promise<readonly Tweet[]>;

  /** Post a new tweet to the backend. */
  postTweet(tweet: Tweet): Promise<void>;
}

/** Token to inject an implementation of `TweetService`. */
export const tweetServiceToken = new InjectionToken<TweetService>('tweet-service');
