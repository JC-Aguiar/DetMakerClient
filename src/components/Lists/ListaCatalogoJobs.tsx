import { InputChangeEventDetail, IonInput, IonList } from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { addOneMainJob, addViewJobs, removeViewJobs, setViewJobs } from "../../Store/Reducer/ReducerAtividade";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addCircleOutline, checkbox, checkmark, closeCircle, search, square } from "ionicons/icons";
import { JobConfig } from "../../data/JobConfigDTO";
import ItemLista from "../Core/ItemLista";


//Componente <ListaCatalogoJobs>
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

    const identificarTipoBotao = (item: JobInfoDTO) => {
        if (mainPipeline !== "") return addCircleOutline;
        return isOn(item.id) ? checkbox : square;
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
            <ItemLista text="" icon={search} >
                <IonInput inputmode='text'
                    maxlength={500}
                    placeholder="Pesquisar Job"
                    value={jobPesquisado}
                    className='text-white'
                    onIonChange={(e) => procurarJob(e)}
                    required
                />
            </ItemLista>
            <ItemLista text="Desselecionar Jobs" icon={closeCircle} trigger={cancelarJobsSelecionados} />
            {
                catalogoJobs.filter(item => item.nome.includes(jobPesquisado))
                    .map((item, index) => {
                        const color = index % 2 === 0 ? 'medium' : 'none';
                        return (
                            <ItemLista key={index}
                                text={item.nome}
                                tag={`ID ${item.id}`}
                                icon={identificarTipoBotao(item)}
                                color={color}
                                trigger={() => {
                                    if (mainPipeline !== "") { 
                                        dispatch(addOneMainJob(item));
                                        return;
                                    }
                                    if (!isOn(item.id)) dispatch(addViewJobs(item.id));
                                    else dispatch(removeViewJobs(item.id)); 
                                }}
                            />
                        );
                    })
            }
        </IonList>
    );
};

export default ListaCatalogoJobs;