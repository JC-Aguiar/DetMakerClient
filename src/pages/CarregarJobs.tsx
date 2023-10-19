import { IonButton, IonContent, IonIcon, IonPage, useIonToast } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { folderOpen, server } from 'ionicons/icons';
import { alertController } from "@ionic/core";
import * as axiosRequest from "../data/AxiosRequest";
import { JobDTO } from '../data/JobDTO';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { setPilha } from '../Store/Reducer/ReducerPilhaJobs';
import { requestErro } from '../data/AxiosRequest';

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
            await alert.dismiss();
        }
    }

    async function carregar() {
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
            await alert.dismiss();
        }
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-4'></div>
                <div className="card border border-2 p-5 mx-0 mx-md-5" id="capa-abrir">
                    <h1 className="card-title destaque lh-1 m-0 text-center">
                        Carregar Jobs
                    </h1>
                    <h3 className="card-text h3 text-primary ms-2 mt-2 text-center">
                        Escolha uma das opções abaixo para dar início ao Det-Maker.
                    </h3>
                    {/* CARREGAR VIA PLANILHA SCHEDULE */}
                    <div className="mb-3 mx-5">
                        <form action="/upload" method="post" encType="multipart/form-data">
                            <label htmlFor="formFile" className="form-label" ></label>
                            <input className="form-control" type="file" id="formFile" onChange={getFile} />
                        </form>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <IonButton className='ms-5 w-100' onClick={abrirPlanilha} disabled={!enviar}>
                            <IonIcon icon={folderOpen} className='me-2'></IonIcon>
                            Abrir
                        </IonButton>
                        {/* CARREGAR DO BANCO */}
                        <IonButton className='me-5 w-100' onClick={carregar}>
                            <IonIcon icon={server} className='me-2'></IonIcon>
                            Carregar
                        </IonButton>
                    </div>
                    <div className='mb-5'></div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CarregarJobs;
