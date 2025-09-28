import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import { NgxMaskDirective } from "ngx-mask";
import { AlertService } from '../../core/services/alert.service';

interface RegisterForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
  cpf: FormControl<string>;
  phone: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgxMaskDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup<RegisterForm>;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.nonNullable.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get form() { return this.registerForm.controls; }

  onSubmit(): void {
    // Marca todos os campos como "tocados" para exibir os erros de validação
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue()).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 201) {
            this.alertService.showSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            // Redireciona para a página de login após 3 segundos
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        },
        error: (err) => {
          // Exemplo de como tratar um erro específico (ex: email já cadastrado)
          if (err.status === 400) {
            this.alertService.showError(err.error.title)
          } else {
            this.alertService.showError('Ocorreu um erro ao realizar o cadastro. Tente novamente mais tarde.');
          }
        }
      });
    }
  }
}
