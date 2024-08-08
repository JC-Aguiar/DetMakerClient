import { ComandoSQL } from "./ComandoSQL";
import { JobCarga, JobConfig } from "./JobConfigDTO";

export interface JobExecuteDTO {
    id: number,
    ordem: number,
    argumentos: string,
    queries: ComandoSQL[],
    cargas: JobCarga[],
    variaveis: { [key: string]: string },
}

export namespace JobExecuteDTO {

    export function parseJobConfig(configDto: JobConfig): JobExecuteDTO {
        //const variaveis = {};
        //configDto.variaveis.forEach((chave, valor) => variaveis[chave] = valor);
        return {
            id: configDto.id,
            ordem: configDto.ordem,
            argumentos: configDto.argumentos.join(" "),
            queries: configDto.queries, //.map(query => query.sql)
            cargas: configDto.cargas,
            variaveis: configDto.variaveis
                .reduce((objeto, item) => {
                    objeto[item.nome] = item.valor;
                    return objeto;
                }, {})
        };
    }
}