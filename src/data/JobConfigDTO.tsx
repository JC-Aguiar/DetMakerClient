import { ComandoSQL } from "./ComandoSQL";
import { JobInfoDTO } from "./JobInfoDTO";

export interface JobConfigDTO {
    ordem: number;
    job: JobInfoDTO;
    argumentos: string;
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
}

export interface JobConfig {
    ordem: number;
    id: number;
    nome: string;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
}

export function parseJobInfo(infoDto: JobInfoDTO, ordem : number = -1): JobConfig {
    return {
        ordem: ordem,
        id: infoDto.id,
        nome: infoDto.nome,
        argumentos: infoDto.parametros.map((item) => ""),
        queries: infoDto.tabelas.map((item) => {
            return {
                campos: [],
                tabela: item,
                filtros: [],
                sql: "",
                descricao: "",
                dinamico: false,
            } as ComandoSQL;
        }),
        cargas: infoDto.mascaraEntrada.map((item) => ""),
    } as JobConfig;
}
