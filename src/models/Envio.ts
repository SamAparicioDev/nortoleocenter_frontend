import { FincaResponse } from "./Finca";
import { LoteResponse } from "./Lote";

export interface EnvioDTO {
  finca_id: number;
  lote_id: number;
  peso_kg: number;
  observaciones: string;
}

export interface EnvioData {
  id: number;
  productor_id: number;
  finca_id: number;
  lote_id: number;
  codigo_envio: string;
  fecha_envio: string;
  estado: string;
  peso_kg: number | string;
  observaciones: string;
  created_at: string;
  updated_at: string;
  finca: FincaResponse;
  lote: LoteResponse;
}
