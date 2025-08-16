import { PaginationService } from './pagination.service';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { BehaviorSubject, tap } from 'rxjs';
import { switchMap, map, of } from 'rxjs';
import { CategorieResponse } from './categorie.service';

export interface ProductResponse {
  id: number;
  nom: string;
  code:string;
  prix: number;
  prixAchat: number;
  quantite: number;
  categorie: CategorieResponse;
  image: string | null;
  statut: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  // private baseUrl = 'http://localhost:8081';
  private endpoint = 'produits';
  private productsSubject = new BehaviorSubject<any[]>([]);
  products = this.productsSubject.asObservable();

  constructor(
    private apiService : ApiService
    ) {
    this.loadProducts();
  }

  public loadProducts() {
    this.apiService.get<ProductResponse[]>(this.endpoint).subscribe(data => {
      // S'assurer que chaque produit a une propriété image
      const productsWithImage = data.map((product: { image: any; }) => ({
        ...product,
        image: product.image || null
      }));
      this.productsSubject.next(productsWithImage);
    });
  }

  public getProducts(): Observable<ProductResponse[]> {
    return this.products;
  }
  deleteProduct(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        const currentProducts = this.productsSubject.getValue();
        this.productsSubject.next(currentProducts.filter(product => product.id !== id));
      })
    );
  }
  // public login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(this.baseUrl + "/login", { username, password });
  // }
// Dans ProduitService
updateProduct(id: number, productData: any, imageFile: File | null): Observable<any> {
  return this.apiService.put<ProductResponse>(`${this.endpoint}/${id}`, productData).pipe(
    map(response => {
      // Si la réponse est null, retournons les données envoyées
      if (!response) {
        return {
          ...productData,
          id: id
        };
      }
      return response;
    }),
    switchMap(response => {
      if (imageFile) {
        return this.uploadProductImage(id, imageFile).pipe(
          map(imageResponse => ({
            ...response,
            image: imageResponse.url
          }))
        );
      }
      return of(response);
    }),
    tap(finalProduct => {
      const currentProducts = this.productsSubject.getValue();
      const updatedProducts = currentProducts.map(product => 
        product.id === id ? finalProduct : product
      );
      this.productsSubject.next(updatedProducts);
      console.log('Produits mis à jour :', this.productsSubject.getValue());
    })
  );
}
 // Création d'un produit avec image
  public createProductWithImage(productData: any, imageFile: File | null): Observable<ProductResponse> {
    return this.apiService.post<ProductResponse>(this.endpoint, productData).pipe(
      switchMap(response => {
        if (imageFile && response.id) {
          return this.uploadProductImage(response.id, imageFile).pipe(
            map(imageResponse => ({ ...response, image: imageResponse.url }))
          );
        }
        return of(response);
      }),
      tap(finalProduct => {
        const currentProducts = this.productsSubject.getValue();
        this.productsSubject.next([finalProduct, ...currentProducts]);
      })
    );
  }

  // Upload d'image pour un produit - CORRIGÉ
  public uploadProductImage(productId: number, imageFile: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Utiliser la méthode uploadFile dédiée pour les FormData
    return this.apiService.uploadFile<{url: string}>(`${this.endpoint}/${productId}/image`, formData);
  }
}

