import { Routes } from '@angular/router';
import { ProduitComponent } from './composents/produit/produit.component';
import { DashboardComponent } from './composents/dashboard/dashboard.component';
import { CommandesComponent } from './composents/commandes/commandes.component';


export const routes: Routes = [
    {path:"produit", component:ProduitComponent},
    {path:"dashboard",component:DashboardComponent},
    {path:"commandes",component:CommandesComponent}
];
