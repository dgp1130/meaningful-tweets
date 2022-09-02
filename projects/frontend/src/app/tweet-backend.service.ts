import { Inject, Injectable } from '@angular/core';
import { Tweet } from '@meaningful-tweets/backend/src/tweet';
import { backendOriginToken } from './backend-origin';
import { TweetService } from './tweet.service';

/**
 * An implementation of the `TweetService` invoking the backend API at the
 * provided URL.
 */
@Injectable({
  providedIn: 'root'
})
export class TweetBackendService implements TweetService {
  constructor(
    @Inject(backendOriginToken) private readonly backendOrigin: string,
  ) { }

  async fetchTweets(): Promise<readonly Tweet[]> {
    // Fetch tweets from the backend.
    const res = await fetch(`${this.backendOrigin}/tweets/list`);

    // Verify HTTP status code was successful.
    if (res.status >= 400) {
      throw new Error(`Failed to fetch tweets, got HTTP ${res.status} response.`);
    }

    const tweets = await res.json() as Tweet[];
    return tweets;
  }

  async postTweet(tweet: Tweet): Promise<void> {
    // Post new tweet to backend.
    const res = await fetch(`${this.backendOrigin}/tweets/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweet, null, 4),
    });

    // Verify HTTP status code was successful.
    if (res.status >= 400) {
      throw new Error(`Failed to post tweet, got HTTP ${res.status} response.`);
    }
  }
}
