import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
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
    "users",
    "blogs"
  ];

  sortByOptionMap = {
    articles: [
      {
        name: 'Name',
        id: 'name',
      },{
        name: 'Published',
        id: 'createdAt',
      },
    ],
    users: [
      {
        name: 'Username',
        id: 'username',
      },{
        name: 'First name',
        id: 'firstName',
      },{
        name: 'Last name',
        id: 'lastName',
      },{
        name: 'Registered',
        id: 'createdAt',
      },
    ],
    blogs: [
      {
        name: 'Name',
        id: 'name',
      },{
        name: 'Created',
        id: 'createdAt',
      },
    ],
  };
  
  timeframeOptionList = [
    "day",
    "week",
    "month",
    "quarter",
    "year",
    "all",
  ];
  displayedColumnsMap = {
    articles: ['name', 'authorUsername', 'blogName', 'published'],// 'views', 'rating'],
    users: ['username','firstName','lastName', 'registered'],// 'averageViews', 'rating'],
    blogs: ['name', 'authorUsername', 'created'],// 'averageViews', 'rating'],
  };

  itemsPerPageOptionList = [10,20,50,100];
  isLoading: boolean;
  dataSource: any;

  constructor(private apollo: Apollo,
              private router: Router,
              private store: Store) {
    this.isLoading = false;
    this.stateSubscription = this.store.select((state: any) => state[contentTableKey]).subscribe((state: ContentTableState) => {
      this.state = state;
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }

  handleRowClick(row: any) {
    let url = '/';
    switch(row.__typename) {
      case "Article":
        url = `/user/${row.author.username}/blog/${row.blog.name}/article/${row.name}`;
        break;
      case "Blog":
        url = `/user/${row.author.username}/blog/${row.name}`;
        break;
      case "User":
        url = `/user/${row.username}`;
        break;
      default: break;
    }
    console.log('url', url);
    this.router.navigateByUrl(url);
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

  getSortByOptionList() {
    return this.sortByOptionMap[<"articles" | "users" | "blogs">this.state.display];
  }

  getColumns() {
    return this.displayedColumnsMap[<"articles" | "users" | "blogs">this.state.display];
  }

  handleChange(property: string, newValue: string | number) {
    this.store.dispatch(stateSuccess(<any>{ [property]: newValue }));
    this.fetchData();
  }

  handleDisplayChange(newDisplay: "articles" | "users" | "blogs") {
    this.store.dispatch(stateSuccess({
      display: newDisplay,
      pageIndex: 0,
      filter: '',
      sortBy: this.sortByOptionMap[newDisplay][0].id,
      filterPageIndex: 0,
    }));
    this.fetchData();
  }

  handleFilterChange(newValue: string) {
    const payload: ContentTableState = { 
      filter: newValue,
    };
   
    if (!newValue) {
      payload.filterPageIndex = 0;
    }
    this.store.dispatch(stateSuccess(payload));
    this.fetchData();
  }

  handlePaginatorChange(
    {pageIndex: newPageIndex, pageSize: newPageSize}:
    {pageIndex: number, pageSize: number}
    ) {
    if (newPageSize !== this.state.pageSize) {
      this.isLoading = true;
      const payload : { [key: string]: number} = {
        pageSize: newPageSize,
        pageIndex: Math.floor(
          (this.state.pageIndex * this.state.pageSize) / newPageSize
        ),
      };

      if (this.state.filter) {
        payload.filterPageIndex = Math.floor(
          (this.state.pageIndex * this.state.pageSize) / newPageSize
        );
      }

      this.store.dispatch(stateSuccess(payload));
    } else {
      this.store.dispatch(stateSuccess({ 
        [this.state.filter ? 'filterPageIndex' : 'pageIndex']: newPageIndex,
      }));
    }
    
    this.fetchData();
  }

  getQuery({
    display,
    pageSize,
    pageIndex,
    filterPageIndex,
    filter,
    sortBy,
    orderBy,
    timeframe
  }: any) {
    const currentPageIndex = filter ? filterPageIndex : pageIndex;
    return { 
      query: (<any>queriesMap)[`${display.slice(0,-1)}ListQuery`],
      variables: {
        offset: pageSize * currentPageIndex + 1,
        limit: (pageSize * currentPageIndex) + pageSize,
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
    this.apollo.query({ 
      ...this.getQuery(this.state)
    }).subscribe(this.handleFetchResult.bind(this));

    //prefetch next page
    this.apollo.query({ 
      ...this.getQuery({
        ...this.state,
        pageIndex: this.state[this.state.filter ? 'filterPageIndex' : 'pageIndex'] + 1,
      }),
    });
  }

  handleFetchResult({ data }: {data: any}) {
    const resultName = this.getQueryResultName(this.state.display);
    const queryResult = data[resultName];
    this.dataSource = queryResult[resultName];
    console.log(this.dataSource);
    this.isLoading = false;
    this.store.dispatch(stateSuccess({ collectionSize: queryResult.count }));
  }
}