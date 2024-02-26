import { FiltroSQL } from "./FiltroSQL";
import { QueryInfoDTO } from "./QueryInfoDTO";

export interface ComandoSQL {
    campos: string[];
    tabela: string;
    filtros: FiltroSQL[];
    sql: string;
    descricao: string;
    dinamico: boolean;
}

export function converterQueryInfoEmConfigQuery(dto: QueryInfoDTO): ComandoSQL {
    //Remove comandos de escape, espaços extras e converte tudo em letras maíusculas
    const queryFormatada = dto.sql.replace(/\s+/g, ' ')
        .replace('\r', '')
        .replace('\n', '')
        .replace('\t', '')
        .toUpperCase();
  
    //Obtem campos do SELECT
    const selectMatch = queryFormatada.match(/SELECT(.*?)FROM/);
    const campos = (selectMatch ? selectMatch[1].split(',') : [])
        .map(item => item.trim())
        .filter(item => item !== "*");
  
    //Obtem filtros do WHERE
    const whereMatch = queryFormatada.match(/WHERE(.*?)$/);
    const filtrosTotais = (whereMatch ? whereMatch[1].split('and') : [])
        .map(filter => filter.trim())
        .join(" ");

    //Regex para identificar as varíaveis a serem preenchidas nos filtros WHERE
    const regex = /\$\{([^{}]+)\}/g;
    const variaveis: string[] = [];
    let match;
    while ((match = regex.exec(filtrosTotais)) !== null) {
        variaveis.push(match[1]);
    }
    if (variaveis.length % 2 !== 0) throw "Formatação inválida para template SQL";

    //Convertendo lista de filtros dinâmicos em FiltroSQL
    const filtros: FiltroSQL[] = [];
    let coluna: string = '';
    let tipo: string = '';
    for (let i = 0; i < variaveis.length; i++) {
        if (i % 2 === 0) {
            coluna = variaveis[i];
        }
        else {
            tipo = variaveis[i];
            filtros.push({
                coluna: coluna,
                tipo: tipo,
                valor: '',
            });
        }
    }

    //Retornando nova instância de ComandoSQL
    return {
        tabela: dto.nome,
        campos: campos,
        filtros: filtros,
        descricao: dto.descricao,
        sql: dto.sql,
        dinamico: true,
    };
  }