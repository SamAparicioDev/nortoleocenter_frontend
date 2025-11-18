export interface UserDTO {
  name: string;
  email: string;
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

    // email_verified_at can be a datetime string or null
    email_verified_at: string | null;

    // The role must be one of the defined values
    rol: 'admin' | 'empleado' | 'productor';

    // Timestamps are typically ISO 8601 strings from Laravel/API
    created_at: string;
    updated_at: string;
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
