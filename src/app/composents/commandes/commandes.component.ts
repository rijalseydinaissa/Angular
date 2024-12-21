import { CommonModule } from '@angular/common';
import { Component,signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommandFormComponent } from '../command-form/command-form.component';
import { CommandeCardComponent } from "./commande-card/commande-card.component";

@Component({
  selector: 'app-commandes',
  imports: [CommonModule, ReactiveFormsModule, CommandFormComponent, CommandeCardComponent],
  templateUrl: './commandes.component.html',
  styleUrl: './commandes.component.css'
})
export class CommandesComponent {

  showProductForm= signal(false);

  closeForm(bole: boolean) {

  }

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

}
