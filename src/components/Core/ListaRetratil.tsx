import { IonAccordion, IonItem, IonFabButton, IonIcon, IonLabel, IonAccordionGroup, IonList, IonBadge } from "@ionic/react";
import { caretDownOutline } from "ionicons/icons";
import React, { HTMLAttributes } from "react";

export interface ListaRetratrilProps extends HTMLAttributes<HTMLIonAccordionElement> {
    title: string,
    icon?: string,
    content: JSX.Element, //ListaRetratrilItemProps[]
    glass?: boolean,
}

export interface ListaRetratrilItemProps {
    texto: string,
    info?: string,
    botao?: JSX.Element, //React.ReactElement<typeof ???>;
}

const ListaRetratril: React.FC<ListaRetratrilProps> = ({ title, icon = null, content, glass = true, ...props}) => {
    //Atributos 
    const value = title
        .replace(new RegExp(' ', 'g'), '-')
        .toLowerCase();
    const renderizarIcone = icon !== null ? 
        <IonIcon icon={icon} color='light' className='ms-1' style={{ transform: 'translate(0, 3px)' }} /> : 
        <></>;

    props.children = null;

    //Renderização do componente
    return (
        <IonAccordion {...props} value={value} className={`lista-navegacao ${glass? 'glass' : ''} my-1 ${props.className}`}>
            <IonItem slot="header" color="#" className='rounded rounded-0'>
                <IonFabButton className="p-2 m-0" size='small' color='#'>
                    <IonIcon icon={caretDownOutline} size='small' color="light" className="ion-accordion-toggle-icon" />
                </IonFabButton>
                <IonLabel className='d-flex ion-align-items-center ion-justify-content-between py-0 my-0'>
                    <span className='ms-1 text-white'>
                        {title}
                        {renderizarIcone}
                    </span>
                </IonLabel>
            </IonItem>
            <div className="p-0 m-0" slot="content">
                <div className='p-0 m-0'>
                    <IonList className={`m-0 p-0`}>
                        {content}
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
                (item, index) => <ListaRetratril key={index} title={item.title} icon={item.icon} content={item.content} />
            )
        } 
    </IonAccordionGroup>;
}