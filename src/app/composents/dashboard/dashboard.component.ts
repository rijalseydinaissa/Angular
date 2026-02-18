// import { DashboardService } from './../../services/dashboard.service';
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
// import { StatsCardComponent } from './stats-card/stats-card.component';
// import { CommandeService } from '../../services/commande.service';
// import { ProduitService } from '../../services/produit.service';
// import { firstValueFrom } from 'rxjs';

// interface Produit {
//   seuilAlerte: number;
//   id: number;
//   nom: string;
//   prix: number;
//   prixAchat: number;
//   quantite: number;
// }

// interface CommandeProduit {
//   id: number;
//   produit: Produit;
//   quantite: number;
// }

// interface Commande {
//   id: number;
//   date: string;
//   status: 'REGLE' | 'NONREGLE';
//   commandeProduits: CommandeProduit[];
// }

// interface DashboardStats {
//   title: string;
//   value: string;
//   icon: string;
// }

// interface VenteRecente {
//   date: string;
//   produit: string;
//   quantite: number;
//   prixUnitaire: string;
// }

// interface ProduitVendu {
//   seuil: any;
//   produit: string;
//   quantite: number;
// }

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, StatsCardComponent],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],
// })
// export class DashboardComponent implements OnInit {
//   stats: DashboardStats[] = [];
//   ventes: VenteRecente[] = [];
//   plusVendues: ProduitVendu[] = [];
//   bientotTermine: ProduitVendu[] = [];
//   allCommandes: Commande[] = [];

//   filterForm = new FormGroup({
//     filterType: new FormControl('all'),
//     dateJour: new FormControl(''),
//     dateDebut: new FormControl(''),
//     dateFin: new FormControl(''),
//   });
//   approvisionnements: any;

//   constructor(
//     private commandeService: CommandeService,
//     private produitService: ProduitService,
//     private dashboardService: DashboardService,
//   ) {}

//   // ngOnInit() {
//   //   this.loadDashboardData();
//   //   this.filterForm.valueChanges.subscribe(() => {
//   //     this.applyFilters();
//   //   });
//   // }
//   ngOnInit() {
//     this.loadDashboardData();
//     this.filterForm.get('filterType')?.valueChanges.subscribe(() => {
//       this.loadDashboardData(); // re-fetch depuis le backend
//     });
//   }

//   // dashboard.component.ts — remplacer loadDashboardData et applyFilters
//   async loadDashboardData() {
//     try {
//       const periode = this.filterForm.get('filterType')?.value || 'all';
//       const data = await firstValueFrom(
//         this.dashboardService.getDashboardStats(periode),
//       );
//       this.updateUI(data);
//     } catch (error) {
//       console.error('Erreur dashboard:', error);
//     }
//   }

//   private updateUI(data: any) {
//     this.stats = [
//       { title: 'Commandes', value: data.totalCommandes.toString(), icon: '🛒' },
//       {
//         title: 'Ventes validées',
//         value: data.ventesValidees.toString(),
//         icon: '✅',
//       },
//       { title: 'Revenus', value: `${data.revenus.toFixed(0)} fr`, icon: '💰' },
//       {
//         title: 'Valeur Stock',
//         value: `${data.valeurTotaleStock.toFixed(0)} fr`,
//         icon: '📦',
//       },
//     ];

//     this.plusVendues = data.produitsPlusSortis.map((p: any) => ({
//       produit: p.nom,
//       quantite: p.quantiteTotale,
//     }));

//     this.bientotTermine = data.produitsEnAlerte.map((p: any) => ({
//       produit: p.nom,
//       quantite: p.quantiteActuelle,
//       seuil: p.seuilAlerte,
//     }));

//     this.approvisionnements = data.derniersApprovisionnements;
//   }

//   // Connecter le filtre au backend

//   // async loadDashboardData() {
//   //   try {
//   //     // Charger d'abord toutes les commandes
//   //     this.allCommandes = await firstValueFrom(this.dashboardService.getCommands());

//   //     // Appliquer les filtres
//   //     this.applyFilters();

//   //     // Charger les autres données
//   //     await Promise.all([
//   //       this.loadProduitsPlusVendus(),
//   //       this.loadProduitsBientotTermines(),
//   //     ]);
//   //   } catch (error) {
//   //     console.error('Erreur lors du chargement des données:', error);
//   //   }
//   // }

//   // applyFilters() {
//   //   const filterType = this.filterForm.get('filterType')?.value;
//   //   const dateJour = this.filterForm.get('dateJour')?.value;
//   //   const dateDebut = this.filterForm.get('dateDebut')?.value;
//   //   const dateFin = this.filterForm.get('dateFin')?.value;

//   //   let filteredCommandes = [...this.allCommandes];

//   //   if (filterType === 'jour' && dateJour) {
//   //     // Filtrer pour une date spécifique choisie
//   //     const selectedDate = new Date(dateJour).toISOString().split('T')[0];
//   //     filteredCommandes = this.allCommandes.filter(cmd =>
//   //       new Date(cmd.date).toISOString().split('T')[0] === selectedDate
//   //     );
//   //   } else if (filterType === 'semaine') {
//   //     // Filtrer pour la semaine en cours
//   //     const today = new Date();
//   //     const firstDayOfWeek = new Date(today);
//   //     firstDayOfWeek.setDate(today.getDate() - today.getDay());

//   //     filteredCommandes = this.allCommandes.filter(cmd => {
//   //       const cmdDate = new Date(cmd.date);
//   //       return cmdDate >= firstDayOfWeek && cmdDate <= today;
//   //     });
//   //   } else if (filterType === 'mois') {
//   //     // Filtrer pour le mois en cours
//   //     const today = new Date();
//   //     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//   //     filteredCommandes = this.allCommandes.filter(cmd => {
//   //       const cmdDate = new Date(cmd.date);
//   //       return cmdDate >= firstDayOfMonth && cmdDate <= today;
//   //     });
//   //   } else if (filterType === 'periode' && dateDebut && dateFin) {
//   //     // Filtrer pour une période spécifique
//   //     const debut = new Date(dateDebut);
//   //     const fin = new Date(dateFin);

//   //     filteredCommandes = this.allCommandes.filter(cmd => {
//   //       const cmdDate = new Date(cmd.date);
//   //       return cmdDate >= debut && cmdDate <= fin;
//   //     });
//   //   }

//   //   // Mettre à jour les statistiques et les ventes récentes avec les commandes filtrées
//   //   this.updateStatsWithFilteredData(filteredCommandes);
//   //   this.updateVentesRecentesWithFilteredData(filteredCommandes);
//   // }

//   private updateStatsWithFilteredData(commandes: Commande[]) {
//     const totalCommandes = commandes.length;
//     const ventesValidees = commandes.filter(
//       (cmd) => cmd.status === 'REGLE',
//     ).length;
//     let revenus = 0;

//     for (const cmd of commandes.filter((cmd) => cmd.status === 'REGLE')) {
//       for (const cp of cmd.commandeProduits) {
//         const produit = cp.produit;
//         if (produit.prix) {
//           // Si vous n'avez plus le prix d'achat, calculez simplement le chiffre d'affaires
//           revenus += produit.prix * cp.quantite;
//         }
//       }
//     }

//     this.stats = [
//       {
//         title: 'Commandes',
//         value: totalCommandes.toString(),
//         icon: 'commandes.png',
//       },
//       { title: 'Ventes', value: ventesValidees.toString(), icon: 'ventes.png' },
//       {
//         title: 'Revenus',
//         value: `${revenus.toFixed(2)} fr`,
//         icon: 'revenues.png',
//       },
//     ];
//   }

//   private updateVentesRecentesWithFilteredData(commandes: Commande[]) {
//     this.ventes = commandes
//       .filter(
//         (cmd) => cmd.status === 'REGLE' && cmd.commandeProduits?.length > 0,
//       )
//       .slice(-8)
//       .map((cmd) => ({
//         date: new Date(cmd.date).toLocaleDateString(),
//         produit: cmd.commandeProduits[0]?.produit.nom || 'Produit inconnu',
//         quantite: cmd.commandeProduits.reduce(
//           (sum, cp) => sum + cp.quantite,
//           0,
//         ),
//         prixUnitaire: `${cmd.commandeProduits[0]?.produit.prix || 0} fr`,
//       }));
//   }

//   private async loadProduitsPlusVendus() {
//     try {
//       const ventesParProduit = new Map<
//         number,
//         { nom: string; totalQuantite: number ; seuil: number}
//       >();

//       this.allCommandes
//         .filter((cmd) => cmd.status === 'REGLE')
//         .forEach((cmd) => {
//           cmd.commandeProduits.forEach((cp) => {
//             const produit = cp.produit;
//             if (ventesParProduit.has(produit.id)) {
//               const existing = ventesParProduit.get(produit.id)!;
//               existing.totalQuantite += cp.quantite;
//             } else {
//               ventesParProduit.set(produit.id, {
//                 nom: produit.nom,
//                 totalQuantite: cp.quantite,
//                 seuil: produit.seuilAlerte,
//               });
//             }
//           });
//         });

//       this.plusVendues = Array.from(ventesParProduit.values())
//         .sort((a, b) => b.totalQuantite - a.totalQuantite)
//         .slice(0, 5)
//         .map(({ nom, totalQuantite, seuil }) => ({
//           produit: nom,
//           seuil: seuil,
//           quantite: totalQuantite,
//         }));
//     } catch (error) {
//       console.error(
//         'Erreur lors du chargement des produits les plus vendus:',
//         error,
//       );
//       this.plusVendues = [];
//     }
//   }

//   // private async loadProduitsBientotTermines() {
//   //   try {
//   //     const produits = await firstValueFrom(this.dashboardService.getProduits());
//   //     this.bientotTermine = produits
//   //       .filter((p: { quantite: number | null; }) => p.quantite != null && p.quantite <= 5)
//   //       .map((p: { nom: any; quantite: any; }) => ({
//   //         produit: p.nom,
//   //         quantite: p.quantite,
//   //       }))
//   //       .slice(0, 5);
//   //   } catch (error) {
//   //     console.error('Erreur lors du chargement des produits bientôt terminés:', error);
//   //     this.bientotTermine = [];
//   //   }
//   // }
// }

// // function ngOnInit() {
// //   throw new Error('Function not implemented.');
// // }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StatsCardComponent } from './stats-card/stats-card.component';
import {
  DashboardService,
  DashboardStatsDto,
  ProduitAlerteDto,
  MouvementRecentDto,
  ProduitStatDto
} from '../../services/dashboard.service';

interface DashboardStat {
  title: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  

  // ── State ──────────────────────────────────────────────
  stats: DashboardStat[] = [];
  plusVendues: ProduitStatDto[] = [];
  bientotTermine: ProduitAlerteDto[] = [];
  approvisionnements: MouvementRecentDto[] = [];
  isLoading = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  // ── Formulaire filtre ──────────────────────────────────
  filterForm = new FormGroup({
    filterType: new FormControl('all'),
  });

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Chargement initial
    this.loadDashboardData('all');

    // Rechargement automatique quand le filtre change
    this.filterForm.get('filterType')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(periode => {
        this.loadDashboardData(periode || 'all');
      });
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(periode: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboardStats(periode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: DashboardStatsDto) => {
           // ← AJOUT DU LOG
             console.log('derniersApprovisionnements:', data.derniersApprovisionnements); // ← ici

          this.updateStats(data);
          this.plusVendues = data.produitsPlusSortis;
          this.bientotTermine = data.produitsEnAlerte;
          this.approvisionnements = data.derniersApprovisionnements;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur dashboard:', err);
          this.errorMessage = 'Impossible de charger les données du dashboard.';
          this.isLoading = false;
        }
      });
  }

  private updateStats(data: DashboardStatsDto): void {
    this.stats = [
      {
        title: 'Commandes',
        value: data.totalCommandes.toString(),
        icon: '🛒'
      },
      {
        title: 'Ventes validées',
        value: data.ventesValidees.toString(),
        icon: '✅'
      },
      {
        title: 'Revenus',
        value: this.formatMontant(data.revenus),
        icon: '💰'
      },
      {
        title: 'Valeur Stock',
        value: this.formatMontant(data.valeurTotaleStock),
        icon: '📦'
      },
    ];
  }

  // ── Helpers ────────────────────────────────────────────
  formatMontant(montant: number): string {
    // Afficher le nombre complet avec séparateur de milliers
    return new Intl.NumberFormat('fr-FR').format(Math.round(montant)) + ' fr';
}

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'RUPTURE':     return 'bg-red-600';
      case 'FAIBLE_STOCK': return 'bg-orange-500';
      default:            return 'bg-green-600';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'RUPTURE':      return 'Rupture';
      case 'FAIBLE_STOCK': return 'Faible';
      default:             return 'En stock';
    }
  }
}