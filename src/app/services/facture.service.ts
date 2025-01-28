import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  // private baseUrl = 'http://localhost:8081';
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {
  }
  genererFacture(commandeId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/factures/generer/${commandeId}`, {
      responseType: 'text', // Indique que la réponse est en texte brut
    });
  }
  
  
  telechargerFacture(urlUnique: string): Observable<any> {
    // Extraire uniquement l'identifiant unique de l'URL complète
    const id = urlUnique.split('/').pop();
    return this.http.get(`${this.apiUrl}/factures/telecharger-facture/${id}`, {
        responseType: 'blob' as 'json',
    });
}
  
}
