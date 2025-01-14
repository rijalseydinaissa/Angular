import { CommandeService } from './../../services/commande.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
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

  // Create a loading
  createLoading() {
    Swal.fire({
      title: 'En cours',
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  handleSubmit() {
    if (this.commandeForm.valid && this.cartItems.length > 0) {
      // Show loading
      this.createLoading();
  
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
          // Close loading
          Swal.close();
          
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Commande enregistrée!',
            text: 'La commande a été créée avec succès',
            confirmButtonText: 'Super!',
            confirmButtonColor: '#28a745',
            timer: 2000,
            timerProgressBar: true
          });
  
          // Reset form and cart after successful creation
          this.commandeForm.reset();
          this.cartItems = [];
          console.log('Commande créée avec succès:', response);
        },
        error: (err) => {
          // Close loading
          Swal.close();
          
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de créer la commande',
            footer: 'Veuillez réessayer plus tard',
            confirmButtonColor: '#dc3545',
            showCancelButton: true,
            cancelButtonText: 'Fermer',
            confirmButtonText: 'Réessayer'
          }).then((result) => {
            if (result.isConfirmed) {
              // If user clicks "Réessayer", try submitting again
              this.handleSubmit();
            }
          });
          
          console.error('Erreur lors de la création de la commande:', err);
        },
      });
    } else {
      // Show validation error if form is invalid or cart is empty
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: this.cartItems.length === 0 
          ? 'Votre panier est vide'
          : 'Veuillez remplir tous les champs requis',
        confirmButtonColor: '#ffc107'
      });
  
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.commandeForm.controls).forEach(key => {
        const control = this.commandeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  close() {
    this.closed.emit(false);
  }
}
