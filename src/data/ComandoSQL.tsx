import { FiltroSQL } from "./FiltroSQL";
import { QueryInfoDTO } from "./QueryInfoDTO";

//Interface que interpreta os dados de um SQL 
export interface ComandoSQL {
    id?: number,
    jobId: number,
    nome: string,
    descricao: string,
    sql: string,
    filtros: FiltroSQL[],
    valores: { [key: string]: string },
    autopreenchimento: boolean,
}

//Compilado de métodos úteis relacionados ao ComandoSQL
export namespace ComandoSQL {

    //Lista dos operadores a serem removidos numa query
    const operadoresParaRemover =[
        "=",
        "<>",
        "!=",
        "<",
        ">",
        "<=",
        ">=",
        "IN",
        "NOT IN",
        "BETWEEN",
        "NOT BETWEEN",
        "LIKE",
        "NOT LIKE",
    ];

    //Remove comandos de escape, espaços extras e converte tudo em letras maíusculas
    function formarQuery(query: string) {
        return query.replaceAll('\r', ' ')
            .replaceAll('\n', ' ')
            .replaceAll('\t', ' ')
            .replaceAll('=', ' = ')
            .replaceAll(/\s+/g, ' ')
            //.toUpperCase()
            ;
    }
    
    //Identificada e obtêm os filtros da query 
    function getFiltros(queryFormatada: string): FiltroSQL[] {
        //Obtendo possível nome de tabela
        let regex = /FROM\s+([\w.]+)/i;
        const fromMatch = queryFormatada.match(regex);
        const tabela = (fromMatch && fromMatch[1]) ? fromMatch[1].split('.')[0] : "";
    
        //Limpando filtros do WHERE
        const whereMatch = queryFormatada.match(/WHERE(.*?)$/);
        const novoWhere = (whereMatch ? whereMatch[1].split(' ') : [])
            .map(trexo => trexo.trim())
            .filter(trexo => !operadoresParaRemover.includes(trexo))
            .filter(trexo => trexo.length > 0);
    
        //Obtendo filtros
        const filtros: FiltroSQL[] = [];
        regex = /\${(.*?)}/;
        let regex2 = /\((.*?)\)/;
        novoWhere.forEach((trexo, index) => {
            const novoTrexo = regex.exec(trexo);
            if (index < 1 || !novoTrexo) return;
            let coluna = novoWhere[index -1];
            if (coluna.includes("(") && coluna.includes(")")) {
                const regexResult = regex2.exec(coluna);
                if (!regexResult) return;
                coluna = regexResult[1];
            }
            const nome = novoTrexo[1];
            const array = trexo.startsWith("(") && trexo.endsWith(")");
            filtros.push({
                variavel: nome,
                coluna: coluna,
                tabela: tabela,
                tipo: "UNSET",
                index: filtros.length,
                array: array,
            });
        })
        return filtros;
    }
    
    //Formata a query para identificar e obter os filtros
    export function getFiltrosFromQuery(query: string): FiltroSQL[] {
        return getFiltros(formarQuery(query));
    }
    
    //Converte QueryInfoDTO em ComandoSQL
    export function parseQueryInfo(dto: QueryInfoDTO, jobId: number): ComandoSQL {
        const queryFormatada = formarQuery(dto.sql);
      
        //Obtem campos do SELECT
        //const selectMatch = queryFormatada.match(/SELECT(.*?)FROM/);
        //const campos = (selectMatch ? selectMatch[1].split(',') : [])
        //    .map(item => item.trim())
        //   .filter(item => item !== "*");
      
        //Retornando nova instância de ComandoSQL
        return {
            id: dto.id,
            jobId: jobId,
            nome: dto.nome,
            //campos: campos,
            descricao: dto.descricao,
            sql: queryFormatada,
            filtros: getFiltros(queryFormatada),
            valores: {},
            autopreenchimento: false,
            //dinamico: true,
        };
    }
}


