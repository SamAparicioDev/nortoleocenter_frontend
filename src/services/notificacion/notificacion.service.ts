import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' }, 
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
      {
        type: 'warning',
        background: '#FF9800',
        icon: {
          className: 'material-icons',
          text: 'warning',
        },
      }
    ],
  });

  success(message: string) {
    this.notyf.success(message);
  }

  error(message: string) {
    this.notyf.error(message);
  }
  warning(message: string) {
    this.notyf.open({
      type: 'warning',
      message: message,
    });
  }
}
