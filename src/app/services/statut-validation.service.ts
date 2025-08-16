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
      StatutApprovisionnement.EXPEDIE, // AJOUTÉ
      StatutApprovisionnement.LIVRE_PARTIELLEMENT,
      StatutApprovisionnement.LIVRE_COMPLETEMENT,
      StatutApprovisionnement.ANNULE
    ],
    // AJOUTÉ : Transitions pour EXPEDIE
    [StatutApprovisionnement.EXPEDIE]: [
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

  // MODIFIÉ : Typage plus strict pour les actions
  getActionsDisponibles(statut: StatutApprovisionnement): { 
    action: 'CONFIRMER' | 'EXPEDIE' | 'LIVRER_PARTIELLEMENT' | 'LIVRER_COMPLETEMENT' | 'ANNULER', 
    nextStatut: StatutApprovisionnement, 
    label: string 
  }[] {
    const actions = [];

    if (this.isTransitionValide(statut, StatutApprovisionnement.CONFIRME)) {
      actions.push({
        action: 'CONFIRMER' as const, // AJOUTÉ : as const pour le typage strict
        nextStatut: StatutApprovisionnement.CONFIRME,
        label: 'Confirmer la commande'
      });
    }

    // AJOUTÉ : Action pour expédier
    if (this.isTransitionValide(statut, StatutApprovisionnement.EXPEDIE)) {
      actions.push({
        action: 'EXPEDIE' as const,
        nextStatut: StatutApprovisionnement.EXPEDIE,
        label: 'Expédier la commande'
      });
    }

    if (this.isTransitionValide(statut, StatutApprovisionnement.LIVRE_PARTIELLEMENT)) {
      actions.push({
        action: 'LIVRER_PARTIELLEMENT' as const,
        nextStatut: StatutApprovisionnement.LIVRE_PARTIELLEMENT,
        label: 'Livraison partielle'
      });
    }

    if (this.isTransitionValide(statut, StatutApprovisionnement.LIVRE_COMPLETEMENT)) {
      actions.push({
        action: 'LIVRER_COMPLETEMENT' as const,
        nextStatut: StatutApprovisionnement.LIVRE_COMPLETEMENT,
        label: 'Livraison complète'
      });
    }

    if (this.isTransitionValide(statut, StatutApprovisionnement.ANNULE)) {
      actions.push({
        action: 'ANNULER' as const,
        nextStatut: StatutApprovisionnement.ANNULE,
        label: 'Annuler la commande'
      });
    }

    return actions;
  }
}