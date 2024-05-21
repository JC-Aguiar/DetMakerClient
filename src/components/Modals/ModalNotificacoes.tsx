import { IonIcon, IonRow, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonBadge } from "@ionic/react";
import { alertCircle, checkmarkCircle, informationCircle } from "ionicons/icons";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../Store/ReduxStore";
import { dataParaString, offsetDateTimeParaString } from "../../App";
import { AtividadeMensagemTYPE } from "../../Store/Reducer/ReducerAtividade";

const ModalNotificacoes: React.FC = () => {
    //Atrbiutos para usar recursos Redux e React
    const dispatch = useDispatch();

    //Atibutos de estado gerenciados via Redux
    const mensagens: AtividadeMensagemTYPE[] = useSelector((state: RootState) => state.store.configAtividade.mensagens);

    //Retorna o nome do ícone a ser renderiza para determinado status
    const iconeDoStatus = (status: string): string => {
        switch(status) {
            case "OK": return checkmarkCircle;
            case "ERROR": return alertCircle;
            default: return informationCircle;
        }
    }

    //Retorna o nome da cor a ser renderiza para determinado status
    const corDoStatus = (status: string): string => {
        switch(status) {
            case "OK": return 'success';
            case "ERROR": return 'warning';
            default: return 'secondary';
        }
    }

    //Renderização do componente
    return <>
        <div className="container justify-content-center mt-1 px-5">
                <div className='text-center text-white py-1 mt-2 mb-4 lh-1'>
                    <small className="opacity-75">
                        Lista das mensagens, avisos e erros durante seu uso na aplicação.<br/>
                        Mensagens: {mensagens.length}/50
                    </small>
                </div>
                <div className='text-primary'>
                    {
                        mensagens.map((item, index) => {
                            const nome = item.id.split("@")[0]?.replace(/_/g, " ");
                            const timestamp = parseInt(item.id.split("@")[1], 10);
                            const data = new Date(timestamp);
                            const cor = corDoStatus(item.status);
                            return (
                                //ion-align-items-center
                                <IonCard key={index} className="glass m-1 p-1 ps-5" style={{ borderColor: `var(--ion-color-${cor})` }} >                           
                                    <IonIcon icon={iconeDoStatus(item.status)} 
                                        className="" 
                                        size="large"
                                        color={cor}
                                        style={{ 
                                            position: 'absolute', 
                                            top: '50%', 
                                            left: '8px',
                                            transform: 'translate(0, -50%)'
                                    }} />
                                    <IonCardContent className="p-0 m-0 small ion-justify-content-beetwen">
                                        {dataParaString(data)} - {nome} - {item.alvo}
                                    </IonCardContent>
                                    <IonCardHeader className="p-0 m-0" >
                                        <IonCardTitle>{item.texto}</IonCardTitle>
                                    </IonCardHeader>
                                </IonCard>
                            );
                        })
                    }
                </div>
        </div>
    </>
}

export default ModalNotificacoes;