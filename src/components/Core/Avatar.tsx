import { IonAvatar, IonBadge, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonRow, useIonModal, useIonToast } from "@ionic/react";
import { close, logOut, logOutOutline, } from "ionicons/icons";
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

//Interface dos parâmetros de entrada do componente <Avatar>
interface AvatarProps {
    user: UserDTO | null
}

//Componente <Avatar>
const Avatar: React.FC<AvatarProps> = ({ user }) => {
    //Atributos gerenciados pelo componente 
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
    //Atributos com estado gerenciado via Redux
    const mainCliente: string = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const mainAmbiente: string = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);
    const mensagens: AtividadeMensagemTYPE[] = useSelector((state: RootState) => state.store.configAtividade.mensagens);

    //Atributos do botão 'close' (X) nos IonToasts de notificação 
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

    //Identifica a cor do IonToast com base no status
    function corDoStatus(status: string) {
        switch(status) {
            case "OK": return 'success';
            case "ERROR": return 'warning';
            default: return 'secondary';
        }
    }

    //Realiza logoff do usuário na aplicação
    const logOff = () => {
        //dispatch(show());
        dispatch(setJwt(null));
        dispatch(setUser(null));
        history.push(URL_LOGIN);
    }

    //Renderização do componente
    if (user === null) return(<></>);
    return (
        <IonFab slot="fixed" vertical="top" horizontal="end" className="ion-justify-content-end ion-align-items-start" style={{ right: '18px', top: '-18px' }}>    
            <div className="p-0 m-0 mt-3"  >
                <IonGrid className="p-0 m-0">
                    <IonRow className="p-0 m-0 ion-justify-content-start">
                        <IonCol size="12" className="p-0 m-0">
                            <IonBadge 
                                color="primary" 
                                className="position-absolute w-100 text-center lh-1 p-0 m-0 " 
                                style={{right: '49px', top: '18px'}}
                                hidden={mainAmbiente === ''}
                            >
                                <small className="text-dark text-wrap">
                                    {mainCliente}
                                    <br/>
                                    {mainAmbiente}
                                </small>
                            </IonBadge>
                            <IonAvatar className="p-0 m-0" 
                                style={{ transform: 'scale(0.9)', cursor: 'pointer', border: "4px solid var(--ion-color-primary)" }}
                                onClick={() => modalMensagens({ cssClass: 'modal-notificacoes' })}
                            >
                                <img src={user.picture} alt="user avatar"  referrerPolicy="no-referrer" />
                               
                                {/* Botão para deslogar */}
                                <IonFabButton
                                    size="small"
                                    color="primary"
                                    className="position-absolute bg-transparent m-0 p-0" 
                                    style={{top: '-16%', right: '-48%', transform: 'scale(0.8)' }}
                                    onClick={() => logOff()}
                                >
                                    <IonIcon icon={logOutOutline}
                                        color="dark"
                                        size="large"
                                        className="m-0 p-0"
                                    />
                                </IonFabButton>
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
