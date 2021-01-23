import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/selectors/app.selector';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService,
        private store: Store<AppState>,
        private navigationService: NavigationService) {};

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | boolean {
        const isLoggedIn = this.authService.getToken();

        if (typeof isLoggedIn !== 'undefined') {
            return this.isAllowed(isLoggedIn, state.url);
        }

        return this.authService.getTokenObservable()
            .pipe(
                skip(1),
                map((jwt: string | object | null | undefined) => {
                    return this.isAllowed(jwt, state.url);
                })
            );
    }

    isAllowed(jwt: string | object | null | undefined, url: string): boolean {
        if (url === '/login' || url === '/register') {
            if (!jwt) {
                return true;
            }
            
            this.navigationService.back();
            return false;
        }

        if (jwt) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}