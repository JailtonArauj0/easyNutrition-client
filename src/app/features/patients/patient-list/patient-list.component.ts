import { Component } from '@angular/core';
import { finalize, Observable, of, catchError } from 'rxjs';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, NgxMaskPipe],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent {
  public patients$!: Observable<Patient[]>;
  public isLoading = true;

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.patients$ = this.patientService.getAll().pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Usamos if/else if para tratar cada status code
        if (error.status === 500) {
          // this.alertService.showError('Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde ou contate o suporte.');
        } 
        else if (error.status === 404) {
          // Erro 404 é específico: a lista não foi encontrada.
          // this.alertService.showError('A lista de pacientes não foi encontrada. Verifique com o administrador do sistema.');
        }
        else if (error.status === 401 || error.status === 403) {
           // Mesmo tratando no componente, a ação correta para 401/403 é deslogar.
          // this.alertService.showError('Sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.');
          // this.authService.logout(); // Chamamos o logout do authService
        }
        
        // Sempre retornamos um array vazio para o pipe async não quebrar
        return of([]); 
      })
    );
  }
}
