import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';
import Swal from 'sweetalert2';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    public localStorage = localStorage;
    public obj: any;
    constructor(private cookie: CookieService) { }

    // intercept request and add token
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // modify request
        if (this.localStorage.getItem('token')) {
            this.obj = {
                setHeaders: {
                    Authorization: this.cookie.get('token')
                },
                withCredentials: true
            };
        } else {
            this.obj = {
                setHeaders: {},
                withCredentials: true
            };
        }
        request = request.clone(this.obj);
        return next.handle(request)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        // http response status code
                    }
                }, error => {
                    // http response status code
                    switch (error.status) {
                        case 404: Swal.fire('Oops...', 'Not found', 'error');
                        case 403: Swal.fire('Oops...', 'Forbidden', 'error');
                    }
                })
            );
    }

}
