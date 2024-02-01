import { IonRow, IonCol, IonIcon, IonProgressBar } from "@ionic/react";
import { alertCircleOutline, informationCircleOutline } from "ionicons/icons";
import React from "react";

export interface InformativoProps {
    icone?: string,
    mensagem?: string,
    status: 'SemDados' | 'Carregando' | 'Normal'
}

const Informativo: React.FC<InformativoProps> = ({icone = informationCircleOutline, mensagem = '', status = 'Normal'}) => {
    const loadingBar = status === 'Carregando' ? <IonProgressBar type="indeterminate" /> : <></>;
    
    const destaque = (texto: string) => <span className='m-0 px-1 border rounded rounded-3 h6 fw-bold'>{texto}</span>;
   
    if (status === 'SemDados') {
        icone = alertCircleOutline;
        mensagem = 'Nenhum registro disponível foi encontrado no banco\n'+ mensagem;
    }

    const textoFinal = mensagem.replaceAll("}", "{").split("{").map((item, index) => {
        if (index % 2 === 0) return <>{item}</>;
        return destaque(item);
    });

    return <IonRow className='mt-5 ion-justify-content-center ion-align-items-center' >
        <IonCol className='text-info text-center ion-align-items-center h5 opacity-50 lh-base fw-normal text-wrap'>
            <IonIcon icon={icone} color='secondary' size='large' className='mb-3 opacity-75' style={{transform: 'scale(2.5)' }} />
            <div><pre>{textoFinal}</pre></div>
            {loadingBar}
        </IonCol>
    </IonRow>;
}

export default Informativo;