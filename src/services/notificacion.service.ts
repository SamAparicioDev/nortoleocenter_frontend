import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private notyf = new Notyf({
    duration: 3000, // milisegundos
    position: { x: 'right', y: 'top' }, // esquina superior derecha
    types: [
      {
        type: 'success',
        background: '#4CAF50',
        icon: {
          className: 'material-icons',
          text: 'check_circle',
        },
      },
      {
        type: 'error',
        background: '#F44336',
        icon: {
          className: 'material-icons',
          text: 'error',
        },
      },
    ],
  });

  success(message: string) {
    this.notyf.success(message);
  }

  error(message: string) {
    this.notyf.error(message);
  }
}
