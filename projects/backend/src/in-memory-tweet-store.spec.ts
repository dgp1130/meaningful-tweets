import { InMemoryTweetStore } from './in-memory-tweet-store';

describe('InMemoryTweetStore', () => {
  it('starts with no tweets', async () => {
    const store = new InMemoryTweetStore();

    const tweets = await store.readTweets();
    expect(tweets).toEqual([]);
  });

  it('reads saved tweets', async () => {
    const store = new InMemoryTweetStore();

    // Save a tweet and read it back out.
    await expectAsync(store.saveTweet({
      author: {
        handle: 'me',
      },
      content: 'Hello!',
    })).toBeResolved();
    expect(await store.readTweets()).toEqual([
      {
        author: {
          handle: 'me',
        },
        content: 'Hello!',
      },
    ]);

    // Save another tweet and read them both.
    await expectAsync(store.saveTweet({
      author: {
        handle: 'you',
        avatar: 'http://example.test/you',
      },
      content: 'Howdy!',
    })).toBeResolved();
    expect(await store.readTweets()).toEqual([
      {
        author: {
          handle: 'me',
        },
        content: 'Hello!',
      },
      {
        author: {
          handle: 'you',
          avatar: 'http://example.test/you',
        },
        content: 'Howdy!',
      },
    ]);
  });
});
