import { AmbienteAcessoDTO } from "./AmbienteAcessoDTO";

export interface AmbienteInfoDTO {
    id: number,
    nome: string,
    banco: AmbienteAcessoDTO,
    ftp: AmbienteAcessoDTO;
}