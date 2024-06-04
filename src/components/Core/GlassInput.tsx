import { IonItem, IonInput, InputChangeEventDetail, IonLabel, IonIcon } from "@ionic/react";


export interface GlassInputProps extends React.ComponentProps<typeof IonInput> {
    text?: string;
    icon?: string;
}

export interface GlassInputEvents {
    onIonChange?: (e: CustomEvent<InputChangeEventDetail>) => void,
    onIonBlur?: (e: CustomEvent<FocusEvent>) => void,
    onIonFocus?: (e: CustomEvent<FocusEvent>) => void,
    onIonInput?: (e: CustomEvent<InputEvent>) => void,
}

const GlassInput: React.FC<GlassInputProps> = ({ text, ...props }) => {
    return(
        <div className="d-flex w-100 px-1">
            <IonItem className='m-0 p-0 w-100'>
                <IonIcon icon={props.icon} color={props.color} hidden={!props.icon} size="small" className="m-0 p-0 me-2" />
                <IonLabel hidden={!text} color={props.color}>{text}</IonLabel>
                <IonInput {...props} className={`glass item-lista lh-0 shadow shadow-0 ms-1 pe-1 h-75 ${props.className}`} />
            </IonItem>
        </div>
    );
}

export default GlassInput;