import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ClienteInfoDTO } from '../../data/ClienteInfoDTO';
import { AmbienteInfoDTO } from '../../data/AmbienteInfoDTO';

//Valores iniciais do Reducer
const initialState = { 
    catalogo: [],
    clienteSelecionado: -1,
    loading: false,
} as ReducerClientesProps;

//Interface para definir o tipo de objeto do reducer
interface ReducerClientesProps {
    catalogo: ClienteInfoDTO[],
    clienteSelecionado: number,
    loading: boolean,
}

export interface AddAmbienteProps {
    clienteId: number,
    ambiente: AmbienteInfoDTO,
}

//Controlador reducer para item-pilha
const catalogoClientes = createSlice({
    name: 'catalogoClientes',
    initialState,
    reducers: {
        setClientes: (state, action: PayloadAction<ClienteInfoDTO[]>) => {
            //const jobsPipeline = action.payload.jobsPipeline;
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerClientes] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            console.log('[ReducerClientes]: Acionado controlador catalogoClientes.setClientes!');
            state.catalogo = action.payload;
            //logClientes(state.catalogo);
        },
        addAmbiente: (state, action: PayloadAction<AddAmbienteProps>) => {
            console.log('[ReducerClientes]: Acionado controlador catalogoClientes.addAmbiente!');
            const {clienteId, ambiente} = action.payload;
            if (clienteId === -1 || ambiente.id === -1) {
                console.log('[ReducerClientes]: ID inválido!');
                return;
            }
            const index = state.catalogo.findIndex(item => item.id === clienteId);
            if (index === -1) {
                console.log('[ReducerClientes]: Usuário não identificado!');
                return;
            }
            state.catalogo[index].ambientes.push(ambiente);
        },
        loadingClientes: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerClientes]: Acionado controlador catalogoClientes.loadingClientes!');
            state.loading = action.payload;
            console.log(`[ReducerClientes]: Catalogo de Pipelines ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logClientes(clientes: ClienteInfoDTO[]) {
    console.log(`[ReducerClientes] Catálogo de Clientes em memória:` + '\n' + clientes.map(
        (item) => ` - Nome: ${item.nome}` + '\n' 
                + ` - Ambientes: ${item.ambientes.map((amb) => amb.nome)}.`
    ));
}

export default catalogoClientes.reducer;
export const { setClientes, loadingClientes, addAmbiente } = catalogoClientes.actions;