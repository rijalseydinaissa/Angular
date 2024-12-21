import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cardline',
  imports: [NgIf],
  templateUrl: './cardline.component.html',
  styleUrl: './cardline.component.css'
})
export class CardlineComponent {
  @Input() attribut: string = '';
  @Input() valeur: string | number = '';
  @Input() icon: string = '';
  @Input() color: string = '';
}
