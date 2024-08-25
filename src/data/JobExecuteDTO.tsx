import { JobCarga, JobConfig } from "./JobConfig";
import { QueryInfo } from "./QueryInfoDTO";

export interface JobExecuteDTO {
    id: number,
    ordem: number,
    argumentos: string,
    queries: string[],  
    cargas: JobCarga[],
    //variaveis: { [key: string]: string },
}

export namespace JobExecuteDTO {

    export function parseJobConfig(configDto: JobConfig, queries: QueryInfo[]): JobExecuteDTO {
        return {
            id: configDto.id,
            ordem: configDto.ordem,
            argumentos: configDto.argumentos.join(" "),
            queries: queries
                .filter(query => query.jobId === configDto.id)
                .map(query => query.sql),
            cargas: configDto.cargas,
            //variaveis: configDto.variaveis
            //    .reduce((objeto, item) => {
            //        objeto[item.nome] = item.valor;
            //        return objeto;
            //    }, {})
        };
    }
}