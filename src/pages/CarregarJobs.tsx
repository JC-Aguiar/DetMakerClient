import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonPopover, IonRadio, IonRadioGroup, RadioGroupChangeEventDetail, useIonModal, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { cloudDownload, create, createOutline, flash, folderOpen, server } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { setPilha } from '../Store/Reducer/ReducerPilhaJobs';
import DynamicModal from '../components/DynamicModal';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { ReducerProjetoTYPE, setDadosProjeto } from '../Store/Reducer/ReducerProjetos';
import { setMainPipeline, setPipelines } from '../Store/Reducer/ReducerPipelines';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { JobConfigDTO } from '../data/JobExecute';
import { Noticacao } from '../components/Noticacao';


const CarregarJobs: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Propriedades do <CarregarJobs>
    const dispatch = useDispatch();
    const pipelinesBanco: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.configPipelines.value);
    const mainPipelineIndex: number = useSelector((state: RootState) => state.store.configPipelines.checkedIndex);
    const mainPipelineNome: string = mainPipelineIndex !== -1 ? pipelinesBanco[mainPipelineIndex].nome : '';
    const [enviar, setEnviar] = useState<boolean | undefined>(false);
    const [anexo, setAnexo] = useState<File | null>(null);
    const history = useHistory();

    //Conteúdo da modal 'Nova Pipeline'
    const conteudoNovaPipeline = (
        <>
            <div className='h5 text-primary mt-2 text-center'>
                Escolha como deseja obter os Jobs para compõem a Pipeline
            </div>

            {/* criar pipeline via jobs em schedule */}
            <div className="my-3 mx-5 border border-2 rounded bg-white p-3 text-center">
                <span className='text-primary h4'>Usar os Jobs de um arquivo schedule</span>
                <form action="/upload" method="post" encType="multipart/form-data" >
                    <label htmlFor="formFile" className="form-label" ></label>
                    <input className="form-control" type="file" id="formFile" onChange={getFile} />
                </form>
                <IonButton className='w-100' onClick={abrirPlanilha} disabled={!enviar}>
                    <IonIcon icon={folderOpen} className='me-2'></IonIcon>
                    Abrir Jobs da Schedule
                </IonButton>
            </div>
            {/*criar pipeline via jobs em banco */}
            <div className='mt-3 mx-5 border border-2 rounded bg-white p-3 text-center'>
                <span className='text-primary text-center h4'>Usar os Jobs salvos no banco</span>
                <IonButton className='w-100 mt-4' onClick={() => carregarBanco(false)}>
                    <IonIcon icon={server} className='me-2'></IonIcon>
                    Carregar Jobs do Banco
                </IonButton>
            </div>
        </>
    );

    //Conteúdo da modal 'Carregar Pipeline'
    const conteudoPipelinesBanco = (
        <>
            <div className='h5 text-primary mt-2 text-center'>
                Escolha qual Pipeline deseja usar
            </div>

            {/* exibindo pipeline obtidas do banco */}
            <div className="my-3 mx-5 border border-2 rounded bg-white p-3 text-center pipelines-repo">
                
                <IonRadioGroup value={mainPipelineNome} onIonChange={(e) => preencherPipelineBanco(e)}>
                    <Swiper
                        //keyboard={true}
                        slidesPerView={5}
                        spaceBetween={0}
                        direction={'vertical'}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        height={300}
                        //navigation={true}
                    >
                        <div className='d-flex justify-items-center'>
                        {
                            pipelinesBanco.map((item, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <IonItem key={index} lines='none' className='border border-2 p-0 m-0'>
                                            {/* nome da pipeline */}
                                            <IonLabel color='primary' className='p-0 m-0'>
                                                <span className='font-weight-bold h4'>{item.nome}</span>
                                            </IonLabel>
                                            <IonRadio color='primary' 
                                                slot="start" 
                                                value={item.nome}
                                            ></IonRadio>

                                            {/* pop-up com a descrição */}
                                            <IonButton id={`pipeline-${index}-descricao`}>Descricao</IonButton>
                                            <IonPopover trigger={`pipeline-${index}-descricao`} 
                                                triggerAction="hover"
                                                className='basic-pop-up'
                                            >
                                                <IonContent color="dark" class="text-dark small font-monospace ion-padding">
                                                    {item.descricao}
                                                </IonContent>
                                            </IonPopover>

                                            {/* pop-up com os jobs */}
                                            <IonButton id={`pipeline-${index}-jobs`}>Jobs</IonButton>
                                            <IonPopover trigger={`pipeline-${index}-jobs`} 
                                                triggerAction="hover"
                                                className='basic-pop-up'
                                            >
                                                <IonContent color="dark" class="text-dark small font-monospace ion-padding">
                                                <ol>
                                                {
                                                    item.jobs.map((jobNome, jobIndex) => 
                                                        <li key={jobIndex}>{jobNome}</li>
                                                    )
                                                }
                                                </ol>
                                                </IonContent>
                                            </IonPopover>
                                        </IonItem>
                                    </SwiperSlide>
                                );
                            })
                        }
                        </div>
                    </Swiper>
                </IonRadioGroup>
            </div>
            <div className='row px-0 px-md-5'>
                <div className='col-12 col-md-6' >
                    <div className="d-block h-100">
                    <IonButton 
                        fill='solid'
                        className="w-100 p-0 m-0"
                        disabled={mainPipelineIndex === -1}
                        onClick={reexecutarPipeline}
                    >
                    <IonIcon icon={flash} className='mx-1 pt-1 pb-0' />
                        Executar Pipeline
                    </IonButton>
                    </div>
                </div>
                <div className='col-12 col-md-6'>
                    <div className="d-block h-100">
                        <IonButton 
                            fill='solid'
                            className="w-100 p-0 m-0"
                            disabled={mainPipelineIndex === -1}
                            onClick={() => carregarBanco(true)}
                        >
                        <IonIcon icon={createOutline} className='mx-1 pt-0 pb-0' />
                            Editar Pipeline
                        </IonButton>
                    </div>
                </div>
            </div>
        </>
    );

    //Configurações e propriedades da modal de nova pipeline
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Criar nova Pipeline",
            elemento: conteudoNovaPipeline,
            onDismiss: () => modalNovaPipelineOff(),
        }
    );

    //Configurações e propriedades da modal de pipelines no banco
    const [modalGetPipelinesOn, modalGetPipelinesOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Pipelines no Banco",
            elemento: conteudoPipelinesBanco,
            onDismiss: () => modalGetPipelinesOff(),
        }
    );

    //Operações ao carregar esta página
    useIonViewDidEnter(() => {
        //dispatch(show());
    }, []);

    //Coletando arquivo da máquina local
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

    //Requisição para abrir a planilha schedule para obter os jobs
    async function abrirPlanilha() {
        try {
            if (!anexo) {
                console.log("[CARREGAR-JOBS]: Nenhum arquivo para envio.");
                return
            };
            console.log(`[CARREGAR-JOBS]: Iniciando requisição 'Abrir Planilha'.`);
            modalNovaPipelineOff();
            toastInfo("ABRIR PLANILHA: Em execução...", []);

            const formData = new FormData();
            formData.append('file', anexo);
            const planilhas: JobConfigDTO[] = await axiosRequest.openSchedule(anexo);
            dispatch(setPilha({ jobsBanco: planilhas, jobsPipeline:[] }));

            toastOk("ABRIR PLANILHA: Realizado com sucesso.", []);
            console.log(`[CARREGAR-JOBS]: Requisição 'Abrir Planilha' funcionou.`);

            console.log(`[CARREGAR-JOBS]: Avançando para etapa 'Escolher Jobs'`);
            history.push('/det-maker/select/');
        }
        catch (error) {
            toastErro(`ABRIR PLANILHA: ${error}`, []);
            console.error(`[CARREGAR-JOBS]: Requisição 'Abrir Planilha' falhou.`);
        }
    }

    //Acionamento ao selecionar uma opção de Pipeline carregada do banco
    function preencherPipelineBanco(e: CustomEvent<RadioGroupChangeEventDetail<string>>): void {
        const valor = e.detail.value;
        if (valor === null || valor === undefined) return;
        console.log(`[CARREGAR-JOBS]: Usuário selecionou opção de Pipeline '${valor}'.`);
        
        const pipelineReg = pipelinesBanco.find((item) => item.nome === valor);
        if (!pipelineReg) {
            console.log(`[CARREGAR-JOBS]: Pipeline '${valor}' não identificada debter as Pipelines do banco.`);
            return;
        };
        console.log(`[CARREGAR-JOBS]: Pipeline '${pipelineReg.nome}' identificada dentre as Pipelines do banco.`);

        console.log(`[CARREGAR-JOBS]: Definindo a Pipeline '${pipelineReg.nome}' como main.`);
        const novaPipelineConfig: ReducerProjetoTYPE = {
            pipelineNome: pipelineReg.nome,
            pipelineDescricao: pipelineReg.descricao,
            projetoId: "",
            projetoNome: "",
            atividadeNome: "",
            configuracao: "",
        };
        dispatch(setMainPipeline({ pipelineNome: pipelineReg.nome }));
        dispatch(setDadosProjeto(novaPipelineConfig));
    }

    //Requisição para obter os jobs diretamente do banco
    async function carregarBanco(aplicarPipeline: boolean) {
        console.log(`[CARREGAR-JOBS]: Iniciando requisição 'Download Jobs'.`);
        modalGetPipelinesOff();
        modalNovaPipelineOff();
        toastInfo("DOWNLOAD JOBS: Em execução...", []);

        try {
            const planilhas: JobConfigDTO[] = (await axiosRequest.getAllJobs());
            const jobsPipeline = (mainPipelineIndex > -1 && aplicarPipeline) ? pipelinesBanco[mainPipelineIndex].jobs : [];
            dispatch(setPilha({ 
                jobsBanco: planilhas, 
                jobsPipeline: jobsPipeline 
            }));

            history.push('/det-maker/select/');
            toastOk("DOWNLOAD JOBS: Realizado com sucesso.", []);
            console.log(`[CARREGAR-JOBS]: Requisição 'Download Jobs' funcionou.`);
        }
        catch (error) {
            toastErro(`DOWNLOAD JOBS: ${error}`, []);
            console.error(`[CARREGAR-JOBS]: Requisição 'Download Jobs' falhou.`);
        }
    }

    //Requisição para obter todas as pipelines do banco
    async function obterPipelinesBanco() {
        console.log(`[CARREGAR-JOBS]: Iniciando requisição 'Download Pipelines'.`);
        toastInfo("DOWNLOAD PIPELINES: Em execução...", []);

        try {
            const pipelines: PipelineInfoDTO[] = await axiosRequest.getAllPipelines();
            dispatch(setPipelines(pipelines));

            //history.push('/det-maker/select/');
            modalGetPipelinesOn();
            toastOk("DOWNLOAD PIPELINES: Realizado com sucesso.", []);
            console.log(`[CARREGAR-JOBS]: Requisição 'Download Pipelines' funcionou.`);
        }
        catch (error) {
            toastErro(`DOWNLOAD PIPELINES: ${error}`, []);
            console.error(`[CARREGAR-JOBS]: Requisição 'Download Pipelines' falhou.`);
        }
    }

    //Requisição para executar a Pipeline
    async function reexecutarPipeline() {
        console.log(`[CARREGAR-JOBS]: Iniciando requisição 'Rexecutar Pipeline'.`);
        toastInfo("REEXECUTAR PIPELINE: Em execução...", []);
        try {
            await axiosRequest.reexecutarPilha(mainPipelineNome); //const resposta: string = 
            toastOk("REEXECUTAR PIPELINE: Realizada com sucesso.", []);
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Rexecutar Pipeline' funcionou.`);
        }
        catch (error) {
            toastErro(`REEXECUTAR PIPELINE: ${error}`, []);
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Rexecutar Pipeline' falhou.`);
        }
    }

    //Conteúdo principal renderizado nesta página
    return (
        <div className='row pt-5 px-0 px-md-5'>
            {/* OPÇÃO 1: NOVA PIPELINE */}
            <div className='col-12 col-md-6' >
                <div className="d-block h-100 mb-3 border border-2">
                    <IonButton expand="full"
                        fill='clear'
                        size="large"
                        className="centered-button h-100 m-0"
                        onClick={() => modalNovaPipelineOn()}
                    >
                        <IonIcon icon={create} className='mx-1 pt-0 pb-1' />
                        Nova Pipeline
                    </IonButton>
                </div>
            </div>

            {/* OPÇÃO 2: CARREGAR PIPELINE */}
            <div className='col-12 col-md-6'>
                <div className="d-block h-100 mb-3 border border-2">
                    <IonButton expand="full"
                        fill='clear'
                        size="large"
                        className="centered-button h-100 m-0"
                        onClick={() => obterPipelinesBanco()}
                    >
                        <IonIcon icon={cloudDownload} className='mx-1 pt-1 pb-0' />
                        Carregar Pipelines
                    </IonButton>
                </div>
            </div>
        </div>
    );
};

export default CarregarJobs;