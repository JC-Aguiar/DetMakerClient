import { IonBadge, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, } from "@ionic/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { setJobs, viewJobs } from "../Store/Reducer/ReducerJobs";
import { JobInfoDTO } from "../data/JobInfoDTO";


const ListarJobs: React.FC = () => {
    const dispatch = useDispatch();
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.pilhaJobs.catalago);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.pilhaJobs.jobsSelecionados);
    const radioGroupIndex = jobsSelecionados.length === 1 ? jobsSelecionados[0] : -1;

    return (
        <IonRadioGroup value={radioGroupIndex}
            className='border-0 h-100'
            onIonChange={(e) => {
                console.log(`[LISTAR-JOBS]: Selecionado Job ID ${e.detail.value}`);
                dispatch(viewJobs([e.detail.value]));
            }}
        >
            <IonList className='m-0 p-0'>
                {
                    catalogoJobs//.filter((item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1)
                        .map((item, index) => {
                            const color = index % 2 === 0 ? 'bg-white' : 'bg-light';
                            return (
                                <IonItem key={index} lines='none'
                                    className={`p-0 m-0 ${color} ion-align-items-top text-primary small`}
                                    style={{ '--min-height': '32px' }}
                                >
                                    <IonLabel className='p-0 m-0 '>
                                        <span className='text-primary'>{item.nome}</span>
                                        <IonBadge color='secondary'
                                            className='ms-1 small fw-normal text-dark'
                                        >
                                            ID {item.id}
                                        </IonBadge>
                                    </IonLabel>
                                    <IonRadio color='primary'
                                        slot="start"
                                        value={item.id}
                                        className='p-0 m-0 me-1'
                                        style={{ height: '16px', width: '17px', }}
                                    />
                                </IonItem>
                            );
                        })
                }
            </IonList>
        </IonRadioGroup>
    );
};

export default ListarJobs;