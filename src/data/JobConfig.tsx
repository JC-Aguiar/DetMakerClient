import { JobInfoDTO } from "./JobInfoDTO";
import { VariavelDinamica } from "./VariavelDinamica";

export interface JobConfig {
    id: number,
    ordem: number,
    nome: string,
    argumentos: string[],
    //queries: QueryInfo[],
    cargas: PipelineJobCargaDTO[],
    variaveis: VariavelDinamica[],
}

export interface PipelineJobCargaDTO {
    nome: string,
    conteudo: string,
    tipo: string,
}

export namespace PipelineJobCargaDTO {

    export function empty(): PipelineJobCargaDTO {
        return {
            nome: '',
            conteudo: '',
            tipo: '',
        };
    }
    
}

export namespace JobConfig {

    export function identificarVariaveis(infoDto: JobInfoDTO): VariavelDinamica[] {
        return infoDto.parametros.map(
            (param, index) => VariavelDinamica.parseJobParamiter(param, infoDto.descricaoParametros[index])
        );
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
            //queries: [], //infoDto.queries.map(item => QueryInfo.parseDTO(item)),
            cargas: infoDto.mascaraEntrada.map((item) => PipelineJobCargaDTO.empty()),
            variaveis: JobConfig.identificarVariaveis(infoDto),
        }
    }

}


