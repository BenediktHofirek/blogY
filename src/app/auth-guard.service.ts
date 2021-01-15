import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService,
        private navigationService: NavigationService) {};

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
        const isUserAuthenticated = this.authService.isAuthenticated();
        console.log('guard', state.url, isUserAuthenticated);
        if (state.url === '/login' || state.url === '/register') {
           return !isUserAuthenticated;
        }

        if (isUserAuthenticated) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}