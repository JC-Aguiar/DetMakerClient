import { IonAccordion, IonAccordionGroup, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonModal, IonRadio, IonRadioGroup, IonSplitPane, IonTitle, RadioGroupChangeEventDetail, useIonModal, useIonViewWillEnter } from '@ionic/react';
import { useRef, useState } from 'react';
import { caretDownOutline, closeCircle, cloudUpload, cube, flash, layers, library, listOutline, open, refresh } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { loadingJobs, setJobs, setViewJobs } from '../Store/Reducer/ReducerJobs';
import DynamicModal from '../components/DynamicModal';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { loadingPipelines, setPipelines } from '../Store/Reducer/ReducerPipelines';
import { JobConfig, parseJobInfo } from '../data/JobConfigDTO';
import { Notificacao } from '../components/Noticacao';
import { ButtonLayoutProps, layoutGrupoBotoes } from '../components/ButtonLayout';
import ConfigurarJobs from '../components/ConfigurarJobs';
import { JobInfoDTO } from '../data/JobInfoDTO';
import { setMainPipeline, setMainJobs } from '../Store/Reducer/ReducerAtividade';
import ListaCatalogoJobs from '../components/ListaCatalogoJobs';
import Schedule from '../components/Schedule';
import Informativo from '../components/Informativo';
import Carregando from '../components/Carregando';
import { QueryInfoDTO } from '../data/QueryInfoDTO';
import { loadingQueries, setQueries } from '../Store/Reducer/ReducerQueries';
import ModalNovaPipeline from '../components/ModalNovaPipeline';
import ModalExecPipeline from '../components/ModalExecPipeline';
import { MassaTabelaDTO } from '../data/MassaTabelaDTO';
import { loadingMassa, setMassas } from '../Store/Reducer/ReducerMassas';
import ModalConfigMassa from '../components/ModalConfigMassa';
import ModalTiposDeMassa from '../components/ModalTiposDeMassa';
import ListaRetratril, { ListaRetratrilAgrupada, ListaRetratrilProps } from '../components/ListaRetratil';
import ListaCatalogoPipelines from '../components/ListaCatalogoPipelines';

const EscolherPipelines: React.FC<Notificacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();

    //Atributos de controle
    const notificacao = { toastInfo: toastInfo, toastOk: toastOk, toastErro: toastErro } as Notificacao;
    const [conectionsCount, setConectionsCount] = useState<number>(0);
    const [jobsSucesso, setJobsSucesso] = useState<boolean | null>(null);
    const [pipelinesSucesso, setPipelinesSucesso] = useState<boolean | null>(null);
    const isLoadingJobs = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const isLoadingPipelines = useSelector((state: RootState) => state.store.catalogoPipelines.loading);
    const isLoading = isLoadingJobs || isLoadingPipelines;

    //Atributos de input do usuário
    const [anexo, setAnexo] = useState<File | null>(null);
    const [massaToView, setMassaToView] = useState<string>("");

    //Atributos dos principais recursos da página
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
    const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const catalogoMassas: MassaTabelaDTO[] = useSelector((state: RootState) => state.store.catalogoMassas.catalogo);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.catalogoJobs.jobsSelecionados);
    const catalogoJobsSelecionados: JobInfoDTO[] = catalogoJobs.filter(
        (item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);  
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        if ((catalogoJobs.length < 1 || conectionsCount < 1) && !isLoading) coletarRecursos();
    }, []);

    //Botões
    const butoes: ButtonLayoutProps[] = [ 
        {
            title: 'Atualizar',
            icon: refresh,
            trigger: () => coletarRecursos(),
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
            trigger: () => uploadSchedule(),
            disable: isLoading,
        }, 
        {
            title: 'Ver Schedule',
            icon: listOutline,
            trigger: () => {
                if (!modalRef || !modalRef.current) return;
                modalRef.current.present();
                setVerModalSchedule(true);
                console.log(`Ativando modal Shedule (var: ${verModalSchedule})`);
            },
            disable: isLoading || catalogoJobs.length < 1,
        },
    ];

    //Modal para criar nova Pipeline
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Criar Nova Pipeline",
            elemento: <ModalNovaPipeline toastInfo={toastInfo} toastOk={toastOk} toastErro={toastErro} />, //conteudoModalNovaPipeline(),
            onDismiss: () => modalNovaPipelineOff(),
        }
    );

    //Modal para ver registro de Massa
    const [modalConfigMassaOn, modalConfigMassaOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Mapeamento de Massa",
            elemento: <ModalConfigMassa 
                    notificacao={notificacao} 
                    massa={catalogoMassas.find(massa => massa.nome === massaToView)} 
                />,
            onDismiss: () => modalConfigMassaOff(),
            //helpContent: <ModalTiposDeMassa />,
        }
    );

    //Painel principal (direita) contendo os recursos selecionado no painel de opções (esquerda)
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

    //Listagem das Massas no Menu Lateral
    const listarMassas = (
        <IonList className='m-0 p-0'>
        {
            catalogoMassas.map((item, index) => {
                const color = index % 2 === 0 ? 'medium' : 'none';
                return (
                    <IonItem key={index} lines='none'
                        color={color}
                        className='ion-align-items-top text-white small p-0 m-0'
                        style={{ '--min-height': '32px' }}
                        onClick={() => {
                            setMassaToView(item.nome);
                            modalConfigMassaOn();
                        }}
                    >
                        <IonIcon color='primary'
                            icon={open}
                            size='small' 
                            className='p-0 m-0 me-1'
                            style={{ height: '16px', width: '17px', }}
                        />
                        <IonLabel className='p-0 m-0'>
                            <span className='text-white font-monospace'>{item.nome}</span>
                            <IonBadge color='secondary'
                                className='ms-1 small fw-normal opacity-25'
                            >
                                {item.colunas.length}
                            </IonBadge>
                        </IonLabel>
                    </IonItem>
                );
            })
        }
        </IonList>
    );

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
                                                    <div className='text-white fw-bold border-bottom p-2' key={queryIndex}>
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

    //Co    nfigurações e propriedades da modal personalizada da Schedule  
    const [verModalSchedule, setVerModalSchedule] = useState<boolean>(false);
    const modalRef = useRef<HTMLIonModalElement>(null);

    //Atualizando Pipelines e Jobs com base no banco
    async function coletarRecursos() {
        dispatch(loadingJobs(true));
        dispatch(loadingPipelines(true));
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

    //Coletando arquivo da máquina local
    /*
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
    */

    //Requisição para abrir a planilha schedule para obter os jobs
    async function uploadSchedule() {
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
            const jobsBanco: JobInfoDTO[] = await axiosRequest.openSchedule(mainAmbienteId, anexo);
            dispatch(setJobs(jobsBanco));
            dispatch(setMainPipeline({ id: -1, nome: "", jobs: [] }));            
            dispatch(setMainJobs([]));

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

    //Requisição para obter os jobs diretamente do banco
    async function obterJobsBanco() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Jobs'.`);
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        toastInfo("DOWNLOAD JOBS: Em execução...", []);
        setJobsSucesso(null);
        setConectionsCount(c => c+1);
        try {
            const novosJobs: JobInfoDTO[] = (await axiosRequest.getAllJobs(mainClienteId));
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
        dispatch(setMainPipeline({
            id: -1,
            nome: "",
            jobs: []
        }));
        try {
            const pipelines: PipelineInfoDTO[] = await axiosRequest.getAllPipelines(mainClienteId);
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

    //Requisição para obter todas as Config-Queries do banco
    async function obterQueriesBanco() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Config-Queries'.`);
        toastInfo("DOWNLOAD QUERIES: Em execução...", []);
        //setQueries([]); Apagar recursos antes de uma nova coleta ou não?
        dispatch(loadingQueries(true));
        try {
            const queriesBanco: QueryInfoDTO[] = await axiosRequest.getAllConfigQueries(mainClienteId);
            dispatch(setQueries(queriesBanco));
            toastOk("DOWNLOAD QUERIES: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Download Config-Queries' funcionou.`);
        }
        catch (error) {
            toastErro(`DOWNLOAD QUERIES: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Download Config-Queries' falhou.`);
        }
        dispatch(loadingQueries(false));
    }

    //Requisição para obter todas as MassaTabelaDTO's do banco
    async function obterMassasBanco() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Massas'.`);
        toastInfo("DOWNLOAD MASSAS: Em execução...", []);
        //setMassas([]); Apagar recursos antes de uma nova coleta ou não?
        dispatch(loadingMassa(true));
        try {
            const massasBanco: MassaTabelaDTO[] = await axiosRequest.getAllMassas(mainClienteId);
            dispatch(setMassas(massasBanco));
            toastOk("DOWNLOAD MASSAS: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Download Massas' funcionou.`);
        }
        catch (error) {
            toastErro(`DOWNLOAD MASSAS: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Download Massas' falhou.`);
        }
        dispatch(loadingMassa(false));
    }

    //Conteúdo principal caso existam dados na base
    function conteudo() {

        const listasRetratil: ListaRetratrilProps[] = [
            {titulo: 'Jobs', icon: cube, conteudo: <ListaCatalogoJobs />},
            {titulo: 'Pipelines', icon: layers, conteudo: <ListaCatalogoPipelines />},
            {titulo: 'Gerador de Massa', icon: library, conteudo: listarMassas},
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

            {/* Modal personalizada da Schedule */}
            <IonModal style={{'--min-width': '94%', '--min-height': '90%'}} isOpen={verModalSchedule} ref={modalRef}>
                <DynamicModal
                    titulo="Schedule Completa"
                    elemento={<Schedule />}
                    onDismiss={() => {
                        if (!modalRef || !modalRef.current) return;
                        modalRef.current.dismiss();
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

