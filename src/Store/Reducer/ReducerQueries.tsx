import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ComandoSQL } from '../../data/ComandoSQL';
import { QueryInfoDTO } from '../../data/QueryInfoDTO';

//Valores iniciais do Reducer
const initialState = { 
    catalogo: [],
    loading: false,
} as ReducerQueriesProps;

//Interface para definir o tipo de objeto do Reducer
interface ReducerQueriesProps {
    catalogo: QueryInfoDTO[],
    loading: boolean,
}

//Controlador Reducer para os relatórios
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
            state.loading = false;
        },
        addQuery: (state, action: PayloadAction<QueryInfoDTO>) => {
            console.log('[ReducerQueries]: Acionado controlador catalogoQueries.addQuery!');
            state.catalogo.push(action.payload);
        },
        updateQuery: (state, action: PayloadAction<QueryInfoDTO>) => {
            console.log('[ReducerQueries]: Acionado controlador catalogoQueries.updateQuery!');
            const novaQuery = action.payload;
            const index = state.catalogo
                .findIndex(item => item.id === novaQuery.id);
            if (index === -1) {
                if (!novaQuery.id) return;
                state.catalogo.push(novaQuery);
                return;    
            }
            state.catalogo[index] = novaQuery;
        },
        removeQuery: (state, action: PayloadAction<number>) => {
            console.log('[ReducerQueries]: Acionado controlador catalogoQueries.removeQuery!');
            if (action.payload > -1 && action.payload < state.catalogo.length)
                state.catalogo.splice(action.payload, 1);
        },
        loadingQueries: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerQueries]: Acionado controlador catalogoQueries.loadingQueries!');
            state.loading = action.payload;
            if (state.loading) state.catalogo = [];
            console.log(`[ReducerQueries]: Catalogo de Relatorios ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

export default catalogoQueries.reducer;
export const { setQueries, addQuery, updateQuery, removeQuery, loadingQueries } = catalogoQueries.actions;