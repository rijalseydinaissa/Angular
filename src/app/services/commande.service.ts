import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiURL = "http://localhost:8081";
  private commandesSubject = new BehaviorSubject<any[]>([]);
  commandes$ = this.commandesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialCommandes();
  }

  private loadInitialCommandes(): void {
    this.http.get<any[]>(`${this.apiURL}/commandes`)
      .subscribe(commandes => {
        this.commandesSubject.next(commandes);
      });
  }

  public getCommandes(): Observable<any> {
    return this.commandes$;
  }

  public createCommande(commandeData: any): Observable<any> {
    return this.http.post(`${this.apiURL}/commandes`, commandeData)
      .pipe(
        tap(newCommande => {
          const currentCommandes = this.commandesSubject.value;
          this.commandesSubject.next([...currentCommandes, newCommande]);
        })
      );
  }

  public getProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/produits`);
  }
}