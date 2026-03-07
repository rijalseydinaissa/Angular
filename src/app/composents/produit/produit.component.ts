import { PaginationService } from './../../services/pagination.service';
import { ProduitService } from './../../services/produit.service';
import { AlertService } from '../../services/alert.service';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { CategorieResponse, CategorieService } from '../../services/categorie.service';

interface Product {
  id: number;
  image: string | null;
  nom: string;
  code: string;
  quantite: number;
  prix: number;
  prixAchat: number;
  categorie: CategorieResponse;
  statut: string;
}

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css'],
})
export class ProduitComponent implements OnInit {

  // ── Formulaire ──────────────────────────────────
  showProductForm = signal(false);
  selectedProduct: Product | null = null;

  // ── Données ─────────────────────────────────────
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: CategorieResponse[] = [];

  // ── Filtres ─────────────────────────────────────
  searchTerm: string = '';
  selectedFilter: string = 'all';
  dropdownOpen: boolean = false;

  // ── Pagination ──────────────────────────────────
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;

  // ── États de chargement ─────────────────────────
  isExporting = false;
  isImporting = false;
  isDownloadingPdf = false;
  isDownloadingAlertPdf = false;

  // ── Toast ────────────────────────────────────────
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  constructor(
    private produitService: ProduitService,
    private paginationService: PaginationService,
    private categorieService: CategorieService,
    private alertService: AlertService
  ) {}

  // ════════════════════════════════════════════════
  // LIFECYCLE
  // ════════════════════════════════════════════════
  ngOnInit(): void {
    this.produitService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
      this.updateTotalPages();
    });

    this.categorieService.getCategories().subscribe(categories => {
      this.categories = categories.filter(c => c.nom !== 'null');
    });
  }

  // ════════════════════════════════════════════════
  // TOAST
  // ════════════════════════════════════════════════
  showToast(message: string, type: 'success' | 'error' = 'success') {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  // ════════════════════════════════════════════════
  // STATISTIQUES
  // ════════════════════════════════════════════════
  getCountByStatut(statut: string): number {
    return this.products.filter(p => p.statut === statut).length;
  }

  // ════════════════════════════════════════════════
  // FILTRES
  // ════════════════════════════════════════════════
  filterProducts() {
    if (!this.products) { this.filteredProducts = []; return; }

    const search = (this.searchTerm || '').toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      if (!product) return false;
      const matchesSearch = product.nom?.toLowerCase().includes(search) ?? false;
      const matchesCat = this.selectedFilter === 'all' ||
        product.categorie?.id?.toString() === this.selectedFilter;
      return matchesSearch && matchesCat;
    });

    this.updateTotalPages();
    this.currentPage = 1;
  }

  // ════════════════════════════════════════════════
  // PAGINATION
  // ════════════════════════════════════════════════
  updateTotalPages() {
    this.totalPages = this.paginationService.getTotalPages(this.filteredProducts, this.pageSize);
  }

  get paginatedProducts() {
    return this.paginationService.getPaginatedItems(this.filteredProducts, this.currentPage, this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getVisiblePages(): number[] {
    return this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
  }

  // ════════════════════════════════════════════════
  // CRUD
  // ════════════════════════════════════════════════
  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.showProductForm.set(true);
  }

  deleteProduct(productId: number) {
    this.alertService.showConfirmation(
      'Cette action supprimera définitivement le produit. Voulez-vous continuer ?',
      'Oui, supprimer'
    ).then(result => {
      if (result.isConfirmed) {
        this.alertService.showLoading('Suppression en cours...');
        this.produitService.deleteProduct(productId).subscribe({
          next: () => {
            this.alertService.closeAlert();
            this.products = this.products.filter(p => p.id !== productId);
            this.filterProducts();
            this.showToast('Produit supprimé avec succès', 'success');
          },
          error: (error) => {
            this.alertService.closeAlert();
            const err = this.alertService.handleHttpError(error);
            this.showToast(err?.message || 'Impossible de supprimer le produit', 'error');
          }
        });
      }
    });
  }

  handleProductCreated(newProduct: Product) {
    this.produitService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
    this.showToast('Produit créé avec succès', 'success');
  }

  handleProductUpdated(updatedProduct: Product) {
    if (!updatedProduct) return;
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.filteredProducts = [...this.products];
      this.filterProducts();
    }
    this.selectedProduct = null;
    this.showProductForm.set(false);
    this.showToast('Produit modifié avec succès', 'success');
  }

  closeForm(event: boolean) {
    this.showProductForm.set(event);
    if (!event) { this.selectedProduct = null; }
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  // ════════════════════════════════════════════════
  // TÉLÉCHARGEMENT (utilitaire privé)
  // ════════════════════════════════════════════════
  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // ════════════════════════════════════════════════
  // EXPORT CSV
  // ════════════════════════════════════════════════
  exportCsv() {
    this.isExporting = true;
    this.produitService.exportCsv().subscribe({
      next: (blob) => {
        this.downloadFile(blob, `produits_${new Date().toISOString().slice(0, 10)}.csv`);
        this.isExporting = false;
        this.showToast('Export CSV téléchargé avec succès', 'success');
      },
      error: () => {
        this.isExporting = false;
        this.showToast('Erreur lors de l\'export CSV', 'error');
      }
    });
  }

  // ════════════════════════════════════════════════
  // IMPORT CSV
  // ════════════════════════════════════════════════
  onImportCsv(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
    (event.target as HTMLInputElement).value = '';

    this.isImporting = true;
    this.produitService.importCsv(file).subscribe({
      next: (res) => {
        this.isImporting = false;
        this.showToast(res.message || 'Import CSV réussi', 'success');
        // Recharger la liste
        this.produitService.getProducts().subscribe(data => {
          this.products = data;
          this.filterProducts();
        });
      },
      error: (err) => {
        this.isImporting = false;
        this.showToast(err.message || 'Erreur lors de l\'import CSV', 'error');
      }
    });
  }

  // ════════════════════════════════════════════════
  // PDF INVENTAIRE
  // ════════════════════════════════════════════════
  downloadInventairePdf() {
    this.isDownloadingPdf = true;
    this.produitService.downloadInventairePdf().subscribe({
      next: (blob) => {
        this.downloadFile(blob, `inventaire_${new Date().toISOString().slice(0, 10)}.pdf`);
        this.isDownloadingPdf = false;
        this.showToast('Rapport d\'inventaire téléchargé', 'success');
      },
      error: () => {
        this.isDownloadingPdf = false;
        this.showToast('Erreur lors de la génération du PDF', 'error');
      }
    });
  }

  // ════════════════════════════════════════════════
  // PDF ALERTES
  // ════════════════════════════════════════════════
  downloadAlertesPdf() {
    this.isDownloadingAlertPdf = true;
    this.produitService.downloadAlertesPdf().subscribe({
      next: (blob) => {
        this.downloadFile(blob, `alertes_stock_${new Date().toISOString().slice(0, 10)}.pdf`);
        this.isDownloadingAlertPdf = false;
        this.showToast('Rapport des alertes téléchargé', 'success');
      },
      error: () => {
        this.isDownloadingAlertPdf = false;
        this.showToast('Erreur lors de la génération du PDF des alertes', 'error');
      }
    });
  }
}