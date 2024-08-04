import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly #http = inject(HttpClient);

  readonly #httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  async getProfile() {
    try {
      return await firstValueFrom(this.#http.get<User>(`${environment.apiUrl}/auth/profile`));
    } catch (error) {
      return null;
    }
  }

  async signUp(firstName: string, lastName: string, email: string, password: string, address: string) {
    try {
      await firstValueFrom(this.#http.post(
        `${environment.apiUrl}/auth/register`,
        { firstName, lastName, email, password, address },
        this.#httpOptions
      ));

      return true;
    } catch (error) {
      return false;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const res = await firstValueFrom(this.#http.post<{ token: string }>(
        `${environment.apiUrl}/auth/login`,
        { email, password },
        this.#httpOptions
      ));

      if(!res.token) return null;
      return res.token;
    } catch (error) {
      return null;
    }
  }

  signOut() {
    localStorage.removeItem('token');
  }

  async updateProfile(id: string, firstName: string, lastName: string, email: string, address: string) {
    try {
      const updatedProfile = await firstValueFrom(this.#http.patch<{ token: string, user: User }>(
        `${environment.apiUrl}/users/${id}`,
        { firstName, lastName, email, address },
        this.#httpOptions
      ));

      if(!updatedProfile.token) return null;
      localStorage.setItem('token', updatedProfile.token);
      return updatedProfile;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');

    if(!token) return false;
    
    const decodedToken: { exp: number } = jwtDecode(token);

    const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;

    if(new Date() > new Date(jwtExpirationInMsSinceUnixEpoch)) {
      return false
    }

    return true;
  }
}
