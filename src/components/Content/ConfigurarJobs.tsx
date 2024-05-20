import { InputChangeEventDetail, IonBadge, IonCard, IonCol, IonInput, IonItem, IonLabel, IonList, IonReorder, IonReorderGroup, IonRow, ItemReorderEventDetail, useIonAlert, useIonModal, useIonViewDidEnter } from '@ionic/react';
import JobCard from './JobCard';
import { arrowUndo, ban, flash, open, save, trash } from 'ionicons/icons';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/ReduxStore';
import { JobConfig, parseJobInfo, } from '../../data/JobConfigDTO';
import { useDispatch } from 'react-redux';
import { UpdateMainJobsIfxdateProps, reorderMainJobs, setMainJobs, setMainPipeline, updateMainJobsIfxdate } from '../../Store/Reducer/ReducerAtividade';
import { UserDTO } from '../../data/UserDTO';
import { Notificacao } from '../Core/Noticacao';
import DynamicModal from '../Core/DynamicModal';
import ModalExecPipeline from '../Modals/ModalExecPipeline';
import { BotaoProps, Botoes } from '../Core/Botao';
import { PipelineInfoDTO } from '../../data/PIpelineInfoDTO';
import { removePipeline, setPipelines } from '../../Store/Reducer/ReducerPipelines';
import * as axiosRequest from "../../data/AxiosRequest";
import { JobInfoDTO, getIndexParametroComIfxdate } from '../../data/JobInfoDTO';
import { pipeline } from 'stream';


const ConfigurarJobs: React.FC<Notificacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atributo para acionamento do Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via React
    const reorderGroupRef = useRef<HTMLIonReorderGroupElement>(null);
    const inputIfxdateRef = useRef<HTMLIonInputElement>(null);
    const [alerta] = useIonAlert();

    //Atributos com estado gerenciado via Redux
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    const mainPipelineDescricao: string | undefined = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo)
        .find((item) => item.nome === mainPipeline)?.descricao;

    //Modal para executar a Pipeline
    const [modalConfigPipelineOn, modalConfigPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Executar Pipeline",
            elemento: <ModalExecPipeline toastInfo={toastInfo} toastOk={toastOk} toastErro={toastErro} />,
            onDismiss: () => modalConfigPipelineOff(),
        }
    );

    //Acionamento realizado assim que esta página for montada
    useIonViewDidEnter(() => {
        if (mainJobs.length === 0) {
            console.log(`[CONFIGURAR-JOBS] A pilha de jobs está vazia. Retornando página.`);
        }
        else {
            console.log(`[CONFIGURAR-JOBS] Carregando cards da pilha dos jobs selecionados.`);
        }
    }, []);

    //Requisição para atualizar no banco a Pipeline atual
    async function atualizarPipeline() {
        toastInfo("SALVAR PIPELINE: Em execução...", []);
        try {
            const novaPipeline = catalogoPipelines.find(pipe => pipe.id === mainPipelineId);
            if (!novaPipeline) 
                throw `Pipeline ID ${mainPipelineId} não encontrada no catálogo de Pipelines.`

            const resultado = await axiosRequest.atualizarPipeline(novaPipeline);
            const catalogoPipelinesAtualizado = catalogoPipelines.slice()
                .map(pipe => {
                    if (pipe.id !== mainPipelineId) return pipe;
                    return novaPipeline;
                });
            dispatch(setPipelines(catalogoPipelinesAtualizado));
            toastOk(`SALVAR PIPELINE: ${resultado}.`, []);
        }
        catch (error) {
            toastErro(`SALVAR PIPELINE: ${error}`, []);
        }
    }

    //Requisição para apagar a Main Pipeline
    async function deletarMainPipeline() {
        const pipeline = catalogoPipelines.find(pipe => pipe.id === mainPipelineId);
        if (!pipeline) return;

        toastInfo(`DELETAR PIPELINE '${mainPipeline}': Em execução...`, []);
        dispatch(setMainPipeline());
        dispatch(removePipeline(mainPipelineId));
        try {
            const resultado = await axiosRequest.deletePipeline(mainClienteId, mainPipeline);
            toastOk(`DELETAR PIPELINE '${mainPipeline}': ${resultado}.`, []);
        }
        catch (error) {
            toastErro(`DELETAR PIPELINE '${mainPipeline}': ${error}.`, []);
            dispatch(setPipelines( [...catalogoPipelines, pipeline] ));
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
                        pipeline.jobs.forEach((pipelineJob, index) => {
                            const atividadeJobs = catalogoJobs.find((jobDto) => jobDto.nome === pipelineJob);
                            if (!atividadeJobs) {
                                console.log(`[CONFIGURAR JOBS]: Nenhum dos Jobs informados na Pipeline selecionada '
                                    + ('${pipeline.nome}') foram identificados no catálogo de Jobs.`);
                                return;
                            }
                            const configJob: JobConfig = parseJobInfo(atividadeJobs, index);
                            jobsMainPipline.push(configJob);
                        });
                        dispatch(setMainPipeline({
                            id: pipeline.id,
                            nome: pipeline.nome,
                            jobs: jobsMainPipline
                        }));
                        toastInfo("Jobs resetados.", []);
                    }
                }
            ],
        });
    }   

    //Handler para definir a Data do Ciclo Globalmente para todos os Jobs
    const preencherIfxdate = (event: CustomEvent<InputChangeEventDetail>) => {
        const ifxdate = (event.target as HTMLInputElement).value
            .trim()
            .replace(/-/g, '');
        if (ifxdate.length !== 8) return;
        
        const dados: UpdateMainJobsIfxdateProps = {
            ifxdate: ifxdate,
            jobs: [],
        };

        catalogoJobs.filter(item => mainJobs.some(mainJob => mainJob.id === item.id))
            .forEach(item => {
                const paramIndex = getIndexParametroComIfxdate(item);
                if (paramIndex !== -1)
                    dados.jobs.push({ id: item.id , parametro: paramIndex });
            });

        dispatch(updateMainJobsIfxdate(dados));
        toastInfo(`Ifxdate global definido: ${ifxdate}. Total de Jobs atualizados: ${dados.jobs.length}.`, []);
    }

    //Faz o processo de reordenação visual se alinhar com a reordenação dos dados no Redux
    function reordenar(event: CustomEvent<ItemReorderEventDetail>) {
        //Valida se a referência ao IonReorderGroup existe
        //const itens = reorderGroupRef?.current?.children;
        //if (!itens) return;

        //Métodos `from` e `to` contêm os índices (antes e depois) do item movido
        const indiceAtual = event.detail.from;
        const indiceNovo = event.detail.to;

        //Renderizando reordenação na listagem de Jobs
        event.detail.complete();

        dispatch(reorderMainJobs({ ordemAntiga: indiceAtual, ordemNova: indiceNovo }));

        /*
        const novosJobs = mainJobs.map(job => ({...job}));
        const jobMovido = novosJobs[indiceAtual];
        console.log(`[CONFIG-JOBS]: Reordenando MainJob [ID ${jobMovido.id}] '${jobMovido.nome}', `
            + `do Nº ${indiceAtual} para Nº ${indiceNovo}.`);

        novosJobs.splice(indiceAtual, 1);
        novosJobs.splice(indiceNovo, 0, jobMovido);
        novosJobs.forEach((item, index) => item.ordem = index);
        dispatch(setMainJobs(novosJobs));
        */
    }

    //Botoes contendo as opções para cada Pipeline
    const botoes: BotaoProps[] = [
        {icon: flash, texto: "Executar",  handler: () => modalConfigPipelineOn()},
        {icon: save, texto: "Salvar",    handler: () => atualizarPipeline()},
        //{icon: open, texto: "Ver Dados", handler: () => null},
        {icon: arrowUndo, texto: "Resetar",  handler: () => resetarJobsPipeline()},
        {icon: trash, texto: "Apagar",    handler: () => deletarMainPipeline()},
    ];

    //Renderização do componente
    return (
        <div className='container mt-3'>
            <IonCard className='glass text-white fixed-top mx-5 mt-3' style={{background: 'var(--ion-color-tertiary)' }}>
                <div className='glass-content text-center'>
                    <div className='h4 text-center text-dark py-2' style={{background: 'var(--ion-color-primary)'}}>
                        {mainPipeline}
                    </div>
                    <div className='mb-3'>
                        {mainPipelineDescricao} 
                        <IonBadge className='mx-2 px-2' style={{ transform: 'translate(0px, 5px)' }}>
                            Total de jobs: {mainJobs.length}
                        </IonBadge>
                    </div>
                    <div className='px-3 pb-md-2 pb-5'>
                        <Botoes botoes={botoes} />
                    </div>
                </div>
            </IonCard>
            <div className='py-5 mt-5 mb-3' />
            <IonRow className='ion-justify-content-center p-0 m-0 w-100'>
                <IonList className='w-100 py-2 px-2'>
                    <IonRow className='m-0 p-0 pb-2 ion-justify-content-end ion-align-items-center border-bottom'> 
                        <span className='me-2'>Data do Ciclo Global</span>
                        <IonItem className='glass m-0 me-2 p-0'>
                            <IonInput inputmode='text'
                                type='date'
                                maxlength={500}
                                className='text-white mx-2'
                                ref={inputIfxdateRef}
                                onIonChange={(e) => preencherIfxdate(e)}
                            />
                        </IonItem>
                    </IonRow>
                    
                    {/* ref={reorderGroupRef}  */}
                    <IonReorderGroup disabled={false} onIonItemReorder={reordenar} className='p-0 m-0' >
                    {
                        mainJobs.map((item, index) => 
                            <JobCard key={index} 
                                index={index} 
                                //jobConfig={item}
                                //jobInfo={}
                                notificacao={{ toastInfo, toastOk, toastErro } as Notificacao}
                            />
                            
                        )
                    }
                    </IonReorderGroup>
                </IonList>
            </IonRow>
        </div>
    );
};

export default ConfigurarJobs;

