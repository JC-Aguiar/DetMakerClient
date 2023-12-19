import { IonAvatar, IonBadge, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { close, } from "ionicons/icons";
import { UserDTO } from "../data/UserDTO";
import { useDispatch } from "react-redux";
import { setJwt, setUser } from '../Store/Reducer/ReducerUser';
import { show, hide } from '../Store/Reducer/ReducerTabMenu';

interface AvatarProps {
    user: UserDTO | null
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
    const dispatch = useDispatch();

    if (user === null) return(<></>);

    const logOff = () => {
        dispatch(show());
        dispatch(setJwt(null));
        dispatch(setUser(null));
    }

    return (
        <IonGrid className="p-0 m-0">
            <IonRow className="p-0 m-0 ion-justify-content-center">
                <IonCol size="12" className="p-0 m-0">
                    <IonAvatar className="p-0 m-0 all-border-gold" style={{transform: 'scale(0.8)'}}>
                        <img src={user.picture} alt="user avatar"  referrerPolicy="no-referrer" />
                        <IonBadge className="position-absolute bg-transparent" style={{top: '-10%', right: '-33%'}}>
                            <IonIcon icon={close} 
                                color="#"
                                className="btn p-1 m-1 border-0 rounded rounded-circle"
                                style={{backgroundColor: 'var(--ion-color-warning)'}}
                                onClick={logOff}
                            />
                        </IonBadge>
                    </IonAvatar>
                </IonCol>
                <IonCol size="12" className="p-0 m-0">
                    <IonBadge className="position-absolute bg-warning w-100 text-center lh-1 p-0 m-0 " style={{top: '-15px'}}>
                        <small className="text-dark text-wrap">{user.name}</small>
                    </IonBadge>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
}

export default Avatar;
