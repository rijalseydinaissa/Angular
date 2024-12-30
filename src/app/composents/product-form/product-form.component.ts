import { ProduitService } from './../../services/produit.service';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
 selector: 'app-product-form',
 templateUrl: './product-form.component.html',
 styleUrls: ['./product-form.component.css'],
 imports: [FormsModule, ReactiveFormsModule, CommonModule],
 standalone: true
})
export class ProductFormComponent {
 @Output() closed = new EventEmitter<boolean>();
 @Output() productCreated = new EventEmitter<any>();
 
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

  this.produitService.createProductWithImage(productData, this.imageFile).subscribe({
    next: (response) => {
      this.productCreated.emit(response);
      this.productForm.reset();
      //this.handleClose();
    },
    error: (error) => {
      console.error('Erreur:', error);
      this.errorMessage = 'Erreur lors de la création du produit. Veuillez réessayer.';
    }
  });
}
}



