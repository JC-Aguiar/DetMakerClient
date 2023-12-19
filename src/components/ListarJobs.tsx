import { IonBadge, IonCheckbox, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, } from "@ionic/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { addViewJobs, removeViewJobs, setJobs, setViewJobs } from "../Store/Reducer/ReducerJobs";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { setMainPipeline } from "../Store/Reducer/ReducerAtividade";


const ListarJobs: React.FC = () => {
    const dispatch = useDispatch();
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.catalogoJobs.jobsSelecionados);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const radioGroupIndex = jobsSelecionados.length === 1 ? jobsSelecionados[0] : -1;

    function isOn(jobId: number): boolean | undefined {
        return jobsSelecionados.findIndex((id) => id === jobId) !== -1; 
    }

    return (
        <IonList className='m-0 p-0'>
        {
            catalogoJobs//.filter((item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1)
                .map((item, index) => {
                    const color = index % 2 === 0 ? 'bg-white' : 'bg-light';
                    return (
                        <IonItem key={index} lines='none'
                            className={`p-0 m-0 ${color}  text-primary small`}
                            style={{ '--min-height': '32px' }}
                        >
                            <IonCheckbox color='primary'
                                slot="start"
                                checked={isOn(item.id)}
                                value={isOn(item.id) ? 'on' : 'off'}
                                className='p-0 m-0 me-1 border border-primary rounded rounded-2'
                                style={{ height: '16px', width: '17px', }}
                                onClick={(e) => {
                                    const on = !isOn(item.id);
                                    //console.log(`Job ID ${item.id}: ${on ? 'on' : 'off'}.`);
                                    if (on) dispatch(addViewJobs(item.id));
                                    else dispatch(removeViewJobs(item.id));
                                    if (mainPipeline !== "") dispatch(setMainPipeline({ nome: "", jobs: [] }));
                                }}
                            />
                            <IonLabel className='p-0 m-0 text-wrap'>
                                <span className='text-primary text-break'>{item.nome}</span>
                                <IonBadge color='secondary'
                                    className='ms-1 small fw-normal text-dark'
                                >
                                    ID {item.id}
                                </IonBadge>
                            </IonLabel>
                        </IonItem>
                    );
                })
        }
        </IonList>
    );
};

export default ListarJobs;