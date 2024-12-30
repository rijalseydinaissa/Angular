import { ProduitService } from './../../services/produit.service';
import { Component, Signal, signal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

interface Product {
  id: number;
  image: string;
  nom: string;
  quantite: number;
  prix: number;
  categorie: string;
  statut: string;
  statutClass: string;
}


@Component({
  selector: 'app-produit',
  imports: [ CommonModule,FormsModule,ProductFormComponent],
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css'],
})

export class ProduitComponent implements OnInit { 
  showProductForm = signal(false);
  
  searchTerm: string = '';
  selectedFilter: string = 'all';

  currentProduct : Signal<number> = signal(-1);
  action : boolean = false;
  
  

  filteredProducts:Product []=[];

  products :Product []=[];
  categories: string[] = [];

  ngOnInit(): void {
      this.produitService.getProducts().subscribe(
        {
          next:(data)=>{
            this.products = data;
            this.filteredProducts = this.products; // Initialiser avec tous les produits

            this.categories = Array.from(
              new Set(this.products.map((product) => product.categorie))
            );
          }
        }
      )
  }

  constructor(private produitService:ProduitService) {  }

  filterProducts() {
    const searchLower = this.searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter((product) => {
      const WeurPro = product.nom.toLowerCase().includes(searchLower);
      const matchesCategory =
        this.selectedFilter === 'all' || product.categorie === this.selectedFilter;

      return WeurPro && matchesCategory;
    });
  }


  closeForm(event: boolean) {
    this.showProductForm.set(event);
  }
}
