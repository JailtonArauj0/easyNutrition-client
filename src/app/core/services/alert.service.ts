import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  /**
   * Exibe um alerta de sucesso.
   * @param message A mensagem a ser exibida.
   */
  public showSuccess(message: string, title: string = 'Sucesso!'): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      width: '400px',
      confirmButtonColor: '#198754'
    });
  }

  /**
   * Exibe um alerta de erro.
   * @param message A mensagem a ser exibida.
   */
  public showError(message: string, title: string = 'Erro!'): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      width: '400px',
      confirmButtonColor: '#dc3545'
    });
  }

  /**
   * Exibe um alerta de confirmação (ex: "Tem certeza que deseja excluir?").
   * @returns Uma promessa que resolve com o resultado do alerta.
   */
  public showConfirmation(
    message: string,
    title: string = 'Você tem certeza?',
    confirmButtonText: string = 'Sim, tenho certeza!'
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar'
    });
  }
}
