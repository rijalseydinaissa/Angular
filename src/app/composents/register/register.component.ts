// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/commandes']);
    }

    this.registerForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() { return this.registerForm.controls; }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Marquer tous les champs comme touched pour afficher les erreurs
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.controls[key].markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    // Préparer les données pour l'API (format attendu par votre backend)
    const userData = {
      nom: this.f['nom'].value,
      prenom: this.f['prenom'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: this.f['role'].value
    };

    console.log('Envoi des données:', userData); // Pour debug

    this.authService.register(userData)
      .subscribe({
        next: (response) => {
          console.log('Réponse reçue:', response); // Pour debug
          this.success = 'Compte créé avec succès ! Redirection...';
          this.loading = false;
          
          // Rediriger vers le dashboard après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/commandes']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur complète:', error); // Pour debug
          
          // Gérer les différents types d'erreurs
          if (error.status === 409) {
            // Erreur 409 - Conflit (email déjà existant)
            this.error = error.error?.error || error.error?.message || 'Un compte avec cet email existe déjà';
          } else if (error.status === 400) {
            // Erreur 400 - Bad Request
            this.error = error.error?.error || error.error?.message || 'Données invalides. Veuillez vérifier vos informations';
          } else if (error.status === 0) {
            // Erreur de connexion au serveur
            this.error = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
          } else if (error.error) {
            // Autres erreurs avec un message du backend
            if (typeof error.error === 'string') {
              this.error = error.error;
            } else if (error.error.error) {
              this.error = error.error.error;
            } else if (error.error.message) {
              this.error = error.error.message;
            } else {
              this.error = 'Une erreur est survenue lors de l\'inscription';
            }
          } else {
            // Erreur générique
            this.error = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer';
          }
          
          this.loading = false;
        }
      });
  }
}