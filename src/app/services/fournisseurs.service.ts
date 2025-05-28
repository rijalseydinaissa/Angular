import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable,tap } from 'rxjs';

export interface Fournisseur {
  id: number;
  nom: string;  
  adresse: string;
  email: string;
  telephone: string;
}

@Injectable({
  providedIn: 'root'
})
export class FournisseursService {
  private endpoint = 'fournisseurs';
  private fournisseursSubject = new BehaviorSubject<Fournisseur[]>([]);
  fournisseurs = this.fournisseursSubject.asObservable();

  constructor(private ApiService: ApiService) {
    this.loadFournisseurs();
   }

  public loadFournisseurs() {
    this.ApiService.get<Fournisseur[]>(this.endpoint).subscribe(data => {
      this.fournisseursSubject.next(data);
      console.log(data);
    })
  }
  public getFournisseurs(): Observable<Fournisseur[]> {
    return this.fournisseurs;
  }
  public createFournisseur(fournisseurData: Fournisseur): Observable<Fournisseur> {
    return this.ApiService.post<Fournisseur>(`${this.endpoint}`, fournisseurData)
      .pipe(
        tap((newFournisseur: Fournisseur) => {
          const currentFournisseurs = this.fournisseursSubject.value;
          this.fournisseursSubject.next([...currentFournisseurs, newFournisseur]);
        })
      );
  }
  public deleteFournisseur(id:number) {
    this.ApiService.delete<Fournisseur>(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        const currentFournisseurs = this.fournisseursSubject.getValue();
        this.fournisseursSubject.next(currentFournisseurs.filter(fournisseur => fournisseur.id !== id));
      })
    );
  }
  public updateFournisseur(id: number, fournisseurData: Fournisseur): Observable<Fournisseur> {
    return this.ApiService.put<Fournisseur>(`${this.endpoint}/${id}`, fournisseurData).pipe(
      tap({
        next: (updatedFournisseur) => {
          const currentFournisseurs = this.fournisseursSubject.getValue();
          const updatedFournisseurs = currentFournisseurs.map(fournisseur =>
            fournisseur.id === id ? updatedFournisseur : fournisseur
          );
          this.fournisseursSubject.next(updatedFournisseurs);
        },
        // Ne rien faire en cas d'erreur
        error: (error) => console.error('Erreur lors de la mise à jour:', error)
      })
    );
  }
}
