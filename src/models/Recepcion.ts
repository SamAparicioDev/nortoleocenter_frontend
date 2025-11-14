import { EnvioData } from "./Envio";
import { User } from "./User";

export interface RecepcionDTO{
    envio_id: number;
    precio_kg: number;
    peso_recibido_kg: number;
}

export interface RecepcionData {
  envio_id: number;
  empleado_id: number;
  precio_kg: number;
  peso_recibido_kg: number;
  total: number;
  fecha_recepcion: string;
  updated_at: string;
  created_at: string;
  id: number;
  empleado: User;
  envio: EnvioData;
}

export interface RecepcionResponse {
  message: string;
  data: RecepcionData;
}
