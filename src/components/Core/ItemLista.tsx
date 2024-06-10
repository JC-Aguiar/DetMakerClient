import { IonItem, IonLabel, IonBadge, IonIcon } from "@ionic/react";
import { Children, HTMLAttributes, useState } from "react";

export interface ItemListaProps extends HTMLAttributes<HTMLIonItemElement>  {
    text: string | number;
    tag?: string | number;
    icon?: string;
    glass?: boolean;
    trigger?: () => void;
    innerPad?: 0 | 1 | 2 | 3 | 4 | 5
}

const ItemLista: React.FC<ItemListaProps> = ({ text, tag, glass = false, trigger = (() => null), ...props })  => {
    //Tenta renderiza o IonIcon se o atributo 'props.icon' foi definido
    const renderizarpropsIcone = () => {
        if (!props.icon) return <></>;
        return <IonIcon icon={props.icon} 
                color="primary" 
                className='pe-1' 
                style={{ transform: 'translate(-2px, 1px) scale(1.4)' }} 
            />;
    };

    const children = props.children;
    props.children = null;
    props.color = !props.color ? 'none' : props.color;
    props.innerPad = !props.innerPad ? 0 : props.innerPad;

    //Renderização do componente
    return (
        <IonItem lines='none'
            {...props}
            className={`item-lista text-white ion-align-items-center ${props.className + (glass ? ' glass' : '')} small`}
            style={{ '--min-height': '32px', cursor: 'pointer', display: 'block' }}
            onClick={trigger}
        >
            <IonLabel className={`d-flex ion-align-items-center bg-transparent border-0 p-0 m-0 text-start ps-${props.innerPad} h-100`} >
                <IonIcon icon={props.icon} 
                    className='ms-1 pe-1'
                    hidden={props.icon === undefined}
                />
                <span className='font-monospace text-wrap'>
                    {text}
                    <IonBadge color='secondary'
                        className='ms-1 small fw-normal lh-0 opacity-25'
                        style={{transform: 'translate(0px, 3px)'}}
                    > 
                        {tag} 
                    </IonBadge>
                </span>
                
            </IonLabel>
            {children}
        </IonItem>
    );

}

export default ItemLista; 