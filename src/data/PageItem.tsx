// Definição da interface para representar um item da página
export interface PageItem<T> {
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
}