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
import { AlertService } from '../../services/alert.service';
import { ProduitService } from '../../services/produit.service';

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
    private commandeService: CommandeService,
    private produitService: ProduitService,
    private alertService: AlertService
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
    this.produitService.getProducts().subscribe({
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

  handleSubmit() {
    if (this.commandeForm.valid && this.cartItems.length > 0) {
      this.alertService.showLoading();
      const commande = {
        date: new Date(),
        status: 'NONREGLE',
        client: this.clientName,
        produits: this.cartItems.map((item) => ({
          produitId: item.product.id,
          quantite: item.quantity,
        })),
      };

      this.commandeService.createCommande(commande).subscribe({
        next: (response) => {
          this.alertService.closeAlert();
          this.alertService.showSuccess('La commande a été créée avec succès');
          this.commandeForm.reset();
          this.cartItems = [];
          this.produitService.loadProducts();
        },
        error: (err) => {
          this.alertService.closeAlert();
          this.alertService.showError('Impossible de créer la commande').then((result) => {
            if (result.isConfirmed) {
              this.handleSubmit();
            }
          });
        },
      });
    } else {
      const message = this.cartItems.length === 0 
        ? 'Votre panier est vide'
        : 'Veuillez remplir tous les champs requis';
      this.alertService.showWarning(message);
      this.commandeForm.markAllAsTouched();
    }
  }

  close() {
    this.closed.emit(false);
  }
}
