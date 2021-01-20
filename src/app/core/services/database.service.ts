import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  collectionMap = {
    articles: 'articles',
    blogs: 'blogs',
    users: 'users',
  }

  constructor(private firestore: AngularFirestore) {
  }
  
  read(collection: string) {
    return this.firestore
      .collection(collection)
      .get()
      .pipe(map((querySnapshot: any) => {
        return querySnapshot.docs.map((doc: any) => doc.data());
      }))
      .toPromise();
  }

  write(collection: string, value: object): any {
    const newRecordRef: { [key: string]: any } = this.firestore.collection(collection).doc();
    return newRecordRef.set({
      ...value,
      id: newRecordRef.id,
    });
  }

  update(collection: string, recordId: string, newValue: object): any {
    return this.firestore.collection(collection).doc(recordId).update(newValue);
  }

  delete(collection: string, recordId: string): any {
    return this.firestore.collection(collection).doc(recordId).delete();
  }
}
