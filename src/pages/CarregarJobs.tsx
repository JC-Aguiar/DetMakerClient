import { IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, useIonModal, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { cloudDownload, create, folderOpen, server } from 'ionicons/icons';
import { alertController } from "@ionic/core";
import * as axiosRequest from "../data/AxiosRequest";
import { JobDTO } from '../data/JobDTO';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { setPilha } from '../Store/Reducer/ReducerPilhaJobs';
import { requestErro } from '../data/AxiosRequest';
import { show } from '../Store/Reducer/ReducerTabMenu';
import ModalGenerica from '../components/ModalGenerica';

export function validarExibirData(dataAtualizacao: string): string {
    const date = dayjs(dataAtualizacao);
    if (!dayjs(date).isValid()) return dataAtualizacao;
    return new Intl.DateTimeFormat('pt-BR').format(date.toDate());
}

const CarregarJobs = (props: any) => {
    const dispatch = useDispatch();
    const [enviar, setEnviar] = useState<boolean | undefined>(false);
    const [anexo, setAnexo] = useState<File | null>(null);
    const history = useHistory();
    const [toast, toastOff] = useIonToast();
    const acionarToast = (mensagem: unknown) => {
        toast({
            message: `${mensagem}`,
            duration: 9900,
            position: 'bottom',
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
                <IonButton className='w-100 mt-4' onClick={carregarBanco}>
                    <IonIcon icon={server} className='me-2'></IonIcon>
                    Carregar Jobs do Banco
                </IonButton>
            </div>
        </>
    );

    //Conteúdo da modal 'Nova Pipeline'
    const conteudoCarregarPipeline = (
        <>

        </>
    );

    //Configurações e propriedades da modal de pipeline
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(
        ModalGenerica,
        {
            titulo: "Criar nova Pipeline",
            elemento: conteudoNovaPipeline,
            onDismiss: () => modalNovaPipelineOff(),
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
        const alert = await alertController.create({
            id: "opening-schedule",
            message: "Lendo conteúdo",
            buttons: [],
            backdropDismiss: false,
            translucent: true,
            keyboardClose: false,
            // TODO: adicionar estilo e talvez uma animação
        });
        try {
            await alert.present();
            if (!anexo) {
                console.log("[CARREGAR-JOBS] Nenhum arquivo para envio.");
                return
            };
            const formData = new FormData();
            formData.append('file', anexo);
            const planilhas: JobDTO[] = await axiosRequest.openSchedule(anexo);
            dispatch(setPilha(planilhas));
            //console.log(`[CARREGAR-JOBS] Avançando para etapa 'Escolher Jobs'`);
            //dispatch(on());
            history.push('/det-maker/select/');
        }
        catch (error) {
            const mensagemErro = requestErro(error as AxiosError);
            console.error(`[CARREGAR-JOBS] ${mensagemErro}`);
            toastOff().then(() => acionarToast(mensagemErro));
        }
        finally {
            modalNovaPipelineOff();
            await alert.dismiss();
        }
    }

    //Requisição para obter os jobs diretamente do banco
    async function carregarBanco() {
        const alert = await alertController.create({
            id: "opening-schedule",
            message: "Lendo conteúdo",
            buttons: [],
            backdropDismiss: false,
            translucent: true,
            keyboardClose: false,
            // TODO: adicionar estilo e talvez uma animação
        });
        try {
            const planilhas: JobDTO[] = await axiosRequest.getAllJobs();
            dispatch(setPilha(planilhas));
            history.push('/det-maker/select/');
        }
        catch (error) {
            const mensagemErro = requestErro(error as AxiosError);
            console.error(`[CARREGAR-JOBS] ${mensagemErro}`);
            toastOff().then(() => acionarToast(mensagemErro));
        }
        finally {
            modalNovaPipelineOff();
            await alert.dismiss();
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

                    <div className='row pt-5 px-5'>
                        {/* OPÇÃO 1: NOVA PIPELINE */}
                        <div className='col-6' >
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
                        <div className='col-6'>
                            <div className="d-block h-100 mb-3 border border-2">
                                <IonButton expand="full"
                                    fill='clear'
                                    size="large"
                                    className="centered-button h-100 m-0"
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
