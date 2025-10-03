import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginRequest {
  email: string,
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'authToken';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  login(credentials: LoginRequest): Observable<HttpResponse<LoginResponse>> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    })
      .pipe(
        tap((response: HttpResponse<LoginResponse>) => {
          if(response.body?.token) {
            this.saveToken(response.body.token);
          }
        })
      )
  }

  register(userData: RegisterRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData, { observe: 'response' });
  }

  private saveToken(token: string): void {
    if(this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if(this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if(this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.router.navigate(['/login']);
    }
  }

}
