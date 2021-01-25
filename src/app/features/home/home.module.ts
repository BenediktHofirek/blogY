import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { HomeComponent } from './home.component';
import { ContentTableComponent } from './components/content-table/content-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import contentTableReducer, { contentTableKey } from './components/content-table/store/content-table.reducers';


@NgModule({
  declarations: [
    HomeComponent,
    ContentTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(contentTableKey, contentTableReducer),
  ],
})
export class HomeModule { }
