import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const skipRedirect = req.headers.has('Skip-Auth-Redirect');

        if (!skipRedirect) {
          switch (error.status) {
            case 401:
              this.router.navigate(['/auth/login']);
              break;
            case 403:
              this.router.navigate(['/forbidden']);
              break;
            case 500:
              console.error('Server error:', error.message);
              break;
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
