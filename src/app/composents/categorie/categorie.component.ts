import { PaginationService } from './../../services/pagination.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategorieService, CategorieResponse } from '../../services/categorie.service';
import { AlertService } from '../../services/alert.service';

interface Categorie {
  id: number;
  nom: string;
}
@Component({
  selector: 'app-categorie-management',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CategorieComponent implements OnInit {
[x: string]: any;
  categories: CategorieResponse[] = [];
  categorieForm: FormGroup;
  isEditMode = false;
  currentCategorieId: number | null = null;
  selectedCategorie: Categorie | null = null;

  pageSize = 5;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private categorieService: CategorieService,
    private fb: FormBuilder,
    private alertService: AlertService,private paginationService:PaginationService
  ) {
    this.categorieForm = this.fb.group({
      nom: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe(
      categories => {
        this.categories = categories;
        this.updateTotalPages();
      },
      error => {
        this.alertService.showError('Erreur lors du chargement des catégories');
      }
    );
  }

  onSubmit(): void {
    if (this.categorieForm.invalid) {
      return;
    }
  
    this.alertService.showLoading();
  
    if (this.isEditMode && this.currentCategorieId) {
      this.categorieService.updateCategorie(this.currentCategorieId, this.categorieForm.value).subscribe({
        next: (response) => {
          this.handleSuccess('Catégorie mise à jour avec succès');
          this.resetForm();
        },
        error: (error) => {
          this.handleError(error?.error?.message || 'Erreur lors de la mise à jour de la catégorie');
        }
      });
    } else {
      this.categorieService.createCategorie(this.categorieForm.value).subscribe({
        next: (response) => {
          this.handleSuccess('Catégorie créée avec succès');
          this.resetForm();
        },
        error: (error) => {
          // Utiliser le message d'erreur du serveur si disponible
          this.handleError(error?.error?.message || 'Erreur lors de la création de la catégorie');
        }
      });
    }
  }

  editCategorie(categorie: CategorieResponse): void {
    this.isEditMode = true;
    this.currentCategorieId = categorie.id;
    this.categorieForm.patchValue({
      nom: categorie.nom
    });
  }

  deleteCategorie(id: number): void {
      if (confirm('Etes-vous sur de vouloir supprimer cette catégorie ?')) {
        // this.alertService.showLoading();
        this.categorieService.deleteCategorie(id).subscribe(
          () => {
            this.handleSuccess('Catégorie supprimée avec succès');
          },
          error => {
            this.handleError('Erreur lors de la suppression. Cette catégorie est peut-être utilisée par des produits.');
          }
        );
      }
    ;
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentCategorieId = null;
    this.categorieForm.reset();
  }

  private handleSuccess(message: string): void {
    this.alertService.closeAlert();
    this.alertService.showSuccess(message);
    this.loadCategories(); // Actualiser la liste
  }

  private handleError(message: string): void {
    this.alertService.closeAlert();
    this.alertService.showError(message);
  }
  //pagination 
  updateTotalPages() {
    this.totalPages = this.paginationService.getTotalPages(this.categories, this.pageSize);
  }

  get paginedCategories(){
    return this.paginationService.getPaginatedItems(this.categories, this.currentPage, this.pageSize);
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  getVisiblePages(): number[] {
    return this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
  }
  // In your component class
  getMaxVisibleIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.categories.length);
  }
  // changePageSize() {
  //   // Convertir pageSize en nombre car les valeurs de select sont souvent des chaînes
  //   this.pageSize = Number(this.pageSize);
    
  //   // Recalculer le nombre total de pages avec la nouvelle taille
  //   this.updateTotalPages();
    
  //   // Ajuster la page courante si nécessaire
  //   if (this.currentPage > this.totalPages) {
  //     this.currentPage = this.totalPages || 1;
  //   }
  // }
  //fin pagination



}