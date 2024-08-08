import { ComandoSQL } from "./ComandoSQL";
import { JobInfoDTO } from "./JobInfoDTO";
import { VariavelDinamica } from "./VariavelDinamica";

export interface JobConfig {
    id: number,
    ordem: number,
    nome: string,
    argumentos: string[],
    queries: ComandoSQL[],
    cargas: JobCarga[],
    variaveis: VariavelDinamica[],
}

export interface JobCarga {
    nome: string,
    conteudo: string,
    tipo: string,
}

export namespace JobCarga {
    export function empty(): JobCarga {
        return {
            nome: '',
            conteudo: '',
            tipo: '',
        };
    }
}

export namespace JobConfig {

    export function identificarVariaveis(infoDto: JobInfoDTO): VariavelDinamica[] {
/*
        const vars = infoDto.queries.map(query => query.sql)
            .flatMap(sql => ComandoSQL.getFiltrosFromQuery(sql))
            .map((filtro, index) => VariavelDinamica.parseFiltroSql(infoDto.nome, index, filtro));
*/
        return infoDto.parametros
            .map((param, index) => VariavelDinamica.parseJobParamiter(param, infoDto.descricaoParametros[index]));
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
            argumentos: infoDto.parametros.map(() => ""),
            queries: infoDto.queries, //TODO: exceção daqui deve ser tratada nos componentes-pai
            cargas: infoDto.mascaraEntrada.map((item) => JobCarga.empty()),
            variaveis: JobConfig.identificarVariaveis(infoDto),
        }
    }

}


