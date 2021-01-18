import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ContentTableComponent } from './components/content-table/content-table.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent,
    ContentTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class HomeModule { }
