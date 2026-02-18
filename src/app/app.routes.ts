import { ApprovisionnementComponent } from './composents/approvisionnement/approvisionnement.component';
import { Routes } from '@angular/router';
import { ProduitComponent } from './composents/produit/produit.component';
import { DashboardComponent } from './composents/dashboard/dashboard.component';
import { CommandesComponent } from './composents/commandes/commandes.component';
import { StockComponent } from './composents/stock/stock.component';
import { LoginComponent } from './composents/login/login.component';
import { CaiseComponent } from './composents/caise/caise.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './composents/register/register.component';
import { NotAuthorizedComponent } from './composents/not-authorized/not-authorized.component';
import { RoleGuard } from './guards/role.guard';
import { CategorieComponent } from './composents/categorie/categorie.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  
  // Produit page - only accessible to ADMIN and SERVEUR
  {
    path: "produit",
    component: ProduitComponent,
  },
  
  // Dashboard - only accessible to ADMIN
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { forbiddenRoles: ['ROLE_GESTIONNAIRE_STOCK', 'ROLE_USER'] }
  },
  
  // Commandes page - accessible to SERVEUR and ADMIN
  {
    path: "commandes",
    component: CommandesComponent,
    canActivate: [AuthGuard]
  },
  { path: "categories", component: CategorieComponent },
  { path: "approvisionnement", component: ApprovisionnementComponent },


  
  // Stock page - only accessible to ADMIN
  {
    path: "stock",
    component: StockComponent,
    // canActivate: [AuthGuard, RoleGuard],
    // data: { forbiddenRoles: ['ROLE_CUISINIER', 'ROLE_SERVEUR'] }
  },
  
  { path: "register", component: RegisterComponent },
  
  // Caisse page - only accessible to ADMIN
  {
    path: "caise",
    component: CaiseComponent,
    // canActivate: [AuthGuard, RoleGuard],
    // data: { forbiddenRoles: ['ROLE_CUISINIER', 'ROLE_SERVEUR'] }
  },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];