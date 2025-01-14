import { ProduitService } from './../../services/produit.service';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
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
  if (this.productForm.valid) {
    // Show loading
    Swal.fire({
      title: 'En cours',
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const productData = {
      ...this.productForm.value,
      prixAchat: Number(this.productForm.value.prixAchat),
      prix: Number(this.productForm.value.prix),
      quantite: Number(this.productForm.value.quantite)
    };

    this.produitService.createProductWithImage(productData, this.imageFile).subscribe({
      next: (response) => {
        // Close loading
        Swal.close();
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Produit enregistré!',
          text: 'Le produit a été ajouté à la base de données',
          confirmButtonText: 'Super!',
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true
        });

        // Emit the created product
        this.productCreated.emit(response);
        // Reset form and image
        this.productForm.reset();
        this.imageFile = null;
        console.log('Produit créé avec succès:', response);
      },
      error: (error) => {
        // Close loading
        Swal.close();
        
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de créer le produit',
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
        console.error('Erreur lors de la création du produit:', error);
        this.errorMessage = 'Erreur lors de la création du produit. Veuillez réessayer.';
      },
    });
  } else {
    // Show validation error
    Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: 'Veuillez remplir tous les champs requis correctement',
      confirmButtonColor: '#ffc107'
    });
    // Mark all form controls as touched to trigger validation messages
    this.productForm.markAllAsTouched();
  }
}
}



