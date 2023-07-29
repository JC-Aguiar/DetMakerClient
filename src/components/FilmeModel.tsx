import Duração from "./Duração";

export enum GenerosEnum {
    DRAMA = "DRAMA",
    TRAGEDIA = "TRAGÉDIA",
    HUMOR = "HUMOR",
    COMEDIA = "COMÉDIA",
    CASO_REAL = "HISTÓRIA REAL",
    DOCUMENTARIO = "DOCUMENTÁRIO",
    AÇÃO = "AÇÃO",
    INVESTIGAÇÃO = "INVESTIGAÇÃO",
    FICÇÃO = "FICÇÃO CIENTÍFICA",
    FANTASIA = "FANTASIA",
    BIBLICO = "BÍBLICO",
    MUSICAL = "MUSICAL",
    TERROR = "TERROR",
    CLASSICO ="CLÁSSICO",
    ROMANCE = "ROMANCE",
    CULT = "CULT",
    //MAKING_OFF
    //REALITY_SHOW
    // "DRAMA",
    // "TRAGÉDIA",
    // "HUMOR",
    // "COMEDIA",
    // "CASO_REAL",
    // "DOCUMENÁRIO",
    // "AÇÃO",
    // "INESTIGAÇÃO",
    // "FICÇÃO",
    // "FANTASIA",
    // "BIBLICO",
    // "MUSICAL",
    // "TERROR",
    // "CLASSICO",
    // "ROMANCE",
    // "CULT",
}

export enum RoteiroEnum {
    ADAPTAÇÃO,
    ORIGINAL,
}

export enum EsteticaEnum {
    PB,
    PADRÃO,
    ESTILIZADO,
    SATURADO,
    STOP_MOTION,
    ANIMAÇÃO,
    COMPUTACAO_GRAFICA,
}

export enum EpocaEnum {
    PRE_HISTÓRICO,
    ERA_ANTIGA,
    MEDIEVAL,
    FEUDAL,
    RENASCENÇA,
    ANOS40,
    ANOS50,
    ANOS60,
    ANOS70,
    ANOS80,
    ANOS90,
    ANOS2000,
    ANOS2010,
    ATUAL,
    FUTURISTA,
}

export enum ClassificaçãoEnum {
    LIVRE,
    MAIORES_10,
    MAIORES_12,
    MAIORES_14,
    MAIORES_16,
    MAIORES_18,
}

interface FilmeInterface {
    readonly id: number;
    readonly titulo: string;
    readonly sinopse: string;
    readonly generos: GenerosEnum[];
    readonly dataLancamento: Date;
    readonly diretores: string[];
    readonly produtores: string[];
    readonly atores: string[];
    readonly classificação: ClassificaçãoEnum;
    readonly logo: string;
    readonly capas: string[];
    readonly font: string,
    readonly epoca: EpocaEnum[];
    readonly roteiro: RoteiroEnum;
    readonly estetica: EsteticaEnum[];
    readonly vizualizações: number;
    readonly votos: number;
    readonly avaliação: number;
    readonly duração: Duração;
    tempoAtual: Duração;
    readonly filme: string;
}

class FilmeModel implements FilmeInterface {
    tempoAtual!: Duração;
    // filme!: File;

    constructor(
        readonly id: number,
        readonly titulo: string,
        readonly sinopse: string,
        readonly generos: GenerosEnum[],
        readonly dataLancamento: Date,
        readonly diretores: string[],
        readonly produtores: string[],
        readonly atores: string[],
        readonly classificação: ClassificaçãoEnum,
        readonly logo: string,
        readonly capas: string[],
        readonly font: string,
        readonly epoca: EpocaEnum[],
        readonly roteiro: RoteiroEnum,
        readonly estetica: EsteticaEnum[],
        readonly vizualizações: number,
        readonly votos: number,
        readonly avaliação: number,
        readonly duração: Duração,
        tempoAtual: Duração,
        readonly filme: string
    ) {
        this.tempoAtual = tempoAtual;
    }
}

export default FilmeModel;
