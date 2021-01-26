import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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

export class ContentTableComponent implements OnInit, OnDestroy {
  state: any;
  stateSubscription: Subscription;
  querySubscription: any;
  query: any;

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
    });
  }

  ngOnInit() {
    this.query = this.apollo.watchQuery<any>({
      query: (<any>queriesMap)[`${this.state.display}Query`],
      variables: {
        offset: this.state.itemsPerPage * this.state.pageNumber,
        limit: this.state.itemsPerPage,
        filter: this.state.filter,
        sortBy: this.state.sortBy,
        orderBy: this.state.orderBy,
        timeframe: this.state.timeframe,
      },
    });

    this.querySubscription = this.query
      .valueChanges
      .subscribe(({ data }: {data: any}) => {
        console.log('queryResult', Object.values(data)[0]);
        this.dataSource = new MatTableDataSource(<any>Object.values(data)[0]);
      });

    this.fetchMore();
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.querySubscription.unsubscribe();
  }

  handleChange(property: string, newValue: string | number) {
    console.log('change', property, newValue);
    this.store.dispatch(stateSuccess(<any>{ [property]: newValue }));
    this.fetchMore();
  }

  fetchMore() {
    this.query.fetchMore({
      query: (<any>queriesMap)[`${this.state.display}Query`],
      variables: {
        offset: this.state.itemsPerPage * this.state.pageNumber,
        limit: this.state.itemsPerPage,
        filter: this.state.filter,
        sortBy: this.state.sortBy,
        orderBy: this.state.orderBy,
        timeframe: this.state.timeframe,
      },
      updateQuery: (prev: any, { fetchMoreResult }: {fetchMoreResult: any}) => {
        return fetchMoreResult;
      }
    });
  }
}