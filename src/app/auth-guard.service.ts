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
        const currentUser = this.authService.getCurrentUser();
        console.log('guard', state.url, currentUser);
        if (state.url === '/login' || state.url === '/register') {
           return !currentUser;
        }

        if (currentUser) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}