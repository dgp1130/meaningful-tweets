import { TestBed } from '@angular/core/testing';
import { Tweet } from '@meaningful-tweets/backend/src/tweet';
import { InMemoryTweetService } from './in-memory-tweet.service';

describe('InMemoryTweetService', () => {
  let service: InMemoryTweetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryTweetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return fetched tweets with initial state', async () => {
    const tweets = await service.fetchTweets();
    expect(tweets).toEqual([
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
    ]);
  });

  it('should append a posted tweet', async () => {
    const tweet1: Tweet = {
      author: { handle: 'me' },
      content: 'Hello!',
    };
    await expectAsync(service.postTweet(tweet1)).toBeResolved();

    const tweets1 = await service.fetchTweets();
    expect(tweets1).toEqual([
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
      {
        author: { handle: 'me' },
        content: 'Hello!',
      },
    ]);

    const tweet2: Tweet = {
      author: { handle: 'you' },
      content: 'Howdy!',
    };
    await expectAsync(service.postTweet(tweet2)).toBeResolved();

    const tweets2 = await service.fetchTweets();
    expect(tweets2).toEqual([
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
      {
        author: { handle: 'me' },
        content: 'Hello!',
      },
      {
        author: { handle: 'you' },
        content: 'Howdy!',
      },
    ]);
  });
});
