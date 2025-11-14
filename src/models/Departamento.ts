import { CiudadResponse } from "./Ciudad";

export interface DepartamentoDTO{
  nombre: string;
}

export interface Data {
id: number;
    nombre: string;
    created_at: string;
    updated_at: string;
}

export interface DepartamentoResponse {
  message: string;
  data: Data;
}


export interface DepartamentoListResponse {
  data : Data;
}

export interface Departamento {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  ciudades: CiudadResponse[];
}
