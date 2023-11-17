import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonPopover, IonRadio, IonRadioGroup, RadioGroupChangeEventDetail, useIonModal, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { cloudDownload, create, createOutline, flash, folderOpen, server } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { JobInfoDTO } from '../data/JobInfoDTO';
import dayjs from 'dayjs';
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { setPilha } from '../Store/Reducer/ReducerPilhaJobs';
import { show } from '../Store/Reducer/ReducerTabMenu';
import ModalGenerica from '../components/ModalGenerica';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { ConfigAtividadeTYPE, setAtividade } from '../Store/Reducer/ReducerPipelineExecute';
import { setMainPipeline, setPipelines } from '../Store/Reducer/ReducerPipelines';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { JobConfigDTO } from '../data/JobExecute';

export function validarExibirData(dataAtualizacao: string): string {
    const date = dayjs(dataAtualizacao);
    if (!dayjs(date).isValid()) return dataAtualizacao;
    return new Intl.DateTimeFormat('pt-BR').format(date.toDate());
}

const CarregarJobs = (props: any) => {
    //Propriedades do <CarregarJobs>
    const dispatch = useDispatch();
    const pipelinesBanco: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.configPipelines.value);
    const mainPipelineIndex: number = useSelector((state: RootState) => state.store.configPipelines.checkedIndex);
    const mainPipelineNome: string = mainPipelineIndex !== -1 ? pipelinesBanco[mainPipelineIndex].nome : '';
    const [enviar, setEnviar] = useState<boolean | undefined>(false);
    const [anexo, setAnexo] = useState<File | null>(null);
    const history = useHistory();
    const [toast, toastOff] = useIonToast();
    const acionarToast = (mensagem: string, tempo: number, cor: string) => {
        toast({
            message: `${mensagem}`,
            duration: tempo,
            position: 'bottom',
            color: cor,
        });
    };

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
        ModalGenerica,
        {
            titulo: "Criar nova Pipeline",
            elemento: conteudoNovaPipeline,
            onDismiss: () => modalNovaPipelineOff(),
        }
    );

    //Configurações e propriedades da modal de pipelines no banco
    const [modalGetPipelinesOn, modalGetPipelinesOff] = useIonModal(
        ModalGenerica,
        {
            titulo: "Pipelines no Banco",
            elemento: conteudoPipelinesBanco,
            onDismiss: () => modalGetPipelinesOff(),
        }
    );

    //Operações ao carregar esta página
    useIonViewDidEnter(() => {
        dispatch(show());
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
            toastOff().then(() => acionarToast("ABRIR PLANILHA: Em execução...", 5000, 'medium'));

            const formData = new FormData();
            formData.append('file', anexo);
            const planilhas: JobConfigDTO[] = await axiosRequest.openSchedule(anexo);
            dispatch(setPilha({ jobsBanco: planilhas, jobsPipeline:[] }));

            toastOff().then(() => acionarToast("ABRIR PLANILHA: Realizado com sucesso.", 5000, 'primary'));
            console.log(`[CARREGAR-JOBS]: Requisição 'Abrir Planilha' funcionou.`);

            console.log(`[CARREGAR-JOBS]: Avançando para etapa 'Escolher Jobs'`);
            history.push('/det-maker/select/');
        }
        catch (error) {
            toastOff().then(() => acionarToast(`ABRIR PLANILHA: ${error}`, 9900, 'warning'));
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
        const novaPipelineConfig: ConfigAtividadeTYPE = {
            pipelineNome: pipelineReg.nome,
            pipelineDescricao: pipelineReg.descricao,
            atividadeNome: "",
            projetoNome: "",
            configuracao: "",
        };
        dispatch(setMainPipeline({ pipelineNome: pipelineReg.nome }));
        dispatch(setAtividade(novaPipelineConfig));
    }

    //Requisição para obter os jobs diretamente do banco
    async function carregarBanco(aplicarPipeline: boolean) {
        console.log(`[CARREGAR-JOBS]: Iniciando requisição 'Download Jobs'.`);
        modalGetPipelinesOff();
        modalNovaPipelineOff();
        toastOff().then(() => acionarToast("DOWNLOAD JOBS: Em execução...", 5000, 'medium'));

        try {
            const planilhas: JobConfigDTO[] = (await axiosRequest.getAllJobs());
            const jobsPipeline = (mainPipelineIndex > -1 && aplicarPipeline) ? pipelinesBanco[mainPipelineIndex].jobs : [];
            dispatch(setPilha({ 
                jobsBanco: planilhas, 
                jobsPipeline: jobsPipeline 
            }));

            history.push('/det-maker/select/');
            toastOff().then(() => acionarToast("DOWNLOAD JOBS: Realizado com sucesso.", 5000, 'primary'));
            console.log(`[CARREGAR-JOBS]: Requisição 'Download Jobs' funcionou.`);
        }
        catch (error) {
            toastOff().then(() => acionarToast(`DOWNLOAD JOBS: ${error}`, 9900, 'warning'));
            console.error(`[CARREGAR-JOBS]: Requisição 'Download Jobs' falhou.`);
        }
    }

    //Requisição para obter todas as pipelines do banco
    async function obterPipelinesBanco() {
        console.log(`[CARREGAR-JOBS]: Iniciando requisição 'Download Pipelines'.`);
        toastOff().then(() => acionarToast("DOWNLOAD PIPELINES: Em execução...", 5000, 'medium'));

        try {
            const pipelines: PipelineInfoDTO[] = await axiosRequest.getAllPipelines();
            dispatch(setPipelines(pipelines));

            //history.push('/det-maker/select/');
            modalGetPipelinesOn();
            toastOff().then(() => acionarToast("DOWNLOAD PIPELINES: Realizado com sucesso.", 5000, 'primary'));
            console.log(`[CARREGAR-JOBS]: Requisição 'Download Pipelines' funcionou.`);
        }
        catch (error) {
            toastOff().then(() => acionarToast(`DOWNLOAD PIPELINES: ${error}`, 9900, 'warning'));
            console.error(`[CARREGAR-JOBS]: Requisição 'Download Pipelines' falhou.`);
        }
    }

    //Requisição para executar a Pipeline
    async function reexecutarPipeline() {
        console.log(`[CARREGAR-JOBS]: Iniciando requisição 'Rexecutar Pipeline'.`);
        toastOff().then(() => acionarToast("REEXECUTAR PIPELINE: Em execução...", 5000, 'medium'));
        try {
            await axiosRequest.reexecutarPilha(mainPipelineNome); //const resposta: string = 
            toastOff().then(() => acionarToast("REEXECUTAR PIPELINE: Realizada com sucesso.", 5000, 'primary'));
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Rexecutar Pipeline' funcionou.`);
        }
        catch (error) {
            toastOff().then(() => acionarToast(`REEXECUTAR PIPELINE: ${error}`, 9900, 'warning'));
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Rexecutar Pipeline' falhou.`);
        }
    }

    //Conteúdo principal renderizado nesta página
    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-4'></div>

                <div className="card border border-2 p-5 mx-0 mx-md-5" id="capa-abrir">
                    <h1 className="card-title destaque lh-1 m-0 text-center">
                        Carregar Jobs
                    </h1>
                    <h3 className="card-text h3 text-primary ms-2 mt-2 text-center">
                        Escolha uma das opções abaixo para iniciar uma Pipeline.
                    </h3>

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
                </div>

                {/* Recuo */}
                <div className='mb-5'></div>
            </IonContent>
        </IonPage>
    );
};

export default CarregarJobs;