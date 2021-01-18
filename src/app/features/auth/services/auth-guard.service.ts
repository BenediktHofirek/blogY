import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService,
        private navigationService: NavigationService) {};

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | boolean {
        const currentUser = this.authService.getCurrentUser();

        if (typeof currentUser !== 'undefined') {
            return this.isAllowed(currentUser, state.url);
        }

        return this.authService.userSubject.asObservable().pipe(
            skip(1),
            map((user: firebase.User | null | undefined) => {
                return this.isAllowed(user, state.url);
            })
        );
    }

    isAllowed(user: firebase.User | null | undefined, url: string): boolean {
        if (url === '/login' || url === '/register') {
            if (!user) {
                return true;
            }
            
            this.navigationService.back();
            return false;
        }

        if (user) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}