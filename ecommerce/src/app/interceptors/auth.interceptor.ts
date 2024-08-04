import { HttpInterceptorFn } from '@angular/common/http';
import { from, of, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(
    of(localStorage.getItem('token'))
  ).pipe(
    switchMap(token => {
      if (token) {
        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next(clonedRequest);
      }
      return next(req);
    })
  );
};