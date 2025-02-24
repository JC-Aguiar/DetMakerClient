import { IonAccordion, IonItem, IonFabButton, IonIcon, IonAccordionGroup, IonList, IonChip, IonRow } from "@ionic/react";
import { addCircle, caretDownOutline } from "ionicons/icons";
import React, { HTMLAttributes, ReactNode } from "react";

export interface ListaRetratrilProps extends HTMLAttributes<HTMLIonAccordionElement> {
    title: string,
    icon?: string,
    content: JSX.Element,
    glass?: boolean,
    arrow?: boolean,
    buttons?: ListaRetratrilBotaoProps[],
}

export interface ListaRetratrilBotaoProps {
    text?: string,
    icon: string,
    className?: string,
    disabled?: boolean,
    handler?: () => void,
}

const ListaRetratril: React.FC<ListaRetratrilProps> = ({ icon = '', glass = true, arrow = true, ...props }) => {
    //Atributos 
    const value = props.title
        .replace(new RegExp(' ', 'g'), '-')
        .toLowerCase();
    
    props.children = null;
    
    const iconRender = <IonIcon icon={icon}
        color='secondary'
        className='mx-1'
        hidden={icon === ''}
        size={arrow ? 'small' : 'large'}
    />;

    const renderOrder: ReactNode[] = arrow ? [props.title, iconRender] : [iconRender, props.title];


    //Renderização do componente
    return (
        <IonRow className={` ${glass ? 'glass' : ''} ion-justify-content-end ion-align-items-start`}>
            <IonAccordion color="#" {...props} value={value} className={`bg-transparent my-1 ${props.className}`}>
                <IonItem slot="header" color="#" className='rounded rounded-0 text-white' lines="none">
                    <IonFabButton className="p-2 m-0" size='small' color='#' hidden={!arrow}>
                        <IonIcon icon={caretDownOutline} size='small' color="light" className="ion-accordion-toggle-icon" />
                    </IonFabButton>
                    {renderOrder}
                </IonItem>
                <div className="p-0 m-0" slot="content">
                    <div className='p-0 m-0'>
                        <IonList className={`m-0 p-0`}>
                            {props.content}
                        </IonList>
                    </div>
                </div>
            </IonAccordion>
            <IonRow className="position-absolute me-2 mt-2 pt-1" hidden={!props.buttons}>
                {
                    props.buttons?.map((button, index) => 
                        <IonChip 
                            key={index} 
                            color="light" 
                            className={`m-0 p-1 mx-1 item-lista ${button.className}`} 
                            disabled={button.disabled}
                            onClick={button.handler}
                        >
                            <IonIcon icon={button.icon} size="small"  className="p-0 m-0" />
                            <small hidden={!button.text} className="ms-1">{button.text}</small>
                        </IonChip>
                    )
                }
            </IonRow>
        </IonRow>
    );

}

export default ListaRetratril;

export interface ListaRetratrilAgrupadaProps {
    listas: ListaRetratrilProps[],
    disable?: boolean,
}
export const ListaRetratrilAgrupada: React.FC<ListaRetratrilAgrupadaProps> = ({ listas, disable = false }) => {
    return <IonAccordionGroup multiple={true} className='px-2' disabled={disable}>
        {
            listas.map((item, index) => 
                <div key={index} className="mb-2">
                    <ListaRetratril {...item} />
                </div>
            )
        }
    </IonAccordionGroup>;
}