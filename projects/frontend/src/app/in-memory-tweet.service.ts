import { Injectable } from '@angular/core';
import { Tweet } from '@meaningful-tweets/backend/src/tweet';
import { TweetService } from './tweet.service';

/** An in-memory implementation of the tweet service. */
@Injectable({
  providedIn: 'root'
})
export class InMemoryTweetService implements TweetService {
  readonly tweets: Tweet[] = [
    {
      author: { handle: 'develwoutacause' },
      content: 'Howdy, World!',
    },
    {
      author: { handle: 'develwoutacause' },
      content: 'I like JavaScript *and* TypeScript.',
    },
    {
      author: { handle: 'develwoutacause' },
      content: '🫵 You matter. 🤜🤛',
    },
  ];

  async fetchTweets(): Promise<readonly Tweet[]> {
    return this.tweets;
  }

  async postTweet(tweet: Tweet): Promise<void> {
    this.tweets.push(tweet);
  }
}
