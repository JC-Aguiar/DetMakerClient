import { InputChangeEventDetail, IonInput, IonList, useIonAlert } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { addMensagem, addOneMainJob, addViewJobs, atualizarMensagem, removeViewJobs, setViewJobs } from "../../Store/Reducer/ReducerAtividade";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addCircleOutline, checkbox, checkmark, closeCircle, search, square, trashOutline } from "ionicons/icons";
import { JobConfig } from "../../data/JobConfig";
import ItemLista from "../Core/ItemLista";
import { loadingJobs } from "../../Store/Reducer/ReducerJobs";
import * as AxiosRequest from "../../data/AxiosRequest";


//Componente <ListaCatalogoJobs>
const ListaCatalogoJobs: React.FC = () => {
    //Atributo para usar Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalogo);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.configAtividade.jobsSelecionados);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const nomeJobsSelecionados: string[] = [];
    const [alerta] = useIonAlert();

    //Acionamento sempre que o array dos Jobs ID for alterado
    useEffect(() => {
        catalogoJobs.filter(job => jobsSelecionados.includes(job.id))
            .map(job => job.nome)
            .forEach(nome => nomeJobsSelecionados.push(nome));
    }, [jobsSelecionados]);

    //Handler para alertar ao usuário caso ele queira excluir o Jobs
    const exibirAlerta = () => {
        alerta({
            header: 'Deletar Jobs!',
            message: 'Tem certeza que deseja deletar os seguintes Jobs da base da dados? ' + 
                    `${nomeJobsSelecionados.join(", ")}.`,
            buttons: [
                'Não',
                { text: 'Sim', handler: (d) => deletarJobs() }
            ],
        });
    };

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
            setLoading(false);
        }
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
            <ItemLista text="Deletar Selecionados" icon={trashOutline} trigger={cancelarJobsSelecionados} />
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

function removerJobsPiepline(arg0: any[]): any {
    throw new Error("Function not implemented.");
}


function removerJobsCatalogo(arg0: any[]): any {
    throw new Error("Function not implemented.");
}


function setLoading(arg0: boolean) {
    throw new Error("Function not implemented.");
}
