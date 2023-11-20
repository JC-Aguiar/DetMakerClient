import { InputChangeEventDetail, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonText, IonTextarea, SelectChangeEventDetail, TextareaChangeEventDetail, ToastButton, useIonModal, useIonToast, useIonViewDidEnter } from "@ionic/react";
import React, { ChangeEvent, useState } from "react";
import { JobConfigDTO } from "../data/JobExecute";
import { ComandoSQL } from "../data/ComandoSQL";
import { codeWorking } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { setItemPilhaStatus } from "../Store/Reducer/ReducerPilhaJobs";
import * as axiosRequest from "../data/AxiosRequest";
import { FiltroSQL } from "../data/FiltroSQL";
import { Console } from "console";

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
    const jobExec: JobConfigDTO = pilhaExec.filter((itemPilha) => itemPilha.job.id === id)[0];
    let parametros: string[] = jobExec.argumentos;
    let queries: ComandoSQL[] = JSON.parse(JSON.stringify(jobExec.queries));
    let cargas: string[] = jobExec.cargas;
    let pronto: boolean = jobExec.pronto;
    let ordem: number = jobExec.ordem;
    const [ordemVO, setOrdemVO] = useState<number>(ordem);

    //Modelo de Toast usado pelo componente
    const [toast, toastOff] = useIonToast();
    const acionarToast = (mensagem: string, tempo: number, cor: string, buttons: ToastButton[]) => {
        toast({
            message: mensagem,
            duration: tempo,
            position: 'bottom',
            color: cor,
            buttons: buttons,
        });
    };

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
                    { inputOrdem() }
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
    useIonViewDidEnter(() => {
        if (!jobExec) return;
        console.log(`[CARD-JOB] Renderizando card do job ${jobExec.job.nome}.`);
    }, []);

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
        const statusOrdem = ordem !== null && ordem >= 0;
        pronto = (statusQueries && statusOrdem); //&& statusParametros && statusCargas
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
    const abrirModal = async (jobId: number) => {
        //console.log(`[CARD-JOB]: Iniciando requisição 'Coletar ConfigQuery'.`);
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
            modalParamOn();
        //}
    }

    //Gerando configurações do job
    function inputOrdem() {
        return (
            <div className="px-1 py-2 mb-2 text-start">
                <IonLabel className="badge bg-info mx-1 sticky-top"
                    style={{
                        position: 'absolute',
                        top: '0%',
                        left: `2%`,
                        transform: 'translate(0%, 225%)',
                    }}
                >
                    Ordem de Execução
                </IonLabel>
                <select className="form-select" id="floatingSelect"
                    aria-label="Floating label select example"
                    onChange={(e) => preencherOrdem(e)}
                    value={ordemVO}
                >
                {
                    pilhaExec.map((itemPilha) => 
                        <option value={itemPilha.ordem}>Nº {itemPilha.ordem}</option>
                    )
                }
                </select>
            </div>
        );
    }

    function inputParametros() {
        if (jobExec.job.parametros.length === 0) return;
        return (
            <div className="px-1 mb-2">
                <label className="form-label fw-bold text-primary" htmlFor={`job${jobExec.job.id}-param`}>
                    PARÂMETROS DE EXECUÇÃO
                </label>
                {
                    jobExec.job.parametros.map((param, index) => {
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
    function inputQuerysManual(comandoSql: ComandoSQL, index: number) {
        return (
            <div className="px-1 mb-2">
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
        const queriesDinamicas = jobExec.queries.filter((queryDto) => queryDto.filtros.length > 0)
            .map((queryDto, queryIndex) => 
                <div key={queryIndex}
                    className="position-relative text-dark border border-1 bg-white rounded-3 mx-3 mt-1 mb-4 py-3 px-2"
                >
                    <IonLabel className="badge bg-info mx-1 sticky-top"
                        key={queryIndex}
                        style={{position: 'absolute', top: '0%', left: `0%`, transform: `translate(0%, -50%)`}}
                    >
                        {queryDto.tabela}
                    </IonLabel>
                    {queryDto.descricao}<br/>
                    {
                        queryDto.filtros.map((filtro, filtroIndex) => 
                            <IonItem className="text-primary" key={queryIndex * filtroIndex}>
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
                <div className="lh-1 py-2 text-dark">
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
                        <IonButton id="session-login-button" fill="solid" onClick={() => abrirModal(jobExec.job.id)} >
                            <IonIcon icon={codeWorking} size='large' />
                            <IonText className="session-buttons">
                                Configurar Job
                            </IonText>
                        </IonButton>
                    </div>

                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default JobCard;