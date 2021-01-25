import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserMap } from 'src/app/store/models/app.models';
import { AppState, selectArticleMap, selectAuthorMap } from 'src/app/store/selectors/app.selector';

@Component({
  selector: 'home-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // private authorMapSubscription: Observable<UserMap>;
  private authorMap: UserMap = {};

  constructor(
    private store: Store<AppState>,
  ) {
    // this.authorMapSubscription = this.store.select(selectAuthorMap);
    // this.authorMapSubscription.subscribe((authorMap: UserMap) => {
    //   this.authorMap = authorMap;
    // });
   }

  ngOnInit(): void {
    
  }

}
