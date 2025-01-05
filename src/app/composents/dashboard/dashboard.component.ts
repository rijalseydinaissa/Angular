import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { CommandeService } from '../../services/commande.service';
import { ProduitService } from '../../services/produit.service';
import { firstValueFrom } from 'rxjs';

interface Produit {
  id: number;
  nom: string;
  prix: number;
  prixAchat: number;
  quantite: number;
}

interface CommandeProduit {
  id: number;
  produit: Produit;
  quantite: number;
}

interface Commande {
  id: number;
  date: string;
  status: 'REGLE' | 'NONREGLE';
  commandeProduits: CommandeProduit[];
}

interface DashboardStats {
  title: string;
  value: string;
  icon: string;
}

interface VenteRecente {
  date: string;
  produit: string;
  quantite: number;
  prixUnitaire: string;
}

interface ProduitVendu {
  produit: string;
  quantite: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats[] = [];
  ventes: VenteRecente[] = [];
  plusVendues: ProduitVendu[] = [];
  bientotTermine: ProduitVendu[] = [];

  constructor(
    private commandeService: CommandeService,
    private produitService: ProduitService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      await Promise.all([
        this.loadStats(),
        this.loadVentesRecentes(),
        this.loadProduitsPlusVendus(),
        this.loadProduitsBientotTermines(),
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }

  private async loadStats() {
    try {
      const commandes: Commande[] = await firstValueFrom(this.commandeService.getCommandes());
      const totalCommandes = commandes.length;
      const ventesValidees = commandes.filter(cmd => cmd.status === 'REGLE').length;
      const revenus = commandes
        .filter(cmd => cmd.status === 'REGLE')
        .reduce((total, cmd) => {
          return (
            total +
            cmd.commandeProduits.reduce((sum, cp) => {
              const produit = cp.produit;
              return produit.prix && produit.prixAchat
                ? sum + (produit.prix - produit.prixAchat) * cp.quantite
                : sum;
            }, 0)
          );
        }, 0);

      this.stats = [
        { title: 'Commandes', value: totalCommandes.toString(), icon: 'commandes.png' },
        { title: 'Ventes', value: ventesValidees.toString(), icon: 'ventes.png' },
        { title: 'Revenues', value: `${revenus.toFixed(2)} fr`, icon: 'revenues.png' },
      ];
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      this.stats = [
        { title: 'Commandes', value: '0', icon: 'commandes.png' },
        { title: 'Ventes', value: '0', icon: 'ventes.png' },
        { title: 'Revenues', value: '0 fr', icon: 'revenues.png' },
      ];
    }
  }

  private async loadVentesRecentes() {
    try {
      const commandes: Commande[] = await firstValueFrom(this.commandeService.getCommandes());
      this.ventes = commandes
        .filter(cmd => cmd.status === 'REGLE' && cmd.commandeProduits?.length > 0)
        .slice(-7)
        .map(cmd => ({
          date: new Date(cmd.date).toLocaleDateString(),
          produit: cmd.commandeProduits[0]?.produit.nom || 'Produit inconnu',
          quantite: cmd.commandeProduits.reduce((sum, cp) => sum + cp.quantite, 0),
          prixUnitaire: `${cmd.commandeProduits[0]?.produit.prix || 0} fr`,
        }));
    } catch (error) {
      console.error('Erreur lors du chargement des ventes récentes:', error);
      this.ventes = [];
    }
  }

  private async loadProduitsPlusVendus() {
    try {
      const commandes: Commande[] = await firstValueFrom(this.commandeService.getCommandes());
      const ventesParProduit = new Map<number, { nom: string; totalQuantite: number }>();

      commandes
        .filter(cmd => cmd.status === 'REGLE')
        .forEach(cmd => {
          cmd.commandeProduits.forEach(cp => {
            const produit = cp.produit;
            if (ventesParProduit.has(produit.id)) {
              const existing = ventesParProduit.get(produit.id)!;
              existing.totalQuantite += cp.quantite;
            } else {
              ventesParProduit.set(produit.id, { nom: produit.nom, totalQuantite: cp.quantite });
            }
          });
        });

      this.plusVendues = Array.from(ventesParProduit.values())
        .sort((a, b) => b.totalQuantite - a.totalQuantite)
        .slice(0, 5)
        .map(({ nom, totalQuantite }) => ({
          produit: nom,
          quantite: totalQuantite,
        }));
    } catch (error) {
      console.error('Erreur lors du chargement des produits les plus vendus:', error);
      this.plusVendues = [];
    }
  }

  private async loadProduitsBientotTermines() {
    try {
      const produits = await firstValueFrom(this.produitService.getProducts());
      this.bientotTermine = produits
        .filter((p: { quantite: number | null; }) => p.quantite != null && p.quantite <= 5)
        .map((p: { nom: any; quantite: any; }) => ({
          produit: p.nom,
          quantite: p.quantite,
        }))
        .slice(0, 5);
    } catch (error) {
      console.error('Erreur lors du chargement des produits bientôt terminés:', error);
      this.bientotTermine = [];
    }
  }
}