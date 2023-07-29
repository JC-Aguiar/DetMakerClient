import {
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonPage,
} from "@ionic/react";
import Avatar from "./Avatar";
import LoginModal from "./LoginModal";
import { UsuarioInterface } from "./UsuarioModel";

const Login = (props: any) => {
    const callBack = props.callBack;
    async function loginCallBack(novoUser: UsuarioInterface) {
        // console.log(`[Login] user: ${novoUser}`);
        callBack(novoUser);
    }
    return (
        <IonPage>
            <IonGrid className="menu-login">
                <IonRow className="ion-text-center">
                    <IonCol className="welcome">
                        <IonLabel>Bem vindo visitante</IonLabel>    
                    </IonCol>
                    <IonCol>
                        <LoginModal dataCallBack={loginCallBack} />
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );

}

export default Login;
