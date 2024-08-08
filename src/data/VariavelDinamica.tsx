import { FiltroSQL, TipoColuna } from "./FiltroSQL";

export interface VariavelDinamica {
    nome: string,
    descricao: string,
    tipo: TipoColuna,
    array: boolean,
    metaDados?: {
        length?: number, 
        precision?: number, 
        scale?: number
    },
    valor: string,
    removivel: boolean,
    origem: "parâmtro" | "query" | "pipeline"
}

export namespace VariavelDinamica {

    export function tipoAlias(variavel: VariavelDinamica): string {
        const metadados = variavel.metaDados;

        const formatar = (alias: string, valores: (number | undefined)[]) => {
            if (valores.every(valor => typeof valor !== undefined))
                return `${alias}(${valores.join(", ")})`;
            return alias;
        };
        
        switch (variavel.tipo) {
            case "UNSET": 
                return "INVALID";
            case "LOB":
            case "CHAR": 
            case "LONG": 
                return formatar("VARCHAR", [metadados?.length]);
            case "REAL":
            case "FLOAT": 
            case "DOUBLE": 
                return "DOUBLE"; 
            case "NUMBER":
            case "DECIMAL":
            case "NUMERIC":
                return formatar("NUMBER", [metadados?.precision, metadados?.scale]);
            default:
                return variavel.tipo;
        }
    }

    export function newDefault(descricao?: string): VariavelDinamica {
        return {
            nome: '',
            descricao: descricao ? descricao : 'Valor',
            tipo: "CHAR",
            array: false,
            valor: '',
            removivel: true,
            metaDados: { length: 255 },
            origem: "pipeline"
        };
    }

    export function parseJobParamiter(paramNome: string, paramDesc?: string): VariavelDinamica {
        return {
            nome: paramNome,
            descricao: paramDesc ? paramDesc : 'Valor',
            tipo: "CHAR",
            array: false,
            valor: '',
            removivel: false,
            metaDados: { length: 255 },
            origem: "parâmtro"
        };
    }

    export function parseFiltroSql(filtro: FiltroSQL): VariavelDinamica {
        return {
            nome: filtro.variavel,
            descricao: filtro.coluna,
            tipo: filtro.tipo,
            array: filtro.array,
            valor: '',
            removivel: false,
            metaDados: filtro.metaDados,
            origem: "query"
        };
    }

}