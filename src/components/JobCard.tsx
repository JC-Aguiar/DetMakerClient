import { InputChangeEventDetail, IonBadge, IonButton, IonCard, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonReorder, IonRow, IonTextarea, TextareaChangeEventDetail, useIonModal, useIonViewDidEnter } from "@ionic/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { JobConfig } from "../data/JobConfigDTO";
import { ComandoSQL } from "../data/ComandoSQL";
import { reorderFour, settings, shieldCheckmark, trash } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import { setJobs } from "../Store/Reducer/ReducerJobs";
import * as axiosRequest from "../data/AxiosRequest";
import { FiltroSQL } from "../data/FiltroSQL";
import { Notificacao } from "./Noticacao";
import DynamicModal from "./DynamicModal";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { removeOneMainJob, updateOneMainJob } from "../Store/Reducer/ReducerAtividade";

export interface JobCardProps {
    jobExec: JobConfig,
    //jobUserInput: JobConfig,
    notificacao: Notificacao,
    callback: () => void
}

const JobCard: React.FC<JobCardProps> = ({ jobExec, notificacao, callback }) => {
    //Propriedades do componente <JobCard> 
    const dispatch = useDispatch();
    const id = jobExec.id;
    const jobInfo: JobInfoDTO = useSelector((state: RootState) => state.store.catalogoJobs.catalago)
        .filter((item) => item.id === id)[0];
    const [jobConfigurado, setJobConfigurado] = useState<JobConfig>({...jobExec});
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    //let pronto: boolean = jobExec.pronto;

    //Método chamado quando este componente fica visível
    useEffect(() => {
        console.log(`[CARD-JOB] jobExec.queries:  ${jobExec.queries.map((item) => JSON.stringify(item)).join('\n')}.`);
        console.log(`[CARD-JOB] jobUserInput.queries: ${jobConfigurado.queries.map((item) => JSON.stringify(item)).join('\n')}.`);
    }, [jobExec]); 

    //Método para salvar o ConfigJob preenchido pelo usuário no banco
    async function salvandoItem() {
        //const statusParametros = parametros.length === 0 || parametros.every((param) => param.trim().length > 0);


        //const statusQueries = jobUserInput.queries.every((comandoSql) => {
        //    if (comandoSql.dinamico) {
        //        return comandoSql.filtros.every((filtroSql) => filtroSql.valor.length > 0);
        //    }
        //    return comandoSql.sql && comandoSql.sql.length > 0;
        //});


        //const statusCargas = cargas.length === 0 || cargas.every((carga) => carga.trim().length > 0);
        //pronto = (statusQueries); //&& statusParametros && statusCargas
        //if (itemPilha.argumentos === parametros
        //    && itemPilha.cargas === cargas
        //    && itemPilha.ordem === ordem
        //    && itemPilha.queries === queries
        //    && itemPilha.pronto === pronto)
        //      return;
        //const JobConfigurado: JobConfig = {
        //    ...jobExec,
        //    argumentos: jobParametros,
        //    queries: jobQueries,
        //    cargas: jobCargas
        //};
        //console.log(
        //    `[CARD-JOB] Status do card job [${jobExec.id}] ${jobExec.nome}: ` + '\n'
        //    + ` - Status Queries ${statusQueries}` //+ '\n'
        //    //+ ` - Status Pronto = ${pronto}.`
        //);
        dispatch(updateOneMainJob(jobConfigurado));
        //callback();
    }

    const preencherParametro = (event: CustomEvent<InputChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novosParam = [...jobConfigurado.argumentos];
        novosParam[index] = value.trim();
        setJobConfigurado( {...jobConfigurado, argumentos: novosParam} );
        console.log(`[CARD-JOB] ${jobConfigurado.nome} parâmetro[${index}] = ${jobConfigurado.argumentos[index]}.`);
    }
    const preencherQueries = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novasQueries = [...jobConfigurado.queries];
        novasQueries[index] = {
            campos: novasQueries[index].campos,
            tabela: novasQueries[index].tabela,
            filtros: [],
            sql: value,
            descricao: novasQueries[index].descricao,
            dinamico: false,
        };
        setJobConfigurado( {...jobConfigurado, queries: novasQueries} );
        console.log(
            `[CARD-JOB] ${jobConfigurado.nome} query[${index}]='${jobConfigurado.queries[index].tabela}', sql='${jobConfigurado.queries[index].sql}'.`
        );
    }
    const preencherConfigQueries = (event: CustomEvent<InputChangeEventDetail>, queryIndex: number, filtroIndex: number) => {
        const value = (event.target as HTMLInputElement).value;
        const tabelaAtualizada = jobConfigurado.queries;
        tabelaAtualizada[queryIndex].filtros[filtroIndex].valor = value;
        setJobConfigurado( {...jobConfigurado, queries: tabelaAtualizada} );
        console.log(
            `[CARD-JOB] ${jobConfigurado.nome} config-query[${queryIndex}]='${jobConfigurado.queries[queryIndex].tabela}', filtro[${filtroIndex}]='${jobConfigurado.queries[queryIndex].filtros[filtroIndex].valor}'.`
        );
    }

    const textoCodigo = (texto: string) => <span className="mx-1 font-monospace">{texto}</span>;

    const labelTitulo = (texto: string, htmlIdFor: string) => 
        <label className="form-label fw-bold text-white pb-0 mb-0" htmlFor={htmlIdFor}>
            {texto}
        </label>;

    const badgeInfo = (texto: string, x: number, y: number) => {
        return <IonBadge color='tertiary' 
            className="border m-1 sticky-top text-start ion-justify-content-start"
            style={{position: 'absolute', top: `0%`, left: `0%`, transform: `translate(${x}%, ${y}%)`}}
        >
            {texto}
        </IonBadge>
    };
    
    

    //Exibindo dados do Job no card
    function informacoes() {
        let sessaoExecutarApos: JSX.Element | null = null;
        if (jobInfo.executarAposJob.length > 0) {
            sessaoExecutarApos = <div> 
                { textoCodigo("Executar após ID " + jobInfo.executarAposJob.join(", ") + ".") }
            </div>
        }
        let sessaoProgramas: JSX.Element | null = null;
        if (jobInfo.programa.length > 0) {
            sessaoProgramas = <div> 
                { textoCodigo("Programas " + jobInfo.programa.join(", ") + ".") }
            </div>
        }
        let grupoUda: JSX.Element | null = null;
        if (jobInfo.grupoUda.length > 0) {
            grupoUda = <div className="d-flex lh-1">
                { textoCodigo(`Grupo UDA${jobInfo.grupoUda}.`) }
            </div>
        }
        return (
            <>
                {labelTitulo('INFORMAÇÕES', `job${id}-param`)}
                <div className="glass mx-4 mt-1 mb-4 pt-2 pb-4 px-2">
                    {sessaoExecutarApos}
                    {sessaoProgramas}
                    {grupoUda}
                    <div className="d-flex lh-1">
                        {textoCodigo(`${jobInfo.descricao}.`)}
                    </div>
                </div>
            </>
        );
    }

    function camposInputParametros() {
        if (jobExec.argumentos.length < 1) return;
        return (
            <div className="px-1 mb-2">
                {labelTitulo('PARÂMETROS', `job${id}-param`)}
                {
                    jobExec.argumentos.map((param, index) => {
                        return (
                            <div key={index} className="position-relative mx-3 my-1 pt-2 pb-4 px-2">
                                {badgeInfo(jobInfo.parametros[index], 10, -25)}
                                <IonInput id={`job${id}-param`}
                                    type="text"
                                    className="form-control text-white w-100 glass"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    placeholder={jobInfo.descricaoParametros[index]}
                                    onIonChange={(e) => preencherParametro(e, index)}
                                    value={jobConfigurado.argumentos[index]}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    const inputQuerysManual = (cmdSql: ComandoSQL, index: number) => {
        return (
            <div className="px-1 mt-2 mb-2" key={index}>
                <div className="position-relative text-center mx-3 mt-1 mb-4">
                    <IonIcon icon={shieldCheckmark}
                        className="btn btn-info sticky-top border rounded rounded-circle p-2"
                        color="tertiary" 
                        title="Validar Query"
                        style={{ position: 'absolute', top: '0%', left: `100%`, transform: `translate(-55%, -45%)` }}
                        onClick={(e) => validarQuery(jobConfigurado.queries[index].sql)}
                    />
                    { badgeInfo(cmdSql.tabela, 0, -50) }
                    <IonTextarea id={`job${id}-sql`}
                        className="form-control text-white glass text-start m-0 p-0"
                        aria-label="With textarea"
                        autoGrow={true}
                        placeholder={`Insira o comando SQL aqui`}
                        onIonChange={(e) => preencherQueries(e, index)}
                        value={jobConfigurado.queries[index].sql}
                    />
                </div>
            </div>
        );
    }

    //Mecânica para adicionar queries ao ConfigJob
    const camposInputQueries = () => {
        if (jobConfigurado.queries.length < 1) return null;

        //Gerando preenchimento dinâmico para as ConfigQuery's cadastradas
        const queriesDinamicas = jobConfigurado.queries
            .filter((cmdSql) => cmdSql.dinamico)
            .filter((cmdSql) => cmdSql.filtros.length > 0)
            .map((cmdSql, queryIndex) =>
                <div key={queryIndex}
                    className="position-relative glass mx-3 mt-2 mb-4 py-3 px-2"
                >
                    <IonIcon icon={shieldCheckmark}
                        className="btn btn-info border rounded rounded-circle p-2"
                        color="tertiary"
                        title="Validar Query"
                        style={{ position: 'absolute', top: '0%', left: `100%`, transform: `translate(-50%, -50%)` }}
                        onClick={(e) => validarQuery(jobConfigurado.queries[queryIndex])}
                    />
                    {badgeInfo(cmdSql.tabela, 0, -50)}
                    {cmdSql.descricao}
                    <br />
                    <IonCard color="dark" className="font-monospace small opacity-75 mx-0 my-2 px-2 ">
                        {cmdSql.dinamico ? cmdSql.sql : null}
                    </IonCard>
                    {
                        cmdSql.filtros.map((filtro, filtroIndex) =>
                            <IonItem className="text-primary glass" key={queryIndex * filtroIndex}>
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
        const queriesManuais = jobConfigurado.queries
            .filter((cmdSql) => !cmdSql.dinamico)
            .map((cmdSql, index) => inputQuerysManual(cmdSql, index));

        //Renderização da função
        return (
            <div className="px-1 mb-2">
                {labelTitulo('QUERIES DE CONSULTA', `job${id}-sql`)}
                {queriesDinamicas}
                {queriesManuais}
            </div>
        );
    }

    //Mecânica para adicionar cargas ao ConfigJob
    function camposInputCargas() {
        if (!jobInfo.mascaraEntrada || jobInfo.mascaraEntrada.length === 0) return;
        return (
            <div className="px-1 mb-2">
                {labelTitulo('CARGAS DE CONSUMO', `job${id}-carga`)}
                {
                    jobInfo.mascaraEntrada.map((item, index) => 
                        <div key={index} className="position-relative glass mx-3 mt-2 mb-4 py-3 px-2">
                            {badgeInfo(item, 0, -50)}
                            <form action="/upload" method="post" encType="multipart/form-data" className="" >
                                <label htmlFor="formFile" className="form-label" ></label>
                                <input className="form-control" 
                                    type="file" id="formFile" 
                                    onChange={e => preencherCarga(e, index)} 
                                    style={{transform: `translate(0, -8px)`}}
                                /> 
                            </form>
                        </div>
                    )
                }
            </div>
        );
    }

    function preencherCarga(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log(`[CARD-JOB]: Usuário enaminhou arquivo para carga[${index}] do Job '${jobInfo.nome}':`);
        const reader = new FileReader();
        reader.onload = () => {
            const novasCargas = {...jobConfigurado.cargas};
            novasCargas[index] = {
                nome: file.name,
                conteudo: reader.result as string,
                tipo: file.type,
            };
            setJobConfigurado( {...jobConfigurado, cargas: novasCargas} );
            console.log('\n'
                + ` - Nome: ${novasCargas[index].nome}` + '\n' 
                + ` - Tamanho do conteudo: ${novasCargas[index].conteudo.length}` + '\n'
                + ` - Tipo: ${novasCargas[index].tipo}`
            );
        };
        reader.readAsText(file);
    }

    const validarQuery = async (comandoSql: ComandoSQL | string) => {
        console.log(`[CARD-JOB]: Iniciando requisição 'Validar ConfigQuery'.`);
        notificacao.toastInfo("VALIDAR QUERY: Em execução...", []);
        try {
            const resultado: string = await axiosRequest.validarQuery(mainAmbienteId, comandoSql);
            notificacao.toastOk(`VALIDAR SQL: ${resultado}`, []);
            console.log(`[CARD-JOB]: Requisição 'Validar ConfigQuery' funcionou.`);
        }
        catch (error) {
            notificacao.toastErro(`VALIDAR QUERY: ${error}`, []);
            console.error(`[CARD-JOB]: Requisição 'Validar ConfigQuery' falhou.`);
        }
    }

    //Modelo e função da modal usada nos cards
    const jobCardModal = <div className="p-2">
        {informacoes()}
        {camposInputParametros()}
        {camposInputQueries()}
        {camposInputCargas()}
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

    const abrirModalInfo = async () => {
        if (jobInfo.tabelas.length < 1) {
            modalParamOn();
            return;
        }
        console.log(`[CARD-JOB]: Iniciando requisição 'Obter ConfigQueries'.`);
        notificacao.toastInfo("OBTER QUERIES: Em execução...", []);
        try {
            const resultado: ComandoSQL[] = await axiosRequest.getJobConfigQueries(id);
            notificacao.toastOk(`OBTER QUERIES: Total de ${resultado.length} registro(s) obtido(s).`, []);
            setJobConfigurado( {...jobConfigurado, queries: resultado} );
            console.log(`[CARD-JOB]: Requisição 'Obter ConfigQueries' funcionou.`);
        }
        catch (error) {
            notificacao.toastErro(`OBTER QUERIES: ${error} Mas você pode criar e preencher queries manualmente.`, []);
            console.error(`[CARD-JOB]: Requisição 'Obter ConfigQueries' falhou.`);
        }
        modalParamOn();
    }


    if (!jobExec) return null;
    return (
        <IonRow className="ion-align-items-center ion-justify-content-between w-100">
            <IonItem className="w-100 border-bottom" lines="none">
                <IonLabel className="p-0 m-0">
                    <IonReorder slot="start" className='w-100 ion-align-items-center'>
                        <IonItem className='container w-100 p-0 m-0' lines='none' >
                            <span><IonIcon icon={reorderFour} /></span>
                            <span><small className="text-white p-0 m-0">Nº{jobExec.ordem+1}</small></span>
                            <span><IonIcon icon={reorderFour} /></span>
                            <IonCard target="_self" className="w-100 border border-2 px-1 py-1" color="tertiary">
                                <span>
                                    <span className="ms-1 badge bg-white me-1 text-dark">
                                        ID <span>{id}</span>
                                    </span>
                                    <span className="ms-1 font-monospace text-white ">
                                        {jobExec.nome}
                                    </span>
                                </span>
                            </IonCard>
                        </IonItem>
                    </IonReorder>
                </IonLabel>
                <IonButton fill="clear" shape="round" onClick={abrirModalInfo} >
                    <IonIcon icon={settings} color='light' />
                </IonButton>
                <IonButton fill="clear" shape="round" onClick={ () => dispatch(removeOneMainJob(id)) }>
                    <IonIcon icon={trash} color='light' />
                </IonButton>
            </IonItem>
        </IonRow>

    );
};

export default JobCard;