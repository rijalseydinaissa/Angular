import { ProduitService } from './../../services/produit.service';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { CategorieResponse ,CategorieService } from '../../services/categorie.service';

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
 @Output() productUpdated = new EventEmitter<any>();
 @Input() productToEdit: any = null;
  
 close = signal(false);
 productForm: FormGroup;
 errorMessage: string = '';
 imageFile: File | null = null;
 isEditMode = false;
 categories: CategorieResponse[] = [];

 constructor(private fb: FormBuilder, private produitService: ProduitService,private alertService: AlertService,private categorieService: CategorieService) {
   this.productForm = this.fb.group({
     nom: ['', [Validators.required]],
     prixAchat: ['', [Validators.required, Validators.min(1)]],
     quantite: ['', [Validators.required, Validators.min(1)]],
     categorieId: ['', [Validators.required]],
     prix: ['', [Validators.required, Validators.min(1)]],
   });
 }

 ngOnInit() {
    this.categorieService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;

        if (this.productToEdit) {
          this.isEditMode = true;
          this.productForm.patchValue({
            nom: this.productToEdit.nom,
            prixAchat: this.productToEdit.prixAchat,
            quantite: this.productToEdit.quantite,
            categorieId: this.productToEdit.categorie.id,
            prix: this.productToEdit.prix,
          });

          setTimeout(() => {
            this.productForm.get('categorieId')?.updateValueAndValidity();
          });
        }
      },
      error: (err) => {
        const errorResponse = this.alertService.handleHttpError(err);
        if (errorResponse) {
          this.alertService.showError(errorResponse.message, errorResponse.errorCode);
        } else {
          this.alertService.showError('Erreur lors du chargement des catégories');
        }
      }
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
      this.alertService.showLoading(
        this.isEditMode ? 'Mise à jour du produit...' : 'Création du produit...'
      );

      const categorieId = Number(this.productForm.value.categorieId);
      const categorie = this.categories.find(cat => cat.id === categorieId);

      if (!categorie) {
        this.alertService.closeAlert();
        this.alertService.showError('Catégorie invalide');
        return;
      }

      const productData = {
        ...this.productForm.value,
        prixAchat: Number(this.productForm.value.prixAchat),
        prix: Number(this.productForm.value.prix),
        quantite: Number(this.productForm.value.quantite),
        categorie: categorie
      };
      delete productData.categorieId;
      
      if (this.isEditMode) {
        this.updateProduct(productData);
      } else {
        this.createProduct(productData);
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
    }
  }
createProduct(productData: any){
  this.produitService.createProductWithImage(productData ,this.imageFile).subscribe({
    next: (response) => {
      this.handleSuccess(response,"crée");
      this.productCreated.emit(response);
    },
    error: (error) => {
      this.handleError(error);
    }
  });
}
private updateProduct(productData: any) {
    if (!this.productToEdit?.id) {
      this.alertService.closeAlert();
      this.alertService.showError('Produit invalide');
      return;
    }

    const updateData = {
      id: this.productToEdit.id,
      nom: productData.nom,
      prixAchat: parseFloat(productData.prixAchat),
      prix: parseFloat(productData.prix),
      quantite: parseInt(productData.quantite),
      categorie: { id: productData.categorie.id },
      image: this.productToEdit.image
    };

    this.produitService.updateProduct(this.productToEdit.id, updateData, this.imageFile)
      .subscribe({
        next: (response) => {
          const updatedProduct = response || updateData;
          this.productUpdated.emit(updatedProduct);
          this.produitService.loadProducts();
          this.handleSuccess(updatedProduct, 'mis à jour');
        },
        error: (error) => this.handleError(error)
      });
  }


private handleSuccess(response: any, action: string) {
    this.alertService.closeAlert();
    this.alertService.showSuccess(`Le produit a été ${action} avec succès`);
    this.productForm.reset();
    this.imageFile = null;
    this.handleClose();
  }

private handleError(error: any) {
    this.alertService.closeAlert();
    const errorResponse = this.alertService.handleHttpError(error);
    
    if (errorResponse) {
      this.alertService.showError(errorResponse.message, errorResponse.errorCode)
        .then((result) => {
          if (result.isConfirmed && errorResponse.errorCode !== 'DUPLICATE_RESOURCE') {
            this.handleSubmit();
          }
        });
    } else {
      this.alertService.showError(
        `Impossible de ${this.isEditMode ? 'mettre à jour' : 'créer'} le produit`
      );      
    }
}
}






