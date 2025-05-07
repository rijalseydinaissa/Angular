import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface CategorieResponse {
  id: number;
  nom: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private endpoint = 'categories';
  private categoriesSubject = new BehaviorSubject<CategorieResponse[]>([]);
  categories = this.categoriesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCategories();
  }

  public loadCategories() {
    this.apiService.get<CategorieResponse[]>(this.endpoint).subscribe(data => {
      this.categoriesSubject.next(data);
      console.log(data);
    });
  }

  public getCategories(): Observable<CategorieResponse[]> {
    return this.categories;
  }

  public createCategorie(categorieData: { nom: string }): Observable<CategorieResponse> {
    return this.apiService.post<CategorieResponse>(this.endpoint, categorieData).pipe(
      tap({
        next: (newCategorie) => {
          const currentCategories = this.categoriesSubject.getValue();
          this.categoriesSubject.next([...currentCategories, newCategorie]);
        },
        // Ne rien faire en cas d'erreur - ne pas mettre à jour le BehaviorSubject
        error: (error) => console.error('Erreur lors de la création:', error)
      })
    );
  }
  
  public updateCategorie(id: number, categorieData: { nom: string }): Observable<CategorieResponse> {
    return this.apiService.put<CategorieResponse>(`${this.endpoint}/${id}`, { id, ...categorieData }).pipe(
      tap({
        next: (updatedCategorie) => {
          const currentCategories = this.categoriesSubject.getValue();
          const updatedCategories = currentCategories.map(cat =>
            cat.id === id ? updatedCategorie : cat
          );
          this.categoriesSubject.next(updatedCategories);
        },
        // Ne rien faire en cas d'erreur
        error: (error) => console.error('Erreur lors de la mise à jour:', error)
      })
    );
  }
  public deleteCategorie(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.getValue();
        this.categoriesSubject.next(currentCategories.filter(cat => cat.id !== id));
      })
    );
  }
}