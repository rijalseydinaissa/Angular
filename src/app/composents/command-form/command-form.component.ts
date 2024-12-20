import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-command-form',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './command-form.component.html',
  styleUrl: './command-form.component.css'
})
export class CommandFormComponent {

  clientName: string = '';
  selectedProduct: any = null;
  quantity: number = 1;
  cartItems: any[] = [];
  
  // Données simulées des produits
  products = [
    { id: 1, name: 'Pomme de terre', price: 24000, image: 'assets/pomme.jpg' },
    { id: 2, name: 'Carotte', price: 15000, image: 'assets/carotte.jpg' },
    { id: 3, name: 'Oignon', price: 18000, image: 'assets/oignon.jpg' },
  ];

  addToCart() {
    if (this.selectedProduct && this.quantity > 0) {
      const item = {
        product: this.selectedProduct,
        quantity: this.quantity,
        total: this.selectedProduct.price * this.quantity
      };
      this.cartItems.push(item);
      this.selectedProduct = null;
      this.quantity = 1;
    }
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.total, 0);
  }

  validateOrder() {
    if (this.clientName && this.cartItems.length > 0) {
      const order = {
        client: this.clientName,
        items: this.cartItems,
        total: this.getTotal(),
        date: new Date()
      };
      console.log('Commande validée:', order);
      // Réinitialiser le formulaire
      this.clientName = '';
      this.cartItems = [];
    }
  }
}
