import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonRow, IonText } from "@ionic/react";
import React, { useState } from "react";
import { TokenInterface, TokenModel } from "../data/TokenModel";
import UsuarioModel, { UsuarioInterface } from "../data/UsuarioModel";
import * as axiosRequest from "../data/AxiosRequest";
import { alertController } from "@ionic/core";
import { ErroModel } from "../data/ErroModel";

const LoginModal = (props: any) => {
    const [showModal, setShowModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userSenha, setUserSenha] = useState("");
    const [mensagemErro, SetMensagemErro] = useState("");
    const callBack = props.dataCallBack;

    async function exibirModal() {
        await document.getElementsByTagName("ion-modal").item(0)!.present();
    }

    async function esconderModal() {
        await document.getElementsByTagName("ion-modal").item(0)!.dismiss();
    }

    async function login() {
        const alert = await alertController.create({
            id: "login-loading",
            message: "Loading",
            buttons: [],
            backdropDismiss: false,
            translucent: true,
            keyboardClose: false,
        });
        try {
            await alert.present().then(esconderModal);
            //const response = await axiosRequest.login(userEmail, userSenha);
            //const token: TokenInterface = new TokenModel(response);
            //const user: UsuarioInterface = new UsuarioModel(token.usuario);
            //callBack(user);
        }
        catch (error) {
            await exibirModal();
            if (error instanceof ErroModel) {
                SetMensagemErro(error.mensagem.toString());
                const alerta = setTimeout(() => SetMensagemErro(""), 6000);
            }
            console.error(error);
        }
        finally {
            await alert.dismiss();
        }
    }

    return (
        <>
            <IonGrid>
                <IonRow className="justify-content-center">
                    <IonCol>
                        <IonButton
                            id="session-login-button"
                            fill="clear"
                            onClick={exibirModal}
                        >
                            <IonText className="session-buttons">Login</IonText>
                        </IonButton>
                    </IonCol>
                    <IonCol>
                        <IonButton fill="clear">
                            <IonText className="session-buttons">
                                Se Cadastre
                            </IonText>
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonModal
                id="modal-login"
                trigger="session-login-button"
                // isOpen={showModal}
                // onDidDismiss={() => setShowModal(false)}
                color="#"
            >
                <IonCard className="card-login">
                    <IonCardHeader className="ion-padding-bottom">
                        <IonCardTitle className="ion-text-center login-title">
                            <IonLabel color="#">
                                <strong>INICIANDO SESSÃO</strong>
                            </IonLabel>
                        </IonCardTitle>
                        <IonFab edge={true} vertical="top" horizontal="end">
                            <IonFabButton
                                className="close-icon"
                                color="#"
                                onClick={esconderModal}
                            >
                                <IonIcon icon="close" color="#"></IonIcon>
                            </IonFabButton>
                        </IonFab>
                    </IonCardHeader>
                    <IonCardContent className="ion-padding-horizontal">
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonItem className="login-item" color="#">
                                        <IonText
                                            color="medium"
                                            className="login-input"
                                        >
                                            E-mail
                                        </IonText>
                                        <IonInput
                                            value={userEmail}
                                            onIonChange={(e) => {
                                                setUserEmail(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value
                                                );
                                            }}
                                            className="login-input-field"
                                            autocomplete="email"
                                            color="primary"
                                            inputMode="email"
                                            name="email"
                                            pattern="email"
                                            required
                                        ></IonInput>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem className="login-item" color="#">
                                        <IonText
                                            color="medium"
                                            className="login-input"
                                        >
                                            Senha
                                        </IonText>

                                        <IonInput
                                            value={userSenha}
                                            onIonChange={(e) => {
                                                setUserSenha(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value
                                                );
                                            }}
                                            className="login-input-field"
                                            autocomplete="current-password"
                                            type="password"
                                            color="primary"
                                            name="password"
                                            pattern="password"
                                            required
                                        ></IonInput>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow className="ion-padding-top justify-content-center">
                                <IonCol sizeMd="5" size="12">
                                    <IonButton
                                        fill="outline"
                                        className="login-button"
                                        onClick={login}
                                    >
                                        ENTRAR
                                    </IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton
                                        fill="outline"
                                        className="login-button"
                                    >
                                        ESQUECI A SENHA
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                            <IonRow className="ion-no-padding">
                                <IonCol>
                                    <IonText id="erro-texto">{mensagemErro}</IonText>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
            </IonModal>
        </>
    );
}

export default LoginModal;
