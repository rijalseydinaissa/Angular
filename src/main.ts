import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Nouvelle manière de configurer HttpClient
    provideRouter(routes), // Gestion des routes
    
  ],
}).catch((err) => console.error(err));
