import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonImg, IonLabel, IonRow, IonThumbnail, useIonViewDidEnter } from "@ionic/react";
import React, { useEffect, useState } from "react";
import FilmeModel from "./FilmeModel";

const GaleriaFilmes = (props: any) => {
    const filme = new FilmeModel(
        props.conteudo.id,
        props.conteudo.titulo,
        props.conteudo.sinopse,
        props.conteudo.generos,
        props.conteudo.dataLancamento,
        props.conteudo.diretores,
        props.conteudo.produtores,
        props.conteudo.atores,
        props.conteudo.classificação,
        props.conteudo.logo,
        props.conteudo.capas,
        props.conteudo.font,
        props.conteudo.epoca,
        props.conteudo.roteiro,
        props.conteudo.estetica,
        props.conteudo.vizualizações,
        props.conteudo.votos,
        props.conteudo.avaliação,
        props.conteudo.duração,
        props.conteudo.tempoAtual,
        props.conteudo.filme
    );
    const [capaSlide, setCapaSlide] = useState(filme.capas[0]);

    return (
        <IonCard id="card-filme" target="_self">
            <IonCardHeader id="filme-texto">
                <IonCardTitle id="filme-title" style={{ fontFamily: filme.font }}>
                    {filme.titulo}
                </IonCardTitle>
                <IonCardSubtitle>
                    {filme.generos.map((genero, index) => {
                        return genero + "\u00A0\u00A0\u00A0";
                    })}
                </IonCardSubtitle>
            </IonCardHeader>
            <IonThumbnail>
                <IonImg id="filme-capa" src={capaSlide} />
            </IonThumbnail>
        </IonCard>
    );
};

export default GaleriaFilmes;
