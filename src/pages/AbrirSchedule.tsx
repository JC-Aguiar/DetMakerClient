import { IonApp, IonButton, IonContent, IonIcon, IonPage, ScrollDetail, useIonViewDidEnter } from '@ionic/react';
import { useParams } from 'react-router';
import { useState } from 'react';
import { folderOpen } from 'ionicons/icons';

const AbrirSchedule = (props: any) => {
    const { name } = useParams<{ name: string }>();


    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-5'></div>
                <div className="card border border-2 p-3 mx-0 mx-md-4" id="capa-abrir">
                    <h1 className="card-title destaque lh-1 m-0 text-center">
                        Abrir Arquivo
                    </h1>
                    <h3 className="card-text h3 text-primary ms-2 mt-2 text-center">
                        Selecione o caminho da planilha Schedule para dar início ao Det-Maker.
                    </h3>
                    <div className="mb-3 mx-5">
                        <label htmlFor="formFile" className="form-label" ></label>
                        <input className="form-control" type="file" id="formFile" />
                    </div>
                    <IonButton className='mx-5'>
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
