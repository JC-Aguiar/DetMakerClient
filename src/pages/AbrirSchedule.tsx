import { IonButton, IonContent, IonIcon, IonPage, useIonToast } from '@ionic/react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { folderOpen } from 'ionicons/icons';
import { alertController } from "@ionic/core";
import * as axiosRequest from "../components/AxiosRequest";
import { AgendaDTO } from '../components/AgendaDTO';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { on } from '../Store/Reducer/ReducerEscolherJobs';
import { setAgenda } from '../Store/Reducer/ReducerAgendas';
import { setPilha } from '../Store/Reducer/ReducerPilhaJobs';

export function validarExibirData(dataAtualizacao: string): string {
    const date = dayjs(dataAtualizacao);
    if (!dayjs(date).isValid()) return dataAtualizacao;
    return new Intl.DateTimeFormat('pt-BR').format(date.toDate());
}

const AbrirSchedule = (props: any) => {
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

    async function carregarArquivo() {
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
                console.log("[ABRIR-SCHEDULE] Nenhum arquivo para envio.");
                return
            };
            const formData = new FormData();
            formData.append('file', anexo);
            const planilhas: AgendaDTO[] = await axiosRequest.openSchedule(anexo);
            dispatch(setPilha(planilhas));
            //console.log(`[ABRIR-SCHEDULE] Avançando para etapa 'Escolher Jobs'`);
            //dispatch(on());
            history.push('/det-maker/select/');
        }
        catch (error) {
            const axiosError = error as AxiosError;
            let mensagemErro = "";
            //O servidor respondeu com um status diferente de 2xx
            if (axiosError.response) {
                mensagemErro = `O servidor respondeu com status diferente de sucesso.
                    Status ${axiosError.response.status}: ${axiosError.response.data}.`;
            }
            else if (axiosError.request) {
                mensagemErro = "Falha de conexão. Sem resposta do servidor.";
            }
            else {
                mensagemErro = `Erro ao fazer a requisição: ${axiosError.message}.`;
            }
            console.error(`[ABRIR-SCHEDULE] ${mensagemErro}`);
            await toastOff();
            acionarToast(mensagemErro);
        }
        finally {
            await alert.dismiss();
        }
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-4'></div>
                <div className="card border border-2 p-3 mx-0 mx-md-4" id="capa-abrir">
                    <h1 className="card-title destaque lh-1 m-0 text-center">
                        Abrir Arquivo
                    </h1>
                    <h3 className="card-text h3 text-primary ms-2 mt-2 text-center">
                        Selecione o caminho da planilha Schedule para dar início ao Det-Maker.
                    </h3>
                    <div className="mb-3 mx-5">
                        <form action="/upload" method="post" encType="multipart/form-data">
                            <label htmlFor="formFile" className="form-label" ></label>
                            <input className="form-control" type="file" id="formFile" onChange={getFile} />
                        </form>
                    </div>
                    <IonButton className='mx-5' onClick={carregarArquivo} disabled={!enviar}>
                        <IonIcon icon={folderOpen} className='me-2'></IonIcon>
                        Abrir
                    </IonButton>
                    <div className='mb-5'></div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AbrirSchedule;
