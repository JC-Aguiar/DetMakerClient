import { IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, } from "@ionic/react";
import { close, closeCircle, closeCircleOutline } from "ionicons/icons";
import React from "react";

//Propriedades da modal 
export interface DynamicModalProps {
    titulo: string,
    elemento: JSX.Element,
    onDismiss: () => void,
    padding?: boolean,
    fullSize?: boolean,
}

//Conteúdo da modal
const DynamicModal: React.FC<DynamicModalProps> = ({ titulo, elemento, onDismiss, padding = true , fullSize = true }) => {
    //border-bottom border-2 border-warning
    return (
        <>
            <IonHeader className="banner p-2 m-0 text-center">
                <span className="font-monospace text-dark fw-bold">{titulo}</span>
            </IonHeader>
            <IonFab edge={true} vertical="top" horizontal="end">
                <IonFabButton className="close-icon" color="#" onClick={onDismiss} >
                    <IonIcon icon={close} color="#" />
                </IonFabButton>
            </IonFab>
            <IonContent className="h-100 w-100 p-5" fullscreen={false} >
                <div className={padding ? "px-2 py-2 m-0" : "p-0 m-0"}>
                    {elemento}
                </div>
            </IonContent>
            <IonFooter className="w-100 py-1 opacity-0" />
        </>
    );
}

export default DynamicModal;


