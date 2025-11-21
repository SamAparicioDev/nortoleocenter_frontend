import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { UserById, UserDTO } from '../../models/User';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  usuario!: UserById;
  formUsuario!: FormGroup;
  editando = false;
  cargando = false;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private notificacion: NotificacionService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser) as UserById;
    const userId = parsedUser.id;

    this.cargando = true;
    this.usuarioService.obtenerUsuarioPorId(userId).subscribe({
      next: (data) => {
        this.usuario = data;
        this.crearFormulario();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.cargando = false;
      },
    });
  }

  crearFormulario() {
    this.formUsuario = this.fb.group(
      {
        name: [this.usuario.name, Validators.required],
        email: [this.usuario.email, [Validators.required, Validators.email]],
        password: [''],
        password_confirmation: [''],
      },
      { validators: this.passwordsCoinciden }
    );
  }

  passwordsCoinciden(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    if (pass && confirm && pass !== confirm) {
      return { noCoinciden: true };
    }
    return null;
  }

  habilitarEdicion() {
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.formUsuario.reset({
      name: this.usuario.name,
      email: this.usuario.email,
      password: '',
      password_confirmation: '',
    });
  }

  guardarCambios() {
    if (this.formUsuario.invalid) {
      this.notificacion.warning('Completa correctamente el formulario');
      return;
    }

    const { name, email, password, password_confirmation } = this.formUsuario.value;
    const dto: Partial<UserDTO> = { name, email };
    if (password) {
      dto['password'] = password;
      dto['password_confirmation'] = password_confirmation;
    }

    this.cargando = true;
    this.usuarioService.actualizarUsuario(this.usuario.id, dto).subscribe({
      next: (resp) => {
        this.notificacion.success('Perfil actualizado correctamente');
        this.editando = false;
        Object.assign(this.usuario, { name, email });
        this.formUsuario.patchValue({ password: '', password_confirmation: '' });
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.notificacion.error('Error al actualizar el perfil');
        this.cargando = false;
      },
    });
  }
}
