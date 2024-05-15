import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { QueryInfoDTO } from '../../data/QueryInfoDTO';

const initialState = { 
    catalogo: [],
    loading: false,
} as ReducerQueriesProps;

//Interface para definir o tipo de objeto do reducer
interface ReducerQueriesProps {
    catalogo: QueryInfoDTO[],
    loading: boolean,
}

//Controlador reducer para os relatórios
const catalogoQueries = createSlice({
    name: 'catalogoQueries',
    initialState,
    reducers: {
        setQueries: (state, action: PayloadAction<QueryInfoDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerQueries] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            console.log('[ReducerQueries]: Acionado controlador catalogoQueries.setQueries!');
            state.catalogo = action.payload;
            //logQueries(state.catalogo);
        },
        addQueries: (state, action: PayloadAction<QueryInfoDTO>) => {
            console.log('[ReducerQueries]: Acionado controlador catalogoQueries.addQueries!');
            state.catalogo.push(action.payload);
            //logQueries(state.catalogo);
        },
        loadingQueries: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerQueries]: Acionado controlador catalogoQueries.loadingQueries!');
            state.loading = action.payload;
            console.log(`[ReducerQueries]: Catalogo de Relatorios ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logQueries(clientes: QueryInfoDTO[]) {
    console.log(`[ReducerQueries] Catálogo de Queries em memória:` + '\n' + clientes.map(
        (item) => ` - ID: ${item.id}` + '\n' 
                + ` - Nome: ${item.nome}`
                + ` - SQL: '${item.sql}'`
    ));
}

export default catalogoQueries.reducer;
export const { setQueries, addQueries, loadingQueries } = catalogoQueries.actions;