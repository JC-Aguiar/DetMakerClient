import { IonAccordion, IonItem, IonFabButton, IonIcon, IonLabel, IonAccordionGroup, IonList, IonBadge } from "@ionic/react";
import { caretDownOutline } from "ionicons/icons";
import React, { HTMLAttributes, ReactNode } from "react";

export interface ListaRetratrilProps extends HTMLAttributes<HTMLIonAccordionElement> {
    title: string,
    icon?: string,
    content: JSX.Element, //ListaRetratrilItemProps[]
    glass?: boolean,
    arrow?: boolean,
}

export interface ListaRetratrilItemProps {
    texto: string,
    info?: string,
    botao?: JSX.Element, //React.ReactElement<typeof ???>;
}

const ListaRetratril: React.FC<ListaRetratrilProps> = ({ icon = '', glass = true, arrow = true, ...props}) => {
    //Atributos 
    const value = props.title
        .replace(new RegExp(' ', 'g'), '-')
        .toLowerCase();
    props.children = null;
    const iconRender = <IonIcon icon={icon} 
                        color='secondary' 
                        className='mx-1' 
                        //style={{ transform: 'translate(0, 0)' }} 
                        hidden={icon === ''}
                        size={arrow ? 'small' : 'large'}
                    />;
    const renderOrder: ReactNode[] = arrow ? [props.title, iconRender] : [iconRender, props.title];

    //Renderização do componente
    return (
        <IonAccordion {...props} value={value} className={`lista-navegacao ${glass? 'glass' : ''} my-1 ${props.className}`}>
            <IonItem slot="header" color="#" className='rounded rounded-0 text-white'>
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
    );

}

export default ListaRetratril;

export const ListaRetratrilAgrupada: React.FC<{listas: ListaRetratrilProps[]}> = ({ listas }) => {
    return <IonAccordionGroup multiple={true} className='px-2'>
        {
            listas.map(
                (item, index) => <ListaRetratril key={index} {...item} />
            )
        } 
    </IonAccordionGroup>;
}