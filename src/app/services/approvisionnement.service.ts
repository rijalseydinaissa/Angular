// approvisionnement.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Fournisseur } from './fournisseurs.service';
import { ProductResponse } from './produit.service';

// Interfaces pour les données
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
  approvisionnementProduits?: ApproProduit[];
}

export interface ApproProduit {
  id: number;
  produit: ProductResponse;
  quantiteCommandee: number;
  quantiteLivree: number;
  prixUnitaire: number;
  sousTotal: number;
}

// DTOs pour les requêtes (correspondant au backend)
interface CreateApprovisionnementDto {
  fournisseurId: number;
  dateLivraisonPrevue?: string; // ISO string format
  observations?: string;
  produits: {
    produitId: number;
    quantiteCommandee: number;
    prixUnitaire: number;
  }[];
}

interface UpdateApprovisionnementDto {
  id?: number;
  fournisseurId: number;
  dateLivraisonPrevue?: string; // ISO string format
  dateLivraisonEffective?: string; // ISO string format
  statut?: string;
  observations?: string;
  produits: {
    produitId: number;
    quantiteCommandee: number;
    quantiteLivree?: number;
    prixUnitaire: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {
  private endpoints = "approvisionnements";  
  private approvisionnementsSubject = new BehaviorSubject<Approvisionnement[]>([]);
  approvisionnements = this.approvisionnementsSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadApprovisionnements();
  }

  private loadApprovisionnements() {
    this.apiService.get<Approvisionnement[]>(this.endpoints).subscribe({
      next: (data) => {
        this.approvisionnementsSubject.next(data);
        console.log('Approvisionnements chargés:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des approvisionnements:', error);
      }
    });
  }

  public getApprovisionnements(): Observable<Approvisionnement[]> {
    return this.approvisionnements;
  }

  public createApprovisionnement(approData: any): Observable<Approvisionnement> {
    // Transformation des données pour correspondre au DTO backend
    const createDto: CreateApprovisionnementDto = {
      fournisseurId: approData.fournisseurId,
      dateLivraisonPrevue: approData.dateLivraisonPrevue ? 
        new Date(approData.dateLivraisonPrevue).toISOString() : undefined,
      observations: approData.observations || '',
      produits: approData.produits.map((p: any) => ({
        produitId: p.produitId,
        quantiteCommandee: p.quantiteCommandee,
        prixUnitaire: p.prixUnitaire
      }))
    };

    console.log('Données envoyées pour création:', createDto);

    return this.apiService.post<Approvisionnement>(`${this.endpoints}`, createDto)
      .pipe(
        tap((newApprovisionnement: Approvisionnement) => {
          const currentApprovisionnements = this.approvisionnementsSubject.value;
          this.approvisionnementsSubject.next([...currentApprovisionnements, newApprovisionnement]);
        })
      );
  }

  public updateApprovisionnement(id: number, approData: any): Observable<Approvisionnement> {
    // Transformation des données pour correspondre au DTO de mise à jour
    const updateDto: UpdateApprovisionnementDto = {
      id: id,
      fournisseurId: approData.fournisseurId,
      dateLivraisonPrevue: approData.dateLivraisonPrevue ? 
        new Date(approData.dateLivraisonPrevue).toISOString() : undefined,
      dateLivraisonEffective: approData.dateLivraisonEffective ? 
        new Date(approData.dateLivraisonEffective).toISOString() : undefined,
      statut: approData.statut,
      observations: approData.observations || '',
      produits: approData.produits.map((p: any) => ({
        produitId: p.produitId,
        quantiteCommandee: p.quantiteCommandee,
        quantiteLivree: p.quantiteLivree || 0,
        prixUnitaire: p.prixUnitaire
      }))
    };

    console.log('Données envoyées pour mise à jour:', updateDto);

    return this.apiService.put<Approvisionnement>(`${this.endpoints}/${id}`, updateDto)
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

  public deleteApprovisionnement(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoints}/${id}`).pipe(
      tap(() => {
        const currentApprovisionnements = this.approvisionnementsSubject.getValue();
        this.approvisionnementsSubject.next(
          currentApprovisionnements.filter(approvisionnement => approvisionnement.id !== id)
        );
      })
    );
  }
}