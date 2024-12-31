import { NgClass, NgFor } from '@angular/common';
import { Component, output, Output, signal, Signal } from '@angular/core';

@Component({
  selector: 'app-commande-detail',
  imports: [NgFor,NgClass],
  templateUrl: './commande-detail.component.html',
  styleUrl: './commande-detail.component.css'
})
export class CommandeDetailComponent {

  @Output() nom:string = 'Diol';
  @Output() prenom:string = 'Issa';
  @Output() currentTotal:number = 200000;
  @Output() cartTotal:number = 200000;
  @Output() cartItems:any = [];
  @Output() status:string = 'Non réglée';
  close = output<(boolean)>();
  nombreProduits:number = this.cartItems.length;

  closed = signal(false);

  updateCartItemQuantity(arg:any,arg1: number) {
    this.currentTotal = 150000;
  }

  removeFromCart(arg:any) {
    this.currentTotal = 500000;
  }

  handleSubmit() {
    console.log('Commande enregistrée');
  }

  closeOverlay() {
    this.closed.set(!this.closed());
    this.close.emit(this.closed());
  }
}
