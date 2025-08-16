import { Component ,EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Approvisionnement, ApprovisionnementService } from '../../services/approvisionnement.service';
import { Fournisseur } from '../../services/fournisseurs.service';
import { ProductResponse } from '../../services/produit.service';
import { Observable , map, switchMap, of, BehaviorSubject, combineLatest, tap} from 'rxjs';
import { StatutValidationService } from '../../services/statut-validation.service';

@Component({
  selector: 'app-approvisionnement-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './approvisionnement-form.component.html',
  styleUrl: './approvisionnement-form.component.css'
})
export class ApprovisionnementFormComponent {
  @Input() fournisseurs: Fournisseur[] = [];
  @Input() produits: ProductResponse[] = [];
  @Input() selectedAppro: Approvisionnement | null = null;

  @Output() submitFormEvent = new EventEmitter<any>();
  @Output() closeFormEvent = new EventEmitter<void>();

  newApproProduits: {produitId: number,nom: string, quantiteCommandee: number, prixUnitaire: number}[] = [];
  selectedProduit: ProductResponse | null = null;
  selectedFournisseur: Fournisseur | null = null;
  filteredProduits: ProductResponse[] = [];

  constructor(private approvisionnementService: ApprovisionnementService,private statutValidation: StatutValidationService) {}

 addProduitToForm(){
    if (this.selectedProduit) {
      // Vérifier si le produit n'est pas déjà ajouté
      const existingProduit = this.newApproProduits.find(p => p.produitId === this.selectedProduit!.id);
      if (!existingProduit) {
        this.newApproProduits.push({
          produitId: this.selectedProduit.id,
          nom: this.selectedProduit.nom,
          quantiteCommandee: 1,
          prixUnitaire: this.selectedProduit.prixAchat || 0
        });
      }
      this.selectedProduit = null;
    }
  }

  removeProduitFromForm(index: number){
    this.newApproProduits.splice(index, 1);
  }

  calculateTotal(): number {
    return this.newApproProduits.reduce((total, item) => {
      return total + (item.quantiteCommandee * item.prixUnitaire);
    }, 0);
  }


onSubmit() {
  // Validation avant soumission
  if (!this.selectedFournisseur) {
    alert('Veuillez sélectionner un fournisseur');
    return;
  }

  if (this.newApproProduits.length === 0) {
    alert('Veuillez ajouter au moins un produit');
    return;
  }

  // Validation des quantités et prix
  const produitsInvalides = this.newApproProduits.some(p => 
    !p.quantiteCommandee || p.quantiteCommandee <= 0 || 
    p.prixUnitaire < 0
  );

  if (produitsInvalides) {
    alert('Veuillez vérifier les quantités et prix des produits');
    return;
  }

  // Préparation des données selon le format attendu par le backend
  const approData = {
    fournisseurId: this.selectedFournisseur.id,
    observations: '', // Ajouter un champ observations si nécessaire
    produits: this.newApproProduits.map(p => ({
      produitId: p.produitId,
      quantiteCommandee: p.quantiteCommandee,
      prixUnitaire: p.prixUnitaire
    }))
  };

  console.log('Données du formulaire à envoyer:', approData);
  this.submitFormEvent.emit(approData);
}

// Méthode ngOnChanges corrigée
ngOnChanges() {
  if (this.selectedAppro) {
    console.log('Chargement des données d\'édition:', this.selectedAppro);
    
    
    // Charger les produits existants
    const produitsSource = this.selectedAppro.produits || this.selectedAppro.approvisionnementProduits || [];
    this.newApproProduits = produitsSource.map(p => ({
      produitId: p.produit.id,
      nom: p.produit.nom,
      quantiteCommandee: p.quantiteCommandee,
      prixUnitaire: p.prixUnitaire
    }));
    
    // Sélectionner le fournisseur - recherche par ID pour éviter les problèmes de référence
    this.selectedFournisseur = this.fournisseurs.find(f => f.id === this.selectedAppro!.fournisseur.id) || null;
    
    // console.log('Fournisseur sélectionné:', this.selectedFournisseur);
    // console.log('Produits chargés:', this.newApproProduits);
  } else {
    // Réinitialisation pour nouveau formulaire
    this.newApproProduits = [];
    this.selectedFournisseur = null;
  }
  // Filtrer les produits avec quantité ≤ 5
  this.filteredProduits = this.produits.filter(p => p.quantite <= 5);
}
// addAllProduitsToForm() {
//   // Vérifier d'abord si un fournisseur est sélectionné
//   if (!this.selectedFournisseur) {
//     alert('Veuillez d\'abord sélectionner un fournisseur');
//     return;
//   }

//   // Filtrer les produits qui ne sont pas déjà dans la liste
//   const produitsAAjouter = this.filteredProduits.filter(produit => 
//     !this.newApproProduits.some(p => p.produitId === produit.id)
//   );

//   // Ajouter tous les produits filtrés
//   produitsAAjouter.forEach(produit => {
//     this.newApproProduits.push({
//       produitId: produit.id,
//       nom: produit.nom,
//       quantiteCommandee: 1, // Quantité par défaut
//       prixUnitaire: produit.prixAchat || 0
//     });
//   });

//   if (produitsAAjouter.length === 0) {
//     alert('Tous les produits disponibles sont déjà ajoutés');
//   }
// }

  onClose() {
    this.closeFormEvent.emit();
  }
}