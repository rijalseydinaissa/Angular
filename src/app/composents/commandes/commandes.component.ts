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
  // Commandes initiales
  // commandes=[
  //   {
  //     id: 1001,
  //     client: 'Issa Diol',
  //     date: '17/12/2024',
  //     nombreProduits: 5,
  //     total: 200000,
  //     status: 'Non réglée',
  //   },
  //   {
  //     id: 1002,
  //     client: 'Aissatou Sarr',
  //     date: '16/12/2024',
  //     nombreProduits: 3,
  //     total: 150000,
  //     status: 'Réglée',
  //   },
  //   {
  //     id: 1003,
  //     client: 'Babacar Ndiaye',
  //     date: '15/12/2024',
  //     nombreProduits: 8,
  //     total: 500000,
  //     status: 'Non réglée',
  //   },
  //   {
  //     id: 1002,
  //     client: 'Aissatou Sarr',
  //     date: '16/12/2024',
  //     nombreProduits: 3,
  //     total: 150000,
  //     status: 'Réglée',
  //   },
  //   {
  //     id: 1003,
  //     client: 'Babacar Ndiaye',
  //     date: '15/12/2024',
  //     nombreProduits: 8,
  //     total: 500000,
  //     status: 'Non réglée',
  //   },
  //   {
  //     id: 1001,
  //     client: 'Issa Diol',
  //     date: '18/12/2024',
  //     nombreProduits: 5,
  //     total: 200000,
  //     status: 'Non réglée',
  //   },
  //   {
  //     id: 1002,
  //     client: 'Aissatou Sarr',
  //     date: '16/12/2024',
  //     nombreProduits: 3,
  //     total: 150000,
  //     status: 'Réglée',
  //   },
  //   {
  //     id: 1002,
  //     client: 'Aissatou Sarr',
  //     date: '16/12/2024',
  //     nombreProduits: 3,
  //     total: 150000,
  //     status: 'Réglée',
  //   },
  //   {
  //     id: 1003,
  //     client: 'Babacar Ndiaye',
  //     date: '15/12/2024',
  //     nombreProduits: 8,
  //     total: 500000,
  //     status: 'Non réglée',
  //   },
  //   {
  //     id: 1001,
  //     client: 'Issa Diol',
  //     date: '17/12/2024',
  //     nombreProduits: 5,
  //     total: 200000,
  //     status: 'Non réglée',
  //   },
  //   {
  //     id: 1002,
  //     client: 'Aissatou Sarr',
  //     date: '16/12/2024',
  //     nombreProduits: 3,
  //     total: 150000,
  //     status: 'Réglée',
  //   },
  //   {
  //     id: 1002,
  //     client: 'Aissatou Sarr',
  //     date: '16/12/2024',
  //     nombreProduits: 3,
  //     total: 150000,
  //     status: 'Réglée',
  //   }
  // ];

  // searchClient: string = '';
  // filterDate: string = '';
  // filteredCommandes = [...this.commandes];
  ngOnInit(): void {
    this.loadCommandes();
  }
  loadCommandes(): void {
    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.filteredCommandes = [...this.commandes];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes :', error);
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
  private formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
}
