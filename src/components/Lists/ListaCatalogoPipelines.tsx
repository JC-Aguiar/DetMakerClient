import { InputChangeEventDetail, IonInput, IonList, IonRadio, IonRadioGroup, RadioGroupChangeEventDetail, } from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { setViewJobs } from "../../Store/Reducer/ReducerAtividade";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { setMainPipeline } from "../../Store/Reducer/ReducerAtividade";
import { closeCircle, search } from "ionicons/icons";
import { JobConfig, parseJobInfo } from "../../data/JobConfigDTO";
import { PipelineInfoDTO } from "../../data/PIpelineInfoDTO";
import ItemLista from "../Core/ItemLista";


const ListaCatalogoPipelines: React.FC = () => {
    //Atributo para acionamento do Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const catalogoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);

    //Atributos com estado gerenciado via React
    const [pipelinePesquisada, setPipelinePesquisada] = useState<string>("");
    
    //Acionamento ao selecionar uma opção de Pipeline carregada do banco
    const selecionarMainPipeline = (e: CustomEvent<RadioGroupChangeEventDetail<string>>): void => {
        const valor = e.detail.value;
        if (valor === null || valor === undefined) return;
        console.log(`[LISTA CATALOGO PIPELINES]: Usuário selecionou opção Pipeline nome '${valor}'.`);

        const userPipeline = catalogoPipelines.find((item) => item.nome === valor);
        if (!userPipeline && userPipeline !== "") {
            console.log(`[LISTA CATALOGO PIPELINES]: Pipeline '${valor}' não identificada no catálogo Pipelines.`);
            return;
        };
        console.log(`[LISTA CATALOGO PIPELINES]: Pipeline '${userPipeline.nome}' identificada no catálogo de Pipelines.`);

        //Definido MainJobs com base na MainPipline
        const jobsMainPipline: JobConfig[] = [];
        userPipeline.jobs.forEach((pipelineJob, index) => {
            const atividadeJobs = catalogoJobs.find((jobDto) => jobDto.nome === pipelineJob);
            if (!atividadeJobs) {
                console.log(`[LISTA CATALOGO PIPELINES]: Nenhum dos Jobs informados na Pipeline selecionada '
                    + ('${userPipeline.nome}') foram identificados no catálogo de Jobs.`);
                return;
            }
            const configJob: JobConfig = parseJobInfo(atividadeJobs, index);
            jobsMainPipline.push(configJob);
        });
        dispatch(setMainPipeline({
            id: userPipeline.id,
            nome: userPipeline.nome,
            jobs: jobsMainPipline
        }));
        //reordenar();
        //dispatch(setMainJobs(jobsMainPipline));
        //dispatch(setDadosProjeto(novaPipelineConfig));
    };

    //Método para descelecionar a Pipeline do painel do Laboratório
    const cancelarMainPipeline = () => {
        if (mainPipeline === "") return;
        dispatch(setMainPipeline());
    }

    //Tenta encontrar possíveis Pipelines para determinada máscara de pesquisa
    const procurarPipeline = (e: CustomEvent<InputChangeEventDetail>) => {
        const valor = (e.target as HTMLInputElement).value.trim();
        setPipelinePesquisada(valor);
    }

    //Renderização do componente
    return (
        <IonRadioGroup value={mainPipeline}
            className='border-0 h-100'
            onIonChange={(e) => selecionarMainPipeline(e)}
        >
            <IonList className='m-0 p-0'>
                <ItemLista text="" icon={search} >
                    <IonInput inputmode='text'
                        maxlength={500}
                        placeholder="Pesquisar Pipeline"
                        value={pipelinePesquisada}
                        className='text-white'
                        onIonChange={(e) => procurarPipeline(e)}
                        required
                    />
                </ItemLista>
                <ItemLista text="Desselecionar Pipeline" icon={closeCircle} trigger={cancelarMainPipeline} />
                {
                    catalogoPipelines.filter(item => item.nome.includes(pipelinePesquisada))
                        .map((item, index) => {
                            const color = index % 2 === 0 ? 'medium' : 'none';
                            const tag = item.jobs.length + " Job" + (item.jobs.length > 1 ? 's' : '');
                            return (
                                <ItemLista key={index} text={item.nome} tag={tag} color={color}>
                                    <IonRadio 
                                        slot="start"
                                        value={item.nome}
                                        className='p-0 m-0 me-1 mt-1'
                                        style={{ height: '16px', width: '17px'}}
                                    />
                                </ItemLista>
                            );
                        })
                }
            </IonList>
        </IonRadioGroup>
    );
};

export default ListaCatalogoPipelines;