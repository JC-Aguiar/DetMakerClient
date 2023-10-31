import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonText, IonTextarea, SelectChangeEventDetail, TextareaChangeEventDetail, useIonModal, useIonViewDidEnter } from "@ionic/react";
import React, { ChangeEvent, useState } from "react";
import { JobExecute } from "../data/JobExecute";
import { ComandoSQL } from "../data/ComandoSQL";
import { codeWorking } from "ionicons/icons";
import ConfigurarJobs from '../pages/ConfigurarJobs';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { setItemPilhaStatus } from "../Store/Reducer/ReducerPilhaJobs";

export interface JobCardProps {
    id: number,
    callback: () => void
}

interface JobCardModalProps {
    onDismiss: () => void
}

const JobCard: React.FC<JobCardProps> = ({ id, callback }) => {
    //Propriedades do componente <JobCard>
    const dispatch = useDispatch();
    const pilhaExec = useSelector((state: RootState) => state.store.pilhaJobs.value)
        .filter((itemPilha) => itemPilha.job.checked);
    const jobExec: JobExecute = pilhaExec.filter((itemPilha) => itemPilha.job.id === id)[0];
    let parametros: string[] = jobExec.argumentos;
    let queries: ComandoSQL[] = jobExec.queries;
    let cargas: string[] = jobExec.cargas;
    let pronto: boolean = jobExec.pronto;
    let ordem: number = jobExec.ordem;
    const [ordemVO, setOrdemVO] = useState<number>(ordem);

    /**
     * Método chamado quando este componente fica visível
     */
    useIonViewDidEnter(() => {
        if (!jobExec) return;
        console.log(`[CARD-JOB] Renderizando card do job ${jobExec.job.nome}.`);
    }, []);

    /**
     * Método para callback á página {@link ConfigurarJobs}, enviando o {@link JobExecute} do card e suas respectivas
     * configurações e seu respectivo index
     */
    async function salvandoItem() {
        const statusParametros = parametros.length === 0 || parametros.every((param) => param.trim().length > 0);
        const statusQueries = queries.length === 0 || queries.every((comandoSql) => comandoSql.filtros.trim().length > 0);
        const statusCargas = cargas.length === 0 || cargas.every((carga) => carga.trim().length > 0);
        const statusOrdem = ordem !== null && ordem >= 0;
        pronto = (statusParametros && statusQueries && statusCargas && statusOrdem);
        try {
            //if (itemPilha.argumentos === parametros
            //    && itemPilha.cargas === cargas
            //    && itemPilha.ordem === ordem
            //    && itemPilha.queries === queries
            //    && itemPilha.pronto === pronto)
            //      return;

            console.log(
                `[CARD-JOB] Status do card job [${jobExec.job.id}] ${jobExec.job.nome}: ` + '\n'
                + ` - Status Ordem ${statusOrdem}` + '\n'
                + ` - Status Parametros ${statusParametros}` + '\n'
                + ` - Status Queries ${statusQueries}` + '\n'
                + ` - Status Cargas ${statusCargas}` + '\n'
                + ` - Status Pronto = ${pronto}.`
            );
            dispatch(setItemPilhaStatus(
                {
                    id: jobExec.job.id,
                    argumentos: parametros,
                    queries: queries,
                    cargas: cargas,
                    pronto: pronto,
                    ordem: ordemVO,
                }
            ));
        }
        finally {
            callback();
        }
    }

    //Funções para preencher as variáveis de manipulação dos cards
    const preencherOrdem = (event:  ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const numero = Number.parseInt(value.toString().trim());
        if (!isNaN(numero)) {
            //setAntigaOrdem(ordem);
            ordem = (numero);
            setOrdemVO(ordem);
        }
        console.log(`[CARD-JOB] ${jobExec.job.nome} nova ordem = ${ordem}.`); //, antiga ordem = ${antigaOrdem}
    }
    const preencherParametro = (event: CustomEvent<InputChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novosParam = parametros.map((param, i) => {
            if (i === index) return value.trim();
            return param;
        });
        parametros = (novosParam);
        console.log(`[CARD-JOB] ${jobExec.job.nome} parâmetro [${index}] = ${parametros[index]}.`);
    }
    const preencherQueries = (event: CustomEvent<TextareaChangeEventDetail>, tabela: string, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novasQueries = [...queries];
        novasQueries[index] = {
            tabela: tabela,
            filtros: value.trim()
        };
        queries = (novasQueries);
        console.log(
            `[CARD-JOB] ${jobExec.job.nome} query [${index}] ${queries[index].tabela} = ${queries[index].filtros}.`
        );
    }
    const preencherCargas = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = event.detail.value;
        const novasCargas = [...cargas];
        if (value) {
            novasCargas[index] = value != null && value != undefined ? value.trim() : "";
            cargas = (novasCargas);
        }
        console.log(`[CARD-JOB] ${jobExec.job.nome} carga [${index}] = ${cargas[index]}.`);
    }

    //Modelo e função da modal usada nos cards
    const JobCardModal: React.FC<JobCardModalProps> = ({ onDismiss }) => {
        return (
            <IonContent className="">
                <IonHeader className="banner p-2 m-0">
                    <span className="badge bg-white me-1 text-primary">{jobExec.job.id}</span>
                    <span className="font-monospace text-white fw-bold">{jobExec.job.nome}</span>
                </IonHeader>
                <IonFab edge={true} vertical="top" horizontal="end">
                    <IonFabButton className="close-icon" color="#" onClick={onDismiss} >
                        <IonIcon icon="close" color="#" />
                    </IonFabButton>
                </IonFab>
                <div className="p-2">
                    {configOrdem()}
                    {configParametros()}
                    {configQuerys()}
                    {configCarga()}
                </div>
            </IonContent>
        )
    }
    const [modalParamOn, modalParamOff] = useIonModal(
        JobCardModal, {
            onDismiss: () => {
                salvandoItem();
                modalParamOff()
            }
        }
    );

    //Gerando configurações do job
    function configOrdem() {
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
                {/* 
                <IonList>
                    <IonItem>
                        <IonSelect
                        aria-label="Fruit"
                        placeholder={ordem.toString()}
                        onIonChange={(e) => preencherOrdem(e)}
                        className="text-primary"
                        value={ordem.toString()}
                        >
                        {
                            pilhaExec.map((itemPilha) =>
                                <IonSelectOption value={itemPilha.ordem}>Nº {itemPilha.ordem}</IonSelectOption> 
                            )
                        }
                        </IonSelect>
                    </IonItem>
                </IonList>
                */}
                
                <select className="form-select" id="floatingSelect"
                    aria-label="Floating label select example"
                    onChange={(e) => preencherOrdem(e)}
                    value={ordemVO}
                >
                    {
                        pilhaExec.map((itemPilha) => <option value={itemPilha.ordem}>Nº {itemPilha.ordem}</option>)
                    }
                </select>
                
            </div>
        );
    }

    function configParametros() {
        if (jobExec.argumentos.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${jobExec.job.id}-param`}>
                    PARÂMETROS DE EXECUÇÃO
                </label>
                {
                    jobExec.argumentos.map((param, index) => {
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
                                    {jobExec.job.parametros[index]}
                                </IonLabel>
                                <IonInput id={`job${jobExec.job.id}-param`}
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    placeholder={jobExec.job.descricaoParametros[index]}
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
        if (jobExec.queries.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${jobExec.job.id}-sql`}>
                    QUERIES DE CONSULTA
                </label>
                {
                    jobExec.queries.map((comandoSql, index) => {
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
                                <IonTextarea id={`job${jobExec.job.id}-sql`}
                                    className="form-control text-start m-0 p-0"
                                    aria-label="With textarea"
                                    autoGrow={true}
                                    placeholder={`Insira aqui as condições WHERE, ORDER e/ou GROUP`}
                                    onIonChange={(e) => preencherQueries(e, comandoSql.tabela, index)}
                                    value={queries[index].filtros}
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
        if (jobExec.cargas.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${jobExec.job.id}-carga`}>
                    CARGAS DE ENTRADA
                </label>
                {
                    jobExec.cargas.map((carga, index) => {
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
                                    {jobExec.job.mascaraEntrada[index]}
                                </IonLabel>
                                <IonTextarea id={`job${jobExec.job.id}-carga`}
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

    if (!jobExec) return null;
    return (
        <IonCard target="_self" className="border border-1 p-0">
            <IonCardHeader className="banner p-2" >
                <IonCardTitle  >
                    <span className="badge bg-white me-1 text-primary">{jobExec.job.id}</span>
                    <span className="font-monospace text-white fw-bold">{jobExec.job.nome}</span>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="rounded rounded-2 bg-light m-3">
                <p className="lh-1 py-2 text-dark">
                    {/* TODO: adicionar estilo css para o nome do job quebrar em qualquer letra (adicionar isso na modal também) */}
                    <p>Ordem: {ordem}</p>
                    Executar após IDs: {
                        jobExec.job.executarAposJob.map((idPosJob) => <span className="badge bg-info m-0">{idPosJob}</span>)
                    }
                    <div className="my-1" />

                    Programas: {
                        jobExec.job.programa.map((recursos) => <span className="badge bg-info m-0">{recursos}</span>)
                    }
                    <div className="my-1" />

                    Grupo: <span className="badge bg-info m-0">UDA{jobExec.job.grupoUda}</span>
                    <div className="my-1" />

                    {jobExec.job.descricao}
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