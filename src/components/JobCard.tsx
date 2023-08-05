import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonText, IonTextarea, TextareaChangeEventDetail, useIonModal, useIonViewDidEnter } from "@ionic/react";
import React, { useRef, useState } from "react";
import { ItemPilha } from "./ItemPilha";
import { ComandoSQL } from "./ComandoSQL";
import { codeWorking } from "ionicons/icons";
import ConfigurarJobs from '../pages/ConfigurarJobs';
import { AgendaDTO } from "./AgendaDTO";

export interface JobCardProps {
    dto: ItemPilha,
    indexPilha: number,
    onCallBack?: (
        numeroPilha: number,
        agenda: AgendaDTO,
        parametros: string[],
        queries: ComandoSQL[],
        cargas: string[],
        pronto: boolean
    ) => void,
    ref?: never
}

interface JobCardModalProps {
    onDismiss: () => void
}

const JobCard: React.FC<JobCardProps> = ({ dto, indexPilha, onCallBack }) => {

    //Propriedades do componente <JobCard>
    const callBack = onCallBack;
    const itemPilha: ItemPilha = dto;
    const numeroPilha: number = indexPilha;
    itemPilha.argumentos = dto.agenda.parametros.map(() => "");
    itemPilha.queries = dto.agenda.tabelas.map((tabelaNome) => {
        return {
            tabela: tabelaNome,
            query: ""
        }
    });
    itemPilha.cargas = dto.agenda.mascaraEntrada.map(() => "");
    itemPilha.pronto = false;

    //Variáveis para manipular o ItemPilha do componente
    const [parametros, setParametros] = useState<string[]>(itemPilha.argumentos);
    const [queries, setQueries] = useState<ComandoSQL[]>(itemPilha.queries);
    const [cargas, setCargas] = useState<string[]>(itemPilha.cargas);
    const [pronto, setPronto] = useState<boolean>(itemPilha.pronto);

    /**
     * Método chamado quando este componente fica visível
     */
    useIonViewDidEnter(() => {
        if (!itemPilha) return;
        console.log(`[CARD-JOB] renderizando card do job ${itemPilha.agenda}.`);
    }, []);

    /**
     * Método para callback á página {@link ConfigurarJobs}, enviando o {@link ItemPilha} do card e suas respectivas
     * configurações e seu respectivo index
     */
    async function salvandoItem() {
        const statusParametros = parametros.length === 0 || parametros.every((param) => param.trim().length > 0);
        const statusQueries = queries.length === 0 || queries.every((comandoSql) => comandoSql.query.trim().length > 0);
        const statusCargas = cargas.length === 0 || cargas.every((carga) => carga.trim().length > 0);
        console.log(
            `[CARD-JOB] Status do card job [${numeroPilha}] ${itemPilha.agenda.job}: ` +
            `Parametros ${statusParametros}, Queries ${statusQueries}, Cargas ${statusCargas}.`
        );

        const pronto = (statusParametros && statusQueries && statusCargas);
        itemPilha.pronto = false;
        setPronto(pronto);
        console.log(`[CARD-JOB] Card job parametros: ${parametros[0]}.`);
        console.log(`[CARD-JOB] Card job [${numeroPilha}] ${itemPilha.agenda.job}: status ${itemPilha.pronto}.`);

        console.log(`[CARD-JOB] Realizando callback do card job [${numeroPilha}] ${itemPilha.agenda.job}.`);
        callBack!(numeroPilha, itemPilha.agenda, parametros, queries, cargas, pronto);
    }

    //Funções para preencher as variáveis de manipulação
    const preencherParametro = (event: CustomEvent<InputChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        parametros[index] = value.trim();
        setParametros(parametros);
        console.log(`[CARD-JOB] ${itemPilha.agenda.job} parâmetro [${index}] = ${parametros[index]}.`);
    }
    const preencherQueries = (event: CustomEvent<TextareaChangeEventDetail>, tabela: string, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        queries[index] = {
            tabela: tabela,
            query: value.trim()
        };
        setQueries(queries);
        console.log(
            `[CARD-JOB] ${itemPilha.agenda.job} query [${index}] ${queries[index].tabela} = ${queries[index].query}.`
        );
    }
    const preencherCargas = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        cargas[index] = value.trim();
        setCargas(cargas);
        console.log(`[CARD-JOB] ${itemPilha.agenda.job} carga [${index}] = ${cargas[index]}.`);
    }

    //Modelo da modal usada nos cards
    const JobCardModal: React.FC<JobCardModalProps> = ({ onDismiss }) => {
        return (
            <IonContent className="">
                <IonHeader className="banner p-2 m-0">
                    <span className="badge bg-white me-1 text-primary">{itemPilha.agenda.id}</span>
                    <span className="font-monospace text-white fw-bold">{itemPilha.agenda.job}</span>
                </IonHeader>
                <IonFab edge={true} vertical="top" horizontal="end">
                    <IonFabButton className="close-icon" color="#" onClick={onDismiss} >
                        <IonIcon icon="close" color="#" />
                    </IonFabButton>
                </IonFab>
                <div className="p-2">
                    {configParametros()}
                    {configQuerys()}
                    {configCarga()}
                </div>
            </IonContent>
        )
    }

    //Função para desfazer a modal
    const [modalParamOn, modelParamOff] = useIonModal(JobCardModal, {
        onDismiss: () => {
            salvandoItem();
            modelParamOff()
        }
    });

    function configParametros() {
        if (itemPilha.argumentos.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${itemPilha.agenda.id}-param`}>
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
                                    {itemPilha.agenda.parametros[index]}
                                </IonLabel>
                                <IonInput id={`job${itemPilha.agenda.id}-param`}
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    placeholder={itemPilha.agenda.descricaoParametros[index]}
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
                <label className="form-label fw-bold text-primary" htmlFor={`job${itemPilha.agenda.id}-sql`}>
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
                                <IonTextarea id={`job${itemPilha.agenda.id}-sql`}
                                    className="form-control text-start m-0 p-0"
                                    aria-label="With textarea"
                                    autoGrow={true}
                                    placeholder={`SELECT * FROM ${comandoSql.tabela} WHERE...`}
                                    onIonChange={(e) => preencherQueries(e, comandoSql.tabela, index)}
                                    value={queries[index].query}
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
                <label className="form-label fw-bold text-primary" htmlFor={`job${itemPilha.agenda.id}-carga`}>
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
                                    {itemPilha.agenda.mascaraEntrada[index]}
                                </IonLabel>
                                <IonTextarea id={`job${itemPilha.agenda.id}-carga`}
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
                    <span className="badge bg-white me-1 text-primary">{itemPilha.agenda.id}</span>
                    <span className="font-monospace text-white fw-bold">{itemPilha.agenda.job}</span>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="rounded rounded-2 bg-light m-3">
                <p className="lh-1 py-2 text-dark">Jobs: {itemPilha.agenda.job}</p>
                <p className="lh-1 py-2 text-dark">Parametros:{parametros.join(", ")}</p>
                <p className="lh-1 py-2 text-dark">Queries: <br />{queries.map((querySql, index) => {
                    return (<> {`[${index}] ${querySql.query}`} <br /></>);
                }
                )}</p>
                <p className="lh-1 py-2 text-dark">Cargas: {cargas.join(", ")}</p>
                <p className="lh-1 py-2 text-dark">Pronto: {pronto ? "sim" : "não"}</p>
                <p className="lh-1 py-2 text-dark">
                    Executar após IDs: {
                        itemPilha.agenda.executarAposJob.map((idPosJob) => <span className="badge bg-info m-0">{idPosJob}</span>)
                    }
                    <div className="my-1" />

                    Programas: {
                        itemPilha.agenda.programa.map((recursos) => <span className="badge bg-info m-0">{recursos}</span>)
                    }
                    <div className="my-1" />

                    Grupo: <span className="badge bg-info m-0">UDA{itemPilha.agenda.grupoUda}</span>
                    <div className="my-1" />

                    {itemPilha.agenda.descricao}
                    <div className="my-1" />

                    <div className="ion-text-center">
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