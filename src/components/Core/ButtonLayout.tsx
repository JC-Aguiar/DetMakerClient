import { InputChangeEventDetail, IonBadge, IonButton, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonInput, IonLabel, IonPopover, IonRow } from "@ionic/react";
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";

export interface ButtonLayoutProps {
    title: string,
    icon: string,
    disabled: boolean,
    trigger: () => void,
    popover?: PopoverProps,
    id?: string,
}

export interface PopoverProps {
    text?: string,
    input?: JSX.Element,
}

export interface PopoverInputProps {
    onIonChange?: (e: CustomEvent<InputChangeEventDetail>) => void,
    onIonBlur?: (e: CustomEvent<FocusEvent>) => void,
    onIonFocus?: (e: CustomEvent<FocusEvent>) => void,
    onIonInput?: (e: CustomEvent<InputEvent>) => void,
}

//export namespace PopoverProps
export const layoutGrupoBotoes = (grupo: ButtonLayoutProps[]) => {
    return (
        <IonFab slot="fixed" 
            vertical="top" 
            horizontal="start" 
            className="ion-justify-content-center ion-align-items-center glass"
            style={{ backgroundColor: 'var(--ion-color-tertiary)', position: 'fixed' }}
        >
            <div className="glass-content" >
                {
                    grupo.map((item, index) => 
                        <IonRow key={index} className="m-0 p-1 ion-justify-content-center ion-align-items-center">
                            <ButtonLayout {...item} />
                        </IonRow>
                    )
                }
            </div>
        </IonFab>
    );
};

const ButtonLayout: React.FC<ButtonLayoutProps> = ({ title, icon, disabled, trigger, id, popover = null }) => {
    //props.children = null;
    const popRef = useRef<HTMLIonCardElement>(null);
    const [mouseLeaveButton, setMouseLeaveButton] = useState<boolean>(true);
    const [mouseLeavePopover, setMouseLeavePopover] = useState<boolean>(true);

    const isVisible = () => {
        return (!mouseLeaveButton || !mouseLeavePopover) ? "visible" : "";
    }

    //<IonRow className="m-0 p-0 py-1 lh-1 ion-justify-content-center ion-align-items-center" >
    const showPopover = () => {
        if(popover === null || (!popover.text && !popover.input)) return <></>;
        
        return <IonCard className={`simples-popover p-0 m-0 ms-3 ${isVisible()} `}
                ref={popRef}
                onMouseLeave={(e) => setMouseLeavePopover(true)}
                onMouseEnter={(e) => setMouseLeavePopover(false)}
            >
                <IonRow className="glass simples-popover-content ion-align-items-center">
                    <IonLabel className="p-0 m-0 small" color="#" hidden={!popover.text}>
                        {popover.text}
                    </IonLabel>  
                    {popover.input ? popover.input : null}
                </IonRow>
            </IonCard>;
    }

    return (
        <>
        <button onClick={trigger} 
            id={id}
            color="#" 
            disabled={disabled}
            className="btn btn-primary glass p-0 m-0"
            onMouseLeave={(e) => setMouseLeaveButton(true)}
            onMouseEnter={(e) => setMouseLeaveButton(false)}
        >
            <IonRow className="m-0 p-0 ion-justify-content-center ion-align-items-center">
                <IonCol size='12' className="m-0 p-0">
                    <IonIcon icon={icon} color='light' style={{transform: 'translate(0px, 8px)'}} />
                </IonCol>
                <IonCol size='12' className="m-0 p-0">
                    <IonBadge color='#' className="bg-transparent text-center lh-1" >
                        <small className="text-white text-wrap fw-normal">
                            {title}
                        </small>
                    </IonBadge>
                </IonCol>
            </IonRow>
        </button>
        {showPopover()}
        </>
    );
};

export default ButtonLayout;

/*
 <IonFab slot="fixed" vertical="top" horizontal="end" className="ion-justify-content-end ion-align-items-start" style={{ right: '0%' }}>    
        <div className="p-0 m-0 mt-3"  >
        <div className="col-12 p-0 m-0">
            <IonGrid key={index} className="p-0 m-0">
                <IonRow className="ion-justify-content-center ion-align-items-start">
                    <IonCol size='12' className="p-0 m-0">
                        <IonFabButton className="p-0 ms-1 rounded rounded-circle" color="primary" style={{ transform: 'scale(0.8)' }} onClick={item.trigger} disabled={item.disable()}>
                            <IonIcon icon={item.icon} color="dark" size='large' />
                        </IonFabButton>
                    </IonCol>
                    <IonCol size="12" className="p-0 m-0">
                        <IonBadge color='primary' className="position-absolute w-100 text-center lh-1 p-0 m-0 " style={{ top: '-15px' }}>
                            <small className="text-dark text-wrap">{item.title}</small>
                        </IonBadge>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    </div>
</IonFab>
*/
