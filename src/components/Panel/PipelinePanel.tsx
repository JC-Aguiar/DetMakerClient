import { cloudUpload, cube, layers, library, listOutline, refresh } from "ionicons/icons";
import { ListaRetratrilAgrupada } from "../Core/ListaRetratil";
import ListaCatalogoJobs from "../Lists/ListaCatalogoJobs";
import ListaCatalogoMassas from "../Lists/ListaCatalogoMassas";
import ListaCatalogoPipelines from "../Lists/ListaCatalogoPipelines";
import ButtonLayout, { ButtonLayoutProps } from "../Core/ButtonLayout";
import { useDispatch, useSelector } from "react-redux";
import { addMensagem, atualizarMensagem, setMainPipeline, setViewJobs } from "../../Store/Reducer/ReducerAtividade";
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import { useState, useRef, useEffect } from "react";
import { IonCol, IonModal, IonRow, useIonModal, useIonViewWillEnter } from "@ionic/react";
import DynamicModal from "../Core/DynamicModal";
import ModalNovaPipeline from "../Modals/ModalNovaPipeline";
import ModalNovoJob from "../Modals/ModalNovoJob";
import { loadingJobs, setJobs } from "../../Store/Reducer/ReducerJobs";
import { loadingMassa, setMassas } from "../../Store/Reducer/ReducerMassas";
import { loadingPipelines, setPipelines } from "../../Store/Reducer/ReducerPipelines";
import { loadingQueries, setQueries } from "../../Store/Reducer/ReducerQueries";
import Schedule from "../Content/Schedule";


const PipelinePanel: React.FC = () => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    const isLoadingJobs = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const isLoadingPipelines = useSelector((state: RootState) => state.store.catalogoPipelines.loading);
    const mainClienteId = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const mainCliente = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const mainAmbienteId = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    const mainAmbiente = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);
    const catalogoJobs = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);

    //Atributos controlados pelo componente
    const isLoading = isLoadingJobs || isLoadingPipelines;
    const [verModalSchedule, setVerModalSchedule] = useState<boolean>(false);
    const modalScheduleRef = useRef<HTMLIonModalElement>(null);
    const novaScheduleRef = useRef<HTMLInputElement>(null);
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(DynamicModal, {
        titulo: "Criar Nova Pipeline",
        elemento: <ModalNovaPipeline onSave={() => modalNovaPipelineOff()} />,
        onDismiss: () => modalNovaPipelineOff(),
    });
    const [modalNovoJobOn, modalNovoJobOff] = useIonModal(DynamicModal, {
        titulo: "Criar Novo Job",
        elemento: <ModalNovoJob />,
        onDismiss: () => modalNovoJobOff(),
    });
    
    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        if (catalogoJobs.length < 1) 
            coletarRecursos();
    }, [catalogoJobs.length]);

    /*
    useEffect(() => {
        dispatch(setMainPipeline());
        dispatch(setMainJobs([]));
        dispatch(setMainMassas({}));
        dispatch(setViewJobs([]));
        dispatch(setMassas([]));
    }, [mainClienteId, mainCliente, mainAmbienteId, mainAmbiente]);
    */

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

    return(
        <div className="p-0 m-0">
            {/*layoutGrupoBotoes(butoes)*/}
                <IonRow className="p-0 m-0 ion-justify-content-around d-flex">
                    {
                        butoes.map((item, index) => <IonCol key={index} className="w-100">
                                <ButtonLayout {...item} />
                            </IonCol>
                        )
                    }
                </IonRow>
            <ListaRetratrilAgrupada 
                listas={[
                    {title: 'Jobs', icon: cube, content: <ListaCatalogoJobs />},
                    {title: 'Pipelines', icon: layers, content: <ListaCatalogoPipelines />},
                    {title: 'Gerador de Massa', icon: library, content: <ListaCatalogoMassas />},
                ]}
                disable={isLoading}
            />
            
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
}

export default PipelinePanel;

function componentDidMount(arg0: () => void, arg1: import("../../data/JobInfoDTO").JobInfoDTO[][]) {
    throw new Error("Function not implemented.");
}
