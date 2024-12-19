import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-produit',
  imports: [ReactiveFormsModule,CommonModule,ProductFormComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css'
})
export class ProduitComponent {

  showProductForm=false;

  products = [
    { name: 'Limon', quantity: 1000, price: 1000, category: 'Aliment', status: 'Suffisant', image: 'assets/images/limon.jpg' },
    { name: 'Bandage', quantity: 10, price: 1000, category: 'Médical', status: 'Insuffisant', image: 'assets/images/bandage.jpg' },
    { name: 'Toast', quantity: 1000, price: 1000, category: 'Aliment', status: 'Suffisant', image: 'assets/images/toast.jpg' },
    { name: 'Ball', quantity: 1000, price: 1000, category: 'Sports', status: 'Suffisant', image: 'assets/images/ball.jpg' },
    { name: 'Clavier', quantity: 10, price: 1000, category: 'Informatique', status: 'Insuffisant', image: 'assets/images/clavier.jpg' },
    { name: 'Ordinateur', quantity: 10, price: 1000, category: 'Informatique', status: 'Insuffisant', image: 'assets/images/ordinateur.jpg' },
    { name: 'Chat', quantity: 1000, price: 1000, category: 'Animal', status: 'Suffisant', image: 'assets/images/chat.jpg' },
    { name: 'Chiken', quantity: 10, price: 1000, category: 'Aliment', status: 'Insuffisant', image: 'assets/images/chicken.jpg' },
  ];
  
  
deleteProduct(_t29: any) {
throw new Error('Method not implemented.');
}
editProduct(_t29: any) {
throw new Error('Method not implemented.');
}
closeForm() {
  this.showProductForm = false;
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
