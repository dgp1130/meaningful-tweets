import * as express from 'express';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';
import { serve as serveTweets } from './tweet-service';
import { InMemoryTweetStore } from './in-memory-tweet-store';
import { Tweet } from './tweet';
import { TweetStore } from './tweet-store';

describe('TweetService', () => {
  it('lists no tweets initially', async () => {
    const store = new InMemoryTweetStore();

    await serve(store, async (port) => {
      // No tweets should exist initially.
      const res = await fetch(`http://localhost:${port}/tweets/list`);
      expect(res.status).toBe(200 /* HTTP OK */);
      expect(await res.json()).toEqual([]);
    });
  });

  it('saves and lists tweets from the store', async () => {
    const store = new InMemoryTweetStore();

    await serve(store, async (port) => {
      // Post a tweet via the HTTP service.
      const res1 = await fetch(`http://localhost:${port}/tweets/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: {
            handle: 'me',
          },
          content: 'Hello!',
        } as Tweet, null, 4),
      });
      expect(res1.status).toBe(200 /* HTTP OK */);
      expect(await res1.text()).toBe('');

      // New tweet should be only tweet in the list.
      const res2 = await fetch(`http://localhost:${port}/tweets/list`);
      expect(res2.status).toBe(200 /* HTTP OK */);
      expect(await res2.json()).toEqual([
        {
          author: {
            handle: 'me',
          },
          content: 'Hello!',
        },
      ] as Tweet[]);

      // Post another tweet.
      const res3 = await fetch(`http://localhost:${port}/tweets/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: {
            handle: 'you',
            avatar: 'https://example.test/you',
          },
          content: 'Howdy!',
        } as Tweet, null, 4),
      });
      expect(res3.status).toBe(200 /* HTTP OK */);
      expect(await res3.text()).toBe('');

      // List should now contain both tweets.
      const res4 = await fetch(`http://localhost:${port}/tweets/list`);
      expect(res4.status).toBe(200 /* HTTP OK */);
      expect(await res4.json()).toEqual([
        {
          author: {
            handle: 'me',
          },
          content: 'Hello!',
        },
        {
          author: {
            handle: 'you',
            avatar: 'https://example.test/you',
          },
          content: 'Howdy!',
        },
      ] as Tweet[]);
    });
  });

  it('returns HTTP 500 when unable to read tweets from the data store', async () => {
    const store = new InMemoryTweetStore();
    spyOn(store, 'readTweets').and.rejectWith(new Error('Sorry, I lost them.'));

    await serve(store, async (port) => {
      const res = await fetch(`http://localhost:${port}/tweets/list`);
      expect(res.status).toBe(500 /* HTTP Internal Server Error */);
      expect(await res.text()).toContain('Sorry, I lost them.');
    });
  });

  it('returns HTTP 400 when attempting to save a tweet with the wrong `Content-Type`', async () => {
    await serve(new InMemoryTweetStore(), async (port) => {
      const res = await fetch(`http://localhost:${port}/tweets/new`, {
        method: 'POST',
        headers: {
          // Client forgot to include `Content-Type`.
          // 'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: {
            handle: 'me',
          },
          content: 'Hello!',
        } as Tweet, null, 4),
      });

      expect(res.status).toBe(400 /* HTTP Bad Request */);
      expect(await res.text()).toContain('Content-Type: application/json');
    });
  });

  it('returns HTTP 500 when unable to save a tweet in the data store', async () => {
    const store = new InMemoryTweetStore();
    spyOn(store, 'saveTweet').and.rejectWith(new Error('Store full.'));

    await serve(store, async (port) => {
      const res = await fetch(`http://localhost:${port}/tweets/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: {
            handle: 'me',
          },
          content: 'Hello!',
        } as Tweet, null, 4),
      });

      expect(res.status).toBe(500 /* HTTP Internal Server Error */);
      expect(await res.text()).toContain('Store full.');
    });
  });
});

/**
 * Runs the tweet service with the provided store and invokes the callback to
 * execute a test against it. The test callback receives a port number the
 * server is currently listening to on localhost. Fails the current spec if the
 * test callback rejects.
 */
async function serve(
  store: TweetStore,
  test: (port: number) => Promise<void>,
): Promise<void> {
  // Create a new server with the provided store.
  const app = express();
  serveTweets(app, { store });

  // Start listening for requests.
  const server = app.listen(0 /* choose arbitrary port */);
  const { port } = server.address() as AddressInfo;

  try {
    // Run the test case.
    await test(port);
  } catch (err) {
    // Fail the test if any uncaught error is thrown.
    fail(err);
  } finally {
    // Kill the server when done.
    server.close();
  }
}
