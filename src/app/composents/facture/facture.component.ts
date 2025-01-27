import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-facture',
  standalone: true,
  styleUrls: ['./facture.component.css'],
  // templateUrl:['./facture.component.html'],
  imports: [CommonModule],
  template:``
 
})
export class FactureComponent {
  @Input() commandeId!: number;
  @Input() nom: string = '';
  @Input() cartItems: any[] = [];
  @Input() currentTotal: number = 0;
  date = new Date().toLocaleDateString();
}