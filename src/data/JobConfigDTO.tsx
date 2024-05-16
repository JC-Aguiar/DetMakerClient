import { ComandoSQL, converterQueryInfoEmConfigQuery } from "./ComandoSQL";
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

/**
 * Converte {@link JobInfoDTO} em {@link JobConfig}
 * @param infoDto {@link JobInfoDTO}
 * @param ordem {@link Number} em que o Job possuirá  
 * @returns objeto {@link JobConfig}
 */
export function parseJobInfo(infoDto: JobInfoDTO, ordem : number = -1): JobConfig {
    return {
        ordem: ordem,
        id: infoDto.id,
        nome: infoDto.nome,
        argumentos: infoDto.parametros
            .filter((item) => item)
            .map(() => "")
        ,
        queries: infoDto.queries
            .filter((item) => item)
            .map((item) => converterQueryInfoEmConfigQuery(item)),
            //.map((item) => {
            //    return {
            //        campos: item.campos,
            //        tabela: item.tabela,
            //        filtros: item.filtros,
            //        sql: item.sql,
            //        descricao: item.descricao,
            //        dinamico: item.dinamico,
            //    } as ComandoSQL;
            //}),
        cargas: infoDto.mascaraEntrada
            .filter((item) => item)
            .map((item) => { return {
                nome: '',
                conteudo: '',
                tipo: '',
            }}),
    }
}
