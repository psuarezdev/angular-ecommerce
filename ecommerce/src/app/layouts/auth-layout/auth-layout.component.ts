import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styles: `
    main {
      background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, .3) 1px, transparent 0); 
      background-size: 40px 40px;
    }
  `,
  imports: [RouterOutlet],
})
export class AuthLayoutComponent {

}
