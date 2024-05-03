import { MassaColunaDTO } from "./MassaColunaDTO";

export interface MassaTabelaDTO {
    nome: string;
    colunas: MassaColunaDTO[];
    usaPessoa: boolean;
}