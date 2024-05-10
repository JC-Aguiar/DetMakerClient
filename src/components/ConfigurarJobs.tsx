import { IonBadge, IonCard, IonList, IonReorderGroup, IonRow, ItemReorderEventDetail, useIonModal, useIonViewDidEnter } from '@ionic/react';
import JobCard from './JobCard';
import { ban, flash, open, save, trash } from 'ionicons/icons';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/ReduxStore';
import { JobConfig, parseJobInfo, } from '../data/JobConfigDTO';
import { useDispatch } from 'react-redux';
import { reorderMainJobs, setMainJobs, setMainPipeline } from '../Store/Reducer/ReducerAtividade';
import { UserDTO } from '../data/UserDTO';
import { Notificacao } from './Noticacao';
import DynamicModal from './DynamicModal';
import ModalExecPipeline from './ModalExecPipeline';
import { BotaoProps, Botoes } from './Botao';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { setPipelines } from '../Store/Reducer/ReducerPipelines';
import * as axiosRequest from "../data/AxiosRequest";


const ConfigurarJobs: React.FC<Notificacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atributo para acionamento do Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via React
    const reorderGroupRef = useRef<HTMLIonReorderGroupElement>(null);

    //Atributos com estado gerenciado via Redux
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const catalagoPipelines: PipelineInfoDTO[] = useSelector(
        (state: RootState) => state.store.catalogoPipelines.catalogo);
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
        console.log(`[CONFIGURAR-JOBS]: Iniciando requisição 'Salvar Pipeline'.`);
        toastInfo("SALVAR PIPELINE: Em execução...", []);
        try {
            const novaPipeline = catalagoPipelines.find(pipe => pipe.id === mainPipelineId);
            if (!novaPipeline) throw `Pipeline ID ${mainPipelineId} não encontrada no catálogo de Pipelines.`

            const resultado = await axiosRequest.atualizarPipeline(novaPipeline);
            const catalogoPipelinesAtualizado = catalagoPipelines.slice()
                .map(pipe => {
                    if (pipe.id !== mainPipelineId) return pipe;
                    return novaPipeline;
                });
            dispatch(setPipelines(catalogoPipelinesAtualizado));
            toastOk(`SALVAR PIPELINE: ${resultado}.`, []);
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Salvar Pipeline' funcionou.`);
        }
        catch (error) {
            toastErro(`SALVAR PIPELINE: ${error}`, []);
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Salvar Pipeline' falhou.`);
        }
    }

    //Faz o processo de reordenação visual se alinhar com a reordenação dos dados no Redux
    function reordenar(event: CustomEvent<ItemReorderEventDetail>) {
        //Valida se a referência ao IonReorderGroup existe
        const itens = reorderGroupRef?.current?.children;
        if (!itens) return;

        //Métodos `from` e `to` contêm os índices (antes e depois) do item movido
        const indiceAtual = event.detail.from;
        const indiceNovo = event.detail.to;

        //Renderizando reordenação na listagem de Jobs
        event.detail.complete();

        dispatch(reorderMainJobs({ ordemAntiga: indiceAtual, ordemNova: indiceNovo }));
    }

    //Botoes contendo as opções para cada Pipeline
    const botoes: BotaoProps[] = [
        {icon: flash, texto: "Executar",  handler: () => modalConfigPipelineOn()},
        {icon: save,  texto: "Salvar",    handler: () => atualizarPipeline()},
        {icon: open,  texto: "Ver Dados", handler: () => null},
        {icon: ban,   texto: "Cancelar",  handler: () => null},
        {icon: trash, texto: "Apagar",    handler: () => null},
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
                    <div className='px-3 pb-2'>
                        <Botoes botoes={botoes} />
                    </div>
                </div>
            </IonCard>
            <div className='py-5 mt-5 mb-3' />
            <IonRow className='ion-justify-content-center p-0 m-0 w-100'>
                <IonList className='w-100 py-2 px-2'>
                    <IonReorderGroup disabled={false} onIonItemReorder={reordenar} ref={reorderGroupRef} className='p-0 m-0' >
                    {
                        mainJobs.map(job => job.ordem)
                            .map(ordem => ({ ordem })) 
                            .sort((item1, item2) => item1.ordem - item2.ordem)
                            .map(item => <JobCard key={item.ordem} 
                                    index={item.ordem} //jobExec={item}
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