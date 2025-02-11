import { ProduitService } from './../../services/produit.service';
import { Component, Signal, signal } from '@angular/core';
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
 statutClass: string;
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
 currentProduct: Signal<number> = signal(-1);
 selectedProduct: Product | null = null;
 action: boolean = false;
 filteredProducts: Product[] = [];
 products: Product[] = [];
 categories: string[] = [];

 editProduct(product : Product){
  this.selectedProduct = product,
  this.showProductForm.set(true);
 }

 constructor(private produitService: ProduitService) {}

 ngOnInit(): void {
   this.produitService.getProducts().subscribe(data => {
     this.products = data;
     this.filteredProducts = this.products;
     this.categories = Array.from(new Set(data.map((product: { categorie: any; }) => product.categorie)));
   });
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
      product.nom.toLowerCase().includes(searchLower) : 
      false;
    
    const matchesCategory = this.selectedFilter === 'all' || 
      product.categorie === this.selectedFilter;
    
    return matchesSearch && matchesCategory;
  });
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
  //  this.products.unshift(newProduct);
   this.filterProducts();
 }
 handleProductUpdated(updatedProduct: Product) {
  if (!updatedProduct) {
    console.error('Updated product is null');
    return;
  }

  // Mettre à jour le produit dans le tableau local
  const index = this.products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    // Fusionner les données existantes avec les nouvelles
    this.products[index] = {
      ...this.products[index],
      ...updatedProduct
    };
    
    // Mettre à jour la liste filtrée
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