import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export interface ErrorResponse {
  message: string;
  errorCode: string;
  status: number;
  timestamp: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  showSuccess(message: string) {
    return Swal.fire({
      title: 'Succès!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  showError(message: string, errorCode?: string) {
    let title = 'Erreur!';
    let confirmButtonText = 'OK';
    let showCancelButton = false;

    // Personnaliser le titre selon le code d'erreur
    switch (errorCode) {
      case 'INSUFFICIENT_STOCK':
        title = 'Stock insuffisant';
        break;
      case 'DUPLICATE_RESOURCE':
        title = 'Ressource déjà existante';
        confirmButtonText = 'Réessayer';
        showCancelButton = true;
        break;
      case 'RESOURCE_NOT_FOUND':
        title = 'Ressource introuvable';
        break;
      case 'ILLEGAL_OPERATION':
        title = 'Opération impossible';
        break;
      case 'INVALID_ARGUMENT':
        title = 'Données invalides';
        confirmButtonText = 'Réessayer';
        showCancelButton = true;
        break;
      case 'INTERNAL_ERROR':
        title = 'Erreur interne';
        confirmButtonText = 'Réessayer';
        showCancelButton = true;
        break;
      default:
        title = 'Erreur!';
        confirmButtonText = 'Réessayer';
        showCancelButton = true;
    }

    return Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: confirmButtonText,
      showCancelButton: showCancelButton,
      cancelButtonText: showCancelButton ? 'Annuler' : undefined
    });
  }

  showWarning(message: string) {
    return Swal.fire({
      title: 'Attention!',
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  showConfirmation(message: string, confirmText: string = 'Oui, supprimer') {
    return Swal.fire({
      title: 'Êtes-vous sûr?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmText,
      cancelButtonText: 'Annuler'
    });
  }

  showLoading(message: string = 'Traitement en cours...') {
    return Swal.fire({
      title: 'Chargement',
      text: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  closeAlert() {
    Swal.close();
  }

  // Méthode améliorée pour traiter les erreurs HTTP
  handleHttpError(error: any): ErrorResponse | null {
    console.log('Erreur complète reçue:', error); // Pour debug
    
    // Cas 1: Erreur HTTP avec structure standard de votre backend
    if (error.error && error.error.message) {
      return {
        message: error.error.message,
        errorCode: error.error.errorCode || 'UNKNOWN_ERROR',
        status: error.error.status || error.status || 500,
        timestamp: error.error.timestamp || new Date().toISOString(),
        path: error.error.path || ''
      };
    }

    // Cas 2: Erreur avec message directement dans error (pour votre cas actuel)
    if (error.message && error.status) {
      let errorCode = 'HTTP_ERROR';
      
      switch (error.status) {
        case 409:
          errorCode = 'ILLEGAL_OPERATION';
          break;
        case 404:
          errorCode = 'RESOURCE_NOT_FOUND';
          break;
        case 400:
          errorCode = 'BAD_REQUEST';
          break;
        case 500:
          errorCode = 'INTERNAL_ERROR';
          break;
      }
      
      return {
        message: error.message,
        errorCode: errorCode,
        status: error.status,
        timestamp: new Date().toISOString(),
        path: error.url || ''
      };
    }

    // Cas 3: Erreur HTTP simple (ex: 404, 500, etc.)
    if (error.status) {
      let message = 'Une erreur s\'est produite';
      let errorCode = 'HTTP_ERROR';

      switch (error.status) {
        case 404:
          message = 'Ressource non trouvée';
          errorCode = 'RESOURCE_NOT_FOUND';
          break;
        case 409:
          message = 'Conflit de données';
          errorCode = 'ILLEGAL_OPERATION';
          break;
        case 400:
          message = 'Données invalides';
          errorCode = 'BAD_REQUEST';
          break;
        case 500:
          message = 'Erreur interne du serveur';
          errorCode = 'INTERNAL_ERROR';
          break;
      }

      return {
        message: error.error?.message || message,
        errorCode: errorCode,
        status: error.status,
        timestamp: new Date().toISOString(),
        path: error.url || ''
      };
    }

    // Cas 4: Erreur réseau ou autre
    if (error.message) {
      return {
        message: error.message,
        errorCode: 'NETWORK_ERROR',
        status: 0,
        timestamp: new Date().toISOString(),
        path: ''
      };
    }

    return null;
}
}