import { IonLabel, IonList, useIonViewWillEnter, } from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from "../Store/ReduxStore";
import { RelatorioResumoDTO } from "../data/RelatorioResumoDTO";
import { loadingRelatorios, setRelatorios } from "../Store/Reducer/ReducerRelatorios";
import { refresh } from "ionicons/icons";
import { layoutGrupoBotoes, ButtonLayoutProps } from "../components/Core/ButtonLayout";
import { PipelineInfoDTO } from "../data/PIpelineInfoDTO";
import Carregando from "../components/Core/Carregando";
import Informativo from "../components/Core/Informativo";
import TicketRelatorio from "../components/Content/TicketRelatorio";
import { addMensagem, atualizarMensagem } from "../Store/Reducer/ReducerAtividade";


const EscolherRelatorios: React.FC = () => {
    //Atributos do componente
    const dispatch = useDispatch();
    const [relatoriosSucesso, setRelatoriosSucesso] = useState<boolean | null>(null);
    //const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const catalogoRelatorios: RelatorioResumoDTO[] = useSelector((state: RootState) => state.store.catalogoRelatorios.catalogo);
    const catalagoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const isLoading: boolean = useSelector((state: RootState) => state.store.catalogoRelatorios.loading);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);

    //Atributos de botões
    const botaoAtualizar = {
        title: 'Atualizar',
        icon: refresh,
        trigger: () => coletarRecursos(),
        disable: isLoading,
    } as ButtonLayoutProps;

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        //dispatch(setButtons([botaoAtualizar]));
        if (catalogoRelatorios.length < 1 && !isLoading) coletarRecursos();
    }, []);

    //Atualizando Pipelines e Jobs com base no banco
    async function coletarRecursos() {
        dispatch(loadingRelatorios(true));
        await obterRelatoriosBanco();
        dispatch(loadingRelatorios(false));
    }

    //Requisição para obter os relatórios diretamente do banco
    async function obterRelatoriosBanco() {
        const mensagemId = `Get_Reports@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Obtendo catálogo de Relatórios no banco.`,
            status: 'INFO'
        }));
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        //setConectionsCount(c => c+1);
        try {
            const relatoriosBanco: RelatorioResumoDTO[] = (await axiosRequest.getAllRelatorios(mainAmbienteId));
            dispatch(setRelatorios(relatoriosBanco));
            setRelatoriosSucesso(true);
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `sucesso.`,
                status: 'OK'
            }));
        }
        catch (error) {
            setRelatoriosSucesso(false);
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
    }

    function conteudo() {
        if (catalogoRelatorios.length < 1) {
            return <Informativo status='SemDados'/>;
        }
        return <IonList className='ion-justify-content-center mx-5 p-1 px-3'>
            {
                catalogoRelatorios.map((item, index) => <TicketRelatorio key={index} relatorio={item} />)
            }
        </IonList>;
    }

    if (isLoading) return <Carregando />;
    return (
        <div className='p-0 m-0'> 
            <IonLabel className='m-0 p-0 h-100' >
                {layoutGrupoBotoes([ botaoAtualizar ])}
                {conteudo()}
            </IonLabel>
        </div>
    );
};

export default EscolherRelatorios;