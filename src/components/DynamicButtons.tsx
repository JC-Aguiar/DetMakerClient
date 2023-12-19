import { IonAvatar, IonBadge, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonRow, ToastButton } from "@ionic/react";
import { RootState } from '../Store/ReduxStore';
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";

export interface DynamicButtonsProps {
    avatar: JSX.Element
}

export interface DynamicButtonsAddsOn {
    title: string,
    icon: string,
    disable: () => boolean,
    trigger: () => void,
}

export function renderizarBotoes(botoes: DynamicButtonsAddsOn[]) { 
    return botoes.map((item, index) => 
            <IonGrid key={index} className="fixed-top p-0 m-0">
                <IonRow className="ion-justify-content-center ion-align-items-start">
                    <IonCol size='12' className="p-0 m-0">
                        <IonFabButton className="p-0 ms-1 all-border-gold rounded rounded-circle" color="dark" style={{ transform: 'scale(0.8)' }} onClick={item.trigger} disabled={item.disable()}>
                            <IonIcon icon={item.icon} color="light" size='large' />
                        </IonFabButton>
                    </IonCol>
                    <IonCol size="12" className="p-0 m-0">
                        <IonBadge color='' className="position-absolute bg-warning w-100 text-center lh-1 p-0 m-0 " style={{ top: '-15px' }}>
                            <small className="text-dark text-wrap">{item.title}</small>
                        </IonBadge>
                    </IonCol>
                </IonRow>
            </IonGrid>
    );
};

const DynamicButtons: React.FC<DynamicButtonsProps> = ({ avatar }) => {
    const botoes: DynamicButtonsAddsOn[] = useSelector((state: RootState) => state.store.buttons.value);
    //Acionamento nesta página sempre que os botões fore atualizados
    //useEffect(() => {
    //    //itensParaExecutar();
    //    setOnOff(botoes.map((item) => item.disable()));
    //    botoes.forEach((item) => console.log(`[BOTOES]: ${item.disable}.`));
    //    onOff.forEach((item) => console.log(`[ON-OFF]: ${item}.`));
    //}, [botoes]);
    
    function renderizarBotoes() { 
        return botoes.map((item, index) => 
            <IonGrid key={index} className="p-0 m-0">
                <IonRow className="ion-justify-content-center ion-align-items-start">
                    <IonCol size='12' className="p-0 m-0">
                        <IonFabButton className="p-0 ms-1 all-border-gold rounded rounded-circle" color="dark" style={{ transform: 'scale(0.8)' }} onClick={item.trigger} disabled={item.disable()}>
                            <IonIcon icon={item.icon} color="light" size='large' />
                        </IonFabButton>
                    </IonCol>
                    <IonCol size="12" className="p-0 m-0">
                        <IonBadge color='' className="position-absolute bg-warning w-100 text-center lh-1 p-0 m-0 " style={{ top: '-15px' }}>
                            <small className="text-dark text-wrap">{item.title}</small>
                        </IonBadge>
                    </IonCol>
                </IonRow>
            </IonGrid>
        );
    };

    return (
         <IonFab slot="fixed" vertical="top" horizontal="end" className="ion-justify-content-center ion-align-items-start">    
            <div className="p-0 m-0 mt-3 me-2" >
                <div className="col-12 p-0 m-0">{avatar}</div>
                <div className="col-12 p-0 m-0">{renderizarBotoes()}</div>
            </div>
        </IonFab>
    );
}

export default DynamicButtons;
