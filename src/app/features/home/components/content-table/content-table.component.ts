import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import moment from 'moment';
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
    articles: ['name', 'authorName', 'blogName', 'createdAt'],
    authors: ['name', 'author', 'createdAt'],
    blogs: ['name', 'author', 'createdAt'],
  };

  itemsPerPageOptionList = [10,20,50,100];
  isLoading: boolean;
  dataSource: any;

  constructor(private apollo: Apollo,
              private store: Store) {
    this.isLoading = false;
    this.stateSubscription = this.store.select((state: any) => state[contentTableKey]).subscribe((state: ContentTableState) => {
      this.state = state;
    });
  }

  ngOnInit() {
    this.query = this.apollo.watchQuery<any>(this.getQuery());

    this.querySubscription = this.query
      .valueChanges
      .subscribe(({ data }: {data: any}) => {
        console.log('queryResult', data[this.getQueryResultName(this.state.display)], data);
        const queryResult = data[this.getQueryResultName(this.state.display)];
        this.dataSource = queryResult.articleList;
        this.store.dispatch(stateSuccess({ collectionSize: queryResult.count }));
      });

    this.fetchMore();
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.querySubscription.unsubscribe();
  }

  getTimeframeByOption(option: string) {
    if (option === 'all') {
      return 0;
    }

    return moment().subtract(1, <any>option).unix();
  }

  getColumns() {
    return this.displayedColumnsMap[<"articles" | "authors" | "blogs">this.state.display];
  }

  handleChange(property: string, newValue: string | number) {
    console.log('change', property, newValue);
    this.store.dispatch(stateSuccess(<any>{ [property]: newValue }));
    this.fetchMore();
  }

  handlePaginatorChange(event: any) {
    console.log('paginator', event);
    this.store.dispatch(stateSuccess({ 
      pageNumber: event.pageIndex, 
      itemsPerPage: event.pageSize,
    }));
    this.fetchMore();
  }

  getQuery() {
    return { 
      query: (<any>queriesMap)[`${this.state.display.slice(0,-1)}ListQuery`],
      variables: {
        offset: this.state.itemsPerPage * this.state.pageNumber + 1,
        limit: (this.state.itemsPerPage * this.state.pageNumber) + this.state.itemsPerPage,
        filter: this.state.filter,
        sortBy: this.state.sortBy,
        orderBy: this.state.orderBy,
        timeframe: this.getTimeframeByOption(this.state.timeframe),
      }
    };
  }

  getQueryResultName(displayOption: string) {
    return `${displayOption.slice(0,-1)}List`;
  }

  fetchMore() {
    console.log('fetching', this.state);
    this.isLoading = true;
    this.query.fetchMore({ 
      ...this.getQuery(),
      updateQuery: (prev: any, { fetchMoreResult }: {fetchMoreResult: any}) => {
        this.isLoading = false;
        return fetchMoreResult;
      }
    });
  }
}