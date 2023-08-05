import { AgendaDTO } from "./AgendaDTO";
import { ComandoSQL } from "./ComandoSQL";

export interface ItemPilha {
    argumentos: string[];
    agenda: AgendaDTO;
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
}