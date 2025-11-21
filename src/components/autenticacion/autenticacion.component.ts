import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutenticationService } from './../../services/autenticacion/autentication.service';
import { UserLogin, UserLoginRepsonse } from '../../models/User';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autenticacion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.css'],
})
export class AutenticacionComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  userLoginResponse?: UserLoginRepsonse;
  loadingLogin = false;      // indicador de carga para login
  loadingRegister = false;   // indicador de carga para registro

  constructor(
    private autenticacionService: AutenticationService,
    private formBuilder: FormBuilder,
    private notyf: NotificacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notyf.warning('Completa los campos correctamente.');
      return;
    }

    this.loadingLogin = true; // comienza el loading
    const userLogin: UserLogin = this.loginForm.value;

    this.autenticacionService.login(userLogin).subscribe({
      next: (response) => {
        this.userLoginResponse = response as UserLoginRepsonse;
        sessionStorage.setItem('token', this.userLoginResponse.token);
        localStorage.setItem('token', this.userLoginResponse.token);
        localStorage.setItem('userData', JSON.stringify(this.userLoginResponse.user));
        this.loginForm.reset();
        this.notyf.success('Inicio de sesión exitoso');
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.notyf.error('Error en el inicio de sesión. Verifica tus credenciales.');
      },
      complete: () => {
        this.loadingLogin = false; // termina el loading
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loadingRegister = true; // comienza el loading
    const userRegister = this.registerForm.value;

    this.autenticacionService.register(userRegister).subscribe({
      next: (response) => {
        console.log('✅ Usuario registrado:', response);
        this.registerForm.reset();
        this.notyf.success('Registro exitoso');
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
      },
      complete: () => {
        this.loadingRegister = false; // termina el loading
      }
    });
  }
}
