// approvisionnement-details.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Approvisionnement, ApproProduit, ApprovisionnementService } from '../../services/approvisionnement.service';
import { StatutValidationService } from '../../services/statut-validation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StatutAction {
  type: string;
  label: string;
  nextStatut: string | null;
  color: string;
  needsQuantityInput?: boolean;
}

interface StatutConfig {
  label: string;
  color: string;
  actions: StatutAction[];
}

@Component({
  selector: 'app-approvisionnement-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approvisionnement-details.component.html',
  styleUrls: ['./approvisionnement-details.component.css']
})
export class ApprovisionnementDetailsComponent {
  @Input() approvisionnement: Approvisionnement | null = null;
  @Input() showModal = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() approvisionnementUpdated = new EventEmitter<Approvisionnement>();

  showQuantityModal = false;
  selectedAction: StatutAction | null = null;
  quantitiesForm: { [key: number]: number } = {};
  isLoading = false;

  // Configuration des statuts et actions
  private statutsConfig: { [key: string]: StatutConfig } = {
    'EN_ATTENTE': {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      actions: [
        { type: 'CONFIRMER', label: 'Confirmer la commande', nextStatut: 'CONFIRME', color: 'bg-green-500 hover:bg-green-600' },
        { type: 'ANNULER', label: 'Annuler', nextStatut: 'ANNULE', color: 'bg-red-500 hover:bg-red-600' }
      ]
    },
    'CONFIRME': {
      label: 'Confirmé',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      actions: [
        { type: 'EXPEDIER', label: 'Marquer comme expédié', nextStatut: 'EXPEDIE', color: 'bg-purple-500 hover:bg-purple-600' },
        { type: 'ANNULER', label: 'Annuler', nextStatut: 'ANNULE', color: 'bg-red-500 hover:bg-red-600' }
      ]
    },
    'EXPEDIE': {
      label: 'Expédié',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      actions: [
        { type: 'LIVRER_PARTIELLEMENT', label: 'Livraison partielle', nextStatut: 'LIVRE_PARTIELLEMENT', color: 'bg-orange-500 hover:bg-orange-600', needsQuantityInput: true },
        { type: 'LIVRER_COMPLETEMENT', label: 'Livraison complète', nextStatut: 'LIVRE_COMPLETEMENT', color: 'bg-green-500 hover:bg-green-600', needsQuantityInput: true }
      ]
    },
    'LIVRE_PARTIELLEMENT': {
      label: 'Livré partiellement',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      actions: [
        { type: 'LIVRER_COMPLETEMENT', label: 'Compléter la livraison', nextStatut: 'LIVRE_COMPLETEMENT', color: 'bg-green-500 hover:bg-green-600', needsQuantityInput: true }
      ]
    },
    'LIVRE_COMPLETEMENT': {
      label: 'Livré complètement',
      color: 'bg-green-100 text-green-800 border-green-300',
      actions: []
    },
    'ANNULE': {
      label: 'Annulé',
      color: 'bg-red-100 text-red-800 border-red-300',
      actions: []
    }
  };

  constructor(private approvisionnementService: ApprovisionnementService) {}

  getApprovisionnementProduits(appro: Approvisionnement | null): any[] {
    if (!appro) return [];
    
    if (appro.produits && Array.isArray(appro.produits)) {
      return appro.produits;
    }
    
    if ((appro as any).approvisionnementProduits && Array.isArray((appro as any).approvisionnementProduits)) {
      return (appro as any).approvisionnementProduits;
    }
    
    return [];
  }

  getStatutLabel(statut: string): string {
    return this.statutsConfig[statut]?.label || statut;
  }

  getStatutColor(statut: string): string {
    return this.statutsConfig[statut]?.color || 'bg-gray-100 text-gray-800';
  }

  getAvailableActions(): StatutAction[] {
    if (!this.approvisionnement?.statut) return [];
    return this.statutsConfig[this.approvisionnement.statut]?.actions || [];
  }

  handleAction(action: StatutAction) {
    if (!this.approvisionnement) return;

    this.selectedAction = action;

    if (action.needsQuantityInput) {
      this.initializeQuantityForm();
      this.showQuantityModal = true;
    } else {
      this.executeAction(action);
    }
  }

  private initializeQuantityForm() {
    this.quantitiesForm = {};
    const produits = this.getApprovisionnementProduits(this.approvisionnement);
    
    produits.forEach(produit => {
      if (this.selectedAction?.type === 'LIVRER_COMPLETEMENT') {
        // Pour livraison complète, pré-remplir avec la quantité restante à livrer
        const quantiteRestante = produit.quantiteCommandee - (produit.quantiteLivree || 0);
        this.quantitiesForm[produit.produit.id] = quantiteRestante;
      } else {
        // Pour livraison partielle, commencer à 0
        this.quantitiesForm[produit.produit.id] = 0;
      }
    });
  }

  executeAction(action: StatutAction, quantities?: { [key: number]: number }) {
    if (!this.approvisionnement || !action.nextStatut) return;

    this.isLoading = true;

    // Préparer les données de mise à jour
    const updateData: any = {
      fournisseurId: this.approvisionnement.fournisseur.id,
      statut: action.nextStatut,
      dateLivraisonEffective: (action.nextStatut === 'LIVRE_COMPLETEMENT' || action.nextStatut === 'LIVRE_PARTIELLEMENT') 
        ? new Date().toISOString() : undefined,
      produits: this.getApprovisionnementProduits(this.approvisionnement).map(produit => ({
        produitId: produit.produit.id,
        quantiteCommandee: produit.quantiteCommandee,
        quantiteLivree: quantities ? 
          (quantities[produit.produit.id] || produit.quantiteLivree || 0) : 
          (produit.quantiteLivree || 0),
        prixUnitaire: produit.prixUnitaire
      }))
    };

    this.approvisionnementService.updateApprovisionnement(this.approvisionnement.id, updateData)
      .subscribe({
        next: (updatedApprovisionnement) => {
          this.approvisionnement = updatedApprovisionnement;
          this.approvisionnementUpdated.emit(updatedApprovisionnement);
          this.isLoading = false;
          this.showQuantityModal = false;
          this.selectedAction = null;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.isLoading = false;
        }
      });
  }

  confirmQuantityAction() {
    if (this.selectedAction) {
      this.executeAction(this.selectedAction, this.quantitiesForm);
    }
  }

  cancelQuantityAction() {
    this.showQuantityModal = false;
    this.selectedAction = null;
    this.quantitiesForm = {};
  }

  closeModal() {
    this.modalClosed.emit();
  }

  getMaxQuantity(produit: any): number {
    return produit.quantiteCommandee - (produit.quantiteLivree || 0);
  }

  getTotalQuantityToDeliver(): number {
    return Object.values(this.quantitiesForm).reduce((sum, qty) => sum + (qty || 0), 0);
  }

  isQuantityValid(): boolean {
    const produits = this.getApprovisionnementProduits(this.approvisionnement);
    return produits.every(produit => {
      const quantity = this.quantitiesForm[produit.produit.id] || 0;
      const maxQuantity = this.getMaxQuantity(produit);
      return quantity >= 0 && quantity <= maxQuantity;
    });
  }
}