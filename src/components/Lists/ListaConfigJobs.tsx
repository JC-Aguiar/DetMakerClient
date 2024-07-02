import { InputChangeEventDetail, IonButton, IonButtons, IonCardContent, IonCol, IonIcon, IonInput, IonItem, IonLabel, IonList, IonReorderGroup, IonRow, IonTitle, IonToolbar, ItemReorderEventDetail, useIonAlert, useIonModal } from '@ionic/react';
import ConfigJobItem from '../Content/ConfigJobItem';
import { addCircle, arrowUndo, cube, flash, layers, lockClosed, save, trash } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/ReduxStore';
import { JobConfig, parseJobInfo, } from '../../data/JobConfigDTO';
import { useDispatch } from 'react-redux';
import { UpdateMainJobsIfxdateProps, addMensagem, atualizarMensagem, reorderMainJobs, setMainPipeline, updateMainJobsIfxdate } from '../../Store/Reducer/ReducerAtividade';
import DynamicModal from '../Core/DynamicModal';
import ModalExecPipeline from '../Modals/ModalExecPipeline';
import { BotaoProps, Botoes } from '../Core/Botao';
import { PipelineInfoDTO } from '../../data/PIpelineInfoDTO';
import { removePipeline, setPipelines } from '../../Store/Reducer/ReducerPipelines';
import * as axiosRequest from "../../data/AxiosRequest";
import { JobInfoDTO, getIndexParametroComIfxdate } from '../../data/JobInfoDTO';
import { ListaRetratrilAgrupada, ListaRetratrilProps } from '../Core/ListaRetratil';
import ListaVariaveisPipeline from './ListaVariaveisPipeline';

//Componente <ListaConfigJobs>
const ListaConfigJobs: React.FC = () => {

    //Atributo para acionamento do Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    //  1. Registros gerais obtidos no banco: 
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    //  2. Registros selecionados e sendo modificados pelo usuário:
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    const mainPipelineDescricao: string | undefined = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo)
        .find((item) => item.nome === mainPipeline)?.descricao;

    //Atributos com estado gerenciado via React
    const [alerta] = useIonAlert();    

    //Modal para executar a Pipeline
    const [modalExecPipelineOn, modalExecPipelineOff] = useIonModal(DynamicModal,
        {
            titulo: "Executar Pipeline",
            elemento: <ModalExecPipeline />,
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
                jobs: mainJobs.map(job => job.nome),
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
        dispatch(setMainPipeline());
        dispatch(removePipeline(mainPipelineId));
        
        try {
            await axiosRequest.deletePipeline(mainClienteId, mainPipeline);
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
                                console.warn(`[LISTA CONFIGURAR-JOBS]: Job '${pipelineJob}' não identificado no catálogo de Jobs.`);
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
            .forEach((item, index) => {
                const paramIndex = getIndexParametroComIfxdate(item);
                if (paramIndex !== -1)
                    dados.jobs.push({ id: item.id , parametro: paramIndex });
            });
        console.log("JOBS: " + dados.jobs.map(job => JSON.stringify(job)).join("\n"));
        dispatch(updateMainJobsIfxdate(dados));
        dispatch(addMensagem({ 
            id: `Set_Ifxdate@${Date.now()}`, 
            texto: `Definindo Ifxdate ${ifxdate} na Pipeline '${mainPipeline}'. Total de Jobs atualizados: ${dados.jobs.length}.`,
            status: 'INFO'
        }));
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

    //Botoes contendo as opções para cada Pipeline
    const botoes: BotaoProps[] = [
        {icon: flash, text: "Executar",  handler: () => modalExecPipelineOn()},
        {icon: save, text: "Salvar",    handler: () => atualizarPipeline()},
        {icon: arrowUndo, text: "Resetar",  handler: () => resetarJobsPipeline()},
        {icon: trash, text: "Apagar",    handler: () => deletarMainPipeline()},
    ];

    //Listas
    const listasRefateis: ListaRetratrilProps[] = [
        //{ title: "Massas Utilizadas", content: <ListaVariaveisPipeline /> }
        { title: "Variáveis Globais", content: <ListaVariaveisPipeline /> }
    ];

    //Renderização do componente
    return (
        <IonRow className='container ion-justify-content-center'>
            <IonItem className='position-fixed w-100 px-5' lines='none' style={{ zIndex: '50' }} >
                <IonToolbar color='tertiary' className='glass'>
                    <IonTitle>{mainPipeline}</IonTitle>
                    <IonButtons slot='end'>
                        <Botoes botoes={botoes} />
                    </IonButtons>
                </IonToolbar>
            </IonItem>
            <div className='py-4'></div>
            <IonCardContent className='w-100 mx-4 my-3 p-0 px-1'>
                <ListaRetratrilAgrupada listas={listasRefateis} />
                <IonList className='glass mx-2'>
                    <IonItem lines='none' className='m-0 p-0'>
                        <IonIcon icon={cube} className='ms-1 my-1' />
                        <IonLabel color='light ms-2'>
                            Fluxo de Execução: {mainJobs.length} Job{mainJobs.length > 1 ? "s" : ""}
                        </IonLabel>
                    </IonItem>
                    {/* 
                        ref={reorderGroupRef}
                        <IonRow className='m-0 p-0 pb-2 ion-justify-content-end ion-align-items-center border-bottom'> 
                            <span className='me-2'>Data do Ciclo Global</span>
                            <IonItem className='glass m-0 me-2 p-0'>
                                <IonInput inputmode='text'
                                    type='date'
                                    maxlength={500}
                                    className='text-white mx-2'
                                    //ref={inputIfxdateRef}
                                    onIonChange={(e) => preencherIfxdate(e)}
                                />
                            </IonItem>
                        </IonRow>  
                    */}
                    <IonReorderGroup disabled={false} onIonItemReorder={reordenar} className='p-0 m-0' >
                        {
                            mainJobs.map((item, index) => <ConfigJobItem key={index} index={index} />)
                        }
                    </IonReorderGroup>
                </IonList>
            </IonCardContent>
        </IonRow>
    );
};

export default ListaConfigJobs;

