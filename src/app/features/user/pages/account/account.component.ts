import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/models/app.models';
import { Store } from '@ngrx/store';
import { User } from 'src/app/store/models/app.models';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from '../../components/input-dialog/input-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  user: User | undefined = undefined;
  userSubscription: Subscription;

  constructor(private store: Store<AppState>,
              public dialog: MatDialog) {
    this.userSubscription = this.store.select('currentUser').subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  edit(field: string) {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      data: {
        initialValue: (<any>this.user)[field],
        name: field,
        type: field === 'email' ? 'email' : 'text'
      },
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
