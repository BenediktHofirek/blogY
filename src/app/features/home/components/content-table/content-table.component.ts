import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import moment from 'moment';
import { Subject, Subscription, Observable } from 'rxjs';
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
  isLoadingSubscription: Subscription;
  dataSourceSubject: Subject<any>;

  constructor(private apollo: Apollo,
              private store: Store) {
    this.isLoading = false;
    this.dataSourceSubject = new Subject();
    this.isLoadingSubscription = this.dataSourceSubject.subscribe(() => this.isLoading = false);
    this.stateSubscription = this.store.select((state: any) => state[contentTableKey]).subscribe((state: ContentTableState) => {
      this.state = state;
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
  }

  formatDate(date: string) {
    return moment(date).format('DD. MM. YYYY');
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
    this.fetchData();
  }

  handlePaginatorChange(
    {pageIndex: newPageIndex, pageSize: newPageSize}:
    {pageIndex: number, pageSize: number}
    ) {
    if (newPageSize !== this.state.pageSize) {
      this.isLoading = true;
      this.store.dispatch(stateSuccess({ 
        pageSize: newPageSize,
        pageIndex: Math.floor(
          (this.state.pageIndex * this.state.pageSize) / newPageSize
        ),
      }));
    } else {
      this.store.dispatch(stateSuccess({ 
        pageIndex: newPageIndex,
      }));
    }
    
    this.fetchData();
  }

  getQuery({
    display,
    pageSize,
    pageIndex,
    filter,
    sortBy,
    orderBy,
    timeframe
  }: any) {
    return { 
      query: (<any>queriesMap)[`${display.slice(0,-1)}ListQuery`],
      variables: {
        offset: pageSize * pageIndex + 1,
        limit: (pageSize * pageIndex) + pageSize,
        filter: filter,
        sortBy: sortBy,
        orderBy: orderBy,
        timeframe: this.getTimeframeByOption(timeframe),
      }
    };
  }

  getQueryResultName(displayOption: string) {
    return `${displayOption.slice(0,-1)}List`;
  }

  fetchData() {
    console.log('fetching', this.state);
    this.apollo.query({ 
      ...this.getQuery(this.state)
    }).subscribe(this.handleFetchResult.bind(this));

    //prefetch next page
    this.apollo.query({ 
      ...this.getQuery({
        ...this.state,
        pageIndex: this.state.pageIndex + 1,
      }),
    }).subscribe(() => console.log('prefetch',this.getQuery({
      ...this.state,
      pageIndex: this.state.pageIndex + 1,
    })));
  }

  handleFetchResult({ data }: {data: any}) {
    console.log('queryResult', data[this.getQueryResultName(this.state.display)], data);
      const queryResult = data[this.getQueryResultName(this.state.display)];
      this.dataSourceSubject.next(queryResult.articleList);
      this.store.dispatch(stateSuccess({ collectionSize: queryResult.count }));
  }
}