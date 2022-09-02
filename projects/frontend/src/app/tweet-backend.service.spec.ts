import { TestBed } from '@angular/core/testing';
import { Tweet } from '@meaningful-tweets/backend/src/tweet';
import { backendOriginToken } from './backend-origin';

import { TweetBackendService } from './tweet-backend.service';

describe('TweetBackendService', () => {
  let service: TweetBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: backendOriginToken, useValue: 'http://tweet-backend.test' },
      ],
    });
    service = TestBed.inject(TweetBackendService);
  });

  it('should fetch tweets from the backend', async () => {
    spyOn(window, 'fetch').and.resolveTo(new Response(JSON.stringify([
      {
        author: { handle: 'me' },
        content: 'Hello!',
      },
    ] as Tweet[])));

    const tweets = await service.fetchTweets();

    expect(fetch).toHaveBeenCalledWith('http://tweet-backend.test/tweets/list');

    expect(tweets).toEqual([
      {
        author: { handle: 'me' },
        content: 'Hello!',
      },
    ]);
  });

  it('should fail to fetch tweets on backend error', async () => {
    spyOn(window, 'fetch').and.resolveTo(new Response(null, {
      status: 500 /* HTTP Internal Server error */,
    }));

    await expectAsync(service.fetchTweets())
        .toBeRejectedWithError(/Failed to fetch tweets/);
  });

  it('should post a tweet to the backend', async () => {
    spyOn(window, 'fetch').and.resolveTo(new Response());

    await expectAsync(service.postTweet({
      author: { handle: 'me' },
      content: 'Hello!',
    })).toBeResolved();

    expect(fetch).toHaveBeenCalledWith('http://tweet-backend.test/tweets/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: { handle: 'me' },
        content: 'Hello!',
      }, null, 4),
    });
  });

  it('should fail to post a tweet on backend error', async () => {
    spyOn(window, 'fetch').and.resolveTo(new Response(null, {
      status: 500 /* HTTP Internal Server error */,
    }));

    const tweet: Tweet = {
      author: { handle: 'me' },
      content: 'Hello!',
    };

    await expectAsync(service.postTweet(tweet))
        .toBeRejectedWithError(/Failed to post tweet/);
  });
});
