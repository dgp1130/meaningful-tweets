import { Component, Input } from '@angular/core';
import { Tweet } from '../tweet';

/** Displays a tweet in a Material card UI. */
@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent {
  @Input()
  tweet!: Tweet;
}
