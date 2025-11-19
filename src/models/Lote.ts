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
// 1. Nivel más profundo: Departamento
export interface Departamento {
    id: number;
    created_at: string;
    updated_at: string;
    nombre: string;
}

// 2. Nivel siguiente: Ciudad
export interface Ciudad {
    id: number;
    created_at: string;
    updated_at: string;
    departamento_id: number;
    nombre: string;
    departamento: Departamento;
}

// 3. Nivel siguiente: Finca
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

// 4. Nivel superior: Lote (El objeto principal del array)
export interface Lote {
    id: number;
    created_at: string;
    updated_at: string;
    finca_id: number;
    nombre: string;
    area_m2: number;
    finca: Finca;
}

// Tipo para el array completo
