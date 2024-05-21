import { IonAvatar, IonBadge, IonCol, IonFab, IonGrid, IonIcon, IonRow, useIonModal, useIonToast } from "@ionic/react";
import { close, } from "ionicons/icons";
import { UserDTO } from "../../data/UserDTO";
import { useDispatch, useSelector } from "react-redux";
import { setJwt, setUser } from '../../Store/Reducer/ReducerUser';
import { RootState } from "../../Store/ReduxStore";
import { useHistory } from "react-router";
import { URL_LOGIN } from "../../data/AxiosRequest";
import { useEffect } from "react";
import DynamicModal from "./DynamicModal";
import ModalNotificacoes from "../Modals/ModalNotificacoes";
import { AtividadeMensagemTYPE } from "../../Store/Reducer/ReducerAtividade";
//import { show, hide } from '../Store/Reducer/ReducerTabMenu';

interface AvatarProps {
    user: UserDTO | null
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [toast, toastOff] = useIonToast();
    const [modalMensagens, modalMensagensOff] = useIonModal(DynamicModal,
        {
            titulo: "Histórico de Ações",
            elemento: <ModalNotificacoes />,
            onDismiss: () => modalMensagensOff()
        }
    );

    const mainCliente: string = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const mainAmbiente: string = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);
    const mensagens: AtividadeMensagemTYPE[] = useSelector((state: RootState) => state.store.configAtividade.mensagens);

    const closeToast = {
      text: 'x',
      role: 'Close',
      handler: () => toastOff(),
    };

    //Acionamento caso haja atualização nas mensagens
    useEffect(() => {
        if (mensagens.length < 1) return;

        toastOff().then(() => toast({
            message: mensagens[0].texto,
            duration: 5000,
            position: 'bottom',
            color: corDoStatus(mensagens[0].status),
            buttons: [closeToast],
        }));
    }, [mensagens]);

    function corDoStatus(status: string) {
        switch(status) {
            case "OK": return 'success';
            case "ERROR": return 'warning';
            default: return 'secondary';
        }
    }

    const logOff = () => {
        //dispatch(show());
        dispatch(setJwt(null));
        dispatch(setUser(null));
        history.push(URL_LOGIN);
    }

    const ambiente = () => {
        if (mainAmbiente === '') return <></>;
        //<IonCol size="12" className="p-0 m-0">
        return <IonBadge color="primary" className="position-absolute w-100 text-center lh-1 p-0 m-0 " style={{right: '49px', top: '18px'}}>
            <small className="text-dark text-wrap">{mainCliente}<br/>{mainAmbiente}</small>
        </IonBadge>
    };

    //Renderização do componente
    if (user === null) return(<></>);
    return (
        <IonFab slot="fixed" vertical="top" horizontal="end" className="ion-justify-content-end ion-align-items-start" style={{ right: '18px', top: '-18px' }}>    
            <div className="p-0 m-0 mt-3"  >
                <IonGrid className="p-0 m-0">
                    <IonRow className="p-0 m-0 ion-justify-content-start">
                        <IonCol size="12" className="p-0 m-0">
                            {ambiente()}
                            <IonAvatar className="p-0 m-0 border border-4 border-primary" 
                                style={{ transform: 'scale(0.8)', cursor: 'pointer' }}
                                onClick={() => modalMensagens({ cssClass: 'modal-notificacoes' })}
                            >
                                <img src={user.picture} alt="user avatar"  referrerPolicy="no-referrer" />
                                <IonBadge color='#' 
                                    className="position-absolute bg-transparent" 
                                    style={{top: '-10%', right: '-38%'}}
                                >
                                    <IonIcon icon={close} 
                                        color="dark"
                                        className="btn p-1 m-1 bg-primary border-0 rounded rounded-circle"
                                        onClick={logOff}
                                    />
                                </IonBadge>
                            </IonAvatar>
                        </IonCol>
                        <IonCol size="12" className="p-0 m-0">
                            <IonBadge color="primary" className="position-absolute w-100 text-center lh-1 p-0 m-0 " style={{top: '-15px'}}>
                                <small className="text-dark text-wrap">{user.name}</small>
                            </IonBadge>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>
        </IonFab>
    );
}

export default Avatar;
