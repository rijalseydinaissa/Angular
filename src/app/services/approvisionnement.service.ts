import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable,tap } from 'rxjs';
import { ApiService } from './api.service';
import { Fournisseur } from './fournisseurs.service';
import { ProductResponse } from './produit.service';

// approvisionnement.model.ts
export interface Approvisionnement {
  id: number;
  code: string;
  dateCommande: Date;
  dateLivraisonPrevue?: Date;
  dateLivraisonEffective?: Date;
  statut: 'EN_ATTENTE' | 'CONFIRME' | 'EXPEDIE' |'LIVRE_COMPLETEMENT' | 'LIVRE_PARTIELLEMENT' | 'ANNULE';
  montantTotal: number;
  observations?: string;
  fournisseur: Fournisseur;
  produits: ApproProduit[];
}

export interface ApproProduit {
  id: number;
  produit: ProductResponse;
  quantiteCommandee: number;
  quantiteLivree: number;
  prixUnitaire: number;
  sousTotal: number;
}




@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {
  private endpoints= "approvisionnements";  
  private approvisionnementsSubject = new BehaviorSubject<Approvisionnement[]>([]);
  approvisionnements = this.approvisionnementsSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadApprovisionnements();
   }

  private loadApprovisionnements() {
    this.apiService.get<Approvisionnement[]>(this.endpoints).subscribe(data=>{
      this.approvisionnementsSubject.next(data);
      console.log(data);
    });
  }
  public getApprovisionnements(): Observable<Approvisionnement[]> {
    return this.approvisionnements;
  }
  public createApprovisionnement(approvisionnementData: Approvisionnement): Observable<Approvisionnement> {
    return this.apiService.post<Approvisionnement>(`${this.endpoints}`, approvisionnementData)
      .pipe(
        tap((newApprovisionnement: Approvisionnement) => {
          const currentApprovisionnements = this.approvisionnementsSubject.value;
          this.approvisionnementsSubject.next([...currentApprovisionnements, newApprovisionnement]);
        })
      );
  }
  public updateApprovisionnement(id: number, approvisionnementData: Approvisionnement): Observable<Approvisionnement> {
    return this.apiService.put<Approvisionnement>(`${this.endpoints}/${id}`, approvisionnementData)
      .pipe(
        tap((updatedApprovisionnement: Approvisionnement) => {
          const currentApprovisionnements = this.approvisionnementsSubject.value;
          const updatedApprovisionnements = currentApprovisionnements.map(approvisionnement =>
            approvisionnement.id === id ? updatedApprovisionnement : approvisionnement
          );
          this.approvisionnementsSubject.next(updatedApprovisionnements);
        })
      );  
  }
  public deleteApprovisionnement(id:number):Observable<Approvisionnement> {
    return this.apiService.delete<Approvisionnement>(`${this.endpoints}/${id}`).pipe(
      tap(() => {
        const currentApprovisionnements = this.approvisionnementsSubject.getValue();
        this.approvisionnementsSubject.next(currentApprovisionnements.filter(approvisionnement => approvisionnement.id !== id));
      })
    );
  }
}
