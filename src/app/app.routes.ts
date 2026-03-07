import { ApprovisionnementComponent } from './composents/approvisionnement/approvisionnement.component';
import { Routes } from '@angular/router';
import { ProduitComponent } from './composents/produit/produit.component';
import { DashboardComponent } from './composents/dashboard/dashboard.component';
import { CommandesComponent } from './composents/commandes/commandes.component';
import { StockComponent } from './composents/stock/stock.component';
import { LoginComponent } from './composents/login/login.component';
import { CaiseComponent } from './composents/caise/caise.component';
import { RegisterComponent } from './composents/register/register.component';
import { NotAuthorizedComponent } from './composents/not-authorized/not-authorized.component';
import { CategorieComponent } from './composents/categorie/categorie.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Produit page - only accessible to ADMIN and GESTIONNAIRE_STOCK
  {
    path: 'produit',
    component: ProduitComponent,
  },

  // Dashboard - only accessible to ADMIN

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { forbiddenRoles: ['ROLE_GESTIONNAIRE_STOCK', 'ROLE_USER'] },
  },

  // Commandes page - accessible to Gestionnaire and ADMIN
  {
    path: 'commandes',
    component: CommandesComponent,
    canActivate: [authGuard, roleGuard],
    data: { forbiddenRoles: ['ROLE_USER'] },
  },
  { path: 'categories',
     component: CategorieComponent,
     canActivate: [authGuard, roleGuard],
     data: { forbiddenRoles: ['ROLE_USER'] },},
  { path: 'approvisionnement',
     component: ApprovisionnementComponent,
     canActivate: [authGuard, roleGuard],
     data: { forbiddenRoles: ['ROLE_USER'] },},

  // Stock page - only accessible to ADMIN
  {
    path: 'stock',
    component: StockComponent,
    // canActivate: [AuthGuard, RoleGuard],
  },

  { path: 'register', component: RegisterComponent },

  // Caisse page - only accessible to ADMIN
  {
    path: 'caise',
    component: CaiseComponent,
    // canActivate: [AuthGuard, RoleGuard],
  },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
