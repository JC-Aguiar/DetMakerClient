import { IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonPopover, IonProgressBar, IonRadio, IonRadioGroup, IonRow, IonSplitPane, IonText, IonTitle, RadioGroupChangeEventDetail, useIonModal, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { addCircle, arrowDownCircle, caretDownCircle, caretDownOutline, folderOpen, refresh, server } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { setJobs, viewJobs } from '../Store/Reducer/ReducerJobs';
import DynamicModal from '../components/DynamicModal';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { ReducerProjetoTYPE, setDadosProjeto } from '../Store/Reducer/ReducerProjetos';
import { setPipelines } from '../Store/Reducer/ReducerPipelines';
import { JobConfig, JobConfigDTO } from '../data/JobConfigDTO';
import { Noticacao } from '../components/Noticacao';
import { setButtons } from '../Store/Reducer/ReducerButtons';
import { DynamicButtonsAddsOn } from '../components/DynamicButtons';
import ConfigurarJobs from './ConfigurarJobs';
import { JobInfoDTO } from '../data/JobInfoDTO';
import { setMainPipeline, setMainJobs } from '../Store/Reducer/ReducerAtividade';
import { ComandoSQL } from '../data/ComandoSQL';
import ListarJobs from '../components/ListarJobs';


const EscolherPipelines: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atrbiutos úteis
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(true);
    const [conectionsCount, setConectionsCount] = useState<number>(0);

    //Atributos dos principais recursos da aplicação
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.pilhaJobs.catalago);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.pilhaJobs.jobsSelecionados);
    const catalagoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.value);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineIndex: number = catalagoPipelines.findIndex((item) => item.nome === mainPipeline);
    const [jobsSucesso, setJobsSucesso] = useState<boolean | null>(null);
    const [pipelinesSucesso, setPipelinesSucesso] = useState<boolean | null>(null);

    //Atributos para carregar schedule
    const [enviar, setEnviar] = useState<boolean | undefined>(false);
    const [anexo, setAnexo] = useState<File | null>(null);


    //Atributos de botões
    const botaoAtualizar = {
        title: 'Atualizar',
        icon: refresh,
        trigger: () => coletarRecursos(),
    } as DynamicButtonsAddsOn;

    const botaoCriar = {
        title: 'Nova Pipeline',
        icon: addCircle,
        trigger: () => modalNovaPipelineOn(),
    } as DynamicButtonsAddsOn;


    //Conteúdo da modal 'Nova Pipeline'
    const conteudoNovaPipeline = (
        <>
            <div className='h5 text-primary mt-2 text-center'>
                Escolha como deseja obter os Jobs para compõem a Pipeline
            </div>

            {/* criar pipeline via jobs em schedule */}
            <div className="my-3 mx-5 border border-2 rounded bg-white p-3 text-center">
                <span className='text-primary h4'>Usar os Jobs de um arquivo schedule</span>
                <form action="/upload" method="post" encType="multipart/form-data" >
                    <label htmlFor="formFile" className="form-label" ></label>
                    <input className="form-control" type="file" id="formFile" onChange={getFile} />
                </form>
                <IonButton className='w-100' onClick={abrirPlanilha} disabled={!enviar}>
                    <IonIcon icon={folderOpen} className='me-2'></IonIcon>
                    Abrir Jobs da Schedule
                </IonButton>
            </div>

            {/*criar pipeline via jobs em banco */}
            <div className='mt-3 mx-5 border border-2 rounded bg-white p-3 text-center'>
                <span className='text-primary text-center h4'>Usar os Jobs salvos no banco</span>
                <IonButton className='w-100 mt-4' onClick={() => obterJobsBanco(false)}>
                    <IonIcon icon={server} className='me-2'></IonIcon>
                    Carregar Jobs do Banco
                </IonButton>
            </div>
        </>
    );

    const conteudoPainelPrincipal = () => {
        if (jobsSelecionados.length < 1) {
            console.log(`Exibindo Pipeline: ${mainPipeline}.`);
            return <ConfigurarJobs toastInfo={toastInfo} toastOk={toastOk} toastErro={toastErro} />;
        }
        return exibirCatalogoJobs(
            catalogoJobs.filter((item) => jobsSelecionados.findIndex((id) => item.id === id) !== -1)
        );
    }

    const listarPipelines = (
        <IonRadioGroup value={mainPipeline}
            className='border-0 h-100'
            onIonChange={(e) => selecionarMainPipeline(e)}
        >
            <IonList className='m-0 p-0'>
                {
                    catalagoPipelines.map((item, index) => {
                        const color = index % 2 === 0 ? 'bg-white' : 'bg-light';
                        const jobTag = item.jobs.length > 1 ? 'Jobs' : 'Job';
                        return (
                            <IonItem key={index} lines='none'
                                className={`p-0 m-0 ${color} ion-align-items-top text-primary small`}
                                style={{ '--min-height': '32px' }}

                            >
                                <IonLabel className='p-0 m-0'>
                                    <span className='text-primary'>{item.nome}</span>
                                    <IonBadge color='secondary'
                                        className='ms-1 small fw-normal text-dark'
                                    >
                                        {item.jobs.length}
                                    </IonBadge>
                                </IonLabel>
                                <IonRadio color='primary'
                                    slot="start"
                                    value={item.nome}
                                    className='p-0 m-0 me-1'
                                    style={{ height: '16px', width: '17px', }}
                                />
                            </IonItem>
                        );
                    })
                }
            </IonList>
        </IonRadioGroup>
    );

    //Conteúdo da modal 'Carregar Pipeline'
    const painelDeControle = (
        <IonContent fullscreen={true} scrollEvents={true} className='w-100 p-0 m-0 card'>
            <IonSplitPane when="xs" contentId="main">
                <IonMenu contentId="main" className='border-end border-2 ' >
                    <IonAccordionGroup multiple={true}>

                        <IonAccordion value="jobs" className='lista-navegacao'>
                            <IonItem slot="header" color="primary" className='rounded rounded-0'>
                                <IonFabButton className="p-2 m-0" size='small' color='dark'>
                                    <IonIcon icon={caretDownOutline} size='small' color="primary" className="ion-accordion-toggle-icon" />
                                </IonFabButton>
                                <IonLabel className='d-flex py-0 my-0 ion-align-items-center ion-justify-content-between p-0 m-0'>
                                    <span className='ms-1'>Jobs</span>
                                    <div className='d-flex p-0 m-0'>
                                        <IonFabButton className="p-2 m-0" size='small'>
                                            <IonIcon icon={botaoAtualizar.icon} size='small' color="dark" onClick={botaoAtualizar.trigger} />
                                        </IonFabButton>
                                        <IonFabButton className="p-2 m-0" size='small'>
                                            <IonIcon icon={botaoCriar.icon} size='small' color="dark" onClick={botaoCriar.trigger} />
                                        </IonFabButton>
                                    </div>
                                </IonLabel>
                            </IonItem>
                            <div className="p-0 m-0" slot="content">
                                <div className='pb-1 mb-1'>
                                    <IonContent fullscreen={false} scrollEvents={true} style={{ height: '200px' }} >
                                        <ListarJobs />
                                    </IonContent>
                                </div>
                            </div>
                        </IonAccordion>

                        <IonAccordion value="pipelines" className='lista-navegacao'>
                            <IonItem slot="header" color="primary" className='rounded rounded-0'>
                                <IonFabButton className="p-2 m-0" size='small' color='dark'>
                                    <IonIcon icon={caretDownOutline} size='small' color="primary" className="ion-accordion-toggle-icon" />
                                </IonFabButton>
                                <IonLabel className='d-flex ion-align-items-center ion-justify-content-between py-0 my-0'>
                                    <span className='ms-1'>Pipelines</span>
                                    <div className='d-flex p-0 m-0'>
                                        <IonFabButton className="p-2 m-0" size='small'>
                                            <IonIcon icon={botaoAtualizar.icon} size='small' color="dark" onClick={botaoAtualizar.trigger} />
                                        </IonFabButton>
                                        <IonFabButton className="p-2 m-0" size='small'>
                                            <IonIcon icon={botaoCriar.icon} size='small' color="dark" onClick={botaoCriar.trigger} />
                                        </IonFabButton>
                                    </div>
                                </IonLabel>
                            </IonItem>
                            <div className="p-0 m-0" slot="content">
                                <div className='pb-1 mb-1'>
                                    <IonContent fullscreen={false} scrollEvents={true} style={{ height: '200px' }} >
                                        {listarPipelines}
                                    </IonContent>
                                </div>
                            </div>
                        </IonAccordion>

                    </IonAccordionGroup>
                </IonMenu>
                <div className="ion-page" id="main">
                    <IonContent fullscreen={true} scrollEvents={true}>
                        {conteudoPainelPrincipal()}
                        <div className='text-primary'> Job Selecionado: {jobsSelecionados} </div>
                    </IonContent>
                </div>

            </IonSplitPane>
        </IonContent>
    );



    function exibirCatalogoJobs(jobsSelecionados: JobInfoDTO[]) {
        return jobsSelecionados.map((jobDto) =>
            <IonCard className=''>
                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                            <IonCardHeader className='bg-primary py-0'>
                                <IonCardTitle className='text-white py-0'>{jobDto.nome}</IonCardTitle>
                            </IonCardHeader>
                        </IonItem>
                        <IonCardContent>
                            <div className='small'>
                                <section className="">
                                    <table className="table table-stripe"> {/* table-light table-striped */}
                                        <tbody>
                                            <tr className='p-0 m-0'>
                                                <td className='text-end'>Descrição:</td>
                                                <td className='' colSpan={3}>{jobDto.descricao}</td>
                                            </tr>
                                            <tr className='p-0 m-0'>
                                                <td className='text-end'>Fase:</td>
                                                <td className='' colSpan={3}>{jobDto.fase}</td>
                                            </tr>
                                            <tr className='p-0 m-0'>
                                                <td className='text-end'>Programas:</td>
                                                <td className='' colSpan={3}>{jobDto.programa.join(", ")}</td>
                                            </tr>
                                            <tr className='p-0 m-0'>
                                                <td className='text-end'>Tabelas:</td>
                                                <td className='' colSpan={3}>{jobDto.tabelas.join(", ")}</td>
                                            </tr>
                                            <tr className='p-0 m-0'>
                                                <td className='text-end'>Máscara de Carga:</td>
                                                <td className='' colSpan={1}>{jobDto.mascaraEntrada.join(", ")}</td>
                                                <td className='text-end'>Máscara de Saída:</td>
                                                <td className='' colSpan={1}>{jobDto.mascaraSaida.join(", ")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                            </div>
                        </IonCardContent>
                    </IonAccordion>
                </IonAccordionGroup>
            </IonCard>
        );
    }

    //Configurações e propriedades da modal de nova pipeline
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Criar nova Pipeline",
            elemento: conteudoNovaPipeline,
            onDismiss: () => modalNovaPipelineOff(),
        }
    );

    //Configurações e propriedades da modal de pipelines no banco
    const [modalGetPipelinesOn, modalGetPipelinesOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Pipelines no Banco",
            elemento: painelDeControle,
            onDismiss: () => modalGetPipelinesOff(),
        }
    );

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        //dispatch(setButtons( [botaoAtualizar, botaoCriar] ));
        coletarRecursos();
    }, []);


    //Atualizando Pipelines e Jobs com base no banco
    async function coletarRecursos() {
        setLoading(true);
        await obterJobsBanco(false).then(() => obterPipelinesBanco());
        setLoading(false);
    }

    //Coletando arquivo da máquina local
    function getFile(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile != null) {
            setAnexo(selectedFile);
            setEnviar(true);
        }
        else {
            setAnexo(null);
            setEnviar(false);
        }
    }

    //Requisição para abrir a planilha schedule para obter os jobs
    async function abrirPlanilha() {
        try {
            if (!anexo) {
                console.log("[ESCOLHER-PIPELINES]: Nenhum arquivo para envio.");
                return
            };
            console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Abrir Planilha'.`);
            modalNovaPipelineOff();
            toastInfo("ABRIR PLANILHA: Em execução...", []);

            const formData = new FormData();
            formData.append('file', anexo);
            const jobsBanco: JobInfoDTO[] = await axiosRequest.openSchedule(anexo);
            dispatch(setJobs(jobsBanco));

            toastOk("ABRIR PLANILHA: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Abrir Planilha' funcionou.`);

            //console.log(`[APP] Navegando para: ${axiosRequest.URL_JOBS}`);
            //history.push(axiosRequest.URL_JOBS);
        }
        catch (error) {
            toastErro(`ABRIR PLANILHA: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Abrir Planilha' falhou.`);
        }
    }

    //Acionamento ao selecionar uma opção de Pipeline carregada do banco
    function selecionarMainPipeline(e: CustomEvent<RadioGroupChangeEventDetail<string>>): void {
        const valor = e.detail.value;
        if (valor === null || valor === undefined) return;
        console.log(`[ESCOLHER-PIPELINES]: Usuário selecionou opção Pipeline nome '${valor}'.`);

        const userPipeline = catalagoPipelines.find((item) => item.nome === valor);
        if (!userPipeline) {
            console.log(`[ESCOLHER-PIPELINES]: Pipeline '${valor}' não identificada no catálogo Pipelines.`);
            return;
        };
        console.log(`[ESCOLHER-PIPELINES]: Pipeline '${userPipeline.nome}' identificada no catálogo de Pipelines.`);

        //Definido MainJobs com base na MainPipline
        const jobsMainPipline: JobConfig[] = [];
        userPipeline.jobs.forEach((pipelineJob, index) => {
            const atividadeJobs = catalogoJobs.find((jobDto) => jobDto.nome === pipelineJob);
            if (!atividadeJobs) {
                console.log(`[ESCOLHER-PIPELINES]: Nenhum dos Jobs informados na Pipeline selecionada '
                    + '(${userPipeline.nome}') foram identificados no catálogo de Jobs.`);
                return;
            }
            const configJob = {
                ordem: index,
                id: atividadeJobs.id,
                nome: atividadeJobs.nome,
                argumentos: atividadeJobs.parametros.map((item) => ""),
                queries: atividadeJobs.tabelas.map((item) => {
                    return {
                        campos: [],
                        tabela: item,
                        filtros: [],
                        sql: "",
                        descricao: "",
                        dinamico: false,
                    } as ComandoSQL;
                }),
                cargas: atividadeJobs.mascaraEntrada.map((item) => ""),
            } as JobConfig;
            jobsMainPipline.push(configJob);
        });
        dispatch(setMainPipeline({
            nome: userPipeline.nome,
            jobs: jobsMainPipline
        }));
        dispatch(viewJobs([]));
        //reordenar();
        //dispatch(setMainJobs(jobsMainPipline));
        //dispatch(setDadosProjeto(novaPipelineConfig));
    }

    //Requisição para obter os jobs diretamente do banco
    async function obterJobsBanco(aplicarPipeline: boolean) {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Jobs'.`);
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        toastInfo("DOWNLOAD JOBS: Em execução...", []);
        setJobsSucesso(null);
        setConectionsCount(conectionsCount + 1);
        try {
            const novosJobs: JobInfoDTO[] = (await axiosRequest.getAllJobs());
            dispatch(setJobs(novosJobs));
            //const jobsPipeline = (mainPipelineIndex > -1 && aplicarPipeline) ? catalagoPipelines[mainPipelineIndex].jobs : [];
            //console.log(`[APP] Navegando para: ${axiosRequest.URL_JOBS}`);
            //history.push(axiosRequest.URL_JOBS);
            setJobsSucesso(true);
            toastOk("DOWNLOAD JOBS: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Download Jobs' funcionou.`);
        }
        catch (error) {
            setJobsSucesso(false);
            toastErro(`DOWNLOAD JOBS: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Download Jobs' falhou.`);
        }
    }

    //Requisição para obter todas as pipelines do banco
    async function obterPipelinesBanco() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Pipelines'.`);
        toastInfo("DOWNLOAD PIPELINES: Em execução...", []);
        setPipelinesSucesso(null);
        dispatch(setMainPipeline({ nome: "", jobs: [] }));
        try {
            const pipelines: PipelineInfoDTO[] = await axiosRequest.getAllPipelines();
            dispatch(setPipelines(pipelines));

            //history.push('/det-maker/select/');
            //modalGetPipelinesOn();
            setPipelinesSucesso(true);
            toastOk("DOWNLOAD PIPELINES: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Download Pipelines' funcionou.`);
        }
        catch (error) {
            setPipelinesSucesso(false);
            toastErro(`DOWNLOAD PIPELINES: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Download Pipelines' falhou.`);
        }
    }

    //Requisição para executar a Pipeline
    async function reexecutarPipeline() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Rexecutar Pipeline'.`);
        toastInfo("REEXECUTAR PIPELINE: Em execução...", []);
        try {
            await axiosRequest.reexecutarPilha(mainPipeline); //const resposta: string = 
            toastOk("REEXECUTAR PIPELINE: Realizada com sucesso.", []);
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Rexecutar Pipeline' funcionou.`);
        }
        catch (error) {
            toastErro(`REEXECUTAR PIPELINE: ${error}`, []);
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Rexecutar Pipeline' falhou.`);
        }
    }

    function conteudo() {
        const loadingBar = <IonProgressBar type="indeterminate" />;
        if (loading) {
            return <div className='h-100 row align-items-center text-primary text-center mt-2'>
                <div className='col-12 text-primary h5'>Carregando recursos do banco...</div>
                <div className='col-12'>Número de conexões: {conectionsCount}</div>
                <br />
                {loadingBar}
            </div>;
        }
        return painelDeControle;
    }

    return conteudo();

    /*
    <IonCol size='12' sizeMd='6' >
        <div className="d-block h-100">
            <IonButton 
                fill='solid'
                className="w-100 p-0 m-0"
                disabled={mainPipelineIndex === -1}
                onClick={() => carregarBanco(true)}
            >
            <IonIcon icon={createOutline} className='mx-1 pt-0 pb-0' />
                Editar Pipeline
            </IonButton>
        </div>
    </IonCol>
    */

    //Conteúdo principal renderizado nesta página
    /*
    return (
        <div className='row pt-5 px-0 px-md-5'>
            <div className='col-12 col-md-6' >
                <div className="d-block h-100 mb-3 border border-2">
                    <IonButton expand="full"
                        fill='clear'
                        size="large"
                        className="centered-button h-100 m-0"
                        onClick={() => modalNovaPipelineOn()}
                    >
                        <IonIcon icon={create} className='mx-1 pt-0 pb-1' />
                        Nova Pipeline
                    </IonButton>
                </div>
            </div>
            <div className='col-12 col-md-6'>
                <div className="d-block h-100 mb-3 border border-2">
                    <IonButton expand="full"
                        fill='clear'
                        size="large"
                        className="centered-button h-100 m-0"
                        onClick={() => obterPipelinesBanco()}
                    >
                        <IonIcon icon={cloudDownload} className='mx-1 pt-1 pb-0' />
                        Carregar Pipelines
                    </IonButton>
                </div>
            </div>
        </div>
    );
    */
};

export default EscolherPipelines;

