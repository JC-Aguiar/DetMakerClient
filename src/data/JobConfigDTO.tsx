import { ComandoSQL } from "./ComandoSQL";
import { JobInfoDTO } from "./JobInfoDTO";

export interface JobConfig {
    ordem: number;
    id: number;
    nome: string;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: JobCarga[];
}

export interface JobCarga {
    nome: string,
    conteudo: string,
    tipo: string,
}

export function parseJobInfo(infoDto: JobInfoDTO, ordem : number = -1): JobConfig {
    return {
        ordem: ordem,
        id: infoDto.id,
        nome: infoDto.nome,
        argumentos: infoDto.parametros
            .filter((item) => item)
            .map(() => "")
        ,
        queries: infoDto.tabelas
            .filter((item) => item)
            .map((item) => {
                return {
                    campos: [],
                    tabela: item,
                    filtros: [],
                    sql: "",
                    descricao: "",
                    dinamico: false,
                } as ComandoSQL;
        }),
        cargas: infoDto.mascaraEntrada
            .filter((item) => item)
            .map((item) => { return {
                nome: '',
                conteudo: '',
                tipo: '',
            }}),
    }
}
