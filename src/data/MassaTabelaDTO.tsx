import { MassaColunaDTO } from "./MassaColunaDTO";

export interface MassaTabelaDTO {
    //id: number,
    nome: string,
    colunas: MassaColunaDTO[],
    usaPessoa: boolean,
}