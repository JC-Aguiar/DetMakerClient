import { IonCol, IonGrid, IonLabel, IonListHeader, IonNote, IonRow } from "@ionic/react";
import React from "react";
import Avatar from "./Avatar";
import { UsuarioInterface } from "./UsuarioModel";

function User(props: any) {
    const user: UsuarioInterface = props.userLogin;
    return (
        <>
            <Avatar picture={user.foto} />
            <IonGrid>
                <IonRow className="ion-padding-start">
                    <IonCol>
                        <IonLabel>
                            <IonListHeader className="user-name">{user.nome}</IonListHeader>
                            <IonNote>{user.email}</IonNote>
                        </IonLabel>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </>
    );
}

export default User;


