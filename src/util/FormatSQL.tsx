import { ComandoSQL } from "../data/ComandoSQL";

export function montarQuery(comando: ComandoSQL): string {
    const { tabela, campos, filtros, ordem, descricao } = comando;
    const camposString = (campos !== null && campos.length > 0) ? campos.join(", ") : "*";
    let query = `SELECT ${camposString} FROM ${tabela}`;
    if (filtros) {
      query += ` WHERE ${filtros}`;
    }
    if (ordem) {
      query += ` ORDER BY ${ordem}`;
    }
    return query;
  }