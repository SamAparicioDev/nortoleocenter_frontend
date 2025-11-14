export interface FincaDTO {
  nombre: string;
  ciudad_id: number;
  productor_id: number;
  direccion: string;
}

export interface FincaResponse {
  id: number;
  created_at: string;
  updated_at: string;
  ciudad_id: number;
  productor_id: number;
  nombre: string;
  direccion: string;
}
