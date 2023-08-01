import { IonApp, IonButton, IonContent, IonIcon, IonPage, IonText, ScrollDetail, useIonViewDidEnter } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { ChangeEvent, useRef, useState } from 'react';
import { folderOpen } from 'ionicons/icons';
import { alertController } from "@ionic/core";
import * as axiosRequest from "../components/AxiosRequest";
import { ErroModel } from '../components/ErroModel';
import { AgendaDTO } from '../components/AgendaDTO';

const AbrirSchedule = (props: any) => {
    const [mensagemErro, SetMensagemErro] = useState("");
    const [enviar, setEnviar] = useState<boolean | undefined>(false);
    const [anexo, setAnexo] = useState<File | null>(null);
    const history = useHistory();
    const callBack = props.callBack;

    async function scheduleCallBack(arquivoXlsx: AgendaDTO[]) {
        console.log(`[ABRIR-SCHEDULE] Realizando callback das agendas`);
        callBack(arquivoXlsx);
    }

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
            //const json: string = JSON.stringify(planilhas);
            await scheduleCallBack(planilhas);
            history.push('/det-maker/select/');
        }
        catch (error) {
            // TODO: criar um Popup/Toast aqui para exibir o erro ao usuário 
            console.error(`[ABRIR-SCHEDULE] ${error}`);
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
                    <IonText id="erro-texto">{mensagemErro}</IonText>
                    <div className='mb-5'></div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AbrirSchedule;
