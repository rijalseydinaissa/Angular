import { CommonModule, NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ProduitService } from '../../services/produit.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, NgClass, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private produitService: ProduitService) {}

  close = signal(false);

  username = '';
  password = '';
  response = '';

  ngOnInit() {
    console.log(this.router.url);
    this.close.set(true);
  }

  ngOnChanges() {
    console.log(this.router.url);
    this.close.set(true);
  }

  // handleSubmit() {
  //   this.produitService
  //     .login(this.username, this.password)
  //     .subscribe((data) => {
  //       this.response = data;
  //     });

  //   if (this.response != '') {
  //     this.close.set(true);
  //     this.router.navigate(['/dashboard']);
  //   }
  // }
}
