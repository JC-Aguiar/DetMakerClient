import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonProgressBar, IonRadio, IonRadioGroup, IonRow, useIonViewWillEnter, } from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from "../Store/ReduxStore";
import { addViewJobs, removeViewJobs, setJobs, setViewJobs } from "../Store/Reducer/ReducerJobs";
import { setMainPipeline } from "../Store/Reducer/ReducerAtividade";
import { Noticacao } from "../components/Noticacao";
import { RelatorioResumoDTO } from "../data/RelatorioResumoDTO";
import { PipelineInfoDTO } from "../data/PIpelineInfoDTO";
import { setButtons } from "../Store/Reducer/ReducerButtons";
import { loadingRelatorios, setRelatorios } from "../Store/Reducer/ReducerRelatorios";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { alertCircleOutline, calendarOutline, chatboxEllipsesOutline, checkmarkCircleOutline, cubeOutline, documentText, eye, newspaper, newspaperOutline, pricetagOutline, refresh, thumbsDownOutline, thumbsUpOutline } from "ionicons/icons";
import { DynamicButtonsAddsOn } from "../components/DynamicButtons";
import { offsetDateTimeParaString } from "../App";
import { RelatorioHistoricoDTO } from "../data/RelatorioHistoricoDTO";
import { addRevisao, removeRevisao } from "../Store/Reducer/ReducerRevisao";
import { useHistory } from "react-router";


const EscolherRelatorios: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [conectionsCount, setConectionsCount] = useState<number>(0);
    const [relatoriosSucesso, setRelatoriosSucesso] = useState<boolean | null>(null);
    //const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const catalogoRelatorios: RelatorioResumoDTO[] = useSelector((state: RootState) => state.store.catalogoRelatorios.catalogo);
    const isLoading: boolean = useSelector((state: RootState) => state.store.catalogoRelatorios.loading);
    const mainCliente: string = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const mainAmbiente: string = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);

    const fonteCodigo = 'font-monospace text-secondary fw-bold ';
    const tag = (icone: string | null, conteudo: string | number | null) => {
        const padding = conteudo === null ? "pe-0" : "me-1 pe-2";
        const tagIcone = icone === null ? null : <IonIcon icon={icone} color="dark" className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
        return <IonBadge className={`mb-0 ${padding} h6`}>
            {tagIcone}
            {conteudo}
        </IonBadge>
    };

    //Atributos de botões
    const botaoAtualizar = {
        title: 'Atualizar',
        icon: refresh,
        trigger: () => coletarRecursos(),
        disable: () => false,
    } as DynamicButtonsAddsOn;

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        dispatch(setButtons([botaoAtualizar]));
        if ((catalogoRelatorios.length < 1 || conectionsCount < 1) && !isLoading) coletarRecursos();
    }, []);

    //Atualizando Pipelines e Jobs com base no banco
    async function coletarRecursos() {
        dispatch(loadingRelatorios(true));
        await obterRelatoriosBanco();
        dispatch(loadingRelatorios(false));
    }

    //Requisição para obter os relatórios diretamente do banco
    async function obterRelatoriosBanco() {
        console.log(`[ESCOLHER-RELATORIOS]: Iniciando requisição 'DOWNLOAD RELÁTORIOS'.`);
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        toastInfo("DOWNLOAD RELÁTORIOS: Em execução...", []);
        setConectionsCount(c => c+1);
        try {
            const relatoriosBanco: RelatorioResumoDTO[] = (await axiosRequest.getAllRelatorios());
            dispatch(setRelatorios(relatoriosBanco));
            setRelatoriosSucesso(true);
            toastOk("DOWNLOAD RELÁTORIOS: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-RELATORIOS]: Requisição 'DOWNLOAD RELÁTORIOS' funcionou.`);
        }
        catch (error) {
            setRelatoriosSucesso(false);
            toastErro(`DOWNLOAD RELÁTORIOS: ${error}`, []);
            console.error(`[ESCOLHER-RELATORIOS]: Requisição 'DOWNLOAD RELÁTORIOS' falhou.`);
        }
    }

    

    //Requisição para obter os relatórios diretamente do banco
    async function obterUmaRevisao(id: number) {
        const titulo = `OBTER RELÁTORIO ID ${id}`;
        console.log(`[ESCOLHER-RELATORIOS]: Iniciando requisição '${titulo}'.`);
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        toastInfo(`${titulo}: Em execução...`, []);
        setConectionsCount(c => c+1);
        try {
            const relatorioParaRevisar: RelatorioHistoricoDTO = await axiosRequest.getUmaRevisao(id);
            dispatch(removeRevisao())
            dispatch(addRevisao({ value: relatorioParaRevisar }));
            
            toastOk(`${titulo}: Realizado com sucesso.`, []);
            console.log(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' funcionou.`);
            console.log(`[ESCOLHER-RELATORIOS] Navegando para: ${axiosRequest.URL_DET}`);
            history.push(axiosRequest.URL_DET);
        }
        catch (error) {
            toastErro(`${titulo}: ${error}`, []);
            console.error(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' falhou.`);
        }
    }

    const listaDosRelatorios = <IonList className='m-0 p-0'>
        {
            catalogoRelatorios//.filter((item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1)
                .map((item, index) => {
                    return (
                        <IonRow key={index} className="p-0 px-5 m-0 ms-3 ion-align-items-center">
                            <div className="d-flex w-100 align-content-center ion-align-items-center p-0 m-0">
                                <span className="pe-1">{tag(newspaperOutline, "ID " + item.id)}</span>
                                <IonCard className="p-1 w-100">
                                    <IonCardHeader className='m-0 p-0'>
                                        <IonCardTitle className='text-white py-0 ion-align-items-center'>
                                            <IonRow className="m-0 p-0 justify-content-between">
                                            <span className="m-0 p-0">
                                                {tag(calendarOutline, offsetDateTimeParaString(item.data))}
                                                {tag(pricetagOutline, item.idProjeto +" - "+ item.nomeProjeto)}
                                                {tag(cubeOutline, item.evidencias)}
                                                {tag(checkmarkCircleOutline, item.revisados)}
                                                {tag(item.sucesso ? thumbsUpOutline : thumbsDownOutline, null)}
                                            </span>
                                            <span className="m-0 p-0">
                                                <IonButton size="small" 
                                                    fill="outline"
                                                    className='my-0'
                                                    onClick={() => obterUmaRevisao(item.id)}
                                                >
                                                    <IonIcon icon={eye} color="primary" className="pe-1" style={{transform: 'translate(0px, -1px)'}} />
                                                    Revisar
                                                </IonButton>
                                            </span>
                                            </IonRow>
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='bg-white text-primary p-0 m-0'>
                                        <div className={fonteCodigo}>
                                            <IonIcon icon={chatboxEllipsesOutline} color="medium" className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
                                            {item.nomeAtividade}
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </div>
                        </IonRow>
                    );
                })
        }
    </IonList>;

    function conteudo() {
        const loadingBar = <IonProgressBar type="indeterminate" />;
        if (isLoading) {
            return <div className='h-100 row align-items-center text-primary text-center mt-2'>
                <div className='py-5'>
                    <div className='col-12 text-primary h5'>Carregando recursos do banco...</div>
                    <div className='col-12'>Número de conexões: {conectionsCount}</div>
                </div>
                <br />
                {loadingBar}
            </div>;
        }
        return listaDosRelatorios;
    }

    return conteudo();
};

export default EscolherRelatorios;