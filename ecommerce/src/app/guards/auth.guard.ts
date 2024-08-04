import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthenticated = authService.isAuthenticated();

  if(!isAuthenticated) router.navigateByUrl('/auth');

  return isAuthenticated;
};
