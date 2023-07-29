import { componentOnReady } from "@ionic/core";
import { IonCol, IonContent, IonGrid, IonImg, IonLabel, IonPage, IonRow, IonText, } from "@ionic/react";
import React, { useEffect, Component } from "react";

const Intro = (props: any) => {
    const tempoAnimacao: number = 3;
    const callBack = props.callBack;

    async function animationEnd()  {
        callBack(true);
    }

    useEffect(() => {
        const logo = document.getElementById("logo")!;
        const animacaoProp = `intro-animation ${tempoAnimacao}s linear forwards`;
        logo!.style.setProperty("animation", animacaoProp);
        setTimeout(animationEnd, tempoAnimacao*1000);
    });

    return (
        <IonPage>
            <IonContent id="logo" />
            <IonContent id="intro-bg" />
        </IonPage>
    );
}

export default Intro;
