import { JobConfig } from "./JobConfig";

export interface PipelineConfig {
    id: number,
    nome: string,
    configuracoes: PipelineVarProps[],
    massas: number[],
    jobs: JobConfig[],
}

export interface PipelineVarProps {
    id: number,
    nome: string,
    valor: string,
    editavel: boolean,
}

export namespace PipelineConfig {
    export function empty() {
        return {
            id: -1,
            nome: "",
            configuracoes: [],
            massas: [],
            jobs: [],
        }
    }
}
