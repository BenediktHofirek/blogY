import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from './services/navigation.service';
import { HeaderComponent } from './components/header/header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    HeaderComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    HeaderComponent,
    PageNotFoundComponent,
  ]
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() coreModule: CoreModule,
              private navigationService: NavigationService) {
    if (coreModule) {
      throw new TypeError(`CoreModule is imported twice.`)
    }
  }
}
