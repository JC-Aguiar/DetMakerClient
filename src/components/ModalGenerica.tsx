import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, } from "@ionic/react";
import React from "react";

//Propriedades da modal 
export interface ModalProps {
    titulo: string,
    elemento: JSX.Element,
    onDismiss: () => void,
}

//Conteúdo da modal
const ModalGenerica: React.FC<ModalProps> = ({ titulo, elemento, onDismiss }) => {
    return (
        <IonContent className="">
            <IonHeader className="banner p-2 m-0 text-center">
                <span className="font-monospace text-white fw-bold">{titulo}</span>
            </IonHeader>
            <IonFab edge={true} vertical="top" horizontal="end">
                <IonFabButton className="close-icon" color="#" onClick={onDismiss} >
                    <IonIcon icon="close" color="#" />
                </IonFabButton>
            </IonFab>
            <div className="p-2">
                {elemento}
            </div>
        </IonContent>
    );
}

export default ModalGenerica;


