import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificacionService } from '../services/notificacion/notificacion.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const interceptorsInterceptor: HttpInterceptorFn = (req, next) => {
  const notyf = inject(NotificacionService);
  const token = sessionStorage.getItem('token');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log("INTERCEPTOR ERROR:", error);

      if (error.status === 401) {
        notyf.error('Tu sesión ha expirado o el token no es válido.');
      }
      else if (error.status >= 500) {
        notyf.error('Error en el servidor. Inténtalo más tarde.');
      }
      else {
        notyf.error('Ha ocurrido un error inesperado.');
      }

      return throwError(() => error);
    })
  );
};
