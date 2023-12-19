import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RelatorioResumoDTO } from '../../data/RelatorioResumoDTO';

const initialState = { 
    catalogo: [],
    loading: false,
} as ReducerRelatoriosProps;

//Interface para definir o tipo de objeto do reducer
interface ReducerRelatoriosProps {
    catalogo: RelatorioResumoDTO[],
    loading: boolean,
}

//Controlador reducer para os relatórios
const catalogoRelatorios = createSlice({
    name: 'catalogoRelatorios',
    initialState,
    reducers: {
        setRelatorios: (state, action: PayloadAction<RelatorioResumoDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerRelatorios] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            console.log('[ReducerRelatorios]: Acionado controlador catalogoRelatorios.setRelatorios!');
            state.catalogo = action.payload;
            logClientes(state.catalogo);
        },
        addRelatorio: (state, action: PayloadAction<RelatorioResumoDTO>) => {
            console.log('[ReducerRelatorios]: Acionado controlador catalogoRelatorios.addRelatorio!');
            state.catalogo.push(action.payload);
            logClientes(state.catalogo);
        },
        loadingRelatorios: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerRelatorios]: Acionado controlador catalogoRelatorios.loadingRelatorios!');
            state.loading = action.payload;
            console.log(`[ReducerRelatorios]: Catalogo de Relatorios ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logClientes(clientes: RelatorioResumoDTO[]) {
    console.log(`[ReducerRelatorios] Catálogo de Relatorios em memória:` + '\n' + clientes.map(
        (item) => ` - ID: ${item.id}` + '\n' 
                + ` - Projeto: ${item.idProjeto} - ${item.nomeProjeto}`
                + ` - Atividade: ${item.nomeAtividade}`
                + ` - Quantidade de Evidencias: ${item.evidencias}`
                + ` - Evidências Revisadas: ${item.revisados}`
                + ` - Sucesso: ${item.sucesso}`
    ));
}

export default catalogoRelatorios.reducer;
export const { setRelatorios, addRelatorio, loadingRelatorios } = catalogoRelatorios.actions;