import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AmbienteInfoDTO, ClienteInfoDTO, logoVivo64 } from '../../pages/EscolherClientes';

const vivoAmbientes: AmbienteInfoDTO[] = [
    {
        nome: "DEV",
        conexaoSftp: "10.129.164.206:22",
        conexaoBanco: "10.129.164.205:1521:cyb3dev",
    }
];
const clientes: ClienteInfoDTO[] = [
    {
        nome: 'Vivo',
        ambientes: vivoAmbientes,
        imagem: logoVivo64,
    },
];

const initialState = { 
    catalogo: clientes,
    clienteSelecionado: -1,
    loading: false,
} as ReducerClientesProps;

//Interface para definir o tipo de objeto do reducer
interface ReducerClientesProps {
    catalogo: ClienteInfoDTO[],
    clienteSelecionado: number,
    loading: boolean,
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
            logClientes(state.catalogo);
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
export const { setClientes, loadingClientes } = catalogoClientes.actions;