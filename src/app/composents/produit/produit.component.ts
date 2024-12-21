import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-produit',
  imports: [ReactiveFormsModule, CommonModule, ProductFormComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css'
})
export class ProduitComponent {

  showProductForm= signal(false);

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
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 10,prix: 100,categorie: 'Informatique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },{
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
    {
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
    {
      id: 1,image: 'https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png',nom: 'Pomme',quantite: 10,prix: 100,categorie: 'Electronique',
      statut: 'Suffisant',
      statutClass: 'bg-green'
    },
  ];
  
  
deleteProduct(_t29: any) {
throw new Error('Method not implemented.');
}
editProduct(_t29: any) {
throw new Error('Method not implemented.');
}
closeForm(event: boolean) {
  this.showProductForm.set(event);
  console.log("helfkzl");
}
// onFileSelected(event: any) {
//   if (event.target.files.length > 0) {
//     this.newProduct.image = event.target.files[0];
//   }
// }

// createProduct() {
//   // Logique de création de produit ici
//   console.log(this.newProduct);
//   this.showProductForm = false;
// }
}
