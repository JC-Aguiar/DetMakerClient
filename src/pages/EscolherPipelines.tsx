import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonItem, IonLabel, IonMenu, IonModal, IonSplitPane, IonTitle, useIonModal, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { cloudUpload, cube, layers, library, listOutline, refresh } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { loadingJobs, setJobs } from '../Store/Reducer/ReducerJobs';
import DynamicModal from '../components/Core/DynamicModal';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { loadingPipelines, setPipelines } from '../Store/Reducer/ReducerPipelines';
import { Notificacao } from '../components/Core/Noticacao';
import { ButtonLayoutProps, layoutGrupoBotoes } from '../components/Core/ButtonLayout';
import ConfigurarJobs from '../components/Content/ConfigurarJobs';
import { JobInfoDTO } from '../data/JobInfoDTO';
import { setMainPipeline, setMainJobs } from '../Store/Reducer/ReducerAtividade';
import ListaCatalogoJobs from '../components/Lists/ListaCatalogoJobs';
import Schedule from '../components/Content/Schedule';
import Informativo from '../components/Core/Informativo';
import Carregando from '../components/Core/Carregando';
import { QueryInfoDTO } from '../data/QueryInfoDTO';
import { loadingQueries, setQueries } from '../Store/Reducer/ReducerQueries';
import ModalNovaPipeline from '../components/Modals/ModalNovaPipeline';
import { MassaTabelaDTO } from '../data/MassaTabelaDTO';
import { loadingMassa, setMassas } from '../Store/Reducer/ReducerMassas';
import { ListaRetratrilAgrupada, ListaRetratrilProps } from '../components/Core/ListaRetratil';
import ListaCatalogoPipelines from '../components/Lists/ListaCatalogoPipelines';
import ListaCatalogoMassas from '../components/Lists/ListaCatalogoMassas';
import ModalNovoJob from '../components/Modals/ModalNovoJob';

const EscolherPipelines: React.FC<Notificacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();
    
    //Atributos de input do usuário
    const [conectionsCount, setConectionsCount] = useState<number>(0);
    const [jobsSucesso, setJobsSucesso] = useState<boolean | null>(null);
    const [pipelinesSucesso, setPipelinesSucesso] = useState<boolean | null>(null);
    const [verModalSchedule, setVerModalSchedule] = useState<boolean>(false);
    const modalScheduleRef = useRef<HTMLIonModalElement>(null);
    const novaScheduleRef = useRef<HTMLInputElement>(null);

    //Atributos com estado gerenciado via Redux
    const isLoadingJobs = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const isLoadingPipelines = useSelector((state: RootState) => state.store.catalogoPipelines.loading);
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.configAtividade.jobsSelecionados);
    const catalogoJobsSelecionados: JobInfoDTO[] = catalogoJobs.filter(
        (item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1);
    const mainClienteId = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const mainCliente = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const userEmail: string | undefined = useSelector((state: RootState) => state.store.login.user?.email);

    //Atributos de utilidade
    const isLoading = isLoadingJobs || isLoadingPipelines;
    const notificacao = { toastInfo: toastInfo, toastOk: toastOk, toastErro: toastErro } as Notificacao;
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Criar Nova Pipeline",
            elemento: <ModalNovaPipeline toastInfo={toastInfo} toastOk={toastOk} toastErro={toastErro} />, //conteudoModalNovaPipeline(),
            onDismiss: () => modalNovaPipelineOff(),
        }
    );
    const [modalNovoJobOn, modalNovoJobOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Criar Novo Job",
            elemento: <ModalNovoJob notificacao={{toastInfo, toastOk, toastErro}} />,
            onDismiss: () => modalNovoJobOff(),
        }
    );

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        //if ((catalogoJobs.length < 1 || conectionsCount < 1) && !isLoading) coletarRecursos();
        //if (conectionsCount === 0) 
        //toastInfo(`CLIENTE: ${mainCliente} (ID ${mainClienteId})`, []);
        coletarRecursos();
    }, [mainClienteId, mainCliente]);

/*
    useEffect(() => {
        toastInfo("OPA. MUDOU!", []);
    }, [mainClienteId, mainCliente]);
*/

    //Conjunto de Requisições para atualizar todos os recursos da página 
    async function coletarRecursos() {
        dispatch(loadingJobs(true));
        dispatch(loadingPipelines(true));
        dispatch(setMainPipeline());
        //dispatch(loadingQueries(true));
        //queries
        await obterJobsBanco()
            .then(() => obterPipelinesBanco())
            .then(() => obterQueriesBanco())
            .then(() => obterMassasBanco());
        dispatch(loadingJobs(false));
        dispatch(loadingPipelines(false));
        //dispatch(loadingQueries(false));
    }

    //Requisição para abrir a planilha schedule para obter os jobs
    async function uploadSchedule(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) {
            toastErro("Nenhum arquivo selecionado.", []);
            return;
        }
        try {
            toastInfo("CARREGAR SCHEDULE: Em execução...", []);
            //const formData = new FormData();
            //formData.append('file', selectedFile);
            const email = userEmail ? userEmail : "DET-MAKER";
            const mensagem = await axiosRequest.openSchedule(mainClienteId, selectedFile, email);
            toastOk(`CARREGAR SCHEDULE: ${mensagem}.`, []);
            coletarRecursos();
        }
        catch (error) {
            toastErro(`CARREGAR SCHEDULE: ${error}`, []);
        }
        novaScheduleRef.current!.files = null;
    }

    //Requisição para obter os jobs diretamente do banco
    async function obterJobsBanco() {
        toastInfo(`DOWNLOAD JOBS: Coletando Jobs do Cliente '${mainCliente}' (ID ${mainClienteId}).`, []);
        setJobsSucesso(null);
        setConectionsCount(c => c+1);
        dispatch(setJobs([]));
        try {
            const novosJobs: JobInfoDTO[] = await axiosRequest.getAllJobs(mainClienteId);
            dispatch(setJobs(novosJobs));
            setJobsSucesso(true);
            toastOk("DOWNLOAD JOBS: Realizado com sucesso.", []);
        }
        catch (error) {
            setJobsSucesso(false);
            toastErro(`DOWNLOAD JOBS: ${error}`, []);
        }
    }

    //Requisição para obter todas as pipelines do banco
    async function obterPipelinesBanco() {
        toastInfo("DOWNLOAD PIPELINES: Em execução...", []);
        setPipelinesSucesso(null);
        dispatch(setPipelines([]));
        dispatch(setMainPipeline());
        try {
            const pipelines: PipelineInfoDTO[] = await axiosRequest.getAllPipelines(mainClienteId);
            dispatch(setPipelines(pipelines));
            setPipelinesSucesso(true);
            toastOk("DOWNLOAD PIPELINES: Realizado com sucesso.", []);
        }
        catch (error) {
            setPipelinesSucesso(false);
            toastErro(`DOWNLOAD PIPELINES: ${error}`, []);
        }
    }

    //Requisição para obter todas as Config-Queries do banco
    async function obterQueriesBanco() {
        toastInfo("DOWNLOAD QUERIES: Em execução...", []);
        dispatch(setQueries([]));
        dispatch(loadingQueries(true));
        try {
            const queriesBanco: QueryInfoDTO[] = await axiosRequest.getAllConfigQueries(mainClienteId);
            dispatch(setQueries(queriesBanco));
            toastOk("DOWNLOAD QUERIES: Realizado com sucesso.", []);
        }
        catch (error) {
            toastErro(`DOWNLOAD QUERIES: ${error}`, []);
        }
        dispatch(loadingQueries(false));
    }

    //Requisição para obter todas as MassaTabelaDTO's do banco
    async function obterMassasBanco() {
        toastInfo("DOWNLOAD MASSAS: Em execução...", []);
        dispatch(loadingMassa(true));
        dispatch(setMassas([]));
        try {
            const massasBanco: MassaTabelaDTO[] = await axiosRequest.getAllMassas(mainClienteId);
            dispatch(setMassas(massasBanco));
            toastOk("DOWNLOAD MASSAS: Realizado com sucesso.", []);
        }
        catch (error) {
            toastErro(`DOWNLOAD MASSAS: ${error}`, []);
        }
        dispatch(loadingMassa(false));
    }

    //Botões renderizados por esse componente
    const butoes: ButtonLayoutProps[] = [ 
        {
            title: 'Atualizar',
            icon: refresh,
            trigger: () => coletarRecursos(),
            disable: isLoading,
        }, 
        {
            title: 'Novo Job',
            icon: cube,
            trigger: () =>  modalNovoJobOn(),
            disable: isLoading,
        },
        {
            title: 'Nova Pipeline',
            icon: layers,
            trigger: () =>  modalNovaPipelineOn(),
            disable: isLoading || catalogoJobs.length < 1,
        },
        {
            title: 'Nova Schedule',
            icon: cloudUpload,
            trigger: () => novaScheduleRef.current!.click(),
            disable: isLoading,
        }, 
        {
            title: 'Ver Schedule',
            icon: listOutline,
            trigger: () => {
                if (!modalScheduleRef || !modalScheduleRef.current) return;
                modalScheduleRef.current.present();
                setVerModalSchedule(true);
                console.log(`Ativando modal Shedule (var: ${verModalSchedule})`);
            },
            disable: isLoading || catalogoJobs.length < 1,
        },
    ];

    //Define conteúdo a ser exibido no painel principal (direita), com base nos recursos selecionado no painel de opções (esquerda)
    const conteudoPainelPrincipal = () => {
        if (jobsSelecionados.length > 0) 
            return exibirJobsSelecionados();

        if (mainPipeline !== "") 
            return <ConfigurarJobs toastInfo={toastInfo} toastOk={toastOk} toastErro={toastErro} />;

        const mensagem = 'Use o painel lateral para vizualizar {Jobs} e {Pipelines}\n'
            + 'Selecione um {Job}, fora da {Pipeline}, para analisá-lo\n'
            + 'Selecione uma {Pipeline} para inserir {Jobs} ou configurar sua execução';
        return <div className='position-absolute'>
            <Informativo mensagem={mensagem} status='Normal' />
        </div>;
    }

    //Exibição no painel principal (direita) listagem de cards, com base na Schedule, dos Jobs selecionados no painel de opções (esquerda)
    function exibirJobsSelecionados() {
        const fonteCodigo = 'font-monospace text-white fw-bold'
        return catalogoJobsSelecionados.map((jobDto, index) =>
            <IonCard key={index}>
                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="primary" className='' >
                            <IonCardHeader className='py-0'>
                                <IonCardTitle className='text-dark py-0'>{jobDto.nome}</IonCardTitle>
                            </IonCardHeader>
                        </IonItem>
                        <div className="glass rounded-0" slot="content">
                            <IonCardContent className='glass-content'>
                                <div className='small'>
                                    <IonTitle color='primary' className='p-0'>Dados da Schedule</IonTitle>
                                    <section className="mb-4">
                                        <table className="table table-stripe">
                                            <tbody className='text-white fw-bold'>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end' style={{ width: '0%' }}>Descrição:</td>
                                                    <td className='' colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.descricao}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Fase:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.fase}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Programas:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.programa.join(", ")}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Tabelas:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.tabelas.join(", ")}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Máscara Carga:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.mascaraEntrada.join(", ")}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Máscara Produto:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.mascaraSaida.join(", ")}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <IonTitle color='primary' className='p-0'>Dados de Queries</IonTitle>
                                        {
                                            jobDto.queries.map((queryItem, queryIndex) => {
                                                return (
                                                    <div className='text-white fw-bold border-bottom p-2' key={index * 10 + queryIndex}>
                                                        <IonTitle color='secondary' className='w-100 h6'>
                                                            {queryItem.nome}
                                                        </IonTitle>
                                                        <div className={`${fonteCodigo} mx-4`} >
                                                            {queryItem.sql}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </section>
                                </div>
                            </IonCardContent>
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
            </IonCard>
        );
    }

    //Conteúdo principal caso existam dados na base
    function conteudo() {

        const listasRetratil: ListaRetratrilProps[] = [
            {titulo: 'Jobs', icon: cube, conteudo: <ListaCatalogoJobs />},
            {titulo: 'Pipelines', icon: layers, conteudo: <ListaCatalogoPipelines />},
            {titulo: 'Gerador de Massa', icon: library, conteudo: <ListaCatalogoMassas notificacao={notificacao} />},
        ];

        if (catalogoJobs.length < 1) {
            return <Informativo 
                mensagem='Uma alternativa é fazer o upload da planilha de Jobs, usando o botão {Nova Schedule}' 
                status='SemDados'
            />;
        }
        return (
            <IonSplitPane when="xs" contentId="main" className='ps-5 ms-5 '>
                <IonMenu contentId="main" className='glass' color='#'>
                    <IonContent className='glass-content p-0 m-0 mx-5'>
                        <ListaRetratrilAgrupada listas={listasRetratil} />
                    </IonContent>
                </IonMenu>
                <div className="container" id="main" >
                    <IonContent className='w-100 h-100'>
                        {conteudoPainelPrincipal()}
                    </IonContent>
                </div>
            </IonSplitPane>
        );
    }

    //Renderização visual deste componente
    if (isLoading) return <Carregando />;
    return (
        <div className='p-0 m-0'> 
            <IonLabel className='m-0 p-0 h-100' >
                {layoutGrupoBotoes(butoes)}
                {conteudo()}
            </IonLabel>

            {/* Input invisível, para coletar Schedule dos Jobs a carregar no banco */}
            <form action="/upload" method="post" encType="multipart/form-data" hidden>
                <label htmlFor="formFile" className="form-label" hidden/>
                <input className="form-control" 
                    type="file" 
                    id="formFile" 
                    accept=".xlsx"
                    multiple={false}
                    ref={novaScheduleRef}
                    onChange={async e => await uploadSchedule(e)} 
                    hidden
                />
            </form>

            {/* Modal personalizada da Schedule */}
            <IonModal style={{'--min-width': '94%', '--min-height': '90%'}} isOpen={verModalSchedule} ref={modalScheduleRef}>
                <DynamicModal
                    titulo="Schedule Completa"
                    elemento={<Schedule />}
                    onDismiss={() => {
                        if (!modalScheduleRef || !modalScheduleRef.current) return;
                        modalScheduleRef.current.dismiss();
                        setVerModalSchedule(false);
                        console.log(`Desativando modal Shedule (var: ${verModalSchedule})`);
                    }}
                    padding={false}
                />
            </IonModal>
        </div>
    );
};

export default EscolherPipelines;

