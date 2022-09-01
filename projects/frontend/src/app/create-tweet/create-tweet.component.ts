import { Component, EventEmitter, Output } from '@angular/core';
import { Tweet } from '@meaningful-tweets/backend/src/tweet';

/**
 * Displays a form for the user to author a new tweet and emits it from the
 * `tweet` output when the users creates it.
 */
@Component({
  selector: 'app-create-tweet',
  templateUrl: './create-tweet.component.html',
  styleUrls: ['./create-tweet.component.css'],
})
export class CreateTweetComponent {
  protected author = '';
  protected content = '';

  @Output()
  tweet = new EventEmitter<Tweet>();

  protected createTweet(): void {
    // Create a new tweet and emit it as an event to the parent component.
    this.tweet.emit({
      author: { handle: this.author },
      content: this.content,
    });

    // Clear the form.
    this.author = '';
    this.content = '';
  }
}
