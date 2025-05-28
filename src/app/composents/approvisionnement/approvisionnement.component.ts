import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApprovisionnementService, Approvisionnement, ApproProduit } from '../../services/approvisionnement.service';
import { PaginationService } from '../../services/pagination.service';
import { ProduitService, ProductResponse } from '../../services/produit.service';
import { FournisseursService } from '../../services/fournisseurs.service';

@Component({
  selector: 'app-approvisionnement',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Pagination
  pageSize = 8;
  currentPage = 1;
  totalPages = 0;

  // Form state
  newApproProduits: {produitId: number,nom: string, quantiteCommandee: number, prixUnitaire: number}[] = [];
  selectedProduit: ProductResponse | null = null;
  selectedFournisseur: any = null;

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

  loadApprovisionnements() {
    this.approService.getApprovisionnements().subscribe(data => {
      this.approvisionnements = data;
      console.log(data);
      
      this.filteredApprovisionnements = [...data];
      this.updateTotalPages();
    });
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
    this.newApproProduits = [];
    this.showForm.set(true);
  }

  openEditForm(appro: Approvisionnement) {
    this.selectedAppro = {...appro};
    // Vérifier si la propriété produits ou approvisionnementProduits existe
    const produits = appro.produits || appro.approvisionnementProduits || [];
  
    this.newApproProduits = produits.map(p => ({
      produitId: p.produit.id,
      nom: p.produit.nom,
      quantiteCommandee: p.quantiteCommandee,
      prixUnitaire: p.prixUnitaire
    }));
    this.showForm.set(true);
  }

  addProduitToForm() {
    if (this.selectedProduit) {
      this.newApproProduits.push({
        produitId: this.selectedProduit.id,
        nom: this.selectedProduit.nom,
        quantiteCommandee: 1,
        prixUnitaire: this.selectedProduit.prixAchat || 0
      });
      this.selectedProduit = null;
    }
  }

  removeProduitFromForm(index: number) {
    this.newApproProduits.splice(index, 1);
  }


  calculateTotal(): number {
    return this.newApproProduits.reduce((total, item) => {
      return total + (item.quantiteCommandee * item.prixUnitaire);
    }, 0);
  }

  submitForm() {
    const approData = {
      fournisseurId: this.selectedFournisseur?.id,
      produits: this.newApproProduits,
      montantTotal: this.calculateTotal()
    };

    if (this.selectedAppro) {
      // Update existing
      this.approService.updateApprovisionnement(this.selectedAppro.id, approData as any).subscribe(() => {
        this.loadApprovisionnements();
        this.showForm.set(false);
      });
    } else {
      // Create new
      this.approService.createApprovisionnement(approData as any).subscribe(() => {
        this.loadApprovisionnements();
        this.showForm.set(false);
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
}