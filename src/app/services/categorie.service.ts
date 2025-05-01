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
      tap(newCategorie => {
        const currentCategories = this.categoriesSubject.getValue();
        this.categoriesSubject.next([...currentCategories, newCategorie]);
      })
    );
  }

  public updateCategorie(id: number, categorieData: { nom: string }): Observable<CategorieResponse> {
    return this.apiService.put<CategorieResponse>(`${this.endpoint}/${id}`, { id, ...categorieData }).pipe(
      tap(updatedCategorie => {
        const currentCategories = this.categoriesSubject.getValue();
        const updatedCategories = currentCategories.map(cat => 
          cat.id === id ? updatedCategorie : cat
        );
        this.categoriesSubject.next(updatedCategories);
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