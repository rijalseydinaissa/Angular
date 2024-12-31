import { CommonModule, NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink,NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(private router: Router) {}

    close = signal(false);

    OnInit() {
      console.log(this.router.url);
      
        this.close.set(true);
    }
    
    OnChanges() {
      console.log(this.router.url);
      
        this.close.set(true);
    }

    handleSubmit() {
      console.log('Connexion réussie');
      this.close.set(true);
      this.router.navigate(['/dashboard']);
    }


}
