import { IonApp, IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonPage, ScrollDetail, useIonViewDidEnter } from '@ionic/react';
import { useParams } from 'react-router';
import { flash, folderOpen, logoGoogle } from 'ionicons/icons';

const ExecutarJobs = (props: any) => {
    const { name } = useParams<{ name: string }>();

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-5'></div>
                <div className="card border border-2 p-3 mx-0 mx-md-4" id="capa-abrir">
                    <div className="progress" role="progressbar" aria-label="carregando..." >
                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: "100%"}}></div>
                    </div>
                    <h1 className="card-title destaque lh-1 m-0 text-center">
                        Executando
                    </h1>
                    <h3 className="card-text h3 text-primary ms-2 mt-2 text-center">
                        Aguarde a aplicação executar toda a pilha de Jobs para termos o log completo.
                    </h3>
                    <div className='d-flex justify-content-center'>
                        <IonIcon id="flash" className="text-secondary " icon={flash} ></IonIcon>
                    </div>
                    <div className='mb-5'></div>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default ExecutarJobs;
