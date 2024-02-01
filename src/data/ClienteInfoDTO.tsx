import { AmbienteInfoDTO } from "./AmbienteInfoDTO";

export interface ClienteInfoDTO {
    id: number;
    nome: string,
    banner: string,
    ambientes: AmbienteInfoDTO[],
}