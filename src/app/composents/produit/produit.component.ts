import { Component, Signal, signal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produit',
  imports: [ CommonModule,FormsModule,ProductFormComponent],
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css'],
})
export class ProduitComponent { 
  showProductForm = signal(false);

  searchTerm: string = '';
  selectedFilter: string = 'all';

  currentProduct : Signal<number> = signal(-1);
  action : boolean = false;
  

  filteredProducts: {
    id: number;
    image: string;
    nom: string;
    quantite: number;
    prix: number;
    categorie: string;
    statut: string;
    statutClass: string;
  }[] = [];

  products = [
    {
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
    {
      id: 2,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 100,prix: 100,categorie: 'Alimentaire',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },{
      id: 3,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 200,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
    {
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Mango',quantite: 10,prix: 100,categorie: 'Informatique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },{
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Matelas',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
    {
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
    {
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Chaise',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
    {
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Chaise',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },{
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Chaise',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
  ];
  

  constructor() {
    this.filteredProducts = this.products; // Initialiser avec tous les produits
  }

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
