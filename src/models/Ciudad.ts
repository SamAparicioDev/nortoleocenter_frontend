export interface CiudadResponse {
  id: number;
  departamento_id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface CiudadDTO{
  departamento_id: number;
  nombre: string;
}

export interface CiudadResponseList {
  id: number;
  created_at: string;
  updated_at: string;
  departamento_id: number;
  nombre: string;
  departamento: {
    id: number;
    created_at: string;
    updated_at: string;
    nombre: string;
  };
}
