import { IonButton, IonIcon } from "@ionic/react";

export interface BotaoProps {
    icon?: string, 
    texto: string,  
    disabled?: boolean, 
    handler: () => void,
}

const Botao: React.FC<BotaoProps> = ({ icon=null, texto, disabled=false, handler }) => {

    const renderizarIcone = () => {
        if (!icon) return <></>;
        return <IonIcon icon={icon} size='large' style={{transform: 'translate(-5px, -1px) scale(1.0)'}} />
    }

    return (
        <IonButton className='glass border border-2 mx-2'  fill="clear" color='light' onClick={handler} disabled={disabled}>
            {renderizarIcone()}
            <div>{texto}</div> 
        </IonButton>
    );
}

export default Botao;

export const Botoes: React.FC<{botoes: BotaoProps[]}> = ({ botoes }) => {
    return <>
        {
            botoes.map((item, index) => <Botao key={index} icon={item.icon} texto={item.texto} handler={item.handler} />)
        }
    </>
}