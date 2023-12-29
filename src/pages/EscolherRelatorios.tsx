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
import { alertCircleOutline, calendarOutline, chatboxEllipsesOutline, checkmarkCircleOutline, cubeOutline, document, documentText, eye, flag, newspaper, newspaperOutline, pricetagOutline, refresh, thumbsDownOutline, thumbsUpOutline, toggle } from "ionicons/icons";
import { DynamicButtonsAddsOn } from "../components/DynamicButtons";
import { offsetDateTimeParaString } from "../App";
import { RelatorioHistoricoDTO } from "../data/RelatorioHistoricoDTO";
import { addRevisao, removeRevisao } from "../Store/Reducer/ReducerRevisao";
import { useHistory } from "react-router";
import { UserDTO } from "../data/UserDTO";
import iconPipeline from '../resources/pipeline.svg';


const EscolherRelatorios: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [conectionsCount, setConectionsCount] = useState<number>(0);
    const [relatoriosSucesso, setRelatoriosSucesso] = useState<boolean | null>(null);
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    //const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const catalogoRelatorios: RelatorioResumoDTO[] = useSelector((state: RootState) => state.store.catalogoRelatorios.catalogo);
    const isLoading: boolean = useSelector((state: RootState) => state.store.catalogoRelatorios.loading);
    const mainCliente: string = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const mainAmbiente: string = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);
    const fonteCodigo = 'font-monospace text-secondary fw-bold ';

    const tag = (icone: string | null, conteudo: string | number | null, alerta: boolean = false) => {
        const padding = conteudo === null ? "pe-0" : "me-1 pe-2";
        const corFundo = alerta ? "warning" : "primary";
        const corTexto = alerta ? "light" : "dark";
        const tagIcone = icone === null ? 
            null : <IonIcon icon={icone} color={corTexto} className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
        return <IonBadge className={`mb-0 ${padding} h6`} color={corFundo}>
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

    //Requisição para obter o relatório no banco a ser revisado
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
            dispatch(addRevisao(relatorioParaRevisar));

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

    function abrirDet(fileBlob: Blob) {
        //TODO: >>> MOVER PARA UM OUTRO ESCOPO/CLASSE  <<<
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
    }
    
    //Requisição para obter o DET no banco
    async function obterDet(id: number) {
        if (!user) {
            toastErro("ERRO: Usuário não definido!", []);
            return;
        };
        const titulo = `OBTER DET ID ${id}`;
        console.log(`[ESCOLHER-RELATORIOS]: Iniciando requisição '${titulo}'.`);
        toastInfo(`${titulo}: Em execução...`, []);
        try {
            const fileBlob: Blob = await axiosRequest.getDet(id, user.name, user.email);
            const buttons = [
                {
                  text: 'Abrir',
                  role: 'Abrir DET',
                  handler: () => abrirDet(fileBlob),
                }
            ];
            toastOk(`${titulo}: Realizado com sucesso.`, buttons);
            console.log(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' funcionou.`);
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
                    const tagSucesso = !item.sucesso ? tag(alertCircleOutline, null, true) : <></>;
                    const jaRevisado = item.revisados === item.evidencias;
                    return (
                        <IonRow key={index} className="container ion-align-items-center">
                            <div className="parallelogram bg-info"/>
                            <div className="d-flex w-100 align-content-center ion-align-items-center p-0 m-0 normal-shape">
                                <span className="pe-1">{tag(newspaperOutline, "ID " + item.id)}</span>
                                <IonCard className="p-1 w-100 bg-transparent border-0" style={{boxShadow: '0 0 0 '}}>
                                    <IonCardHeader className='m-0 p-0'>
                                        <IonCardTitle className='text-white py-0 ion-align-items-center'>
                                            <IonRow className="m-0 p-0 justify-content-between">
                                            <IonCol className="m-0 p-0">
                                                {tag(calendarOutline, offsetDateTimeParaString(item.data))}
                                                {tag(pricetagOutline, item.idProjeto +" - "+ item.nomeProjeto)}
                                                {tag(cubeOutline, item.evidencias)}
                                                {tag(checkmarkCircleOutline, item.revisados, !jaRevisado)}
                                                {tagSucesso}
                                            </IonCol>
                                                <IonBadge color="#" className="m-0 p-0 pe-1">
                                                    <IonButton size="small" 
                                                        fill="outline"
                                                        className='m-0 '
                                                        onClick={() => obterUmaRevisao(item.id)}
                                                    >
                                                        <IonIcon icon={eye} color="primary" className="pe-1" style={{transform: 'translate(0px, -1px)'}} />
                                                        Revisar
                                                    </IonButton>
                                                </IonBadge>
                                                <IonBadge color="#" className="m-0 p-0 pe-1">
                                                    <IonButton size="small" 
                                                        fill="outline"
                                                        className='m-0 '
                                                        onClick={() => obterDet(item.id)}
                                                    >
                                                        <IonIcon icon={document} color="primary" className="pe-1" style={{transform: 'translate(0px, -1px)'}} />
                                                        Gerar DET
                                                    </IonButton>
                                                </IonBadge>
                                            </IonRow>
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='text-primary p-0 m-0'>
                                        <div className={fonteCodigo}>
                                            <div className="">
                                                <IonIcon icon={flag} color="medium" className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
                                                {item.nomeAtividade}
                                            </div>
                                            <div className="">
                                                <IonIcon icon={iconPipeline} className='ms-1' style={{fill: 'var(--ion-color-medium)', transform: 'translate(-3px, 3px)'}}/>
                                                {item.nomePipeline}
                                            </div>
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