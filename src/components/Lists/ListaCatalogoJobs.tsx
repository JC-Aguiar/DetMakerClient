import { InputChangeEventDetail, IonIcon, IonInput, IonList, IonRadio, IonRadioGroup, RadioGroupChangeEventDetail, useIonAlert } from "@ionic/react";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { addMensagem, addOneMainJob, addViewJobs, atualizarMensagem, removeViewJobs, setViewJob } from "../../Store/Reducer/ReducerAtividade";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addCircleOutline, checkbox, checkmark, closeCircle, search, square, trashOutline } from "ionicons/icons";
import { JobConfig } from "../../data/JobConfig";
import ItemLista from "../Core/ItemLista";
import { loadingJobs } from "../../Store/Reducer/ReducerJobs";
import * as AxiosRequest from "../../data/AxiosRequest";
import { removerJobs as removerJobsCatalogo } from "../../Store/Reducer/ReducerJobs";
import { removerJobs as removerJobsPiepline } from "../../Store/Reducer/ReducerPipelines";


//Interface dos métodos acionáveis via referência do <ListaCatalogoJobs>
export interface ListaCatalogoRef {
    getMainJob: JobInfoDTO | undefined,
}


//Componente <ListaCatalogoJobs>
const ListaCatalogoJobs = forwardRef<ListaCatalogoRef>((props, ref) => {
    //Atributo para usar Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.configAtividade.jobSelecionado);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainPipelineJobs);

    //Atributos com estado gerenciado via React
    const [jobPesquisado, setJobPesquisado] = useState<string>("");
    const [mainJob, setMainJob]  = useState<JobInfoDTO | undefined>(undefined);
    const [alerta] = useIonAlert();

    //Atributos sem estado gerenciado
    const nomeJobsSelecionados: string[] = [];

    //Acionamento sempre que o array dos Jobs ID for alterado
    useEffect(() => {
        catalogoJobs.filter(job => jobsSelecionados.includes(job.id))
            .map(job => job.nome)
            .forEach(nome => nomeJobsSelecionados.push(nome));
    }, [jobsSelecionados]);

    //Disponibilizando os métodos acionáveis via referência 
    useImperativeHandle(ref, () => ({
        getMainJob: mainJob
    }));

    //Handler para alertar ao usuário caso ele queira excluir o Jobs
    const exibirAlerta = () => {
        alerta({
            header: 'Deletar Jobs!',
            message: 'Tem certeza que deseja deletar estes Jobs da base da dados?<br/>' +
                `${nomeJobsSelecionados.join('<br/>')}.`,
            buttons: [
                'Não',
                { text: 'Sim', handler: (d) => deletarJobs() }
            ]
        });
    };

    //Valida se está no modo de exibição "Pipeline"
    const pipelineMode = () => mainPipeline === "";

    //Valida se Job consta selecionado
    function isOn(jobId: number): boolean | undefined {
        return jobsSelecionados.findIndex((id) => id === jobId) !== -1;
    }

    //Identifica tipo de botão na lista
    const identificarTipoBotao = (item: JobInfoDTO) => {
        if (mainPipeline !== "") return addCircleOutline;
        return isOn(item.id) ? checkbox : square;
    }

    //Desseleciona todos os Jobs
    const cancelarJobsSelecionados = () => {
        setMainJob(undefined);
        dispatch(setViewJob([]));
    }

    //Tenta encontrar possíveis Jobs para determinada máscara de pesquisa
    const procurarJob = (e: CustomEvent<InputChangeEventDetail>) => {
        const valor = (e.target as HTMLInputElement).value.trim();
        setJobPesquisado(valor);
    }

    //Requisição para deletar todos os Jobs selecionados
    const deletarJobs = async () => {
        const mensagemId = `Delete_Jobs@${Date.now()}`;
        try {
            dispatch(loadingJobs(true));
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Deletando Jobs ID ${jobsSelecionados.join(", ")}.`,
                status: 'INFO'
            }));
            await AxiosRequest.deleteJobs(jobsSelecionados);
            dispatch(removerJobsPiepline(nomeJobsSelecionados));
            dispatch(removerJobsCatalogo(nomeJobsSelecionados));
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `Sucesso.`,
                status: 'OK'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
        finally {
            dispatch(loadingJobs(false));
        }
    }

    //Acionamento ao selecionar uma opção de Job e não estando no modo "Pipeline"
    const selecionarMainJob = (e: CustomEvent<RadioGroupChangeEventDetail<number>>): void => {
        const id = e.detail.value;
        if (!id) return;
        console.log(`[LISTA CATALOGO JOBS]: Usuário selecionou opção Job id '${id}'.`);

        const jobSelecionado = catalogoJobs.find((item) => item.id === id);
        if (!jobSelecionado) {
            console.log(`[LISTA CATALOGO JOBS]: Job '${id}' não identificada no catálogo.`);
            return;
        };
        console.log(`[LISTA CATALOGO JOBS]: Job '${jobSelecionado.nome}' identificada no catálogo.`);
        setMainJob(jobSelecionado);
    }

    //Renderizando componente
    return (
        <IonRadioGroup 
            value={mainJob?.id}
            className='border-0 h-100'
            onIonChange={selecionarMainJob}
        >
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
                {/*
                    <ItemLista text="Deletar Selecionados" icon={trashOutline} trigger={
                        () => jobsSelecionados.length > 0 ? exibirAlerta() : null
                    } />
                */}
                {
                    catalogoJobs.filter(item => item.nome.includes(jobPesquisado))
                        .map((item, index) => {
                            const color = index % 2 === 0 ? 'medium' : 'none';
                            return (
                                <ItemLista key={index}
                                    text={item.nome}
                                    tag={`ID ${item.id}`}
                                    color={color}
                                    trigger={() => {
                                        if (!pipelineMode()) {
                                            dispatch(addOneMainJob(item));
                                            return;
                                        }
                                    }}
                                >
                                    <IonRadio
                                        slot="start"
                                        value={item.id}
                                        className='p-0 m-0 me-1 mt-1'
                                        style={{ height: '16px', width: '17px' }}
                                        hidden={!pipelineMode()}
                                    />
                                    <IonIcon
                                        slot="start"
                                        className='p-0 m-0 me-1 mt-1'
                                        icon={addCircleOutline}
                                        hidden={pipelineMode()}
                                    />
                                </ItemLista>
                            );
                        })
                }
            </IonList>
        </IonRadioGroup>
    );
});

export default ListaCatalogoJobs;
