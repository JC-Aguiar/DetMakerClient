import { StringUtils } from "./StringUtils";

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
    function getFiltros(queryFormatada: string): Map<string, string> {
        //Obtendo possível nome de tabela
        let regex = /FROM\s+([\w.]+)/i;
        const fromMatch = queryFormatada.match(regex);
        const tabela = (fromMatch && fromMatch[1]) ? fromMatch[1].split('.')[0] : "";
    
        //Limpando filtros do WHERE
        const whereParametros = getParametrosWhere(queryFormatada);
    
        //Obtendo filtros
        const filtros = new Map<string, string>();
        regex = /\((.*?)\)/;
        whereParametros.forEach((trexo, index) => {
            const novoTrexo = StringUtils.getVariavel(trexo);
            if (index < 1 || !novoTrexo) return;

            let coluna = whereParametros[index -1];
            if (coluna.includes("(") && coluna.includes(")")) {
                const regexResult = regex.exec(coluna);
                if (!regexResult) return;
                coluna = regexResult[1];
            }
            const nome = novoTrexo[1];
            const array = trexo.startsWith("(") && trexo.endsWith(")");
            /*
            filtros.push({
                variavel: nome,
                coluna: coluna,
                tabela: tabela,
                tipo: "UNSET",
                index: filtros.length,
                array: array,
            });
            */
            filtros.set(coluna, nome);
        })
        return filtros;
    }

    //Limpando filtros do WHERE
    function getParametrosWhere(query: string): string[] {
        const whereMatch = query.match(/WHERE(.*?)$/);
        return (whereMatch ? whereMatch[1].split(' ') : [])
            .map(trexo => trexo.trim())
            .filter(trexo => !operadoresParaRemover.includes(trexo))
            .filter(trexo => trexo.length > 0);
    }
    
    //Formata a query para identificar e obter os filtros
    export function getFiltrosFromQuery(query: string): Map<string, string> {
        return getFiltros(formarQuery(query));
    }
    
}

