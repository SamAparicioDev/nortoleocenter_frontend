export interface LoteResponse {
  id: number;
  created_at: string;
  updated_at: string;
  finca_id: number;
  nombre: string;
  area_m2: number;
}

export interface LoteDTO {
  finca_id: number;
  nombre: string;
  area_m2: number;
}

export interface Departamento {
    id: number;
    created_at: string;
    updated_at: string;
    nombre: string;
}

export interface Ciudad {
    id: number;
    created_at: string;
    updated_at: string;
    departamento_id: number;
    nombre: string;
    departamento: Departamento;
}

export interface Finca {
    id: number;
    created_at: string;
    updated_at: string;
    ciudad_id: number;
    productor_id: number;
    nombre: string;
    direccion: string;
    ciudad: Ciudad;
}

export interface Lote {
    id: number;
    created_at: string;
    updated_at: string;
    finca_id: number;
    nombre: string;
    area_m2: number;
    finca: Finca;
}

