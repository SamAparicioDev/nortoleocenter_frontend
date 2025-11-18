export interface UserDTO {
  name: string;
  email: string;
  rol: string;
  password: string;
  password_confirmation: string;
}

export interface UserLoginRepsonse{
  messagge: string;
  user: User;
  token: string;

}

export interface UserById {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    rol: 'admin' | 'empleado' | 'productor';
    created_at: string;
    updated_at: string;
}

export interface UserList {
  id: number;
  name: string;
  email: string;
  rol : string;
  created_at : string;
}
export interface UserUpdate{
  message: string;
  user: UserById;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  created_at: string;
  updated_at: string;
}
export interface UserUpdateDTO {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  rol?: string;
}
