import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiURL = "http://localhost:8081";

  constructor(private http: HttpClient) { }
  public getCommandes(): Observable<any> {
    return this.http.get<any[]>(this.apiURL+"/commandes");
  }
  public createCommande(commandeData:any): Observable<any> {
    return this.http.post(this.apiURL+"/commandes", commandeData);
  }
  public getProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/produits`);
  }
}
