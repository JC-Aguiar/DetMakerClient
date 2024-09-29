import { PipelineJobCargaDTO, JobConfig } from "./JobConfig";
import { PipelineQueryInputDTO } from "./PipelineQueryInputDTO";
import { QueryInfo } from "./QueryInfoDTO";


export interface PipelineJobInputDTO {
    id: number,
    ordem: number,
    argumentos: string,
    queries: PipelineQueryInputDTO[],  
    cargas: PipelineJobCargaDTO[],
    //variaveis: { [key: string]: string },
}

export namespace PipelineJobInputDTO {

    export function parseJobConfig(configDto: JobConfig, queriesInfo: QueryInfo[]): PipelineJobInputDTO {
        return {
            id: configDto.id,
            ordem: configDto.ordem,
            argumentos: configDto.argumentos.join(" "),
            queries: queriesInfo
                .filter(query => query.jobId === configDto.id)
                .map(query => ({ sql: query.sql })),
            cargas: configDto.cargas,
            //variaveis: configDto.variaveis
            //    .reduce((objeto, item) => {
            //        objeto[item.nome] = item.valor;
            //        return objeto;
            //    }, {})
        };
    }
}