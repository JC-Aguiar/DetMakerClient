import { IonBadge } from "@ionic/react";

export interface InfoTagProps {
    texto: string, 
    x: number, 
    y: number
}

const InfoTag: React.FC<InfoTagProps> = ({ texto, x, y }) => {
    return <IonBadge color='tertiary' 
            className="border m-1 sticky-top text-start ion-justify-content-start"
            style={{position: 'absolute', top: `0%`, left: `0%`, transform: `translate(${x}%, ${y}%)`}}
        >
            {texto}
        </IonBadge>
};

export default InfoTag;