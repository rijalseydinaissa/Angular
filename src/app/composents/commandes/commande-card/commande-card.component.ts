import { Component, Input } from '@angular/core';
import { CardlineComponent } from "./cardline/cardline.component";
import { CommandesComponent } from '../commandes.component';

@Component({
  selector: 'app-commande-card',
  imports: [CardlineComponent],
  templateUrl: './commande-card.component.html',
  styleUrl: './commande-card.component.css'
})
export class CommandeCardComponent {
  @Input() id!: number;
  @Input() client!: string;
  @Input() date!: string;
  @Input() nombreProduits!: number;
  @Input() total!: number;
  @Input() status!: string;
}
