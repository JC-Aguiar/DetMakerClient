import {
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonIcon,
} from "@ionic/react";
import { UsuarioInterface } from "../data/UsuarioModel";
import { logoGoogle } from "ionicons/icons";

const Login = (props: any) => {
    const callBack = props.callBack;
    async function loginCallBack(novoUser: UsuarioInterface) {
        // console.log(`[Login] user: ${novoUser}`);
        callBack(novoUser);
    }
    return (
        <IonPage className="container">
            <IonCard target="_self" className="banner h-100 py-5">
                <IonCardHeader id="det-maker-login" className="pb-lg-5">
                    <IonCardTitle id="det-maker-big-logo">
                        <h1 className="card-title destaque lh-1 m-0 text-center">DET MAKER</h1>
                    </IonCardTitle>
                    <h4 className="py-2 h4 text-primary ms-2 text-center">
                        Entre com seu login para acessar os recursos da aplicação.
                    </h4>
                </IonCardHeader>
                <IonCardContent className="pt-5 pt-sm-0">
                    <IonFab className="login-btn" vertical="center" > {/*horizontal="center" vertical="center"*/}
                        <IonFabButton id="google">
                            <IonIcon icon={logoGoogle} color="white"></IonIcon>
                        </IonFabButton>
                    </IonFab>
                </IonCardContent>
                {
                    /*
                    <IonCardContent className="pt-5 mt-5 d-flex justify-content-center">
                        <button className="bg-primary rounded-circle p-5">
                                <IonIcon id="login-btn" icon={logoGoogle} className="fs-1" color="white"></IonIcon>
                        </button>
                    </IonCardContent>
                    */
                }

            </IonCard>
        </IonPage>
    );

}

export default Login;
