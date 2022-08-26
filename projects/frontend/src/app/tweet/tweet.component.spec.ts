import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { TweetComponent } from './tweet.component';

describe('TweetComponent', () => {
  let component: TweetComponent;
  let fixture: ComponentFixture<TweetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TweetComponent ],
      imports: [ MatCardModule ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TweetComponent);
    component = fixture.componentInstance;
  });

  it('should render', () => {
    component.tweet = {
      author: {
        handle: 'me',
        avatar: 'https://example.test/me',
      },
      content: 'Hello!',
    };
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(avatar.src).toBe('https://example.test/me');

    const user = fixture.nativeElement.querySelector('.author') as HTMLAnchorElement;
    expect(user.textContent).toBe('@me');

    const content =
      fixture.nativeElement.querySelector('.content') as HTMLElement;
    expect(content.textContent).toBe('Hello!');
  });

  it('should render default avatar', () => {
    component.tweet = {
      author: { handle: 'me' },
      content: 'Hello!',
    };
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(avatar.src).toBe('https://fonts.gstatic.com/s/i/googlematerialicons/account_circle/v19/24px.svg');
  });
});
