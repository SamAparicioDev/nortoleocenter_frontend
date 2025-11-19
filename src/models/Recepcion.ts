import { FincaResponse } from "./Finca";
import { LoteResponse } from "./Lote";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  rol: string;
  created_at: string;
  updated_at: string;
}
export interface EnvioData {
  id: number;
  productor_id: number;
  finca_id: number;
  lote_id: number | null;
  codigo_envio: string;
  fecha_envio: string;
  estado: string;
  peso_kg: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
  productor: User;   // 🔥 obligatorio
  finca: FincaResponse;
  lote: LoteResponse | null;
}

export interface Finca {
  id: number;
  created_at: string;
  updated_at: string;
  ciudad_id: number;
  productor_id: number;
  nombre: string;
  direccion: string;
}

export interface Lote {
  // Actualmente es null en tu JSON, pero si más adelante tiene campos puedes agregarlos
  // Por ahora dejamos como opcional
  id?: number;
  nombre?: string;
}



export interface RecepcionData {
  id: number;
  created_at: string;
  updated_at: string;
  empleado_id: number;
  fecha_recepcion: string;
  precio_kg: number;
  total: number;
  envio_id: number;
  peso_recibido_kg: string;
  empleado: User;
  envio: EnvioData;
}

export interface RecepcionResponse {
  message: string;
  data: RecepcionData;
}

export interface RecepcionDTO {
  envio_id: number;
  precio_kg: number;
  peso_recibido_kg: number;
}
