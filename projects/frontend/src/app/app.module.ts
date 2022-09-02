import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TweetComponent } from './tweet/tweet.component';
import { CreateTweetComponent } from './create-tweet/create-tweet.component';
import { tweetServiceToken } from './tweet.service';
import { backendOriginToken } from './backend-origin';
import { TweetBackendService } from './tweet-backend.service';

@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
    CreateTweetComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
  ],
  providers: [
    { provide: tweetServiceToken, useClass: TweetBackendService },
    { provide: backendOriginToken, useValue: 'http://localhost:8000' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
