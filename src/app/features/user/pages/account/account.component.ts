import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/models/app.models';
import { Store } from '@ngrx/store';
import { User } from 'src/app/store/models/app.models';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from '../../components/input-dialog/input-dialog.component';
import { Apollo } from 'apollo-angular';
import { userUpdateMutation } from './graphql';
import { currentUserSuccess } from 'src/app/store/actions/app.actions';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ImageUploadDialogComponent } from '../../components/image-upload-dialog/image-upload-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  user: any = undefined;
  userSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private apollo: Apollo,
              private notification: NotificationService,
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

  uploadPhoto() {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe(newPhoto => {
      this.updateUser({ photoUrl: newPhoto });
    });
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

    dialogRef.afterClosed().subscribe(newValue => {
      this.updateUser({ [field]: newValue });
    });
  }

  updateUser(payload: object) {
    const userBeforeUpdate = {...this.user};
      this.user = {
        ...this.user,
        ...payload
      };

    this.apollo.mutate({
      mutation: userUpdateMutation,
      variables: {
        id: this.user?.id,
        ...payload
      }
    }).subscribe(
      (result: any) => {
        const updatedUser = result?.data?.userUpdate;
        if (updatedUser) {
          this.store.dispatch(currentUserSuccess({ currentUser: updatedUser }));
        } else {
          this.user = {
            ...userBeforeUpdate,
          };

          this.notification.error(
            'Something went wrong', 
            'An error occur while saving your changes. Please try again later.'
          );
        }
      },
      (err) => console.log('error', err)
    );
  }

}
