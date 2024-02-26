import { ComandoSQL } from "./ComandoSQL";
import { JobConfig } from "./JobConfigDTO";

export interface JobExecuteDTO {
    id: number
    ordem: number;
    argumentos: string;
    queries: ComandoSQL[];
    cargas: File[];
}

export function parseJobConfigParaJobExecute(configDto: JobConfig): JobExecuteDTO {
    return {
        id: configDto.id,
        ordem: configDto.ordem,
        argumentos: configDto.argumentos.join(" "),
        queries: configDto.queries,
        cargas: Array.from(configDto.cargas).map(item => {
            const fileBlob = new Blob([item.conteudo], { type: item.tipo });
            return new File([fileBlob], item.nome, { type: item.tipo });
        }),
    } as JobExecuteDTO;
}