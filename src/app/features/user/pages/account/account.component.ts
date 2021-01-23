import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/selectors/app.selector';
import { Store } from '@ngrx/store';
import { User } from 'src/app/store/models/app.models';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user: User | undefined = undefined;

  constructor(private store: Store<AppState>) {
    // this.user = this.store.select('currentUser');
  }

  ngOnInit() {
  }

}
