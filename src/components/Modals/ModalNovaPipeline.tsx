import { TextareaChangeEventDetail, IonTextarea, IonButton, IonIcon, InputChangeEventDetail, IonRow, IonBadge, IonCol, IonInput, IonItem } from "@ionic/react";
import { closeCircle, save } from "ionicons/icons";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { atualizarMensagem, setMainPipeline } from "../../Store/Reducer/ReducerAtividade";
import { setViewJobs } from "../../Store/Reducer/ReducerAtividade";
import { loadingPipelines, setPipelines } from "../../Store/Reducer/ReducerPipelines";
import { JobConfig } from "../../data/JobConfig";
import { PipelineInfoDTO } from "../../data/PIpelineInfoDTO";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import Botao from "../Core/Botao";
import { addMensagem } from "../../Store/Reducer/ReducerAtividade";
import Informativo from "../Core/Informativo";


export interface ModalNovaPipelineProps {
    onSave?: () => void
}

//Componente <ModalNovaPipeline>
const ModalNovaPipeline: React.FC<ModalNovaPipelineProps> = ({ onSave = () => null }) => {
    //Atrbiutos para usar recursos Redux e React
    const dispatch = useDispatch();

    //Atributos de estado gerenciados via React
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const catalagoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);

    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.configAtividade.jobsSelecionados);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);

    //Atibutos de estado gerenciados via Redux
    const [loading, setLoading] = useState<boolean>(false);
    const [pipelineNome, setPipelineNome] = useState<string>("");
    const [pipelineDescricao, setPipelineDescricao] = useState<string>("");
    const [jobsParaUso, setJobsParaUso] = useState<JobInfoDTO[]>(jobsParaUsoInicial);

    //Método para preencher a quantidade de Jobs na variável jobsParaUso 
    function jobsParaUsoInicial(): JobInfoDTO[] {
        if (jobsSelecionados.length > 0)
            return catalogoJobs.filter(item => jobsSelecionados.findIndex(id => id === item.id) !== -1);
        if (mainPipelineId !== -1) {
            const pipeline = catalagoPipelines.find(pipe => pipe.id === mainPipelineId);
            const jobsDto: JobInfoDTO[] = [];
            pipeline?.jobs.forEach(
                jobNome => catalogoJobs
                    .filter(job => job.nome === jobNome)
                    .forEach(job => jobsDto.push(job))
            );
            return jobsDto;
        }
        return [];
    }

    //handler para preencher nome da Pipeline
    const preencherPepilineNome = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setPipelineNome(value);
        console.log(`[MODAL NOVA PIPELINE] Pipeline nome alterada para ${value}.`);
    }

    //Handler para preencher descrição da Pipeline
    const preencherPepilineDescricao = (event: CustomEvent<TextareaChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setPipelineDescricao(value);
        console.log(`[MODAL NOVA PIPELINE] Pipeline descrição alterada para ${value}.`);
    }

    //Requisição para salvar nova Pipeline
    async function salvarNovaPipeline() {
        const mensagemId = `New_Pipeline@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: 'Salvando nova Pipeline no catálogo do banco.',
            status: 'INFO'
        }));
        setLoading(true);
        dispatch(loadingPipelines(true));
        dispatch(setViewJobs([]));
        try {
            const novaPipeline: PipelineInfoDTO = {
                id: -1,
                nome: pipelineNome,
                descricao: pipelineDescricao,
                clienteId: mainClienteId,
                jobs: jobsParaUso.map((item) => item.nome),
                checked: false,
            };
            const novaPipelineSalva = await axiosRequest.salvarNovaPipeline(novaPipeline);
            const jobsNovaPipeline: JobConfig[] = catalogoJobs
                .filter((item) => novaPipelineSalva.jobs.findIndex((jobNome) => jobNome === item.nome) !== -1)
                .map((item, index) => JobConfig.parseJobInfo(item, index));
            
            dispatch(setPipelines([...catalagoPipelines, novaPipelineSalva]));
            dispatch(setMainPipeline({ 
                id: novaPipelineSalva.id,
                nome: novaPipelineSalva.nome, 
                jobs: jobsNovaPipeline
            }));
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `Sucesso.`,
                status: "OK"
            }));
            onSave();
        }
        catch (error) {
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${error}.`,
                status: "ERROR"
            }));
        }
        setLoading(false);
        dispatch(loadingPipelines(false));
    }

    //Renderiza (ou não) a lista de Jobs selecionados para serem atributos á nova Pipeline
    const jobs = () => {
        if (jobsParaUso.length < 1) return <></>; 
        return (
            <IonCol size='12' className='mx-0 px-0 '>
                <IonRow className='glass px-4 pt-2'>
                    <IonCol size='12' className="opacity-50">Jobs</IonCol>
                    {
                        jobsParaUso.map((item, index) => <IonCol key={index} size="6" className=""> 
                            <IonBadge color='tertiary' className='ion-align-items-center font-monospace small w-100 text-start'>
                                <span style={{backgroundColor: 'var(--ion-color-dark)'}} className='rounded text-white px-1'>
                                    Nº{index+1}
                                </span>
                                <span className="ms-1">{item.nome}</span>
                                <IonIcon icon={closeCircle} 
                                    color="light"
                                    className="btn btn-outline m-0 p-0 ms-1 mb-1" 
                                    onClick={() => setJobsParaUso(jobsParaUso.filter((job, jobIndex) => jobIndex !== index)) } 
                                />
                            </IonBadge>
                        </IonCol>
                        )
                    }
                </IonRow>
            </IonCol>
        );
    } 

    //Renderização do componente
    if (loading) return <Informativo status="Carregando" />
    return <>
        <div className="container justify-content-center mt-1 px-5">
            <div className='glass px-3'>
                <div className='h5 text-center text-white py-2 mt-2 mb-4'>
                    Preencha os dados abaixo para prosseguir
                </div>
                <div className='text-primary'>
                    <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                        <IonCol size='12' className="glass m-0 my-1 px-1">
                            <IonItem className='m-0 p-0'>
                                <IonInput inputmode='text'
                                    maxlength={500}
                                    placeholder="Nome da Pipeline"
                                    value={pipelineNome}
                                    className='text-white'
                                    onIonChange={(e) => preencherPepilineNome(e)}
                                    required
                                />
                            </IonItem>
                        </IonCol>
                        <IonCol size='12' className='glass m-0 my-1 px-1'>
                            <IonItem className='m-0 p-0'>
                                <IonTextarea inputmode='text'
                                    maxlength={500}
                                    value={pipelineDescricao}
                                    placeholder="Descrição"
                                    className='text-white'
                                    style={{minHeight: '100px' }}
                                    onIonChange={(e) => preencherPepilineDescricao(e)}
                                    required
                                />
                            </IonItem>
                        </IonCol>
                        {jobs()}
                    </IonRow>
                    <div className="d-flex ion-justify-content-end py-2">
                        <Botao icon={save}
                            text="Salvar no Banco"
                            disabled={pipelineNome.trim().length < 2 || pipelineDescricao.trim().length < 2} 
                            handler={salvarNovaPipeline} 
                        /> 
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ModalNovaPipeline;