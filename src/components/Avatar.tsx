import { IonAvatar, IonIcon } from "@ionic/react";
import { personCircleOutline, personCircleSharp } from "ionicons/icons";
import React from "react";

/* TODO "IMG-VALID"
 * MÉTODO PARA VALIDAÇÀO DE IMAGENS
 * 1) FETCH NA URL
 * 2) CONFERIR O FORMATO E O TAMANHO DENTRO DOS PADRÕES
 * 3) SE FORA DOS PADÕES, AVATAR GENÊRICO É COLOCADO
 */


function loadAvatar(picture: string) {
    if (picture !== null && picture !== "") {
        return (
            <IonAvatar slot="start" id="avatar">
                <img src={picture} alt="user avatar" />
            </IonAvatar>
        );
    }
    return (
        <IonIcon
            id="avatar"
            slot="start"
            md={personCircleOutline}
            ios={personCircleSharp}
            color="dark"
        />
    );
}

function Avatar(props: any) {
    return(loadAvatar(props.picture));
}

export default Avatar;
