import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';  // ← supprime l'import { title } from 'process'

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
      case 'ACCESS_DENIED':          // ← dans le bon switch
        title = 'Accès refusé';
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

  handleHttpError(error: any): ErrorResponse | null {
    // Cas 1: Structure standard du backend → toujours prioritaire
    if (error.error && error.error.message) {
      return {
        message: error.error.message,
        errorCode: error.error.errorCode || 'UNKNOWN_ERROR',
        status: error.error.status || error.status || 500,
        timestamp: error.error.timestamp || new Date().toISOString(),
        path: error.error.path || ''
      };
    }

    // Cas 2: Fallback selon le code HTTP numérique
    const httpFallbacks: { [key: number]: { message: string; errorCode: string } } = {
      400: { message: 'Données invalides',         errorCode: 'INVALID_ARGUMENT' },
      403: { message: 'Accès refusé',              errorCode: 'ACCESS_DENIED' },
      404: { message: 'Ressource introuvable',     errorCode: 'RESOURCE_NOT_FOUND' },
      409: { message: 'Opération impossible',      errorCode: 'ILLEGAL_OPERATION' },
      500: { message: 'Erreur interne du serveur', errorCode: 'INTERNAL_ERROR' },
    };

    if (error.status) {
      const fallback = httpFallbacks[error.status] || 
                       { message: "Une erreur s'est produite", errorCode: 'HTTP_ERROR' };
      return {
        message: fallback.message,
        errorCode: fallback.errorCode,
        status: error.status,
        timestamp: new Date().toISOString(),
        path: error.url || ''
      };
    }

    // Cas 3: Erreur réseau (pas de statut HTTP)
    return {
      message: error.message || 'Erreur réseau, vérifiez votre connexion',
      errorCode: 'NETWORK_ERROR',
      status: 0,
      timestamp: new Date().toISOString(),
      path: ''
    };
  }
}