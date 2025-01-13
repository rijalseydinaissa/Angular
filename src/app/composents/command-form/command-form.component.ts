import { CommandeService } from './../../services/commande.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

interface Product {
  id: number;
  nom: string;
  prix: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-command-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './command-form.component.html',
  styleUrl: './command-form.component.css',
})
export class CommandFormComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();

  products: any[] = [];
  commandeForm: FormGroup;
  cartItems: CartItem[] = [];
  currentTotal: number = 0;

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeService
  ) {
    this.commandeForm = this.fb.group({
      clientName: ['', Validators.required],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
    });
  }
  ngOnInit() {
    this.loadProduits();
  }

  private loadProduits() {
    this.commandeService.getProduits().subscribe({
      next: (produits) => {
        console.log(produits);
        this.products = produits;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
      },
    });
  }

  get clientName() {
    return this.commandeForm.get('clientName')?.value;
  }

  get cartTotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.product.prix * item.quantity,
      0
    );
  }
  updateTotalPrice() {
    const productId = this.commandeForm.get('productId')?.value;
    const quantity = this.commandeForm.get('quantity')?.value;

    if (productId && quantity) {
      const product = this.products.find((p) => p.id === Number(productId));
      if (product) {
        this.currentTotal = product.prix * quantity;
      }
    } else {
      this.currentTotal = 0;
    }
  }

  addToCart() {
    if (this.commandeForm.valid) {
      const productId = Number(this.commandeForm.get('productId')?.value);
      const quantity = Number(this.commandeForm.get('quantity')?.value);
      const product = this.products.find((p) => p.id === productId);

      if (product) {
        const existingItem = this.cartItems.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.cartItems.push({ product, quantity });
        }

        this.currentTotal = 0;
      }
    }else{
      Object.keys(this.commandeForm.controls).forEach(key => {
        const control = this.commandeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  updateCartItemQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    }
  }

  removeFromCart(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  // handleSubmit() {
  //   if (this.cartItems.length > 0) {
  //     console.log('Order submitted:', {
  //       clientName: this.clientName,
  //       items: this.cartItems,
  //       total: this.cartTotal
  //     });
  //     this.close();
  //   }
  // }

  handleSubmit() {
    if (this.commandeForm.valid) {
      const commande = {
        date: new Date(),
        status: 'NONREGLE',
        client: this.clientName,
        produits: this.cartItems.map((item) => {
          console.log({
            produitId: item.product.id,
            quantite: item.quantity,
          });

          const product = {
            produitId: item.product.id,
            quantite: item.quantity,
          };

          return product;
        }),
      };
      console.log('Commande envoyée:', commande);
      this.commandeService.createCommande(commande).subscribe({
        next: (response) => {
          console.log('Commande créée avec succès:', response);
          this.commandeForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la commande:', err);
        },
      });
    }
  }

  close() {
    this.closed.emit(false);
  }
}
