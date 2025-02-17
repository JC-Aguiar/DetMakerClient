import { InputChangeEventDetail, IonButtons, IonCardContent, IonIcon, IonItem, IonLabel, IonList, IonReorderGroup, IonRow, IonTitle, IonToolbar, ItemReorderEventDetail, useIonAlert, useIonModal } from '@ionic/react';
import ConfigJobItem, { ConfigJobItemRef } from '../Content/ConfigJobItem';
import { arrowUndo, cube, flash, options, save, trash } from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/ReduxStore';
import { JobConfig, } from '../../data/JobConfig';
import { useDispatch } from 'react-redux';
import { UpdateMainJobsIfxdateProps, addMensagem, addMeuTicket, atualizarMensagem, reorderMainJobs, setMainPipeline, updateMainJobsIfxdate } from '../../Store/Reducer/ReducerAtividade';
import DynamicModal from '../Core/DynamicModal';
import ModalExecPipeline from './ModalExecPipeline';
import { BotaoProps, Botoes } from '../Core/Botao';
import { PipelineInfoDTO } from '../../data/PipelineInfoDTO';
import { removePipeline, setPipelines } from '../../Store/Reducer/ReducerPipelines';
import * as axiosRequest from "../../data/AxiosRequest";
import { JobInfoDTO, getIndexParametroComIfxdate } from '../../data/JobInfoDTO';
import { ListaRetratrilAgrupada, ListaRetratrilProps } from '../Core/ListaRetratil';
import ListaVariaveisPipeline, { ListaVariaveisPipelineRef } from '../Lists/ListaVariaveisPipeline';
import { useRef } from 'react';
import BotaoMassasPipeline, { BotaoMassasPipelineRef } from '../Content/BotaoMassasPipeline';
import { UserDTO } from '../../data/UserDTO';
import { PipelineJobInputDTO } from '../../data/PipelineJobInputDTO';
import { PipelineExecDTO } from '../../data/PipelineExecDTO';
import { QueryInfo } from '../../data/QueryInfoDTO';
import { QueuePushResponseDTO } from '../../data/QueuePushResponseDTO';

//Componente <ModalPipelineRunner>
const ModalPipelineRunner: React.FC = () => {

    //Atributo para acionamento do Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    //  1. Registros gerais obtidos no banco: 
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    //  2. Registros selecionados e sendo modificados pelo usuário:
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainPipelineJobs);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    const mainPipelineDescricao: string | undefined = useSelector(
        (state: RootState) => state.store.catalogoPipelines
            .catalogo
            .find(item => item.nome === mainPipeline)
            ?.descricao
    );
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    const queries: QueryInfo[] = useSelector(
        (state: RootState) => state.store.catalogoQueries.catalogo.filter(
            item => mainJobs.some(job => item.jobId === job.id)
    )); 

    //Atributos com estado gerenciado via React
    const [alerta] = useIonAlert(); 
    const variaveisRef = useRef<ListaVariaveisPipelineRef>(null);
    const massasRef = useRef<BotaoMassasPipelineRef>(null);
    const jobsConfigurados = useRef<ConfigJobItemRef[]>([]);

    //Modal para executar a Pipeline
    const [modalExecPipelineOn, modalExecPipelineOff] = useIonModal(DynamicModal,
        {
            titulo: "Executar Pipeline",
            elemento: <ModalExecPipeline variaveis={variaveisRef.current?.variaveis()} massas={massasRef.current?.massas()} />,
            onDismiss: () => modalExecPipelineOff(),
        }
    );

    //Requisição para atualizar no banco a Pipeline atual
    async function atualizarPipeline() {
        const mensagemId = `Get_Clients@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Atualizando Pipeline '${mainPipeline}' no catálogo do banco.`,
            status: 'INFO'
        }));
        try {
            const novaPipeline: PipelineInfoDTO = {
                clienteId: mainClienteId,
                id: mainPipelineId,
                nome: mainPipeline,
                descricao: !mainPipelineDescricao ? "" : mainPipelineDescricao,
                jobs: [...mainJobs]
                    .sort((item1, item2) => item1.ordem - item2.ordem)
                    .map(job => job.nome),
                checked: true,
            };
            await axiosRequest.atualizarPipeline(novaPipeline);
            const catalogoPipelinesAtualizado = catalogoPipelines.slice()
                .map(pipe => {
                    if (pipe.id !== mainPipelineId) return pipe;
                    return novaPipeline;
                });
            dispatch(setPipelines(catalogoPipelinesAtualizado));
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `Sucesso.`,
                status: "OK",
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${error}.`,
                status: "ERROR",
            }));
        }
    }

    //Requisição para apagar a Main Pipeline
    async function deletarMainPipeline() {
        const pipeline = catalogoPipelines.find(pipe => pipe.id === mainPipelineId);
        if (!pipeline) return;

        const mensagemId = `Delete_Pipeline@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Deletando Pipeline '${mainPipeline}' do catálogo do banco.`,
            status: 'INFO'
        }));
        
        try {
            await axiosRequest.deletePipeline(mainClienteId, mainPipeline);
            dispatch(setMainPipeline());
            dispatch(removePipeline(mainPipelineId));
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Sucesso.`,
                status: 'OK'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}.`,
                status: 'ERROR'
            }));
        }
    }

    //Handler que avisa e reseta todas as configurações dos Jobs
    const resetarJobsPipeline = () => {
        alerta({
            header: 'RESETAR JOBS',
            message: 'Todas as configurações dos Jobs serão desfeitas. Deseja continuar?',
            buttons: [
                'Não',
                { 
                    text: 'Sim', 
                    handler: (d) => {
                        const pipeline = catalogoPipelines.find(pipe => pipe.id === mainPipelineId);
                        if (!pipeline) return;

                        dispatch(setMainPipeline());
                        const jobsMainPipline: JobConfig[] = [];
                        pipeline.jobs.forEach((jobNome, index) => {
                            const atividadeJobs = catalogoJobs.find((jobDto) => jobDto.nome === jobNome);
                            if (!atividadeJobs) {
                                console.warn(`[LISTA CONFIGURAR-JOBS]: Job ID ${jobNome} não identificado no catálogo de Jobs.`);
                                return;
                            }
                            const configJob: JobConfig = JobConfig.parseJobInfo(atividadeJobs, index);
                            jobsMainPipline.push(configJob);
                        });
                        dispatch(setMainPipeline({
                            id: pipeline.id,
                            nome: pipeline.nome,
                            jobs: jobsMainPipline
                        }));
                        dispatch(addMensagem({ 
                            id: `Reset_Pipeline@${Date.now()}`, 
                            texto: `Resetado configuração dos Jobs na Pipeline '${mainPipeline}'.`,
                            status: 'INFO'
                        }));
                    }
                }
            ],
        });
    }

    //Faz o processo de reordenação visual se alinhar com a reordenação dos dados no Redux
    function reordenar(event: CustomEvent<ItemReorderEventDetail>) {
        //Métodos `from` e `to` contêm os índices (antes e depois) do item movido
        const indiceAtual = event.detail.from;
        const indiceNovo = event.detail.to;

        //Renderizando reordenação na listagem de Jobs
        event.detail.complete();

        dispatch(reorderMainJobs({ ordemAntiga: indiceAtual, ordemNova: indiceNovo }));
    }

    //Requisição para executar a Pipeline
    async function executarPipeline() {
        const mensagemId = `Run_Pipeline@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Executando Pipeline '${mainPipeline}'.`,
            status: 'INFO'
        }));
        
        try {
            if(!user) throw "Usuário não identificado/logado para executar Pipeline";
            const body: PipelineExecDTO = {
                pipelineId: mainPipelineId,
                //atividade: relatorioDto,
                jobs: mainJobs.map(job => PipelineJobInputDTO.parseJobConfig(job, queries)),
                user: user.name,
                ambienteId: mainAmbienteId,
                clienteId: mainClienteId,
                massas: massasRef.current?.massas().map(m => m.nome),
                configuracoes: {},
            };
            jobsConfigurados.current.map((item, index) => {
                const jobAlvo = body.jobs.find((job, jobIndex) => jobIndex === index);
                if (!jobAlvo) return;
                jobAlvo.cargas = item.cargas.arquivos;
            })
            variaveisRef.current?.variaveis().forEach(
                item => body.configuracoes[item.nome] = item.valor
            );
            const solicitacao: QueuePushResponseDTO = await axiosRequest.executarPipeline(body);
            dispatch(addMeuTicket(solicitacao.ticket));
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Solicitação ${solicitacao.ticket}: ${solicitacao.message}.`,
                status: 'OK'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}.`,
                status: 'ERROR'
            }));
        }
    }

    //Botoes contendo as opções para cada Pipeline
    const botoes: BotaoProps[] = [
        {icon: flash, text: "Executar",  handler: () => executarPipeline()}, //modalExecPipelineOn()},
        {icon: save, text: "Salvar",    handler: () => atualizarPipeline()},
        {icon: arrowUndo, text: "Resetar",  handler: () => resetarJobsPipeline()},
        {icon: trash, text: "Apagar",    handler: () => deletarMainPipeline()},
    ];

    //Listas
    const listasRefateis: ListaRetratrilProps[] = [
        { 
            title: `Variáveis Globais`,
            arrow: false,
            icon: options,
            content: <ListaVariaveisPipeline ref={variaveisRef}/> 
        }
    ];

    //Renderização do componente
    return (
        <IonRow className='container ion-justify-content-center'>
            <IonItem className='w-100 mx-3' lines='none' style={{ zIndex: '50' }} >
                <IonToolbar color='tertiary' className='glass'>
                    <IonTitle>{mainPipeline}</IonTitle>
                    <IonButtons slot='end'>
                        <Botoes botoes={botoes} />
                    </IonButtons>
                </IonToolbar>
            </IonItem>
            <IonCardContent className='w-100 mx-4 my-3 p-0 px-1'>
                {/* Massas */}
                <BotaoMassasPipeline ref={massasRef}/>

                {/* Variáeis Globais (Configurações) */}
                <ListaRetratrilAgrupada 
                    listas={listasRefateis} 
                    disable={listasRefateis.length < 1}
                />

                {/* Jobs */}
                <IonList className='glass mx-2'>
                    <IonItem lines='none' className='m-0 p-0'>
                        <IonIcon icon={cube} className='ms-0 my-1' />
                        <IonLabel color='light ms-2'>
                            Fluxo de Execução: {mainJobs.length} Job{mainJobs.length === 1 ? "" : "s"}
                        </IonLabel>
                    </IonItem>
                    <IonReorderGroup disabled={false} onIonItemReorder={reordenar} className='p-0 m-0' >
                        {
                            mainJobs.map((item, index) => { 
                                return <ConfigJobItem 
                                            key={index} 
                                            index={index} 
                                            ref={el => el !== null ? jobsConfigurados.current[index] = el : null} 
                                        />
                            })
                        }
                    </IonReorderGroup>
                </IonList>
            </IonCardContent>
            <div className='m-3'></div>
        </IonRow>
    );
};

export default ModalPipelineRunner;

