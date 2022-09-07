import { MongoClient, Db, Collection, FindCursor, Document, ObjectId, InsertOneResult } from 'mongodb';
import { MongoTweetStore } from './mongo-tweet-store';
import { Tweet } from './tweet';

describe('MongoTweetStore', () => {
  it('reads tweets from the MongoDB database', async () => {
    const store = new MongoTweetStore('mongodb+srv://mongo.test/');

    spyOn(MongoClient.prototype, 'connect').and.callFake(
      ((onConnect: (err?: Error) => void) => {
        onConnect();
      }) as any,
    );
    spyOn(MongoClient.prototype, 'close');
    spyOn(MongoClient.prototype, 'db').and.returnValue(mockDatabase({
      read: () => Promise.resolve([
        {
          author: { handle: 'me' },
          content: 'Howdy!',
        },
        {
          author: { handle: 'you' },
          content: 'Hello!',
        }
      ] as Tweet[]),
    }));

    await expectAsync(store.readTweets()).toBeResolvedTo([
      {
        author: { handle: 'me' },
        content: 'Howdy!',
      },
      {
        author: { handle: 'you' },
        content: 'Hello!',
      }
    ]);

    // Should close connection after database read.
    expect(MongoClient.prototype.close).toHaveBeenCalled();
  });

  it('fails to read on connection error', async () => {
    const store = new MongoTweetStore('mongodb+srv://mongo.test/');

    const error = new Error('Too many tweets, can\'t keep up!');
    spyOn(MongoClient.prototype, 'connect').and.callFake(
      ((onConnect: (err?: Error) => void) => {
        onConnect(error);
      }) as any,
    );

    await expectAsync(store.readTweets()).toBeRejectedWith(error);
  });

  it('fails to read on database read error', async () => {
    const store = new MongoTweetStore('mongodb+srv://mongo.test/');

    const error = new Error('Too many tweets, can\'t keep up!')
    spyOn(MongoClient.prototype, 'connect').and.callFake(
      ((onConnect: (err?: Error) => void) => {
        onConnect();
      }) as any,
    );
    spyOn(MongoClient.prototype, 'close');
    spyOn(MongoClient.prototype, 'db').and.returnValue(mockDatabase({
      read: () => Promise.reject(error),
    }));

    await expectAsync(store.readTweets()).toBeRejectedWith(error);

    // Should still clean up connection on failure.
    expect(MongoClient.prototype.close).toHaveBeenCalled();
  });

  it('saves the given tweet to the MongoDB database', async () => {
    const store = new MongoTweetStore('mongodb+srv://mongo.test/');

    const tweets: Tweet[] = [];
    spyOn(MongoClient.prototype, 'connect').and.callFake(
      ((onConnect: (err?: Error) => void) => {
        onConnect();
      }) as any,
    );
    spyOn(MongoClient.prototype, 'close');
    spyOn(MongoClient.prototype, 'db').and.returnValue(mockDatabase({
      read: async () => tweets,
      write: async (doc) => { tweets.push(doc as Tweet); },
    }));

    await expectAsync(store.saveTweet({
      author: { handle: 'me' },
      content: 'Howdy!',
    })).toBeResolved();

    expect(tweets).toEqual([
      {
        author: { handle: 'me' },
        content: 'Howdy!',
      },
    ]);

    // Should close connection after database write.
    expect(MongoClient.prototype.close).toHaveBeenCalled();
  });

  it('fails to save on connection error', async () => {
    const store = new MongoTweetStore('mongodb+srv://mongo.test/');

    const error = new Error('Too many tweets, can\'t keep up!');
    spyOn(MongoClient.prototype, 'connect').and.callFake(
      ((onConnect: (err?: Error) => void) => {
        onConnect(error);
      }) as any,
    );

    await expectAsync(store.saveTweet({
      author: { handle: 'me' },
      content: 'Howdy!',
    })).toBeRejectedWith(error);
  });

  it('fails to save on database write error', async () => {
    const store = new MongoTweetStore('mongodb+srv://mongo.test/');

    const error = new Error('Too many tweets, can\'t keep up!');
    spyOn(MongoClient.prototype, 'connect').and.callFake(
      ((onConnect: (err?: Error) => void) => {
        onConnect();
      }) as any,
    );
    spyOn(MongoClient.prototype, 'close');
    spyOn(MongoClient.prototype, 'db').and.returnValue(mockDatabase({
      write: () => Promise.reject(error),
    }))

    await expectAsync(store.saveTweet({
      author: { handle: 'me' },
      content: 'Howdy!',
    })).toBeRejectedWith(error);

    // Should still clean up connection on failure.
    expect(MongoClient.prototype.close).toHaveBeenCalled();
  });
});

/** Minimal Mongo database mock implementation. */
function mockDatabase({
  read = () => Promise.resolve([]),
  write = (_doc) => Promise.resolve(),
}: {
  read?: () => Promise<Document[]>,
  write?: (doc: Document) => Promise<InsertOneResult | void>,
} = {}): Db {
  const mockCursor = jasmine.createSpyObj(
    'find', ['toArray']) as jasmine.SpyObj<FindCursor<Document>>;
  mockCursor.toArray.and.callFake(() => read());

  const mockCollection = jasmine.createSpyObj(
    'collection', ['find', 'insertOne']) as jasmine.SpyObj<Collection>;
  mockCollection.find.and.returnValue(mockCursor);
  mockCollection.insertOne.and.callFake(async (doc: Document) => {
    return await write(doc) ?? {
      acknowledged: true,
      insertedId: new ObjectId(1234),
    };
  });

  const mockDb = jasmine.createSpyObj(
    'db', ['collection']) as jasmine.SpyObj<Db>;
  mockDb.collection.and.returnValue(mockCollection);

  return mockDb;
}
