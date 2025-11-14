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

