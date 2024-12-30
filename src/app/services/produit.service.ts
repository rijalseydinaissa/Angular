import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<any> {
    return this.http.get(this.baseUrl+"/produits");
  }

  public createProduct(productData: any): Observable<any> {
    return this.http.post(this.baseUrl+"/produits", productData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  public uploadProductImage(productId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    // Correction de l'URL pour l'upload d'image
    return this.http.post(`${this.baseUrl}/${productId}/image`, formData);
  }
}