import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Injectable } from '@angular/core'
import { Router, NavigationEnd, NavigationCancel } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        if (this.history[this.history.length - 1] !== event.url) {
          this.history.push(event.url);
        }
      }
    })
  }

  back(): void {
    this.history.pop();
    const historyLength = this.history.length;
    if (historyLength > 1) {
      let index = 0;
      let previousPage = '';
      do {
        index -= 1;
        previousPage = this.history[historyLength + index];
      } while(
        Math.abs(index) < historyLength &&
        ['/login', '/register'].includes(previousPage)
      );
      
      this.history = this.history.slice(0, index);
      if (Math.abs(index) === historyLength && ['/login', '/register'].includes(previousPage)) {
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl(previousPage);
      }
    } else {
      this.router.navigateByUrl('/')
    }
  }
}