import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  imports:[FormsModule,ReactiveFormsModule]
})
export class ProductFormComponent {
  
  @Output() closed = new EventEmitter<boolean>();
  close = signal(false);

  handleClose() {
    this.close.set(!this.close());
    this.closed.emit(this.close());
  }

  handleSubmit() {
    console.log("helfkzl");
    this.handleClose()
  }

  
}