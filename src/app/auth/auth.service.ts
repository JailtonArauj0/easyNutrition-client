import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

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

  constructor(private http: HttpClient, private router: Router) { }

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
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

}
