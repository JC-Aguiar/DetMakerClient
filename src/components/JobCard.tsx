import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonReorder, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, TextareaChangeEventDetail, useIonModal, useIonViewDidEnter } from "@ionic/react";
import React, { ChangeEvent, useState } from "react";
import { JobConfigDTO } from "../data/JobExecute";
import { ComandoSQL } from "../data/ComandoSQL";
import { codeWorking, reorderFour, settings, shieldCheckmark } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { setItemPilhaStatus } from "../Store/Reducer/ReducerPilhaJobs";
import * as axiosRequest from "../data/AxiosRequest";
import { FiltroSQL } from "../data/FiltroSQL";
import { Noticacao } from "./Noticacao";

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
    const pilhaExec = useSelector((state: RootState) => state.store.pilhaJobs.value)
        .filter((itemPilha) => itemPilha.job.checked);
    const jobExec: JobConfigDTO = pilhaExec.filter((itemPilha) => itemPilha.job.id === id)[0];
    let parametros: string[] = jobExec.argumentos;
    let queries: ComandoSQL[] = JSON.parse(JSON.stringify(jobExec.queries));
    let cargas: string[] = jobExec.cargas;
    let pronto: boolean = jobExec.pronto;

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
                    { jobInfos() }
                    { inputParametros() }
                    { inputConfigQuerys() }
                    { inputCarga() }
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

    //Método chamado quando este componente fica visível
    //useIonViewDidEnter(() => {
    //    if (!jobExec) return;
    //    console.log(`[CARD-JOB] Renderizando card do job ${jobExec.job.nome}.`);
    //}, []);

    //Método para callback á página {@link ConfigurarJobs}, enviando o {@link JobExecute} do card e suas respectivas
    //configurações e seu respectivo index
    async function salvandoItem() {
        //const statusParametros = parametros.length === 0 || parametros.every((param) => param.trim().length > 0);
        const statusQueries = queries.length === 0 || queries.every((comandoSql) => {
            if (comandoSql.dinamico) {
                return comandoSql.filtros.every((filtroSql) => filtroSql.valor.length > 0);
            }
            return comandoSql.sql && comandoSql.sql.length > 0;
        });
        //const statusCargas = cargas.length === 0 || cargas.every((carga) => carga.trim().length > 0);
        pronto = (statusQueries); //&& statusParametros && statusCargas
        try {
            //if (itemPilha.argumentos === parametros
            //    && itemPilha.cargas === cargas
            //    && itemPilha.ordem === ordem
            //    && itemPilha.queries === queries
            //    && itemPilha.pronto === pronto)
            //      return;

            console.log(
                `[CARD-JOB] Status do card job [${jobExec.job.id}] ${jobExec.job.nome}: ` + '\n'
                + ` - Status Queries ${statusQueries}` + '\n'
                + ` - Status Pronto = ${pronto}.`
            );
            dispatch(setItemPilhaStatus(
                {
                    id: jobExec.job.id,
                    argumentos: parametros,
                    queries: queries,
                    cargas: cargas,
                    pronto: pronto,
                    ordem: jobExec.ordem,
                }
            ));
        }
        finally {
            callback();
        }
    }

    const preencherParametro = (event: CustomEvent<InputChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novosParam = [...parametros];
        novosParam[index] = value.trim();
        parametros = (novosParam);
        console.log(`[CARD-JOB] ${jobExec.job.nome} parâmetro[${index}] = ${parametros[index]}.`);
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
        queries = (novasQueries);
        console.log(
            `[CARD-JOB] ${jobExec.job.nome} query[${index}] ${queries[index].tabela} = ${queries[index].sql}.`
        );
    }
    const preencherConfigQueries = (event: CustomEvent<InputChangeEventDetail>, queryIndex: number, filtroIndex: number) => {
        const value = (event.target as HTMLInputElement).value;
        queries[queryIndex].filtros[filtroIndex] = {
            ...queries[queryIndex].filtros[filtroIndex],
            valor: value,
        } as FiltroSQL;
        const tabelaAtualizada = queries[queryIndex].tabela;
        const {coluna, tipo, valor} = queries[queryIndex].filtros[filtroIndex];
        console.log(
            `[CARD-JOB] ${jobExec.job.nome} query[${queryIndex}] ${tabelaAtualizada}.${coluna} = ${valor}.`
        );
    }
    const preencherCargas = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = event.detail.value;
        const novasCargas = [...cargas];
        if (value) {
            novasCargas[index] = value != null && value != undefined ? value.trim() : "";
            cargas = (novasCargas);
        }
        console.log(`[CARD-JOB] ${jobExec.job.nome} carga[${index}] = ${cargas[index]}.`);
    }

    //Procedimento para abrir modal com as infos do Job (ao clicar no botão 'CONFIGURAR JOB')
    //
    const abrirModal = (jobId: number) => {
        //console.log(`[CARD-JOB]: Abrindo modal.`);
        //toastOff().then(() => acionarToast("OBTER CONFIG-QUERYs: Em execução...", 5000, 'medium', []));
        //try {
        //    const resultado: ComandoSQL[] = await axiosRequest.getQueries(jobId);
        //    dispatch(setItemPilhaStatus({
        //        id: jobId,
        //        argumentos: jobExec.argumentos,
        //        queries: resultado,
        //        cargas: jobExec.cargas,
        //        pronto: jobExec.pronto,
        //        ordem: jobExec.ordem,
        //    }));
        //    setQueryDinamica(true);
        //    toastOff().then(() => acionarToast("OBTER CONFIG-QUERYs: Realizada com sucesso.", 5000, 'primary', []));
        //    console.log(`[CARD-JOB]: Requisição 'Coletar ConfigQuery' funcionou.`);
        //}
        //catch (error) {
        //    const mensagem = error + ' Por causa do erro, o preenchimento das queries de forma dinâmica está indisponível.'
        //        + ' Preenchimento manual habilitado.'
        //    setQueryDinamica(false);
        //    toastOff().then(() => acionarToast(`OBTER CONFIG-QUERYs: ${mensagem}`, 9900, 'warning', []));
        //    console.error(`[CARD-JOB]: Requisição 'Coletar ConfigQuery' falhou.`);
        //}
        //finally {
        //    modalParamOn();
        //}
    }

    function jobInfos() {
        let sessaoExecutarApos: JSX.Element | null = null;
        if (jobExec.job.executarAposJob.length > 0) {
            sessaoExecutarApos = <div>Executar após Jobs: 
                {jobExec.job.programa.map((recursos) => <span className="badge bg-info m-0">{recursos}</span>)}
            </div>
        }
        let sessaoProgramas: JSX.Element | null = null; 
        if (jobExec.job.programa.length > 0) {
            sessaoProgramas = <div>Programas: 
                {jobExec.job.executarAposJob.map((idPosJob) => <span className="badge bg-info m-0">{idPosJob}</span>)}
            </div>
        }
        return (
            <>
                <label className="form-label fw-bold text-primary" htmlFor={`job${jobExec.job.id}-param`}>
                    INFORMAÇÕES
                </label>
                <div className="text-dark card bg-white mx-4 mt-1 mb-4 pt-2 pb-4 px-2">
                    {sessaoExecutarApos}
                    {sessaoProgramas}
                    <div className="d-flex">Grupo: <span className="badge bg-info mt-1">UDA{jobExec.job.grupoUda}</span></div>
                    <div className="d-flex">Descrição: {jobExec.job.descricao}</div>
                </div>
            </>
        );
    }

    function inputParametros() {
        if (jobExec.job.parametros.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary pb-0 mb-0" htmlFor={`job${jobExec.job.id}-param`}>
                    PARÂMETROS
                </label>
                {
                    jobExec.job.parametros.map((param, index) => {
                        return (
                            <div className="position-relative mx-3 mt-1 mb-4 pt-2 pb-4 px-2">
                                <IonLabel className="badge bg-info mx-1 sticky-top"
                                    style={{position: 'absolute', top: '0%', rigth: `100%`}}
                                >
                                    {jobExec.job.parametros[index]}
                                </IonLabel>
                                <IonInput id={`job${jobExec.job.id}-param`}
                                    type="text"
                                    className="form-control w-100"
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
    function inputQuerysManual(comandoSql: ComandoSQL, index: number) {
        return (
            <div className="px-1 mb-2">
                <div className="position-relative text-center mx-3 mt-1 mb-4">
                    <IonIcon icon={shieldCheckmark} 
                        className="btn btn-light sticky-top border rounded rounded-circle p-2"
                        color="primary"
                        title="Validar Query"
                        style={{position: 'absolute', top: '0%', left: `100%`, transform: `translate(-50%, -50%)`}}
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
                    <IonTextarea id={`job${jobExec.job.id}-sql`}
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
                        style={{position: 'absolute', top: '0%', left: `100%`, transform: `translate(-50%, -50%)`}}
                        onClick={(e) => validarQuery(queries[queryIndex])}
                    />
                    <IonLabel className="badge bg-info mx-1 sticky-top"
                        key={queryIndex}
                        style={{position: 'absolute', top: '0%', left: `0%`, transform: `translate(0%, -50%)`}}
                    >
                        {queryDto.tabela}
                    </IonLabel>
                    {queryDto.descricao}<br/>
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
                <label className="form-label fw-bold text-primary" htmlFor={`job${jobExec.job.id}-sql`}>
                    QUERIES DE CONSULTA
                </label>
                {queriesDinamicas}
                {queriesManuais}
            </div>
        );
    }
    function inputCarga() {
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
                            <span className='small h-6'>Nº{jobExec.ordem}</span>
                            <span><IonIcon icon={reorderFour} /></span>
                            <IonCard target="_self" className="bg-primary w-100 border border-2 px-1 py-1">
                                <span>
                                    <span className="ms-1 badge bg-white me-1 text-primary">
                                        ID <span>{jobExec.job.id}</span>
                                    </span>
                                    <span className="ms-1 font-monospace text-white fw-bold">
                                        {jobExec.job.nome}
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