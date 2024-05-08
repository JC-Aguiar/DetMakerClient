import { IonAccordion, IonItem, IonFabButton, IonIcon, IonLabel, IonAccordionGroup, IonList, IonBadge } from "@ionic/react";
import { caretDownOutline } from "ionicons/icons";
import React from "react";

export interface ListaRetratrilProps {
    titulo: string,
    icon?: string,
    conteudo: JSX.Element //ListaRetratrilItemProps[]
}

export interface ListaRetratrilItemProps {
    texto: string,
    info?: string,
    botao?: JSX.Element, //React.ReactElement<typeof ???>;
}

const ListaRetratril: React.FC<ListaRetratrilProps> = ({ titulo, icon = null, conteudo}) => {
    //Atributos 
    const value = titulo
        .replace(new RegExp(' ', 'g'), '-')
        .toLowerCase();
    const renderizarIcone = icon !== null ? 
        <IonIcon icon={icon} color='light' className='ms-1' style={{ transform: 'translate(0, 3px)' }} /> : 
        <></>;

    const renderizarItem = (item: ListaRetratrilItemProps, color: string) => {
        const {texto, info, botao} = item;
        return <IonItem lines='none' color={color} className='p-0 m-0 text-white small' style={{ '--min-height': '32px' }}>
            {botao}
            <IonLabel className='p-0 m-0 text-wrap'>
                <span className='font-monospace text-white text-break'>{texto}</span>
                <IonBadge color='secondary'
                    className='ms-1 small fw-normal opacity-25'
                    style={{transform: 'translate(0px, 3px)'}}
                >
                    ID {info}
                </IonBadge>
            </IonLabel>
        </IonItem>
    }

    //Renderização do componente
    return (
        <IonAccordion value={value} className='lista-navegacao glass my-1'>
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
                    <IonList className='m-0 p-0'>
                        {conteudo}
                        {
                            /*
                            conteudo.map((item, index) => {
                                const color = index % 2 === 0 ? 'medium' : 'none';
                                return ( 
                                    <IonItem key={index} 
                                        lines='none' 
                                        color={color} 
                                        className='p-0 m-0 text-white small' 
                                        style={{ '--min-height': '32px' }}
                                    >
                                        {item.botao}
                                        <IonLabel className='p-0 m-0 text-wrap'>
                                            <span className='font-monospace text-white text-break'>{item.texto}</span>
                                            <IonBadge color='secondary'
                                                className='ms-1 small fw-normal opacity-25'
                                                style={{transform: 'translate(0px, 3px)'}}
                                            >
                                                ID {item.info}
                                            </IonBadge>
                                        </IonLabel>
                                    </IonItem>
                                );
                            })
                            */
                        }
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
                (item, index) => <ListaRetratril key={index} titulo={item.titulo} icon={item.icon} conteudo={item.conteudo} />
            )
        } 
    </IonAccordionGroup>;
}