import { AgendaDTO } from "./AgendaDTO";
import { ComandoSQL } from "./ComandoSQL";

export interface ItemPilhaDTO {
    argumentos: string[];
    agenda: AgendaDTO;
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
    ordem: number;
}