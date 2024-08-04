import { Component } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: `
    @media (max-width: 1127px) {
      header {
        justify-content: center;
        gap: 75px;
      }
    }

    @media (max-width: 932px) {
      header {
        padding-left: 15px;
        padding-right: 15px;
      }
    }

    @media (max-width: 832px) {
      header { 
        justify-content: space-between;
        gap: 15px;
      }
      header img { display: none; }
    }
  `,
  imports: [RouterModule, SideMenuComponent, SearchbarComponent],
})
export class HeaderComponent { }
