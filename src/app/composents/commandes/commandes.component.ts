import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandFormComponent } from '../command-form/command-form.component';
import { CommandeCardComponent } from './commande-card/commande-card.component';

@Component({
  selector: 'app-commandes',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CommandFormComponent, CommandeCardComponent],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent {
  showProductForm = signal(false);

  // Commandes initiales
  commandes=[
    {
      id: 1001,
      client: 'Issa Diol',
      date: '17/12/2024',
      nombreProduits: 5,
      total: 200000,
      status: 'Non réglée',
    },
    {
      id: 1002,
      client: 'Aissatou Sarr',
      date: '16/12/2024',
      nombreProduits: 3,
      total: 150000,
      status: 'Réglée',
    },
    {
      id: 1003,
      client: 'Babacar Ndiaye',
      date: '15/12/2024',
      nombreProduits: 8,
      total: 500000,
      status: 'Non réglée',
    },
    {
      id: 1002,
      client: 'Aissatou Sarr',
      date: '16/12/2024',
      nombreProduits: 3,
      total: 150000,
      status: 'Réglée',
    },
    {
      id: 1003,
      client: 'Babacar Ndiaye',
      date: '15/12/2024',
      nombreProduits: 8,
      total: 500000,
      status: 'Non réglée',
    },
    {
      id: 1001,
      client: 'Issa Diol',
      date: '18/12/2024',
      nombreProduits: 5,
      total: 200000,
      status: 'Non réglée',
    },
    {
      id: 1002,
      client: 'Aissatou Sarr',
      date: '16/12/2024',
      nombreProduits: 3,
      total: 150000,
      status: 'Réglée',
    },
    {
      id: 1002,
      client: 'Aissatou Sarr',
      date: '16/12/2024',
      nombreProduits: 3,
      total: 150000,
      status: 'Réglée',
    },
    {
      id: 1003,
      client: 'Babacar Ndiaye',
      date: '15/12/2024',
      nombreProduits: 8,
      total: 500000,
      status: 'Non réglée',
    },
    {
      id: 1001,
      client: 'Issa Diol',
      date: '17/12/2024',
      nombreProduits: 5,
      total: 200000,
      status: 'Non réglée',
    },
    {
      id: 1002,
      client: 'Aissatou Sarr',
      date: '16/12/2024',
      nombreProduits: 3,
      total: 150000,
      status: 'Réglée',
    },
    {
      id: 1002,
      client: 'Aissatou Sarr',
      date: '16/12/2024',
      nombreProduits: 3,
      total: 150000,
      status: 'Réglée',
    }
  ];

  searchClient: string = '';
  filterDate: string = '';
  filteredCommandes = [...this.commandes];

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
    // Convertit le format "DD/MM/YYYY" en "YYYY-MM-DD" pour correspondre au format de l'input date
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
}
