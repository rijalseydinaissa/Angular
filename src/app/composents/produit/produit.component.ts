import { PaginationService } from './../../services/pagination.service';
import { ProduitService } from './../../services/produit.service';
import { Component, ElementRef, Signal, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { CategorieResponse ,CategorieService } from '../../services/categorie.service';

interface Product {
 id: number;
 image: string | null;
 nom: string;
 code: string;
 quantite: number;
 prix: number;
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
  showProductForm = signal(false);
  searchTerm: string = '';
  selectedFilter: string = 'all';
  selectedProduct: Product | null = null;
  action: boolean = false;
  filteredProducts: Product[] = [];
  products: Product[] = [];
  categories: CategorieResponse[] = [];
  dropdownOpen: boolean = false;
  

  pageSize = 8;
  currentPage = 1;
  totalPages = 0;
 

  constructor(private produitService: ProduitService, private paginationService: PaginationService, private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.produitService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = this.products;
      // this.categories = Array.from(new Set(data.map((product: { categorie: any }) => product.categorie.nom)));
      this.updateTotalPages();
    });
    this.categorieService.getCategories().subscribe(categories=>{
      this.categories=categories.filter(categories=>categories.nom!='null');
      console.log(categories);
    });
  }

  closeDropdown() {
    this.dropdownOpen = true;
  }
  
//pagination
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

  changePageSize() {
    // Convertir pageSize en nombre car les valeurs de select sont souvent des chaînes
    this.pageSize = Number(this.pageSize);
    // Recalculer le nombre total de pages avec la nouvelle taille
    this.updateTotalPages();
    
    // Ajuster la page courante si nécessaire
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }
  //fin pagination

  editProduct(product : Product){
     // Vérifiez la structure de la catégorie
    console.log('Product to edit:', product);
    console.log('Product category:', product.categorie);
    
    this.selectedProduct = {...product},
    this.showProductForm.set(true);
   }
   filterProducts() {
    if (!this.products) {
      this.filteredProducts = [];
      return;
    }

    const searchLower = (this.searchTerm || '').toLowerCase();
    this.filteredProducts = this.products.filter((product) => {
      if (!product) return false;

      // Recherche par nom de produit
      const matchesSearch = product.nom ? 
        product.nom.toLowerCase().includes(searchLower) : false;

      // Filtre par catégorie
      const matchesCategory = this.selectedFilter === 'all' || 
        product.categorie.id.toString() === this.selectedFilter;

      return matchesSearch && matchesCategory;
    });

    this.updateTotalPages();
    this.currentPage = 1;
  }

  deleteProduct(productId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduct(productId).subscribe(
        () => {
          this.products = this.products.filter(p => p.id !== productId);
          this.filterProducts();
        },
        error => {
          console.error('Erreur lors de la suppression du produit:', error);
        }
      );
    }
  }

  handleProductCreated(newProduct: Product) {
    // Rafraîchir la liste des produits après une création
    this.produitService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
  }

  handleProductUpdated(updatedProduct: Product) {
    if (!updatedProduct) {
      console.error('Updated product is null');
      return;
    }

    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct
      };

      this.filteredProducts = [...this.products];
      this.filterProducts();
    }

    this.selectedProduct = null;
    this.showProductForm.set(false);
  }

  closeForm(event: boolean) {
    this.showProductForm.set(event);
    if (!event) {
      this.selectedProduct = null;
    }
  }
}
