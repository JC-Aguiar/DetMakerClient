import { IonItem, IonLabel, IonBadge, IonIcon } from "@ionic/react";
import { Children } from "react";

export interface ItemListaProps {
    children?: React.ReactNode;
    texto: string | number;
    tag?: string | number;
    icone?: string;
    cor?: string;
    trigger?: () => void;
}

const ItemLista: React.FC<ItemListaProps> = ({ children, texto, tag, icone, cor = 'none', trigger = (() => null) })  => {
    //Tenta renderiza o IonIcon se o atributo 'icone' foi definido
    const renderizarIcone = () => {
        if (!icone) return <></>;
        return <IonIcon icon={icone} 
                color="primary" 
                className='pe-1' 
                style={{ transform: 'translate(-2px, 1px) scale(1.4)' }} 
            />;
    };

    const renderizarChildren = Children.toArray(children);

    //Renderização do componente
    return (
        <IonItem lines='none'
            color={cor}
            className='p-0 m-0 ion-align-items-center text-white small'
            style={{ '--min-height': '32px' }}
        >
            <IonLabel className='btn bg-transparent border-0 p-0 m-0 text-start' onClick={trigger}>
                <span className="ms-1">{renderizarIcone()}</span>
                <span className='font-monospace text-white text-break'>{texto}</span>
                <IonBadge color='secondary'
                    className='ms-1 small fw-normal opacity-25'
                    style={{transform: 'translate(0px, 3px)'}}
                > 
                    {tag} 
                </IonBadge>
            </IonLabel>
            {children}
        </IonItem>
    );

}

export default ItemLista; 