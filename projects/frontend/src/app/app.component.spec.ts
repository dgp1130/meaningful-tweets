import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Tweet } from '@meaningful-tweets/backend/src/tweet';
import { AppComponent } from './app.component';
import { CreateTweetComponent } from './create-tweet/create-tweet.component';
import { TweetComponent } from './tweet/tweet.component';
import { tweetServiceToken } from './tweet.service';
import { TweetBackendService } from './tweet-backend.service';

describe('AppComponent', () => {
  const tweetServiceSpy = jasmine.createSpyObj(
    'TweetService',
    Object.getOwnPropertyNames(TweetBackendService.prototype),
  );

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
        CreateTweetComponent,
        TweetComponent,
      ],
    }).overrideProvider(
      tweetServiceToken,
      { useValue: tweetServiceSpy },
    ).overrideComponent(TweetComponent, {
      set: { template: `` },
    }).overrideComponent(CreateTweetComponent, {
      set: { template: `` },
    }).compileComponents();
  });

  it('should list initial tweets', async () => {
    // Mock existing tweets from backend.
    const fetchedTweets: Tweet[] = [
      {
        author: { handle: 'me' },
        content: 'Hello!',
      },
      {
        author: { handle: 'you' },
        content: 'Howdy!',
      },
    ];
    tweetServiceSpy.fetchTweets.and.resolveTo(fetchedTweets);

    // Create the component.
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // Run `ngOnInit()` and fetch tweets.
    await fixture.whenStable(); // Wait for tweets to resolve.
    fixture.detectChanges(); // Update UI.

    const renderedTweets = fixture.debugElement.queryAll(
      By.css('.tweet-list app-tweet'),
    ).map((el) => (el.componentInstance as TweetComponent).tweet);
    expect(renderedTweets).toEqual(fetchedTweets);
  });

  it('should prepend newly-posted tweets', async () => {
    // Mock existing tweets from backend.
    const existingTweet: Tweet = {
      author: { handle: 'me' },
      content: 'Hello!',
    };
    tweetServiceSpy.fetchTweets.and.resolveTo([existingTweet]);

    // Create the component.
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // Run `ngOnInit()` and fetch tweets.
    await fixture.whenStable(); // Wait for tweets to resolve.
    fixture.detectChanges(); // Update UI.

    // Post a new tweet.
    const createTweetComponent = fixture.debugElement.query(
      By.css('app-create-tweet'),
    ).componentInstance as CreateTweetComponent;
    const newTweet: Tweet = {
      author: { handle: 'you' },
      content: 'Howdy!',
    };
    createTweetComponent.tweet.emit(newTweet);
    fixture.detectChanges();

    // Assert new tweet is prepended to the list.
    const tweets = fixture.debugElement.queryAll(By.css('.tweet-list app-tweet'))
      .map((el) => (el.componentInstance as TweetComponent).tweet);
    expect(tweets).toEqual([
      {
        author: { handle: 'you' },
        content: 'Howdy!',
      },
      {
        author: { handle: 'me' },
        content: 'Hello!',
      },
    ]);
  });
});
