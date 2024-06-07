// Definição da interface Page que encapsula o resultado paginado
export interface Page<T> {
    content: T[]; // Array de conteúdo da página
    pageable: {
        pageNumber: number; // Número da página atual
        pageSize: number; // Tamanho da página
        offset: number; // Índice de deslocamento
    };
    totalPages: number; // Total de páginas disponíveis
    totalElements: number; // Total de elementos no resultado
    last: boolean; // Indica se é a última página
    first: boolean; // Indica se é a primeira página
    size: number; // Número de elementos na página atual
    number: number; // Número da página atual
    sort: {
        sorted: boolean; // Indica se a página está ordenada
        unsorted: boolean; // Indica se a página está desordenada
    };
    numberOfElements: number; // Número de elementos na página atual
}

export const noPageContent = <T extends any>(): Page<T> => {
    return {
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: 0,
            offset: 0,
        },
        totalPages: 0,
        totalElements: 0,
        last: false,
        first: false,
        size: 0,
        number: 0,
        sort: {
            sorted: false,
            unsorted: false,
        },
        numberOfElements: 0,
    }
} 