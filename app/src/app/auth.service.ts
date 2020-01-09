import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private me = new BehaviorSubject<any>(null);
  public onMe = this.me.asObservable();
  constructor(
    private cookie: CookieService
  ) { }

  setMe(data) {
    this.me.next(data);
  }
  clearMe() {
    this.me.next(null);
  }
  isAuthAdmin() {
    if (this.cookie.get('userId')) {
      return true;
    }
    return false;
  }
}
