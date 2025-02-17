import { IonButton, IonIcon } from "@ionic/react";
import { HTMLAttributes } from "react";

export interface BotaoProps extends HTMLAttributes<HTMLIonButtonElement> {
    icon?: string, 
    text: string,  
    disabled?: boolean, 
    handler: () => void,
}

const Botao: React.FC<BotaoProps> = ({ icon, text, disabled=false, handler, color = 'light', ...props }) => {
    return (
        <IonButton fill="clear" 
            {...props}
            color={color}
            className={`glass mx-2'${props.className}`}  
            onClick={handler} 
            disabled={disabled}
            style={{ borderWidth: '2px', borderColor: `var(--ion-color-${color})` }}
        >
            <IonIcon icon={icon} size='large' style={{transform: 'translate(-5px, -1px) scale(1.0)'}} hidden={!icon} />
            <div >{text}</div> 
        </IonButton>
    );
}

export default Botao;

export const Botoes: React.FC<{botoes: BotaoProps[]}> = ({ botoes }) => {
    return <>
        {
            botoes.map((item, index) => <Botao key={index} {...item} /> )
        }
    </>
}