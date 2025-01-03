import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-commande-detail',
  imports: [NgFor, NgClass],
  templateUrl: './commande-detail.component.html',
  styleUrls: ['./commande-detail.component.css'],
})
export class CommandeDetailComponent {

  constructor() {
    console.log(this.closed);
    
  }

  @Input() nom: string = '';
  @Input() prenom: string = '';
  @Input() currentTotal: number = 200000;
  @Input() cartTotal: number = 200000;
  @Input() cartItems: any = [];
  @Input() status: string = 'Non réglée';
  @Output() close = new EventEmitter<boolean>();
  nombreProduits: number = this.cartItems.length;

  @Input() closed: boolean = true;

  updateCartItemQuantity(arg: any, arg1: number) {
    this.currentTotal = 150000;
  }

  removeFromCart(arg: any) {
    this.currentTotal = 500000;
  }

  handleSubmit() {
    console.log('Commande enregistrée');
  }

  closeOverlay() {
    this.closed = !this.closed;
    this.close.emit(this.closed);
  }
}
