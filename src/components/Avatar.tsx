import { IonAvatar, IonBadge, IonIcon } from "@ionic/react";
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
        <div>         
            {/*<div className="banner rounded rounded-circle p-1">*/}
            <div className="d-flex justify-content-center">
                <IonAvatar className="ms-0 border border-white">
                    <img src={user.picture} alt="user avatar"  referrerPolicy="no-referrer"/>
                    <IonBadge className="position-absolute bg-transparent" style={{top: '-3%', right: '-3%'}}>
                        <IonIcon icon={close} 
                            color="#"
                            className="btn btn-info p-1 m-1 border rounded rounded-circle"
                            onClick={logOff}
                        />
                    </IonBadge>
                </IonAvatar>
            {/*</div>*/}
            </div>
            <p className="text-center text-primary fw-bold lh-1"><small>{user.name}</small></p>
            
        </div>
    );
}

export default Avatar;
