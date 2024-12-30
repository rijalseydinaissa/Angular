import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, tap } from 'rxjs';
import { switchMap, map, of } from 'rxjs';

interface ProductResponse {
  id: number;
  nom: string;
  prix: number;
  prixAchat: number;
  quantite: number;
  categorie: string;
  image: string | null;
  statut: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private baseUrl = 'http://localhost:8081';
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    this.http.get<any[]>(this.baseUrl + "/produits").subscribe(data => {
      this.productsSubject.next(data);
    });
  }

  public getProducts(): Observable<any> {
    return this.products$;
  }

 // produit.service.ts
 public createProductWithImage(productData: any, imageFile: File | null): Observable<ProductResponse> {
  return this.http.post<ProductResponse>(this.baseUrl + "/produits", productData).pipe(
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

  public uploadProductImage(productId: number, imageFile: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<{url: string}>(`${this.baseUrl}/produits/${productId}/image`, formData);
}
}