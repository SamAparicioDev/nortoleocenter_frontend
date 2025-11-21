import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigate(['/inicio/dashboard']);
    return false;
  }

  return true;
};

