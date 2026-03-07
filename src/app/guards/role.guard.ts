import { Injectable } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // role.guard.ts
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const forbiddenRoles = route.data['forbiddenRoles'] || [];
    const userRole = this.authService.getRole();

    console.log('Current Role:', JSON.stringify(userRole)); // voir valeur exacte
    console.log('Forbidden Roles:', JSON.stringify(forbiddenRoles));
    console.log('Is forbidden:', forbiddenRoles.includes(userRole));

    if (!userRole || forbiddenRoles.includes(userRole)) {
      this.router.navigate(['/not-authorized']);
      return false;
    }
    return true;
  }
}

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const roleGuard = inject(RoleGuard);
  return roleGuard.canActivate(route, state);
};
