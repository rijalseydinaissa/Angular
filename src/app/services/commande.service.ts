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

  
  private sortCommandesByDate(commandes: any[]): any[] {
    return commandes.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  private loadInitialCommandes(): void {
    this.http.get<any[]>(`${this.apiURL}/commandes`)
      .subscribe(commandes => {
        const sortedCommandes = this.sortCommandesByDate(commandes);
        this.commandesSubject.next(sortedCommandes);
      });
  }

  public getCommandes(): Observable<any> {
    return this.commandes$;
  }

   updateCommandeStatus(id: number, status: string) {
    const url = `${this.apiURL}/commandes/${id}/status`;
    return this.http.patch(url, { status });
  }


  public createCommande(commandeData: any): Observable<any> {
    return this.http.post(`${this.apiURL}/commandes`, commandeData)
      .pipe(
        tap(newCommande => {
          const currentCommandes = this.commandesSubject.value;
          this.commandesSubject.next([newCommande, ...currentCommandes]);
        })
      );
  }

  public getProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/produits`);
  }
}