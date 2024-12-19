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
  ventes = [
    { date: '12/01/2025', produit: 'Chaise anglaise', quantite: 10, prix: 15000 },
    { date: '12/01/2025', produit: 'Chaise anglaise', quantite: 10, prix: 15000 },
    { date: '12/01/2025', produit: 'Chaise anglaise', quantite: 10, prix: 15000 },
    { date: '12/01/2025', produit: 'Chaise anglaise', quantite: 10, prix: 15000 },
    { date: '12/01/2025', produit: 'Chaise anglaise', quantite: 10, prix: 15000 }
  ];

  // Produits
  produitsPlusVendus = [
    { nom: 'Papier peint', quantite: 1000 },
    { nom: 'Bois', quantite: 1000 },
    { nom: 'Ordinateur', quantite: 1000 }
  ];

  produitsRupture = [
    { nom: 'Papier peint' },
    { nom: 'Peinture' },
    { nom: 'Papier toilette' }
  ];
}
