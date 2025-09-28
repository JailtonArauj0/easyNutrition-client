import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginResponse } from '../auth.service';
import { AlertService } from '../../core/services/alert.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface LoginForm {
  email: FormControl<string>,
  password: FormControl<string>
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  get form() { return this.loginForm.controls; }

  ngOnInit(): void {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }
  
  onSubmit(): void {
    if(this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: (response: HttpResponse<LoginResponse>) => {
          if(response.status === 200) {
            //this.router.navigate(['/main']);
            //TODO
            this.alertService.showSuccess('Logado com sucesso.')
          }
        },
        error: (err: HttpErrorResponse) => {
          if(err.status === 401) {
            this.alertService.showError('Usuário ou senha inválida.');
          }
          else {
            const message = err.error?.title || 'Ocorreu um erro inesperado, contate o suporte técnico.';
            this.alertService.showError(message);
          }
        }
      })
    }
  }
}
