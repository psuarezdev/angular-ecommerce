import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }, 
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        title: 'Authentification',
        loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent)
      }
    ],
  },
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      {
        path: '', 
        title: 'Home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'me',
        title: 'Profile',
        canMatch: [authGuard],
        loadComponent: () => import('./pages/home/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'favorites',
        title: 'Favorites Products',
        canMatch: [authGuard],
        loadComponent: () => import('./pages/home/favorites/favorites.component').then(m => m.FavoritesComponent),
      },
      {
        path: 'cart',
        title: 'Cart',
        canMatch: [authGuard],
        loadComponent: () => import('./pages/home/cart/cart.component').then(m => m.CartComponent),
      },
      {
        path: 'orders',
        title: 'Orders',
        canMatch: [authGuard],
        loadComponent: () => import('./pages/home/orders/orders.component').then(m => m.OrdersComponent),
      },
      {
        path: 'product/:id',
        title: 'Product Details',
        loadComponent: () => import('./pages/home/product-details/product-details.component').then(m => m.ProductDetailsComponent),
      },
      {
        path: 'search/:query',
        title: 'Search',
        loadComponent: () => import('./pages/home/search/search.component').then(m => m.SearchComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
