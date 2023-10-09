import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonLabel, IonText, IonTextarea, TextareaChangeEventDetail, useIonModal, useIonViewDidEnter } from "@ionic/react";
import React, { ChangeEvent, useState } from "react";
import { ItemPilha } from "./ItemPilha";
import { ComandoSQL } from "./ComandoSQL";
import { codeWorking } from "ionicons/icons";
import ConfigurarJobs from '../pages/ConfigurarJobs';
import { JobDTO } from "./JobDTO";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { setItemPilhaStatus } from "../Store/Reducer/ReducerPilhaJobs";

export interface JobCardProps {
    itemPilha: ItemPilha,
    callback: () => void
}

interface JobCardModalProps {
    onDismiss: () => void
}

let parametros: string[] = [];
let queries: ComandoSQL[] = [];
let cargas: string[] = [];
let pronto: boolean = false;
let ordem: number = -1;

const JobCard: React.FC<JobCardProps> = ({ itemPilha, callback }) => {
    //Propriedades do componente <JobCard>
    const dispatch = useDispatch();
    const pilha = useSelector((state: RootState) => state.store.pilhaJobs.value);
    //const [parametros, setParametros] = useState<string[]>(itemPilha.argumentos);
    //const [queries, setQueries] = useState<ComandoSQL[]>(itemPilha.queries);
    queries = itemPilha.queries;
    //const [cargas, setCargas] = useState<string[]>(itemPilha.cargas);
    //const [pronto, setPronto] = useState<boolean>(itemPilha.pronto);
    //const [ordem, setOrdem] = useState<number>(itemPilha.ordem);
    const [teste, setTeste] = useState<string>("");

    /**
     * Método chamado quando este componente fica visível
     */
    useIonViewDidEnter(() => {
        if (!itemPilha) return;
        console.log(`[CARD-JOB] Renderizando card do job ${itemPilha.job.nome}.`);
    }, []);

    /**
     * Método para callback á página {@link ConfigurarJobs}, enviando o {@link ItemPilha} do card e suas respectivas
     * configurações e seu respectivo index
     */
    async function salvandoItem() {
        const statusParametros = parametros.length === 0 || parametros.every((param) => param.trim().length > 0);
        const statusQueries = queries.length === 0 || queries.every((comandoSql) => comandoSql.query.trim().length > 0);
        const statusCargas = cargas.length === 0 || cargas.every((carga) => carga.trim().length > 0);
        const statusOrdem = ordem !== null && ordem >= 0;
        pronto = (statusParametros && statusQueries && statusCargas && statusOrdem);
        //itemPilha.pronto = pronto;
        //setPronto(pronto);
        try {
            if (itemPilha.argumentos === parametros
                && itemPilha.cargas === cargas
                && itemPilha.ordem === ordem
                && itemPilha.queries === queries
                && itemPilha.pronto === pronto)
                return;

            console.log(
                `[CARD-JOB] Status do card job [${itemPilha.job.id}] ${itemPilha.job.nome}: ` + '\n'
                + ` - Status Ordem ${statusOrdem}` + '\n'
                + ` - Status Parametros ${statusParametros}` + '\n'
                + ` - Status Queries ${statusQueries}` + '\n'
                + ` - Status Cargas ${statusCargas}` + '\n'
                + ` - Status Pronto = ${pronto}.`
            );
            dispatch(setItemPilhaStatus(
                {
                    id: itemPilha.job.id,
                    argumentos: parametros,
                    queries: queries,
                    cargas: cargas,
                    pronto: pronto,
                    ordem: ordem,
                }
            ));
        }
        finally {
            callback();
        }
        //callBack!(numeroPilha, itemPilha.agenda, parametros, queries, cargas, pronto);
    }

    //Funções para preencher as variáveis de manipulação dos cards
    const preencherStack = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const numero = Number.parseInt(value.trim());
        if (!isNaN(numero)) {
            //setOrdem(numero);
            ordem = numero;
        }
        console.log(`[CARD-JOB] ${itemPilha.job.nome} stack = ${numero}.`);
    }
    const preencherParametro = (event: CustomEvent<InputChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        //parametros[index] = value.trim();
        //setParametros(parametros);
        const updatedParams = [...parametros];
        updatedParams[index] = value.trim();
        parametros = updatedParams;
        console.log(`[CARD-JOB] ${itemPilha.job.nome} parâmetro[${index}] = ${parametros[index]}.`);
    }
    const preencherQueries = (event: CustomEvent<TextareaChangeEventDetail>, tabela: string, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const updatedQueries = [...queries];
        updatedQueries[index] = { tabela: tabela, query: value.trim() };
        queries = updatedQueries;
        //setQueries(updatedQueries);
        console.log(
            `[CARD-JOB] ${itemPilha.job.nome} query[${index}] ${queries[index].tabela} = ${queries[index].query}.`
        );
    }
    const preencherCargas = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        //cargas[index] = value.trim();
        //setCargas(cargas);
        const updatedCargas = [...cargas];
        updatedCargas[index] = value.trim();
        cargas = updatedCargas;
        console.log(`[CARD-JOB] ${itemPilha.job.nome} carga[${index}] = ${cargas[index]}.`);
    }

    //Modelo e função da modal usada nos cards
    const JobCardModal: React.FC<JobCardModalProps> = ({ onDismiss }) => {
        return (
            <IonContent className="">
                <IonHeader className="banner p-2 m-0">
                    <span className="badge bg-white me-1 text-primary">{itemPilha.job.id}</span>
                    <span className="font-monospace text-white fw-bold">{itemPilha.job.nome}</span>
                </IonHeader>
                <IonFab edge={true} vertical="top" horizontal="end">
                    <IonFabButton className="close-icon" color="#" onClick={onDismiss} >
                        <IonIcon icon="close" color="#" />
                    </IonFabButton>
                </IonFab>
                <div className="p-2">
                    {configStack()}
                    {configParametros()}
                    {configQuerys()}
                    {configCarga()}
                </div>
            </IonContent>
        )
    }
    const [modalParamOn, modalParamOff] = useIonModal(JobCardModal, {
        onDismiss: () => {
            salvandoItem();
            modalParamOff()
        }
    });

    //Gerando configurações do job
    function configStack() {
        return (
            <div className="px-1 py-2 mb-2 text-start">
                <IonLabel className="badge bg-info mx-1 sticky-top"
                    style={{
                        position: 'absolute',
                        top: '0%',
                        left: `2%`,
                        transform: 'translate(0%, 225%)',
                    }}
                >Ordem de Execução
                </IonLabel>
                <select className="form-select" id="floatingSelect"
                    aria-label="Floating label select example"
                    onChange={(e) => preencherStack(e)}
                    value={ordem}
                >
                    {
                        pilha.map((itemPilha, index) => {
                            return (
                                <option value={index}>{index}</option>
                            );
                        })
                    }
                </select>

            </div>
        );
    }

    function configParametros() {
        if (itemPilha.argumentos.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${itemPilha.job.id}-param`}>
                    PARÂMETROS DE EXECUÇÃO
                </label>
                {
                    itemPilha.argumentos.map((param, index) => {
                        return (
                            <div className="position-relative pb-1 mt-1 mb-3">
                                <IonLabel className="badge bg-info mx-1 sticky-top"
                                    style={{
                                        position: 'absolute',
                                        top: '0%',
                                        left: `0%`,
                                        transform: 'translate(0%, -50%)',
                                    }}
                                >
                                    {itemPilha.job.parametros[index]}
                                </IonLabel>
                                <IonInput id={`job${itemPilha.job.id}-param`}
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    placeholder={itemPilha.job.descricaoParametros[index]}
                                    onIonChange={(e) => preencherParametro(e, index)}
                                    value={parametros[index]}
                                />
                            </div>

                        );
                    })
                }
            </div>
        );
    }
    function configQuerys() {
        if (itemPilha.queries.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${itemPilha.job.id}-sql`}>
                    QUERIES DE CONSULTA
                </label>
                {
                    itemPilha.queries.map((comandoSql, index) => {
                        return (
                            <div className="position-relative text-center pb-1 mt-1 mb-3">
                                <IonLabel className="badge bg-info mx-1 sticky-top"
                                    style={{
                                        position: 'absolute',
                                        top: '0%',
                                        left: `0%`,
                                        transform: `translate(0%, -50%)`,
                                    }}
                                >
                                    {comandoSql.tabela}
                                </IonLabel>
                                <IonTextarea id={`job${itemPilha.job.id}-sql`}
                                    className="form-control text-start m-0 p-0"
                                    aria-label="With textarea"
                                    autoGrow={true}
                                    placeholder={`Insira aqui as condições WHERE, ORDER e/ou GROUP`}
                                    onIonChange={(e) => preencherQueries(e, comandoSql.tabela, index)}
                                    value={queries[index].query}
                                //onChange={(e) => setTeste((e.target as HTMLInputElement).value)}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    function configCarga() {
        if (itemPilha.cargas.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${itemPilha.job.id}-carga`}>
                    CARGAS DE ENTRADA
                </label>
                {
                    itemPilha.cargas.map((carga, index) => {
                        return (
                            <div className="position-relative text-center pb-1 mt-1 mb-3">
                                <IonLabel className="badge bg-info mx-1 sticky-top"
                                    style={{
                                        position: 'absolute',
                                        top: '0%',
                                        left: `0%`,
                                        transform: `translate(0%, -50%)`,
                                    }}
                                >
                                    {itemPilha.job.mascaraEntrada[index]}
                                </IonLabel>
                                <IonTextarea id={`job${itemPilha.job.id}-carga`}
                                    className="form-control m-0 p-0 text-start"
                                    aria-label="With textarea"
                                    autoGrow={true}
                                    placeholder="insira aqui o conteúdo da carga"
                                    onIonChange={(e) => preencherCargas(e, index)}
                                    value={cargas[index]}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    if (!itemPilha) return null;
    return (
        <IonCard target="_self" className="border border-1 p-0">
            <IonCardHeader className="banner p-2" >
                <IonCardTitle  >
                    <span className="badge bg-white me-1 text-primary">{itemPilha.job.id}</span>
                    <span className="font-monospace text-white fw-bold">{itemPilha.job.nome}</span>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="rounded rounded-2 bg-light m-3">
                <p className="lh-1 py-2 text-dark">
                    {/* TODO: adicionar bootstrap select, persistir informação e transitá-la */}
                    {/* TODO: adicionar estilo css para o nome do job quebrar em qualquer letra (adicionar isso na modal também) */}
                    <p>Ordem: {ordem}</p>
                    Executar após IDs: {
                        itemPilha.job.executarAposJob.map((idPosJob) => <span className="badge bg-info m-0">{idPosJob}</span>)
                    }
                    <div className="my-1" />

                    Programas: {
                        itemPilha.job.programa.map((recursos) => <span className="badge bg-info m-0">{recursos}</span>)
                    }
                    <div className="my-1" />

                    Grupo: <span className="badge bg-info m-0">UDA{itemPilha.job.grupoUda}</span>
                    <div className="my-1" />

                    {itemPilha.job.descricao}
                    <div className="my-1" />

                    <div className="ion-text-center d-flex align-items-center">
                        <IonButton id="session-login-button" fill="solid" onClick={() => modalParamOn()} >
                            <IonIcon icon={codeWorking} size='large' />
                            <IonText className="session-buttons">
                                Configurar Job
                            </IonText>
                        </IonButton>
                    </div>

                </p>
            </IonCardContent>
        </IonCard>
    );
};

export default JobCard;