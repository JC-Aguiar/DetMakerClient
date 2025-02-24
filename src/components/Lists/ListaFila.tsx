import { IonIcon, IonBadge, IonCard, IonCardContent, IonRow, IonFab, IonLabel, } from "@ionic/react";
import { calendarOutline, layers, ticket, personCircle, flash, timer } from "ionicons/icons";
import { useDispatch } from "react-redux";
import { FilaResumoDTO } from "../../data/FilaResumoDTO";
import { offsetDateTimeParaString } from "../../App";

//Atributos de entrada do componente ListaFilas
export interface ListaFilasProps {
    fila: FilaResumoDTO,
    index: number,
}

const ListaFilas: React.FC<ListaFilasProps> = ({ fila: fila, index }) => { 
    //Atributos do componente
    const dispatch = useDispatch();
    const fonteCodigo = 'h6 lh-1 font-monospace text-white ';

    //Renderiza o componente
    return (
        <IonRow className="ion-align-items-center p-2 px-4 ">
            <div className="glass d-flex w-100 glass-content ion-align-items-center">
                <IonFab slot="fixed" 
                    vertical="top" 
                    horizontal="start" 
                    edge
                >
                    <IonBadge color="primary" 
                        className="text-center" 
                        style={{ transform: 'translate(-11px, 27px)', minWidth: '24px' }}
                    >
                        <small>Nº {index+1}</small>
                    </IonBadge>
                </IonFab>
                <IonRow className="p-0 m-0 ms-3 ion-justify-content-center ">
                    <IonLabel className="text-center w-100 pe-2" color={fila.status === "EXECUTANDO" ? 'warning' : 'primary'}>
                        <IonIcon icon={fila.status === "EXECUTANDO" ? flash : timer} 
                            color={fila.status === "EXECUTANDO" ? 'warning' : 'primary'} 
                            size="large"
                            className="w-100" 
                            style={{transform: 'translate(0px, 3px)'}} 
                        />
                        {fila.status === "EXECUTANDO" ? 'Running' : 'Waiting'}
                    </IonLabel>
                </IonRow>
                <IonCard className="ms-0 mb-0 w-100 bg-transparent border-0" style={{boxShadow: '0 0 0 '}}>
                    <IonCardContent className='p-0 m-0'>
                        <div className={fonteCodigo}>
                            {/*
                            <div className="">
                                <IonIcon icon={flag} color="light" className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
                                {relatorio.nomeAtividade}
                            </div>
                            */}
                            <IonBadge className="m-0 p-0 text-start h6" color="none">
                                <div>
                                    <IonIcon icon={ticket} color="light"/> Ticket {fila.ticket}
                                </div>
                                <div>
                                    <IonIcon icon={personCircle} color="light"/> {fila.autor} <span className="mx-1" /> 
                                    <IonIcon icon={calendarOutline} color="light"/> {offsetDateTimeParaString(fila.data)}
                                </div>
                                <div>
                                    <IonIcon icon={layers} color="light"/> Pipeline {fila.nomePipeline}
                                </div>
                            </IonBadge>
                        </div>
                    </IonCardContent>
                </IonCard>
            </div>
        </IonRow>
    );
}

export default ListaFilas;