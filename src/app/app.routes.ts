import { Routes } from '@angular/router';
import { ProduitComponent } from './composents/produit/produit.component';
import { DashboardComponent } from './composents/dashboard/dashboard.component';
import { CommandesComponent } from './composents/commandes/commandes.component';
import { StockComponent } from './composents/stock/stock.component';
import { LoginComponent } from './composents/login/login.component';


export const routes: Routes = [
    {path:"produit", component:ProduitComponent},
    {path:"dashboard",component:DashboardComponent},
    {path:"commandes",component:CommandesComponent},
    {path:"stock",component:StockComponent},
    {path:"login",component:LoginComponent},
    {path:"register",component:LoginComponent},
];
