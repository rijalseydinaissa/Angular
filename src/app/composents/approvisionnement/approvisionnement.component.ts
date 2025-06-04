import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApprovisionnementService, Approvisionnement, ApproProduit } from '../../services/approvisionnement.service';
import { PaginationService } from '../../services/pagination.service';
import { ProduitService, ProductResponse } from '../../services/produit.service';
import { FournisseursService } from '../../services/fournisseurs.service';
import { ApprovisionnementFormComponent } from '../approvisionnement-form/approvisionnement-form.component';
import { ApprovisionnementDetailsComponent } from '../approvisionnement-details/approvisionnement-details.component';


@Component({
  selector: 'app-approvisionnement',
  standalone: true,
  imports: [CommonModule, FormsModule,ApprovisionnementFormComponent, ApprovisionnementDetailsComponent],
  templateUrl: './approvisionnement.component.html',
  styleUrls: ['./approvisionnement.component.css']
})
export class ApprovisionnementComponent {
  showForm = signal(false);
  searchTerm: string = '';
  selectedFilter: string = 'all';
  selectedAppro: Approvisionnement | null = null;
  approvisionnements: Approvisionnement[] = [];
  filteredApprovisionnements: Approvisionnement[] = [];
  produits: ProductResponse[] = [];
  fournisseurs: any[] = [];

  // Ajouter ces propriétés à votre classe ApprovisionnementComponent
  showDetailsModal = false;
  selectedApproDetails: Approvisionnement | null = null;

  // Pagination
  pageSize = 7;
  currentPage = 1;
  totalPages = 0;

  
  constructor(
    private approService: ApprovisionnementService,
    private paginationService: PaginationService,
    private produitService: ProduitService,
    private fournisseurService: FournisseursService
  ) {}

  ngOnInit(): void {
    this.loadApprovisionnements();
    this.loadProduits();
    this.loadFournisseurs();
  }

  // loadApprovisionnements() {
  //   this.approService.getApprovisionnements().subscribe(data => {
  //     this.approvisionnements = data;
  //     console.log(data);
      
  //     this.filteredApprovisionnements = [...data];
  //     this.updateTotalPages();
  //   });
  // }
  loadApprovisionnements(){
    this.approService.getApprovisionnements().subscribe({
      next: (data) => {
        this.approvisionnements = data.filter(appro => appro != null);
        // console.log(data);
        this.filteredApprovisionnements = [...data];
        this.updateTotalPages();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des approvisionnements:', error);
      }
    })
  }

  loadProduits() {
    this.produitService.getProducts().subscribe(data => {
      this.produits = data;
    });
  }

  loadFournisseurs() {
    this.fournisseurService.getFournisseurs().subscribe(data => {
      this.fournisseurs = data;
    });
  }

  // Pagination methods
  updateTotalPages() {
    this.totalPages = this.paginationService.getTotalPages(this.filteredApprovisionnements, this.pageSize);
  }

  get paginatedApprovisionnements() {
    return this.paginationService.getPaginatedItems(this.filteredApprovisionnements, this.currentPage, this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getVisiblePages(): number[] {
    return this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
  }

  // Filter methods
  filterApprovisionnements() {
    if (!this.approvisionnements) {
      this.filteredApprovisionnements = [];
      return;
    }

    const searchLower = (this.searchTerm || '').toLowerCase();
    this.filteredApprovisionnements = this.approvisionnements.filter(appro => {
      const matchesSearch = appro.code.toLowerCase().includes(searchLower) || 
                          appro.fournisseur.nom.toLowerCase().includes(searchLower);

      const matchesStatus = this.selectedFilter === 'all' || 
                          appro.statut === this.selectedFilter;

      return matchesSearch && matchesStatus;
    });

    this.updateTotalPages();
    this.currentPage = 1;
  }

  // Form methods
  openCreateForm() {
    this.selectedAppro = null;
    this.showForm.set(true);
  }


openEditForm(appro: Approvisionnement) {
  // console.log('Ouverture du formulaire d\'édition pour:', appro);
  // console.log('Fournisseur de l\'appro:', appro.fournisseur);
  console.log('Produits de l\'appro:', appro.produits || appro.approvisionnementProduits);
  
  this.selectedAppro = {...appro}; // Copie profonde si nécessaire
  this.showForm.set(true);
}

handleSubmit(approData: any) {
  console.log('Données reçues du formulaire:', approData);
  
  // Validation des données avant envoi
  if (!approData.fournisseurId) {
    alert('Fournisseur manquant');
    return;
  }

  if (!approData.produits || approData.produits.length === 0) {
    alert('Aucun produit sélectionné');
    return;
  }

  // Validation des produits
  const produitsValides = approData.produits.every((p: any) => 
    p.produitId && p.quantiteCommandee > 0 && p.prixUnitaire >= 0
  );

  if (!produitsValides) {
    alert('Données des produits invalides');
    return;
  }

  if (this.selectedAppro) {
    console.log('Mode édition - ID:', this.selectedAppro.id);
    
    // Préparation des données pour la mise à jour
    const updateData = {
      id: this.selectedAppro.id,
      fournisseurId: approData.fournisseurId,
      dateLivraisonPrevue: this.selectedAppro.dateLivraisonPrevue,
      dateLivraisonEffective: this.selectedAppro.dateLivraisonEffective,
      statut: this.selectedAppro.statut, // Conserver le statut existant
      observations: approData.observations || '',
      produits: approData.produits.map((p: any) => ({
        produitId: p.produitId,
        quantiteCommandee: p.quantiteCommandee,
        quantiteLivree: 0, // Valeur par défaut pour les nouveaux produits
        prixUnitaire: p.prixUnitaire
      }))
    };
    
    console.log('Données envoyées pour mise à jour:', updateData);
    
    this.approService.updateApprovisionnement(this.selectedAppro.id, updateData).subscribe({
      next: (result) => {
        console.log('Mise à jour réussie:', result);
        this.loadApprovisionnements();
        this.showForm.set(false);
        this.selectedAppro = null;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
        alert('Erreur lors de la mise à jour: ' + errorMsg);
      }
    });
  } else {
    console.log('Mode création');
    this.approService.createApprovisionnement(approData).subscribe({
      next: (result) => {
        console.log('Création réussie:', result);
        this.loadApprovisionnements();
        this.showForm.set(false);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
        alert('Erreur lors de la création: ' + errorMsg);
      }
    });
  }
}


  deleteApprovisionnement(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet approvisionnement ?')) {
      this.approService.deleteApprovisionnement(id).subscribe(() => {
        this.approvisionnements = this.approvisionnements.filter(appro => appro.id !== id);
        this.filterApprovisionnements();
      });
    }
  }

  updateApproStatus(appro: Approvisionnement, newStatus: any) {
    const updatedAppro = {...appro, statut: newStatus};
    this.approService.updateApprovisionnement(appro.id, updatedAppro).subscribe(() => {
      this.loadApprovisionnements();
    });
  }
// validation
  getStatutLabel(statut: string): string {
    const statutLabels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRME': 'Confirmé',
      'EXPEDIE': 'Expédié',
      'LIVRE_COMPLETEMENT': 'Livré complètement',
      'LIVRE_PARTIELLEMENT': 'Livré partiellement',
      'ANNULE': 'Annulé'
    };
    return statutLabels[statut] || statut;
  }

  closeForm() {
    this.showForm.set(false);
    this.selectedAppro = null;
  }
  //details   ppro

  /**
 * Ouvre le modal des détails pour un approvisionnement
 */
openDetailsModal(appro: Approvisionnement) {
  this.selectedApproDetails = {...appro};
  this.showDetailsModal = true;
}

/**
 * Ferme le modal des détails
 */
closeDetailsModal() {
  this.showDetailsModal = false;
  this.selectedApproDetails = null;
}


}