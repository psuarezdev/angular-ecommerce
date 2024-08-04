import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  templateUrl: './side-menu.component.html',
  styles: ``,
  imports: [RouterModule]
})
export class SideMenuComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  ngOnInit(): void {
    initFlowbite();
  }

  onSignOut() {
    this.#authService.signOut();
    this.#router.navigateByUrl('/auth');
  }
}
