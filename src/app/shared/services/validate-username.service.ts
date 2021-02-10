import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { first } from 'rxjs/operators';
import { AppState } from 'src/app/store/models/app.models';

const userQuery = gql`
  query UserQuery(
      $username: String,
    ) {
    user(
      username: $username,
    ) {
      id
      username
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ValidateUsernameService implements AsyncValidator{

  constructor(private apollo: Apollo,
              private store: Store<AppState>,
    ) { 
      this.validate.bind(this);
    }

  validate = (control: FormControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve, reject) => {
      this.apollo.query({
        query: userQuery,
        variables: {
          username: control.value,
        }
      }).subscribe(
        ({ data }: {data: any}) => {
          if (data.user) {
            this.store.select(state => state.currentUser).pipe(first()).subscribe((currentUser) => {
              if (data.user.username === currentUser.username) {
                resolve(null);
              } else {
                resolve({ 'usernameAlreadyExists': true });
              }
            });
          } else {
            resolve(null);
          }
        },
        (err) => {
          console.log('error', err);
        }
      );
    });
  }
}
