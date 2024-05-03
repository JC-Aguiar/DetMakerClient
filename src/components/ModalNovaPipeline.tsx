import { TextareaChangeEventDetail, IonTextarea, IonButton, IonIcon, InputChangeEventDetail, IonRow, IonBadge, IonCol, IonInput, IonLabel } from "@ionic/react";
import { save } from "ionicons/icons";
import { useState } from "react";
import { Notificacao } from "./Noticacao";
import { useDispatch, useSelector } from 'react-redux';
import { setMainPipeline } from "../Store/Reducer/ReducerAtividade";
import { setViewJobs } from "../Store/Reducer/ReducerJobs";
import { loadingPipelines, setPipelines } from "../Store/Reducer/ReducerPipelines";
import { JobConfig, parseJobInfo } from "../data/JobConfigDTO";
import { PipelineInfoDTO } from "../data/PIpelineInfoDTO";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { RootState } from "../Store/ReduxStore";
import * as axiosRequest from "../data/AxiosRequest";

const ModalNovaPipeline: React.FC<Notificacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();

    //Atributos globais
    const catalogoJobs: JobInfoDTO[] = useSelector(
        (state: RootState) => state.store.catalogoJobs.catalago);
    const catalagoPipelines: PipelineInfoDTO[] = useSelector(
        (state: RootState) => state.store.catalogoPipelines.catalogo);
    const jobsSelecionados: number[] = useSelector(
        (state: RootState) => state.store.catalogoJobs.jobsSelecionados);
    const [pipelineNome, setPipelineNome] = useState<string>("");
    const [pipelineDescricao, setPipelineDescricao] = useState<string>("");
    const catalogoJobsSelecionados: JobInfoDTO[] = catalogoJobs.filter(
        (item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);

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
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Salvar Nova Pipeline'.`);
        toastInfo("SALVAR NOVA PIPELINE: Em execução...", []);
        dispatch(loadingPipelines(true));
        dispatch(setViewJobs([]));
        try {
            const novaPipeline: PipelineInfoDTO = {
                id: -1,
                nome: pipelineNome,
                descricao: pipelineDescricao,
                clienteId: mainClienteId,
                jobs: catalogoJobsSelecionados.map((item) => item.nome),
                checked: false,
            };
            const novaPipelineSalva = await axiosRequest.salvarNovaPipeline(novaPipeline);
            console.log(`[MODAL NOVA PIPELINE]: Nova Pipeline salva: ${novaPipelineSalva}`);

            const jobsNovaPipeline: JobConfig[] = catalogoJobs
                .filter((item) => novaPipelineSalva.jobs.findIndex((jobNome) => jobNome === item.nome) !== -1)
                .map((item, index) => parseJobInfo(item, index));
                
            const catalogoPipelinesAtualizado = catalagoPipelines.slice();
            catalogoPipelinesAtualizado.push(novaPipelineSalva);

            console.log(`[MODAL NOVA PIPELINE]: Atualizando catálogo das Pipelines com novo registro.`);
            dispatch(setPipelines(catalogoPipelinesAtualizado));
            console.log(`[CONFIGURAR-/JOBS]: Definindo Main-Pipeline para ${novaPipelineSalva.nome}.`);
            dispatch(setMainPipeline({ 
                id: novaPipelineSalva.id,
                nome: novaPipelineSalva.nome, 
                jobs: jobsNovaPipeline
            }));
            toastOk("SALVAR NOVA PIPELINE: Realizada com sucesso.", []);
            console.log(`[MODAL NOVA PIPELINE]: Requisição 'Salvar Nova Pipeline' funcionou.`);
        }
        catch (error) {
            toastErro(`SALVAR NOVA PIPELINE: ${error}`, []);
            console.error(`[MODAL NOVA PIPELINE]: Requisição 'Salvar Nova Pipeline' falhou.`);
        }
        dispatch(loadingPipelines(false));
    }

    //Renderização do componente
    return <>
        <div className="container justify-content-center mt-1 px-5">
            <div className='glass px-3'>
                <div className='h5 text-center text-white py-2 mt-2 mb-4'>
                    Preencha os dados abaixo para prosseguir
                </div>
                <div className='text-primary'>
                    <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                        <IonCol size='1' className='text-center p-0 m-0'>
                            <IonLabel className='fw-bold'>Pipeline:</IonLabel>
                        </IonCol>
                        <IonCol size='11' className=''>
                            <IonInput inputmode='text'
                                maxlength={500}
                                value={pipelineNome}
                                className='glass text-white m-1'
                                onIonChange={(e) => preencherPepilineNome(e)}
                                required
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                        <IonCol size='1' className='text-center p-0 m-0'>
                            <IonLabel className='fw-bold'>Descrição:</IonLabel>
                        </IonCol>
                        <IonCol size='11' className=''>
                            <IonTextarea inputmode='text'
                                maxlength={500}
                                value={pipelineDescricao}
                                className='glass text-white m-1'
                                style={{minHeight: '100px' }}
                                onIonChange={(e) => preencherPepilineDescricao(e)}
                                required
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow className='d-flex w-100 ion-align-items-center'>
                        <IonCol size='1' className='text-center p-0 m-0'>
                            <IonLabel className='fw-bold mt-2' >Jobs:</IonLabel>
                        </IonCol>
                        <IonCol size='11' className=''>
                            <div className='ms-1 pt-1 glass'>
                            {
                                catalogoJobsSelecionados.map((item, index) => 
                                    <IonBadge key={index} className='ion-align-items-center mx-1 mt-1 pt-2 font-monospace small'>
                                        <span style={{backgroundColor: 'var(--ion-color-dark)'}} className='rounded text-white px-1'>
                                            Nº{index+1}
                                        </span>
                                        <span className='ms-1 pt-1'>{item.nome}</span>
                                    </IonBadge>
                                )
                            }
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonButton fill='solid'
                        className='w-100 mt-4 my-3' 
                        disabled={pipelineNome.trim().length < 2 || pipelineDescricao.trim().length < 2} 
                        onClick={() => salvarNovaPipeline()} 
                    > 
                        <IonIcon icon={save} className='me-2'/>
                        Salvar no Banco
                    </IonButton>
                </div>
            </div>
        </div>
    </>
}

export default ModalNovaPipeline;