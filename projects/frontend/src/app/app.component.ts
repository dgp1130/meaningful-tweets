import { Component, Inject, OnInit } from '@angular/core';
import { Tweet } from './tweet';
import { TweetService, tweetServiceToken } from './tweet.service';

/** Root component for the entire application. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(@Inject(tweetServiceToken) private readonly tweetService: TweetService) {}

  protected readonly tweets: Tweet[] = [];

  ngOnInit(): void {
    // Load tweets from backend service.
    this.tweetService.fetchTweets().then((tweets) => {
      // Prepend to list instead of overwriting it in case the user posted a
      // tweet before the backend responded.
      this.tweets.unshift(...tweets);
    });
  }

  // Post the new tweet. No backend to send it to :(, so just prepend to the
  // list for now.
  protected async postTweet(tweet: Tweet): Promise<void> {
    this.tweets.unshift(tweet);
    await this.tweetService.postTweet(tweet);
  }
}
