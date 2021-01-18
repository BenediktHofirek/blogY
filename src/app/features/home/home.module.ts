import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ContentTableComponent } from './components/content-table/content-table.component';



@NgModule({
  declarations: [
    ContentTableComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
