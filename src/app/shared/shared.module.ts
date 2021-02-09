import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material-module';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarRatingModule } from "ngx-bar-rating";
import { RatingComponent } from './components/rating/rating.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    RatingComponent,
  ],
  imports: [
    BarRatingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports: [
    LoadingSpinnerComponent,
    RatingComponent,
    
    BarRatingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ]
})
export class SharedModule { }
