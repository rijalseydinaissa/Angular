import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  showLoading(message: string = 'En cours') {
    return Swal.fire({
      title: message,
      allowEscapeKey: false,

      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  showSuccess(message: string = 'Opération réussie') {
    return Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: message,
      confirmButtonText: 'Super!',
      confirmButtonColor: '#28a745',
      timer: 3000,
      timerProgressBar: true
    });
  }

  showError(message: string = 'Une erreur est survenue') {
    return Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      footer: 'Veuillez réessayer plus tard',
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: 'Fermer',
      confirmButtonText: 'Réessayer'
    });
  }

  showWarning(message: string = 'Attention') {
    return Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: message,
      confirmButtonColor: '#ffc107'
    });
  }

  closeAlert() {
    Swal.close();
  }
}