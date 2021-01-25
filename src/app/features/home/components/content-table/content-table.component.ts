import { Component, OnDestroy, SimpleChanges } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import queriesMap from './graphql';
import { stateSuccess } from './store/content-table.actions';
import { ContentTableState } from './store/content-table.models';
import { contentTableKey } from './store/content-table.reducers';

@Component({
  selector: 'home-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.scss']
})

export class ContentTableComponent implements OnDestroy {
  state: any;
  stateSubscription: Subscription;
  displayOptionList = [
    "articles",
    "authors",
    "blogs"
  ];
  sortByOptionList = [
    "newest",
    "mostRead",
    "highestRated"
  ];
  timeframeOptionList = [
    "day",
    "week",
    "month",
    "quarter",
    "year",
    "all",
  ];
  displayedColumnsMap = {
    articles: ['name', 'blogName', 'createdAt'],
    authors: ['name', 'author', 'createdAt'],
    blogs: ['name', 'author', 'createdAt'],
  };

  itemsPerPageOptionList = [10,20,50,100];

  dataSource: any;

  constructor(private apollo: Apollo,
              private store: Store) {
    this.stateSubscription = this.store.select((state: any) => state[contentTableKey]).subscribe((state: ContentTableState) => {
      this.state = state;
      this.handleStateUpdate();
    });
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }

  handleChange(property: string, newValue: string | number) {
    console.log('change', property, newValue);
    this.store.dispatch(stateSuccess(<any>{ [property]: newValue }));
  }

  handleStateUpdate() {
    // this.apollo.query<any>({
    //   query: (<any>queriesMap)[`${this.state.display}Query`],
    // }).subscribe(({ data }) => {
    //   this.dataSource = new MatTableDataSource(<any>Object.values(data)[0]);
    // });
  }
}