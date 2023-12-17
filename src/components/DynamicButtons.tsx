import { IonAvatar, IonBadge, IonCol, IonFab, IonFabButton, IonIcon, IonRow, ToastButton } from "@ionic/react";
import { RootState } from '../Store/ReduxStore';
import { useSelector } from 'react-redux';

export interface DynamicButtonsProps {
    avatar: JSX.Element
}

export interface DynamicButtonsAddsOn {
    title: string,
    icon: string,
    trigger: () => void,
}

const DynamicButtons: React.FC<DynamicButtonsProps> = ({ avatar }) => {
    const botoes: DynamicButtonsAddsOn[] = useSelector((state: RootState) => state.store.buttons.value);
    function renderizarBotoes() { 
        return botoes.map((item, index) => 
            <IonCol key={index} className="">
                <div className="d-flex justify-content-center">  
                    <IonFabButton className="p-2">
                        <IonIcon icon={item.icon} color="#" onClick={item.trigger}  />
                    </IonFabButton>
                </div>
                <p className="text-center text-primary fw-bold lh-1"><small>{item.title}</small></p>
            </IonCol>
        );
    };

    return (
         <IonFab slot="fixed" vertical="top" horizontal="end" className="ion-justify-content-center">    
            <IonRow className="p-0 m-0" style={{transform: `translate(-0%, 80%)`}}>
                {renderizarBotoes()}{avatar}
            </IonRow>
        </IonFab>
    );
}

export default DynamicButtons;
