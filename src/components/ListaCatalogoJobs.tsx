import { InputChangeEventDetail, IonBadge, IonCheckbox, IonIcon, IonInput, IonItem, IonLabel, IonList } from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { addOneMainJob, addViewJobs, removeViewJobs, setViewJobs } from "../Store/Reducer/ReducerAtividade";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { setMainJobs } from "../Store/Reducer/ReducerAtividade";
import { addCircleOutline, closeCircle, search } from "ionicons/icons";
import { JobConfig, parseJobInfo } from "../data/JobConfigDTO";
import ItemLista from "./ItemLista";


const ListaCatalogoJobs: React.FC = () => {
    //Atributo para usar Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.configAtividade.jobsSelecionados);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);

    //Atributos com estado gerenciado via React
    const [jobPesquisado, setJobPesquisado] = useState<string>("");


    function isOn(jobId: number): boolean | undefined {
        return jobsSelecionados.findIndex((id) => id === jobId) !== -1; 
    }

    const identificarTipoBotao = (item: JobInfoDTO): JSX.Element => {
        if (mainPipeline !== "") {
            return <IonBadge color="#" className="p-0 m-0 bg-transparent">
                <IonIcon icon={addCircleOutline} 
                    color="primary" 
                    className='p-0 m-1 pe-1' 
                    style={{ transform: 'scale(1.5) translate(0.25px, 3px)'}}
                />
            </IonBadge>
        }
        return (
            <IonCheckbox color='primary'
                slot="start"
                checked={isOn(item.id)}
                value={isOn(item.id) ? 'on' : 'off'}
                className='p-0 m-0 me-1 mt-1 border border-primary rounded rounded-2'
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

    //Desseleciona todos os Jobs
    const cancelarJobsSelecionados = () => {
        dispatch(setViewJobs([]));   
    }

    //Tenta encontrar possíveis Jobs para determinada máscara de pesquisa
    const procurarJob = (e: CustomEvent<InputChangeEventDetail>) => {
        const valor = (e.target as HTMLInputElement).value.trim();
        setJobPesquisado(valor);
    }

    //Renderizando componente
    return (
        <IonList className='m-0 p-0'>
            <ItemLista texto="" icone={search} >
                <IonInput inputmode='text'
                    maxlength={500}
                    placeholder="Pesquisar Job"
                    value={jobPesquisado}
                    className='text-white'
                    onIonChange={(e) => procurarJob(e)}
                    required
                />
            </ItemLista>
            <ItemLista texto="Desselecionar Jobs" icone={closeCircle} trigger={cancelarJobsSelecionados} />
            {
                catalogoJobs.filter(item => item.nome.includes(jobPesquisado))
                    .map((item, index) => {
                        const color = index % 2 === 0 ? 'medium' : 'none';
                        return (
                            <IonItem key={index} lines='none'
                                color={color}
                                className='p-0 m-0 text-white small '
                                style={{ '--min-height': '32px', cursor: `${mainPipeline === "" ? 'auto' : 'pointer'}`  }}
                                onClick={(e) => {
                                    //Acionamento deve estar disponível apenas se nenhuma Pipeline estiver selecionada
                                    if (mainPipeline === "") return;
                                    const novoJobConfig: JobConfig =  parseJobInfo(item, mainJobs.length);
                                    dispatch(addOneMainJob(novoJobConfig));
                            }}>
                                {identificarTipoBotao(item)}
                                <IonLabel className='p-0 m-0 text-wrap' >
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

export default ListaCatalogoJobs;