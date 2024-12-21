import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StatsCardComponent } from "./stats-card/stats-card.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Ventes récentes
 // Ventes récentes
 ventes = [
  { date: '12/01/2025', produit: 'Pomme', quantite: 14, prixUnitaire: '250 fr' },
  { date: '13/01/2025', produit: 'Banane', quantite: 20, prixUnitaire: '200 fr' },
  { date: '14/01/2025', produit: 'Orange', quantite: 30, prixUnitaire: '300 fr' },
  { date: '14/01/2025', produit: 'Orange', quantite: 30, prixUnitaire: '300 fr' },
  { date: '14/01/2025', produit: 'Orange', quantite: 30, prixUnitaire: '300 fr' },
  { date: '14/01/2025', produit: 'Orange', quantite: 30, prixUnitaire: '300 fr' },
  { date: '14/01/2025', produit: 'Orange', quantite: 30, prixUnitaire: '300 fr' },
];

// Produits les plus vendus
plusVendues = [
  { produit: "Pomme d'Adam", quantite: 100000 },
  { produit: 'Banane', quantite: 50000 },
  { produit: 'Orange', quantite: 30000 },
  { produit: 'Orange', quantite: 30000 },
  { produit: 'Orange', quantite: 30000 },
];

// Produits bientôt terminés
bientotTermine = [
  { produit: "Pomme d'Adam", quantite: 5 },
  { produit: 'Banane', quantite: 3 },
  { produit: 'Orange', quantite: 2 },
  { produit: 'Orange', quantite: 2 },
  { produit: 'Orange', quantite: 2 },
];

}
