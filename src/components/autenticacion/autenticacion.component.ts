import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutenticationService } from './../../services/autenticacion/autentication.service';
import { UserLogin, UserLoginRepsonse } from '../../models/User';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../services/notificacion.service';

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

  constructor(
    private autenticacionService: AutenticationService,
    private formBuilder: FormBuilder,
    private notyf: NotificacionService

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
      this.notyf.error('Completa los campos correctamente.');

      return;
    }

    const userLogin: UserLogin = this.loginForm.value;

    this.autenticacionService.login(userLogin).subscribe({
      next: (response) => {
        this.notyf.success('Inicio de sesión exitoso');
        this.userLoginResponse = response as UserLoginRepsonse;
        console.log('✅ Login exitoso:', response);
        sessionStorage.setItem('token', this.userLoginResponse.token);
        this.loginForm.reset();
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
      },
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const userRegister = this.registerForm.value;
    this.autenticacionService.register(userRegister).subscribe({
      next: (response) => {console.log('✅ Usuario registrado:', response);
        this.notyf.success('Registro exitoso');
        this.registerForm.reset();
      },
      error: (err) => console.error('❌ Error en registro:', err),
    });
  }
}
