import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

//@Injectable({
 // providedIn: 'root'
//})
//export class DashboardService {

  // private apiURL = "http://localhost:8081";
  // private endpointCommande = 'commandes';
  // private endpointProduit = 'produits';
  // private commandesSubject = new BehaviorSubject<any[]>([]);
  // commandes$ = this.commandesSubject.asObservable();

  // constructor(private http: HttpClient,private apiService: ApiService) {
  //   this.loadInitialCommandes();
  // }

  // private loadInitialCommandes(): void {
  //   this.apiService.get<any[]>(`${this.endpointCommande}`)
  //     .subscribe(commandes => {
  //       this.commandesSubject.next(commandes);
  //     });
  // }
  // public getCommands(): Observable<any[]>{
  //   return this.apiService.get<any[]>(`${this.endpointCommande}`);
  // }
  // public createCommande(commandeData: any): Observable<any> {
  //   return this.apiService.post(`${this.endpointCommande}`, commandeData)
  //     .pipe(
  //       tap(newCommande => {
  //         const currentCommandes = this.commandesSubject.value;
  //         this.commandesSubject.next([...currentCommandes, newCommande]);
  //       })
  //     );
  // }

  // public getProduits(): Observable<any[]> {
  //   return this.apiService.get<any[]>(`${this.endpointProduit}`);
  // }
//}


// Interfaces pour typer les réponses du backend
export interface ProduitStatDto {
  nom: string;
  code: string;
  quantiteTotale: number;
}

export interface ProduitAlerteDto {
  id: number;
  nom: string;
  code: string;
  quantiteActuelle: number;
  seuilAlerte: number;
  statut: 'EN_STOCK' | 'FAIBLE_STOCK' | 'RUPTURE';
}

export interface MouvementRecentDto {
  produitNom: string;
  produitCode: string;
  type: 'ENTREE' | 'SORTIE';
  motif: 'APPROVISIONNEMENT' | 'VENTE' | 'PERTE' | 'DON' | 'TRANSFERT';
  quantite: number;
  date: string;
  utilisateur: string;
}

export interface DashboardStatsDto {
  totalCommandes: number;
  ventesValidees: number;
  commandesNonReglees: number;
  revenus: number;
  valeurTotaleStock: number;
  produitsPlusSortis: ProduitStatDto[];
  produitsEnAlerte: ProduitAlerteDto[];
  derniersApprovisionnements: MouvementRecentDto[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private endpointDashboard = 'dashboard/stats';
  private endpointMouvements = 'mouvements';

  constructor(private apiService: ApiService) {}

  public getDashboardStats(periode: string = 'all'): Observable<DashboardStatsDto> {
    return this.apiService.get<DashboardStatsDto>(
      `${this.endpointDashboard}?periode=${periode}`
    );
  }

  public createMouvement(data: any): Observable<any> {
    return this.apiService.post(this.endpointMouvements, data);
  }
}
