import { IonItem, InputChangeEventDetail, IonLabel, IonIcon, IonRow, IonChip, IonFabButton } from "@ionic/react";
import React, { ReactNode, useState } from "react";


export interface GlassInputProps {
    icon?: string,
    text?: string,
    textButtons?: GlassInputIconProps[], 
    color?: string, 
    children?: ReactNode,
    className?: string,
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
        <IonRow className={`d-flex w-100 p-0 py-2 m-0`}>
            <IonItem className='w-100 m-0 p-0' lines="none" hidden={!children}>
                <span onFocus={focus} onBlur={blur} className="glass w-100">
                    {children}
                </span>
            </IonItem>
            <IonChip  
                hidden={!text}
                className="stick p-0 pe-2 m-0 ms-3"
                style={{ 
                    backgroundColor: `var(--ion-color-${color})`, 
                    color: `var(--ion-color-${color}-contrast)`,
                }}
            >
                <IonIcon icon={icon} color='dark' hidden={!icon} size="small" className="m-0 p-0 ms-1" />
                <IonLabel hidden={!text} style={{ '--color': `var(--ion-color-${color}-contrast)` }} className="mx-1" >
                    {text}
                </IonLabel>
                {
                    props.textButtons?.map((item, index) => 
                        <IonFabButton
                            key={index}
                            size="small"
                            color="light"
                            className={`p-0 m-0 ${item.className ? item.className : ""}`}
                            style={{ width: '16px', height: '16px', transform: 'translate(5px, -.5px)' }}
                            onClick={() => item.handler()}
                        >
                            <IonIcon 
                                icon={item.icon}
                                className="m-0 p-0"
                            />
                        </IonFabButton>
                    )
                }
            </IonChip>
        </IonRow>
    );
}

export default GlassInput;