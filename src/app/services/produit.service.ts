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

  public loadProducts() {
    this.http.get<any[]>(this.baseUrl + "/produits").subscribe(data => {
      // S'assurer que chaque produit a une propriété image
      const productsWithImage = data.map(product => ({
        ...product,
        image: product.image || null
      }));
      this.productsSubject.next(productsWithImage);
    });
  }

  public getProducts(): Observable<any> {
    return this.products$;
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/produits/${id}`);
  }

  public login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/login", { username, password });
  }
// Dans ProduitService
updateProduct(id: number, productData: any, imageFile: File | null): Observable<any> {
  const currentProducts = this.productsSubject.getValue();
  const currentProduct = currentProducts.find(p => p.id === id);
  
  const dataToSend = {
    ...productData,
    nom: productData.nom || '',
    prix: Number(productData.prix) || 0,
    quantite: Number(productData.quantite) || 0,
    categorie: productData.categorie || '',
    image: currentProduct?.image || null
  };

  return this.http.put<ProductResponse>(`${this.baseUrl}/produits/${id}`, dataToSend).pipe(
    switchMap(response => {
      if (imageFile) {
        return this.uploadProductImage(id, imageFile).pipe(
          map(imageResponse => ({
            ...response,
            image: imageResponse.url
          }))
        );
      }
      return of({
        ...response,
        image: currentProduct?.image || null
      });
    }),
    tap(finalProduct => {
      const currentProducts = this.productsSubject.getValue();
      const updatedProducts = currentProducts.map(product => 
        product.id === id ? { ...finalProduct } : product
      );
      this.productsSubject.next(updatedProducts);
    })
  );
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

