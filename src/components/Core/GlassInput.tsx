import { IonItem, InputChangeEventDetail, IonLabel, IonIcon, IonRow, IonChip } from "@ionic/react";
import React, { ReactNode, useState } from "react";


export interface GlassInputProps {
    icon?: string,
    text?: string,
    textButtons?: GlassInputIconProps[], 
    color?: string, 
    children?: ReactNode,
}

export interface GlassInputIconProps {
    icon: string,
    className?: string, 
    handler: () => void,
}

export interface GlassInputEvents {
    onIonChange?: (e: CustomEvent<InputChangeEventDetail>) => void,
    onIonBlur?: (e: CustomEvent<FocusEvent>) => void,
    onIonFocus?: (e: CustomEvent<FocusEvent>) => void,
    onIonInput?: (e: CustomEvent<InputEvent>) => void,
}

const GlassInput: React.FC<GlassInputProps> = ({ text, icon, children, ...props }) => {
    const getPropsColor = () => props.color ? props.color : 'primary';
    const [color, setColor] = useState<string>(getPropsColor());
    const focus = () => setColor(color === 'secondary' ? 'primary' : 'secondary');
    const blur = () => setColor(getPropsColor());

    return(
        <IonRow className="d-flex w-100 p-0 px-1 py-2 m-0 ">
            <IonItem className='glass w-100' hidden={!children}>
                <span onFocus={focus} onBlur={blur} className="w-100">
                    {children}
                </span>
            </IonItem>
            <IonChip  
                hidden={!text}
                className="stick py-0 pe-2 m-0 lh-1"
                style={{ backgroundColor: `var(--ion-color-${color})`, color: `var(--ion-color-${color}-contrast)` }}
            >
                <IonIcon icon={icon} color='dark' hidden={!icon} size="small" className="m-0 p-0" />
                <IonLabel hidden={!text} style={{ '--color': `var(--ion-color-${color}-contrast)` }} className="me-2" >
                    {text}
                </IonLabel>
                {
                    props.textButtons?.map((item, index) => 
                        <IonIcon icon={item.icon} 
                            key={index}
                            className={`btn p-0 m-0 ${item.className ? item.className : ""}`}
                            onClick={() => item.handler()}
                        />
                    )
                }
            </IonChip>
        </IonRow>
    );
}

export default GlassInput;