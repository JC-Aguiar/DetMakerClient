import { IonAccordion, IonItem, IonFabButton, IonIcon, IonLabel, IonAccordionGroup } from "@ionic/react";
import { caretDownOutline } from "ionicons/icons";
import React from "react";

export interface ListaRetratrilProps {
    titulo: string,
    icon?: string,
    conteudo: JSX.Element,
}

const ListaRetratril: React.FC<ListaRetratrilProps> = ({ titulo, icon = null, conteudo}) => {
    //Atributos 
    const value = titulo
        .replace(new RegExp(' ', 'g'), '-')
        .toLowerCase();
    const renderizarIcone = icon !== null ? 
        <IonIcon icon={icon} color='light' className='ms-1' style={{ transform: 'translate(0, 3px)' }} /> : 
        <></>;

    //Renderização do componente
    return (
        <IonAccordion value={value} className='lista-navegacao glass'>
            <IonItem slot="header" color="#" className='rounded rounded-0'>
                <IonFabButton className="p-2 m-0" size='small' color='#'>
                    <IonIcon icon={caretDownOutline} size='small' color="light" className="ion-accordion-toggle-icon" />
                </IonFabButton>
                <IonLabel className='d-flex ion-align-items-center ion-justify-content-between py-0 my-0'>
                    <span className='ms-1 text-white'>
                        {titulo}
                        {renderizarIcone}
                    </span>
                </IonLabel>
            </IonItem>
            <div className="p-0 m-0" slot="content">
                <div className='p-0 m-0'>
                    {conteudo}
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
                (item, index) => <ListaRetratril key={index} titulo={item.titulo} icon={item.icon} conteudo={item.conteudo} />
            )
        } 
    </IonAccordionGroup>;
}