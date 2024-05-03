export interface MassaPreparada {
    tabela: string;
    colunasGeradas: MapObject;
    colunasErro: MapObject;
}

export interface MapObject {
    [key: string]: any;
}