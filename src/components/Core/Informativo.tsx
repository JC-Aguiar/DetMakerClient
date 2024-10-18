import { IonRow, IonCol, IonIcon, IonProgressBar } from "@ionic/react";
import { alertCircleOutline, bug, hourglass, informationCircleOutline } from "ionicons/icons";
import React from "react";

export interface InformativoProps {
    icone?: string,
    mensagem?: string,
    status: 'SemDados' | 'Carregando' | 'Normal' | 'Erro'
}

const Informativo: React.FC<InformativoProps> = ({icone, mensagem = '', status = 'Normal'}) => {

    switch (status) {
        case "SemDados":
            icone = alertCircleOutline;
            mensagem = 'Nenhum registro disponível foi encontrado no banco\n'+ mensagem;
            break;
        case "Carregando":
            icone = hourglass;
            mensagem = 'Processando\n'+mensagem;
            break;
        case "Normal":
            icone = informationCircleOutline;
            break;
        case "Erro":
            icone = bug;
            mensagem = 'Erro inesperado!\n'+mensagem;
            break;
    }

    const textoFinal = mensagem?.replaceAll("}", "{")
        .split("{")
        .map((item, index) => {
            if (index % 2 === 0) return <span key={index}>{item}</span>;
            return <span key={index} className='m-0 px-1 border rounded rounded-3 h6 fw-bold'>{item}</span>;
        });

    return <IonRow className='mt-5 ion-justify-content-center ion-align-items-center' >
        <IonCol className='text-info text-center ion-align-items-center h5 opacity-50 lh-base fw-normal text-wrap'>
            <IonIcon icon={icone} color='secondary' size='large' className='mb-3 opacity-75' style={{transform: 'scale(2.5)' }} />
            <div><pre>{textoFinal}</pre></div>
            <IonProgressBar type="indeterminate" hidden={status !== 'Carregando'} />
        </IonCol>
    </IonRow>;
}

export default Informativo;