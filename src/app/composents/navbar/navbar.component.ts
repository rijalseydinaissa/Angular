import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavLinkComponent } from "./nav-link/nav-link.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NavLinkComponent,NavLinkComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

}
