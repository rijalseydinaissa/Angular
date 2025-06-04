// statut-validation.service.ts
import { Injectable } from '@angular/core';
import { StatutApprovisionnement } from '../models/statut-approvisionnement.enum';

@Injectable({ providedIn: 'root' })
export class StatutValidationService {
  
  private readonly transitionsAutorisees: Record<StatutApprovisionnement, StatutApprovisionnement[]> = {
    [StatutApprovisionnement.EN_ATTENTE]: [
      StatutApprovisionnement.CONFIRME,
      StatutApprovisionnement.ANNULE
    ],
    [StatutApprovisionnement.CONFIRME]: [
      StatutApprovisionnement.LIVRE_PARTIELLEMENT,
      StatutApprovisionnement.LIVRE_COMPLETEMENT,
      StatutApprovisionnement.ANNULE
    ],
    [StatutApprovisionnement.LIVRE_PARTIELLEMENT]: [
      StatutApprovisionnement.LIVRE_COMPLETEMENT,
      StatutApprovisionnement.ANNULE
    ],
    [StatutApprovisionnement.LIVRE_COMPLETEMENT]: [],
    [StatutApprovisionnement.ANNULE]: []
  };
  

  constructor() {}

  // Vérifie si la transition entre deux statuts est autorisée
  isTransitionValide(current: StatutApprovisionnement, next: StatutApprovisionnement): boolean {
    return this.transitionsAutorisees[current].includes(next);
  }

  // Vérifie si un approvisionnement peut être modifié selon son statut
  peutEtreModifie(statut: StatutApprovisionnement): boolean {
    return statut !== StatutApprovisionnement.LIVRE_COMPLETEMENT && 
           statut !== StatutApprovisionnement.ANNULE;
  }

  // Vérifie si un approvisionnement peut être supprimé selon son statut
  peutEtreSupprime(statut: StatutApprovisionnement): boolean {
    return statut === StatutApprovisionnement.EN_ATTENTE;
  }

  // Obtient les actions disponibles pour un statut donné
  getActionsDisponibles(statut: StatutApprovisionnement): { action: string, nextStatut: StatutApprovisionnement, label: string }[] {
    const actions = [];
    
    if (this.isTransitionValide(statut, StatutApprovisionnement.CONFIRME)) {
      actions.push({
        action: 'CONFIRMER',
        nextStatut: StatutApprovisionnement.CONFIRME,
        label: 'Confirmer la commande'
      });
    }

    if (this.isTransitionValide(statut, StatutApprovisionnement.LIVRE_PARTIELLEMENT)) {
      actions.push({
        action: 'LIVRER_PARTIELLEMENT',
        nextStatut: StatutApprovisionnement.LIVRE_PARTIELLEMENT,
        label: 'Livraison partielle'
      });
    }

    if (this.isTransitionValide(statut, StatutApprovisionnement.LIVRE_COMPLETEMENT)) {
      actions.push({
        action: 'LIVRER_COMPLETEMENT',
        nextStatut: StatutApprovisionnement.LIVRE_COMPLETEMENT,
        label: 'Livraison complète'
      });
    }

    if (this.isTransitionValide(statut, StatutApprovisionnement.ANNULE)) {
      actions.push({
        action: 'ANNULER',
        nextStatut: StatutApprovisionnement.ANNULE,
        label: 'Annuler la commande'
      });
    }

    return actions;
  }
}