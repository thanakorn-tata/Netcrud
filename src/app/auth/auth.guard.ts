import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
=======
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
import { AuthService } from '../services/test/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

<<<<<<< HEAD
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
=======
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
      return false;
    }

    const requiredRole = route.data['role'];
    if (requiredRole && this.authService.getRole() !== requiredRole) {
      this.router.navigate(['/']);
      return false;
    }
<<<<<<< HEAD
=======

>>>>>>> 15557ce36fc6be6a95003b0a49c0a3038c5c359f
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) return true;
    this.router.navigate(['/']);
    return false;
  }
}
