import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './features/auth/services/auth.service';
import { NavigationService } from './core/services/navigation.service';
import { appLoad, blogMapSuccess } from './store/actions/app.actions';
import { BlogMap } from './store/models/app.models';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private blogs = {
    "blogSoskRJoD5qWAdlxhd8mmWIN8NAb2": {
      "id": "blogSoskRJoD5qWAdlxhd8mmWIN8NAb2",
      "author_id": "SoskRJoD5qWAdlxhd8mmWIN8NAb2",
      "created_at": "Monday, March 19, 2012 4:13 PM",
      "name": "Cipromox"
    },
    "blogUab3fykKN3aBHs758QWTwbNqUEE3": {
      "id": "6002e64ab164b7da811c457f",
      "author_id": "Uab3fykKN3aBHs758QWTwbNqUEE3",
      "created_at": "Saturday, March 5, 2011 4:17 PM",
      "name": "Steelfab"
    },
    "blogczNGAwSoVUfrhC04SpNyanDzCiv2": {
      "id": "blogczNGAwSoVUfrhC04SpNyanDzCiv2",
      "author_id": "czNGAwSoVUfrhC04SpNyanDzCiv2",
      "created_at": "Monday, March 15, 2010 11:29 PM",
      "name": "Ecraze"
    },
    "blogrA2zVIKukPbpiF0mQJboPVXRFAD3": {
      "id": "blogrA2zVIKukPbpiF0mQJboPVXRFAD3",
      "author_id": "rA2zVIKukPbpiF0mQJboPVXRFAD3",
      "created_at": "Sunday, August 14, 2011 4:59 PM",
      "name": "Manglo"
    }
  };
  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private store: Store) {}

  ngOnInit() {
    // this.store.dispatch(appLoad());
    this.store.dispatch(blogMapSuccess({ blogMap: this.blogs }));
  }
  title = 'blogY';
}
