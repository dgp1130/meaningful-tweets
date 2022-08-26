import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { firstValueFrom } from 'rxjs';

import { CreateTweetComponent } from './create-tweet.component';

describe('CreateTweetComponent', () => {
  let component: CreateTweetComponent;
  let fixture: ComponentFixture<CreateTweetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTweetComponent ],
      imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a tweet', async () => {
    // Fill out the author field.
    const authorInput =
      fixture.nativeElement.querySelector('[name="author"]') as HTMLInputElement;
    authorInput.value = 'Me';
    authorInput.dispatchEvent(new Event('input'));

    // Fill out the content field.
    const contentInput =
      fixture.nativeElement.querySelector('[name="content"]') as HTMLInputElement;
    contentInput.value = 'Hello!';
    contentInput.dispatchEvent(new Event('input'));

    // Click the "Tweet" button and wait for the event to emit.
    const tweetPromise = firstValueFrom(component.tweet.asObservable());
    const tweetButton =
      fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    tweetButton.click();
    const tweet = await tweetPromise;

    // Assert the tweet is correct.
    expect(tweet).toBeTruthy();
    expect(tweet.author.handle).toBe('Me');
    expect(tweet.author.avatar).toBeUndefined();
    expect(tweet.content).toBe('Hello!');
  });
});
