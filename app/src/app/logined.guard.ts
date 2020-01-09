import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginedGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (this.auth.isAuthAdmin()) {
      return true;
    } else {
      this.router.navigate(['signin']);
      return false;
    }

  }
}
