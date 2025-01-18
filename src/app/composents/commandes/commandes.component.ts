import { CommonModule } from '@angular/common';
import { Component, signal,OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandFormComponent } from '../command-form/command-form.component';
import { CommandeCardComponent } from './commande-card/commande-card.component';
import { CommandeService } from '../../services/commande.service';
import { CommandeDetailComponent } from './commande-detail/commande-detail.component';

@Component({
  selector: 'app-commandes',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CommandFormComponent, CommandeCardComponent,CommandeDetailComponent],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {
  showProductForm = signal(false);
  commandes: any[] = [];
  filteredCommandes: any[] = [];
  searchClient: string = '';
  filterDate: string = '';
  commande = signal({client:"",date:"",montantTotal:0,commandeProduits:Array,status:"",id:0});
  showDetail = signal<boolean>(true);

  setCommande(commande: any) {
    this.commande.set(commande);
  }

  showDetailModal(commande: any) {
    
    this.setCommande(commande);
    this.showDetail.set(!this.showDetail()); 
    console.log(commande);
  }

  constructor(private commandeService:CommandeService){}
  
  ngOnInit(): void {
    this.loadCommandes();
  }
  loadCommandes(): void {
    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.filteredCommandes = [...this.commandes];
        this.filterCommandes(); // Applique les filtres existants
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes :', error);
      }
    });
  }

  handleForm(bole: boolean) {
    this.showProductForm.set(bole);
  }

  filterCommandes() {
    this.filteredCommandes = this.commandes.filter(commande => {
      const matchesClient =
        this.searchClient === '' || commande.client.toLowerCase().includes(this.searchClient.toLowerCase());
        const matchesDate = this.filterDate
        ? this.formatDate(commande.date) === this.filterDate
        : true;
      return matchesClient && matchesDate;
    });
  }
  handleStatusChange(event: {id: number, status: string}) {
    if (!event.id) {
      console.error('ID de commande manquant');
      return;
    }
    console.log('Mise à jour du statut pour la commande:', event.id, 'nouveau statut:', event.status);
    
    this.commandeService.updateCommandeStatus(event.id, event.status).subscribe({
      next: (response) => {
        console.log('Statut mis à jour avec succès:', response);
        // Mettre à jour le statut dans le tableau local
        const index = this.commandes.findIndex(c => c.id === event.id);
        if (index !== -1) {
          this.commandes[index].status = event.status;
          this.filteredCommandes = [...this.commandes];
          this.filterCommandes();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    });
  }
  private formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
}
