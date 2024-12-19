import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  imports:[FormsModule,ReactiveFormsModule]
})
export class ProductFormComponent {
  newProduct = {
    name: '',
    quantity: 0,
    price: 0,
    category: '',
    status: 'Suffisant',
    image: 'https://via.placeholder.com/50'
  };

  createProduct() {
    console.log('Nouveau produit créé :', this.newProduct);
    // Réinitialiser le formulaire
    this.newProduct = {
      name: '',
      quantity: 0,
      price: 0,
      category: '',
      status: 'Suffisant',
      image: 'https://via.placeholder.com/50'
    };
  }
  

  onFileSelected(event: any) {
  if (event.target.files.length > 0) {
    this.newProduct.image = event.target.files[0];
  }
}

// createProduct() {
//   // Logique de création de produit ici
//   console.log(this.newProduct);
//   this.showProductForm = false;
// }
  
}