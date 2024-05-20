import { IonBadge, IonButton, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonRow } from "@ionic/react";

export interface ButtonLayoutProps {
    title: string,
    icon: string,
    disable: boolean,
    trigger: () => void,
}

export const layoutGrupoBotoes = (grupo: ButtonLayoutProps[]) => {
    return (
        <IonFab slot="fixed" 
            vertical="top" 
            horizontal="start" 
            className="ion-justify-content-center ion-align-items-center glass"
            style={{ backgroundColor: 'var(--ion-color-tertiary)', position: 'fixed' }}
        >
            <div className="glass-content" >
                {
                    grupo.map((item, index) => 
                        <IonRow className="m-0 p-1 ion-justify-content-center ion-align-items-center">
                            <ButtonLayout key={index} 
                                title={item.title} 
                                icon={item.icon} 
                                disable={item.disable} 
                                trigger={item.trigger} 
                            />
                        </IonRow>
                    )
                }
            </div>
        </IonFab>
    );
};

const ButtonLayout: React.FC<ButtonLayoutProps> = ({ title, icon, disable, trigger }) => {
    return (
        <button onClick={trigger} 
            color="#" 
            disabled={disable}
            className="btn btn-primary glass"
            style={{width: '64px'}}
        >
            <IonRow className="m-0 p-0 ion-justify-content-center ion-align-items-center">
                <IonCol size='12' className="m-0 p-0">
                    <IonIcon icon={icon} color='light' style={{transform: 'translate(0px, 8px)'}} />
                </IonCol>
                <IonCol size='12' className="m-0 p-0">
                    <IonBadge color='#' className="bg-transparent text-center lh-1" >
                        <small className="text-white text-wrap fw-normal">
                            {title}
                        </small>
                    </IonBadge>
                </IonCol>
            </IonRow>
        </button>
    );
};

export default ButtonLayout;

/*
 <IonFab slot="fixed" vertical="top" horizontal="end" className="ion-justify-content-end ion-align-items-start" style={{ right: '0%' }}>    
        <div className="p-0 m-0 mt-3"  >
        <div className="col-12 p-0 m-0">
            <IonGrid key={index} className="p-0 m-0">
                <IonRow className="ion-justify-content-center ion-align-items-start">
                    <IonCol size='12' className="p-0 m-0">
                        <IonFabButton className="p-0 ms-1 rounded rounded-circle" color="primary" style={{ transform: 'scale(0.8)' }} onClick={item.trigger} disabled={item.disable()}>
                            <IonIcon icon={item.icon} color="dark" size='large' />
                        </IonFabButton>
                    </IonCol>
                    <IonCol size="12" className="p-0 m-0">
                        <IonBadge color='primary' className="position-absolute w-100 text-center lh-1 p-0 m-0 " style={{ top: '-15px' }}>
                            <small className="text-dark text-wrap">{item.title}</small>
                        </IonBadge>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    </div>
</IonFab>
*/
