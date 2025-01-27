import { FactureService } from './../../../services/facture.service';
import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter,ViewChild, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector, ChangeDetectorRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FactureComponent } from '../../facture/facture.component';

interface ArticlePanier {
  produit: {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
    image: string;
  }
}

@Component({
  selector: 'app-commande-detail',
  imports: [NgFor, NgClass,],
  templateUrl: './commande-detail.component.html',
  styleUrls: ['./commande-detail.component.css'],
  standalone: true
})
export class CommandeDetailComponent {

  

  @Input() nom: string = '';
  @Input() prenom: string = '';
  @Input() currentTotal: number = 0;
  @Input() cartTotal: number = 0;
  @Input() cartItems: any = [];
  @Input() status: string = 'Non réglée';
  @Output() close = new EventEmitter<boolean>();
  nombreProduits: number = 0;

  @Input() closed: boolean = true;
  @Output() deleteCommand = new EventEmitter<number>(); 
  @Input() commandeId!: number ;

  deleteCommande() {
    this.deleteCommand.emit(this.commandeId); // Vous devez ajouter @Input() commandeId: number
    this.closeOverlay();
  }

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private factureService :FactureService
  ) {}
  // updateCartItemQuantity(item: any, change: number) {
  //   item.quantite += change;
  //   // Recalculer le total ici
  //   this.calculateTotal();
  // }
  reglerFacture(commandeId: number): void {
    console.log('Appel de génération de facture pour commande ID :', commandeId);
    
    this.factureService.genererFacture(commandeId).subscribe({
        next: (url: string) => {
            console.log('URL reçue :', url);
            
            this.factureService.telechargerFacture(url).subscribe({
                next: (blob: Blob) => {
                    // Vérifier que le blob est un PDF
                    if (blob.type === 'application/pdf') {
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `facture_${commandeId}.pdf`;
                        link.click();
                        window.URL.revokeObjectURL(link.href);
                    } else {
                        console.error('Le fichier reçu n\'est pas un PDF');
                    }
                },
                error: (err) => {
                    console.error('Erreur lors du téléchargement :', err);
                    // Ajouter une notification utilisateur ici
                }
            });
        },
        error: (err) => {
            console.error('Erreur lors de la génération :', err);
            // Ajouter une notification utilisateur ici
        }
    });
}
  
  
  
  

  removeFromCart(arg: any) {
    this.currentTotal = 500000;
  }

  handleSubmit() {
    console.log('Commande enregistrée');
  }

  closeOverlay() {
    this.closed = !this.closed;
    this.close.emit(this.closed);
  }
}
