import { PaginationService } from './../../services/pagination.service';
import { ProduitService } from './../../services/produit.service';
import { Component, ElementRef, Signal, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

interface Product {
 id: number;
 image: string | null;
 nom: string;
 quantite: number;
 prix: number;
 categorie: string;
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
  categories: string[] = [];


  pageSize = 8;
  currentPage = 1;
  totalPages = 0;
  // @ViewChild('dropdownMenu') dropdownMenu: ElementRef | undefined;

// closeDropdown(event: Event) {
//   event.stopPropagation();
//   // Retirer le focus du menu déroulant
//   if (this.dropdownMenu?.nativeElement) {
//     this.dropdownMenu.nativeElement.blur();
//   }
//   // Appeler editProduct
//   this.editProduct(this.products.find(p => p.id === this.selectedProduct?.id)!);
// }

  constructor(private produitService: ProduitService, private paginationService: PaginationService) {}

  ngOnInit(): void {
    this.produitService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = this.products;
      this.categories = Array.from(new Set(data.map((product: { categorie: any }) => product.categorie)));
      this.updateTotalPages();
    });
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
  //fin pagination

  editProduct(product : Product){
    this.selectedProduct = product,
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

      const matchesSearch = product.nom ? 
        product.nom.toLowerCase().includes(searchLower) : false;

      const matchesCategory = this.selectedFilter === 'all' || 
        product.categorie === this.selectedFilter;

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
    this.filterProducts();
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
