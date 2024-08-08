import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MassaTabelaDTO } from '../../data/MassaTabelaDTO';

const initialState = { 
    catalogo: [],
    loading: false,
} as ReducerMassasProps;

//Interface para definir o tipo de objeto do reducer
interface ReducerMassasProps {
    catalogo: MassaTabelaDTO[],
    loading: boolean,
}

//Controlador reducer para os relatórios
const catalogoMassas = createSlice({
    name: 'catalogoMassas',
    initialState,
    reducers: {
        setMassas: (state, action: PayloadAction<MassaTabelaDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerMassas] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            console.log('[ReducerMassas]: Acionado controlador catalogoMassas.setMassas!');
            state.catalogo = action.payload;
            state.loading = false;
        },
        addMassa: (state, action: PayloadAction<MassaTabelaDTO>) => {
            console.log('[ReducerMassas]: Acionado controlador catalogoMassas.addMassa!');
            state.catalogo.push(action.payload);
        },
        loadingMassa: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerMassas]: Acionado controlador catalogoMassas.loadingMassa!');
            state.loading = action.payload;
            if (state.loading) state.catalogo = [];
            console.log(`[ReducerMassas]: Catalogo de Relatorios ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logMassas(clientes: MassaTabelaDTO[]) {
    console.log(`[ReducerMassas] Catálogo de Massas em memória:` + '\n' + clientes.map(
        (item) => ` - Nome ${item.nome}` + '\n' 
                + ` - Quant. Colunas: ${item.colunas.length}`
                + ` - usaPessoa: '${item.usaPessoa}'`
    ));
}

export default catalogoMassas.reducer;
export const { setMassas, addMassa, loadingMassa } = catalogoMassas.actions;