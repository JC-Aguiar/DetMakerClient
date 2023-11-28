import { IonAvatar, IonFab, IonFabButton, IonIcon, IonText } from "@ionic/react";
import { chevronUpCircle, personCircleOutline, personCircleSharp } from "ionicons/icons";
import { UserDTO } from "../data/UserDTO";

function loadAvatar(user: UserDTO) {
    if (user === null) return(<></>);

    let icon;
    if (user.picture !== "" && user.picture.length > 0) {
        icon = <IonAvatar slot="start">
            <img src={user.picture} alt="user avatar"  referrerPolicy="no-referrer"/>
        </IonAvatar>;
    }
    else {
        icon = <IonIcon
            slot="start"
            md={personCircleOutline}
            color="dark"
        />;
    }
    return (
        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="ion-justify-content-center me-2">
            <IonAvatar className="ms-0">
                <img src={user.picture} alt="user avatar"  referrerPolicy="no-referrer"/>
            </IonAvatar>
            <small className="text-center text-primary fw-bold">{user.name}</small>
        </IonFab>
    );
}

function Avatar(props: any) {
    return(loadAvatar(props.picture));
}

export default Avatar;
