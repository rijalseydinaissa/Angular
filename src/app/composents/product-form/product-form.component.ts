import { ProduitService } from './../../services/produit.service';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class ProductFormComponent {
  @Output() closed = new EventEmitter<boolean>();
  close = signal(false);
  productForm: FormGroup;
  errorMessage: string = '';
  imageFile: File | null = null;

  constructor(private fb: FormBuilder, private produitService: ProduitService) {
    this.productForm = this.fb.group({
      nom: ['', [Validators.required]],
      prixAchat: ['', [Validators.required, Validators.min(1)]],
      quantite: ['', [Validators.required, Validators.min(1)]],
      categorie: ['', [Validators.required]],
      prix: ['', [Validators.required, Validators.min(1)]],
    });
  }

  handleClose() {
    this.close.set(!this.close());
    this.closed.emit(this.close());
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  handleSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData = {
      ...this.productForm.value,
      prixAchat: Number(this.productForm.value.prixAchat),
      prix: Number(this.productForm.value.prix),
      quantite: Number(this.productForm.value.quantite)
    };
    // D'abord créer le produit
    this.produitService.createProduct(productData).subscribe({
      next: (response) => {
        console.log('Produit créé avec succès:', response);
        
        // Si une image a été sélectionnée, l'uploader
        if (this.imageFile && response.id) {
          this.produitService.uploadProductImage(response.id, this.imageFile).subscribe({
            next: () => {
              console.log('Image uploadée avec succès');
              this.handleClose();
            },
            error: (error) => {
              console.error('Erreur lors de l\'upload de l\'image:', error);
              this.errorMessage = 'Le produit a été créé mais l\'upload de l\'image a échoué';
            }
          });
        } else {
          this.handleClose();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création du produit:', error);
        this.errorMessage = 'Erreur lors de la création du produit. Veuillez réessayer.';
      }
    });
  }
}