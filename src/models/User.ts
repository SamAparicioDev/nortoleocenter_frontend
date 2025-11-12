export interface UserRegister {
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
