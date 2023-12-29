import { IonBadge, IonButton, IonCheckbox, IonIcon, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, } from "@ionic/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { addViewJobs, removeViewJobs, setJobs, setViewJobs } from "../Store/Reducer/ReducerJobs";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { setMainJobs, setMainPipeline } from "../Store/Reducer/ReducerAtividade";
import { addCircle } from "ionicons/icons";
import { JobConfig, parseJobInfo } from "../data/JobConfigDTO";


const ListarJobs: React.FC = () => {
    const dispatch = useDispatch();
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.catalogoJobs.jobsSelecionados);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const radioGroupIndex = jobsSelecionados.length === 1 ? jobsSelecionados[0] : -1;

    function isOn(jobId: number): boolean | undefined {
        return jobsSelecionados.findIndex((id) => id === jobId) !== -1; 
    }

    const seletor = (item: JobInfoDTO): JSX.Element => {

        if (mainPipeline !== "") {
            return <IonBadge color="#" className="p-0 m-0 btn bg-transparent" onClick={(e) => {
               const novoJobConfig: JobConfig =  parseJobInfo(item, mainJobs.length);
               dispatch(setMainJobs([...mainJobs, novoJobConfig]));
            }}>
                <IonIcon icon={addCircle} color="primary" className='pe-1' style={{ transform: 'scale(1.2) translate(0.25px, 1.75px)' }}/>
            </IonBadge>
        }

        return (
            <IonCheckbox color='primary'
                slot="start"
                checked={isOn(item.id)}
                value={isOn(item.id) ? 'on' : 'off'}
                className='p-0 m-0 me-1 border border-primary rounded rounded-2'
                style={{ height: '16px', width: '17px', }}
                onClick={(e) => {
                    const on = !isOn(item.id);
                    if (on) dispatch(addViewJobs(item.id));
                    else dispatch(removeViewJobs(item.id));
                    //if (mainPipeline !== "") dispatch(setMainPipeline({ nome: "", jobs: [] }));
                }}
            />
        );

    }

    return (
        <IonList className='m-0 p-0'>
        {
            catalogoJobs//.filter((item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1)
                .map((item, index) => {
                    const color = index % 2 === 0 ? 'medium' : 'none';
                    return (
                        <IonItem key={index} lines='none'
                            color={color}
                            className='p-0 m-0 text-white small'
                            style={{ '--min-height': '32px' }}
                        >
                            {seletor(item)}
                            <IonLabel className='p-0 m-0 text-wrap'>
                                <span className='font-monospace text-white text-break'>{item.nome}</span>
                                <IonBadge color='secondary'
                                    className='ms-1 small fw-normal opacity-25'
                                    style={{transform: 'translate(0px, 3px)'}}
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