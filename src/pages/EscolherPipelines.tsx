import { IonContent, IonMenu, IonModal, IonSplitPane, useIonModal, useIonViewWillEnter } from '@ionic/react';
import { useRef, useState } from 'react';
import { cloudUpload, cube, layers, library, listOutline, refresh } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { loadingJobs, setJobs } from '../Store/Reducer/ReducerJobs';
import DynamicModal from '../components/Core/DynamicModal';
import { loadingPipelines, setPipelines } from '../Store/Reducer/ReducerPipelines';
import { ButtonLayoutProps, layoutGrupoBotoes } from '../components/Core/ButtonLayout';
import ListaConfigJobs from '../components/Lists/ListaConfigJobs';
import { JobInfoDTO } from '../data/JobInfoDTO';
import { setMainPipeline, setViewJobs } from '../Store/Reducer/ReducerAtividade';
import ListaCatalogoJobs from '../components/Lists/ListaCatalogoJobs';
import Schedule from '../components/Content/Schedule';
import Informativo from '../components/Core/Informativo';
import Carregando from '../components/Core/Carregando';
import { loadingQueries, setQueries } from '../Store/Reducer/ReducerQueries';
import ModalNovaPipeline from '../components/Modals/ModalNovaPipeline';
import { loadingMassa, setMassas } from '../Store/Reducer/ReducerMassas';
import { ListaRetratrilAgrupada, ListaRetratrilProps } from '../components/Core/ListaRetratil';
import ListaCatalogoPipelines from '../components/Lists/ListaCatalogoPipelines';
import ListaCatalogoMassas from '../components/Lists/ListaCatalogoMassas';
import ModalNovoJob from '../components/Modals/ModalNovoJob';
import { addMensagem, atualizarMensagem } from '../Store/Reducer/ReducerAtividade';
import JobCard from '../components/Content/JobCard';

//Componente <EscolherPipelines>
const EscolherPipelines: React.FC = () => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();
    
    //Atributos de input do usuário
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
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(DynamicModal,
        {
            titulo: "Criar Nova Pipeline",
            elemento: <ModalNovaPipeline onSave={() => modalNovaPipelineOff()} />,
            onDismiss: () => modalNovaPipelineOff(),
        }
    );
    const [modalNovoJobOn, modalNovoJobOff] = useIonModal(DynamicModal,
        {
            titulo: "Criar Novo Job",
            elemento: <ModalNovoJob />,
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
        const id = `Get_Resources@${Date.now()}`;
        dispatch(addMensagem({ 
            id: id, 
            texto: 'Obtendo catálogo de Recusos.',
            status: 'INFO'
        }));
        const erros: {recurso: string, erro: string}[] = [];
        const addErro = (recurso: string, erro: string) => erros.push({recurso, erro});
        await Promise.all([
            obterJobsBanco().catch(error => addErro('Jobs', error)),
            obterPipelinesBanco().catch(error => addErro('Pipelines', error)),
            obterQueriesBanco().catch(error => addErro('Queries', error)),
            obterMassasBanco().catch(error => addErro('Massas', error)),
        ]);
        const mensagemGeral = erros.length < 1 ? 
            "Todos os recursos foram botidos com sucesso. " :
            "Alguns recursos falharam. ";
        const mensagensDeErro = erros.map(item => `{${item.recurso}: ${item.erro}`).join("\n");
        dispatch(atualizarMensagem({ 
            id: id, 
            complmento: mensagemGeral + mensagensDeErro,
            status: (erros.length > 0 ? 'ERROR' : 'OK')
        }));
    }

    //Requisição para abrir a planilha schedule para obter os jobs
    async function uploadSchedule(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        const id = `Upload_File@${Date.now()}`;
        if (!selectedFile) {
            dispatch(addMensagem({ 
                id: id, 
                texto: 'Nenhum arquivo selecionado para upload da Schedule.',
                status: 'INFO'
            }));
            return;
        }
        try {
            dispatch(addMensagem({ 
                id: id, 
                texto: `Carregando Schedule '${selectedFile.name}'.`,
                status: 'INFO'
            }));
            const email = userEmail ? userEmail : "DET-MAKER";
            const mensagem = await axiosRequest.openSchedule(mainClienteId, selectedFile, email);
            dispatch(atualizarMensagem({ 
                id: id, 
                complmento: `${mensagem}.`,
                status: 'OK'
            }));
            coletarRecursos();
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: id, 
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
        novaScheduleRef.current!.files = null;
    }

    //Requisição para obter os jobs diretamente do banco
    async function obterJobsBanco() {
        dispatch(loadingJobs(true));
        dispatch(setViewJobs([]));
        await axiosRequest.getAllJobs(mainClienteId)
            .then(
                novosJobs => dispatch(setJobs(novosJobs))
            );
    }

    //Requisição para obter todas as pipelines do banco
    async function obterPipelinesBanco() {
        dispatch(loadingPipelines(true));
        dispatch(setMainPipeline());
        await axiosRequest.getAllPipelines(mainClienteId)
            .then(
                novasPipelines => dispatch(setPipelines(novasPipelines))
            );
    }

    //Requisição para obter todas as Config-Queries do banco
    async function obterQueriesBanco() {
        dispatch(loadingQueries(true));
        await axiosRequest.getAllConfigQueries(mainClienteId)
            .then(
                queriesBanco => dispatch(setQueries(queriesBanco))
            );
    }

    //Requisição para obter todas as MassaTabelaDTO's do banco
    async function obterMassasBanco() {
        dispatch(loadingMassa(true));
        await axiosRequest.getAllMassas(mainClienteId)
            .then(
                massasBanco => dispatch(setMassas(massasBanco))
            );
    }

    //Botões renderizados por esse componente
    const butoes: ButtonLayoutProps[] = [ 
        {
            title: 'Atualizar',
            icon: refresh,
            trigger: () => coletarRecursos(),
            disabled: isLoading,
        }, 
        {
            title: 'Novo Job',
            icon: cube,
            trigger: () =>  modalNovoJobOn(),
            disabled: isLoading,
        },
        {
            title: 'Nova Pipeline',
            icon: layers,
            trigger: () =>  modalNovaPipelineOn(),
            disabled: isLoading || catalogoJobs.length < 1,
        },
        {
            title: 'Nova Schedule',
            icon: cloudUpload,
            trigger: () => novaScheduleRef.current!.click(),
            disabled: isLoading,
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
            disabled: isLoading || catalogoJobs.length < 1,
        },
    ];

    //Define conteúdo a ser exibido no painel principal (direita), com base nos recursos selecionado no painel de opções (esquerda)
    const conteudoPainelPrincipal = () => {
        if (jobsSelecionados.length > 0) 
            return catalogoJobsSelecionados.map((jobDto, index) => <JobCard key={index} jobDto={jobDto}/> );

        if (mainPipeline !== "") 
            return <ListaConfigJobs />;

        const mensagem = 'Use o painel lateral para vizualizar {Jobs} e {Pipelines}\n'
            + 'Selecione um {Job}, fora da {Pipeline}, para analisá-lo\n'
            + 'Selecione uma {Pipeline} para inserir {Jobs} ou configurar sua execução';
        return <div className='position-absolute'>
            <Informativo mensagem={mensagem} status='Normal' />
        </div>;
    }

    //Conteúdo principal caso existam dados na base
    function conteudo() {

        const listasRetratil: ListaRetratrilProps[] = [
            {title: 'Jobs', icon: cube, content: <ListaCatalogoJobs />},
            {title: 'Pipelines', icon: layers, content: <ListaCatalogoPipelines />},
            {title: 'Gerador de Massa', icon: library, content: <ListaCatalogoMassas />},
        ];

        if (catalogoJobs.length < 1) {
            return <Informativo 
                mensagem='Uma alternativa é fazer o upload da planilha de Jobs, usando o botão {Nova Schedule}' 
                status='SemDados'
            />;
        }
        return (
            <IonSplitPane when="xs" contentId="pipelineContent" className='ps-5 ms-5 '>
                <IonMenu contentId="pipelineContent" className='glass' color='#'>
                    <IonContent className='glass-content p-0 m-0 mx-5'>
                        <ListaRetratrilAgrupada listas={listasRetratil} />
                    </IonContent>
                </IonMenu>
                <div className="container" id="pipelineContent" >
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
            {layoutGrupoBotoes(butoes)}
            {conteudo()}

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

