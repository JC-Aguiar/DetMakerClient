import { InputChangeEventDetail, IonButton, IonCard, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonReorder, IonRow, IonTextarea, TextareaChangeEventDetail, useIonModal } from "@ionic/react";
import React, { ChangeEvent, useState } from "react";
import { JobConfig, JobConfigDTO } from "../data/JobConfigDTO";
import { ComandoSQL } from "../data/ComandoSQL";
import { reorderFour, settings, shieldCheckmark } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { setJobs } from "../Store/Reducer/ReducerJobs";
import * as axiosRequest from "../data/AxiosRequest";
import { FiltroSQL } from "../data/FiltroSQL";
import { Noticacao } from "./Noticacao";
import DynamicModal from "./DynamicModal";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { updateOneMainJob } from "../Store/Reducer/ReducerAtividade";

export interface JobCardProps {
    id: number,
    notificacao: Noticacao,
    callback: () => void
}

interface JobCardModalProps {
    onDismiss: () => void
}

const JobCard: React.FC<JobCardProps> = ({ id, notificacao, callback }) => {
    //Propriedades do componente <JobCard>
    const dispatch = useDispatch();
    const jobInfo: JobInfoDTO = useSelector((state: RootState) => state.store.catalogoJobs.catalago)
        .filter((item) => item.id === id)[0];
    const jobExec: JobConfig = useSelector((state: RootState) => state.store.configAtividade.mainJobs)
        .filter((item) => item.id === id)[0];
    const [parametros, setParametros ] = useState<string[]>(jobExec.argumentos);
    const [queries, setQueries ] = useState<ComandoSQL[]>(jobExec.queries);
    const [cargas, setCargas ] = useState<string[]>(jobExec.cargas);
    //let pronto: boolean = jobExec.pronto;

    //Modelo e função da modal usada nos cards
    const jobCardModal = <div className="p-2">
        {informacoes()}
        {inputParametros()}
        {inputConfigQuerys()}
        {inputCarga()}
    </div>;

    const [modalParamOn, modalParamOff] = useIonModal(
        DynamicModal,
        {
            titulo: <>
                <span className="badge bg-white me-1 text-primary">ID {id}</span>
                {jobExec.nome}
            </>,
            elemento: jobCardModal,
            onDismiss: () => {
                salvandoItem();
                modalParamOff()
            }
        }
    );

    //Método chamado quando este componente fica visível
    //useIonViewDidEnter(() => {
    //    if (!jobExec) return;
    //    console.log(`[CARD-JOB] Renderizando card do job ${jobExec.job.nome}.`);
    //}, []);

    //Método para salvar o ConfigJob preenchido pelo usuário no banco
    async function salvandoItem() {
        //const statusParametros = parametros.length === 0 || parametros.every((param) => param.trim().length > 0);
        const statusQueries = queries.every((comandoSql) => {
            if (comandoSql.dinamico) {
                return comandoSql.filtros.every((filtroSql) => filtroSql.valor.length > 0);
            }
            return comandoSql.sql && comandoSql.sql.length > 0;
        });
        //const statusCargas = cargas.length === 0 || cargas.every((carga) => carga.trim().length > 0);
        //pronto = (statusQueries); //&& statusParametros && statusCargas
        //if (itemPilha.argumentos === parametros
        //    && itemPilha.cargas === cargas
        //    && itemPilha.ordem === ordem
        //    && itemPilha.queries === queries
        //    && itemPilha.pronto === pronto)
        //      return;
        const JobConfigurado: JobConfig = {
            ...jobExec,
            argumentos: parametros,
            queries: queries,
            cargas: cargas
        };
        //console.log(
        //    `[CARD-JOB] Status do card job [${jobExec.id}] ${jobExec.nome}: ` + '\n'
        //    + ` - Status Queries ${statusQueries}` //+ '\n'
        //    //+ ` - Status Pronto = ${pronto}.`
        //);
        dispatch(updateOneMainJob(JobConfigurado));
        //callback();
    }

    const preencherParametro = (event: CustomEvent<InputChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novosParam = [...parametros];
        novosParam[index] = value.trim();
        setParametros(novosParam);
        console.log(`[CARD-JOB] ${jobExec.nome} parâmetro[${index}] = ${parametros[index]}.`);
    }
    const preencherQueries = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novasQueries = [...queries];
        novasQueries[index] = {
            campos: novasQueries[index].campos,
            tabela: novasQueries[index].tabela,
            filtros: [],
            sql: value,
            descricao: novasQueries[index].descricao,
            dinamico: false,
        };
        setQueries(novasQueries);
        console.log(
            `[CARD-JOB] ${jobExec.nome} query[${index}] ${queries[index].tabela} = ${queries[index].sql}.`
        );
    }
    const preencherConfigQueries = (event: CustomEvent<InputChangeEventDetail>, queryIndex: number, filtroIndex: number) => {
        const value = (event.target as HTMLInputElement).value;
        queries[queryIndex].filtros[filtroIndex] = {
            ...queries[queryIndex].filtros[filtroIndex],
            valor: value,
        } as FiltroSQL;
        const tabelaAtualizada = queries[queryIndex].tabela;
        const { coluna, tipo, valor } = queries[queryIndex].filtros[filtroIndex];
        console.log(
            `[CARD-JOB] ${jobExec.nome} query[${queryIndex}] ${tabelaAtualizada}.${coluna} = ${valor}.`
        );
    }
    const preencherCargas = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = event.detail.value;
        const novasCargas = [...cargas];
        if (value) {
            novasCargas[index] = value != null && value != undefined ? value.trim() : "";
            setCargas(novasCargas);
        }
        console.log(`[CARD-JOB] ${jobExec.nome} carga[${index}] = ${cargas[index]}.`);
    }

    //Exibindo dados do Job no card
    function informacoes() {
        let sessaoExecutarApos: JSX.Element | null = null;
        if (jobInfo.executarAposJob.length > 0) {
            sessaoExecutarApos = <div>Executar após Jobs:
                {
                    jobInfo.programa.map((recursos, index) => 
                        <span className="badge bg-info m-0" key={index}>{recursos}</span>
                    )
                }
            </div>
        }
        let sessaoProgramas: JSX.Element | null = null;
        if (jobInfo.programa.length > 0) {
            sessaoProgramas = <div>Programas:
                {
                    jobInfo.executarAposJob.map((idPosJob, index) => 
                        <span className="badge bg-info m-0" key={index}>{idPosJob}</span>
                    )
                }
            </div>
        }
        return (
            <>
                <label className="form-label fw-bold text-primary" htmlFor={`job${id}-param`}>
                    INFORMAÇÕES
                </label>
                <div className="text-dark card bg-white mx-4 mt-1 mb-4 pt-2 pb-4 px-2">
                    {sessaoExecutarApos}
                    {sessaoProgramas}
                    <div className="d-flex">Grupo: <span className="badge bg-info mt-1">UDA{jobInfo.grupoUda}</span></div>
                    <div className="d-flex">Descrição: {jobInfo.descricao}</div>
                </div>
            </>
        );
    }

    function inputParametros() {
        if (jobExec.argumentos.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary pb-0 mb-0" htmlFor={`job${id}-param`}>
                    PARÂMETROS
                </label>
                {
                    jobExec.argumentos.map((param, index) => {
                        return (
                            <div key={index} className="position-relative mx-3 mt-1 mb-4 pt-2 pb-4 px-2">
                                <IonLabel className="badge bg-info mx-1 sticky-top"
                                    style={{ position: 'absolute', top: '0%', rigth: `100%` }}
                                >
                                    {jobInfo.parametros[index]}
                                </IonLabel>
                                <IonInput id={`job${id}-param`}
                                    type="text"
                                    className="form-control w-100"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    placeholder={jobInfo.descricaoParametros[index]}
                                    onIonChange={(e) => preencherParametro(e, index)} //FIX01
                                    value={parametros[index]}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    function inputQuerysManual(comandoSql: ComandoSQL, index: number) {
        return (
            <div className="px-1 mb-2" key={index}>
                <div className="position-relative text-center mx-3 mt-1 mb-4">
                    <IonIcon icon={shieldCheckmark}
                        className="btn btn-light sticky-top border rounded rounded-circle p-2"
                        color="primary"
                        title="Validar Query"
                        style={{ position: 'absolute', top: '0%', left: `100%`, transform: `translate(-50%, -50%)` }}
                        onClick={(e) => validarQuery(queries[index].sql)}
                    />
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
                    <IonTextarea id={`job${id}-sql`}
                        className="form-control text-start m-0 p-0"
                        aria-label="With textarea"
                        autoGrow={true}
                        placeholder={`Insira o comando SQL aqui`}
                        onIonChange={(e) => preencherQueries(e, index)}
                        value={queries[index].sql}
                    />
                </div>
            </div>
        );
    }

    //Mecânica para adicionar queries ao ConfigJob
    function inputConfigQuerys() {
        if (queries.length === 0) return;

        //Gerando preenchimento dinâmico para as ConfigQuery's cadastradas
        const queriesDinamicas = jobExec.queries
            .filter((queryDto) => queryDto.filtros.length > 0)
            .map((queryDto, queryIndex) =>
                <div key={queryIndex}
                    className="position-relative text-dark card bg-white mx-3 mt-1 mb-4 pt-2 pb-4 px-2"
                >
                    <IonIcon icon={shieldCheckmark}
                        className="btn btn-light border rounded rounded-circle p-2"
                        color="primary"
                        title="Validar Query"
                        style={{ position: 'absolute', top: '0%', left: `100%`, transform: `translate(-50%, -50%)` }}
                        onClick={(e) => validarQuery(queries[queryIndex])}
                    />
                    <IonLabel className="badge bg-info mx-1 sticky-top"
                        key={queryIndex}
                        style={{ position: 'absolute', top: '0%', left: `0%`, transform: `translate(0%, -50%)` }}
                    >
                        {queryDto.tabela}
                    </IonLabel>
                    {queryDto.descricao}<br />
                    <div className="font-monospace small card text-secondary my-2 px-2 ">
                        {queryDto.dinamico ? queryDto.sql : null}
                    </div>
                    {
                        queryDto.filtros.map((filtro, filtroIndex) =>
                            <IonItem className="text-primary card" key={queryIndex * filtroIndex}>
                                <IonLabel className="fw-bold">{filtro.coluna + ":"}</IonLabel>
                                <IonInput placeholder={filtro.tipo}
                                    value={filtro.valor}
                                    onIonChange={(e) => preencherConfigQueries(e, queryIndex, filtroIndex)}
                                />
                            </IonItem>
                        )
                    }
                </div>
            );
        //Adicionando preenchimento manual para as ConfigQuery's pendentes 
        const queriesManuais = jobExec.queries.filter((tabela) => tabela.filtros.length < 1)
            .map((tabela, index) => inputQuerysManual(tabela, index));

        //Renderização da função
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${id}-sql`}>
                    QUERIES DE CONSULTA
                </label>
                {queriesDinamicas}
                {queriesManuais}
            </div>
        );
    }

    //Mecânica para adicionar cargas ao ConfigJob
    function inputCarga() {
        if (jobExec.cargas.length === 0) return;
        return (


            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary pb-0 mb-0" htmlFor={`job${id}-carga`}>
                    CARGAS DE ENTRADA
                </label>
                {
                    jobExec.cargas.map((carga, index) => {
                        return (
                            <div key={index} className="position-relative mx-3 mt-1 mb-4 pt-2 pb-4 px-2">
                                <IonLabel className="badge bg-info mx-1 sticky-top"
                                    style={{ position: 'absolute', top: '0%', rigth: `100%` }}
                                >
                                    {jobInfo.mascaraEntrada[index]}
                                </IonLabel>
                                <form action="/upload" method="post" encType="multipart/form-data" className="py-0my-0" >
                                    <label htmlFor="formFile" className="form-label " ></label>
                                    <input className="form-control " type="file" id="formFile" /> {/* onChange={getFile} */}
                                </form>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    const validarQuery = async (comandoSql: ComandoSQL | string) => {
        console.log(`[CARD-JOB]: Iniciando requisição 'Validar ConfigQuery'.`);
        notificacao.toastInfo("VALIDAR QUERY: Em execução...", []);
        try {
            const resultado: string = await axiosRequest.validarQuery(comandoSql);
            notificacao.toastOk(`VALIDAR SQL: ${resultado}`, []);
            console.log(`[CARD-JOB]: Requisição 'Validar ConfigQuery' funcionou.`);
        }
        catch (error) {
            notificacao.toastErro(`VALIDAR QUERY: ${error}`, []);
            console.error(`[CARD-JOB]: Requisição 'Validar ConfigQuery' falhou.`);
        }
    }

    if (!jobExec) return null;
    return (
        <IonRow className="ion-align-items-center ion-justify-content-between w-100">
            <IonItem className="w-100 border-bottom" lines="none">
                <IonLabel className="p-0 m-0">
                    <IonReorder slot="start" className='w-100 ion-align-items-center'>
                        <IonItem className='text-secondary container w-100 p-0 m-0' lines='none'>
                            <span><IonIcon icon={reorderFour} /></span>
                            <span><small className="p-0 m-0">Nº{jobExec.ordem}</small></span>
                            <span><IonIcon icon={reorderFour} /></span>
                            <IonCard target="_self" className="bg-primary w-100 border border-2 px-1 py-1">
                                <span>
                                    <span className="ms-1 badge bg-white me-1 text-primary">
                                        ID <span>{id}</span>
                                    </span>
                                    <span className="ms-1 font-monospace text-white fw-bold">
                                        {jobExec.nome}
                                    </span>
                                </span>
                            </IonCard>
                        </IonItem>
                    </IonReorder>
                </IonLabel>
                <IonButton fill="clear" shape="round" onClick={(e) => modalParamOn()} >
                    <IonIcon icon={settings} />
                </IonButton>
            </IonItem>
        </IonRow>

    );
};

export default JobCard;