import { InputChangeEventDetail, IonBadge, IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonReorder, IonRow, IonTextarea, TextareaChangeEventDetail, useIonModal } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { JobConfig } from "../data/JobConfigDTO";
import { ComandoSQL } from "../data/ComandoSQL";
import { reorderFour, settings, shieldCheckmark, trash } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/ReduxStore";
import * as axiosRequest from "../data/AxiosRequest";
import { Notificacao } from "./Noticacao";
import DynamicModal from "./DynamicModal";
import { JobInfoDTO } from "../data/JobInfoDTO";
import { removeOneMainJob, updateOneMainJob } from "../Store/Reducer/ReducerAtividade";
import { FiltroSQL } from "../data/FiltroSQL";

export interface JobCardProps {
    jobExec: JobConfig,
    //jobUserInput: JobConfig,
    notificacao: Notificacao,
    callback: () => void
}

const JobCard: React.FC<JobCardProps> = ({ jobExec, notificacao, callback }) => {
    //Atributos principais de controle
    const dispatch = useDispatch();
    const id = jobExec.id;
    const jobInfo: JobInfoDTO = useSelector((state: RootState) => state.store.catalogoJobs.catalago)
        .filter((item) => item.id === id)[0];
    const [jobConfigurado, setJobConfigurado] = useState<JobConfig>({...jobExec});
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    
    //Atributos para padrões de estilização
    const textoCodigo = (texto: string) => <span className="mx-1 font-monospace">{texto}</span>;
    const labelTitulo = (texto: string, htmlIdFor: string) => {
        return <label className="form-label fw-bold text-white pb-1 mb-0" htmlFor={htmlIdFor}>
            {texto}
        </label>
    };
    const badgeInfo = (texto: string, x: number, y: number) => {
        return <IonBadge color='tertiary' 
            className="border m-1 sticky-top text-start ion-justify-content-start"
            style={{position: 'absolute', top: `0%`, left: `0%`, transform: `translate(${x}%, ${y}%)`}}
        >
            {texto}
        </IonBadge>
    };

    //Método chamado quando este componente fica visível
    useEffect(() => {
        console.log(`[CARD-JOB] JobConfig: ${JSON.stringify(jobExec)}`);
        console.log(`[CARD-JOB] Queries: ${JSON.stringify(jobExec.queries)}`);
        //console.log(`[CARD-JOB] jobExec.queries:  ${jobExec.queries.map((item) => JSON.stringify(item)).join('\n')}.`);
        //console.log(`[CARD-JOB] jobUserInput.queries: ${jobConfigurado.queries.map((item) => JSON.stringify(item)).join('\n')}.`);
    }, [jobExec]); 

    //Método para salvar este JobCard (objeto ConfigJob) preenchido pelo usuário no banco
    async function salvandoItem() {
        dispatch(updateOneMainJob(jobConfigurado));
    }

    //Método de tratamento dos inputs do usuário para os Parâmetros
    const preencherParametro = (event: CustomEvent<InputChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novosParam = [...jobConfigurado.argumentos];
        novosParam[index] = value.trim();
        setJobConfigurado( {...jobConfigurado, argumentos: novosParam} );
        console.log(`[CARD-JOB] ${jobConfigurado.nome} parâmetro[${index}] = ${jobConfigurado.argumentos[index]}.`);
    }

    //Método de tratamento dos inputs do usuário para as Queries (manuais)
    const preencherQueries = (event: CustomEvent<TextareaChangeEventDetail>, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const novasQueries = [...jobConfigurado.queries];
        novasQueries[index] = {
            campos: novasQueries[index].campos,
            nome: novasQueries[index].nome,
            filtros: [],
            sql: value,
            descricao: novasQueries[index].descricao,
            dinamico: false,
        };
        setJobConfigurado( {...jobConfigurado, queries: novasQueries} );
        console.log(
            `[CARD-JOB] ${jobConfigurado.nome} query[${index}]='${jobConfigurado.queries[index].nome}', sql='${jobConfigurado.queries[index].sql}'.`
        );
    }

    //Método de tratamento dos inputs do usuário para as ConfigQueries (automáticas)
    const preencherConfigQueries = (event: CustomEvent<InputChangeEventDetail>, queryIndex: number, filtroIndex: number) => {
        const value = (event.target as HTMLInputElement).value;
        
        const novasQueries = [...jobConfigurado.queries];
        const novosFiltros: FiltroSQL[] = [...novasQueries[queryIndex].filtros]
            .map((item, index) => {
                if (index === filtroIndex) {
                    return {
                        coluna: item.coluna,
                        valor: value,
                        tipo: item.tipo,
                    };
                }
                return item; 
            });

        novasQueries[queryIndex] = {
            campos: novasQueries[queryIndex].campos,
            nome: novasQueries[queryIndex].nome,
            filtros: novosFiltros,
            sql: novasQueries[queryIndex].sql,
            descricao: novasQueries[queryIndex].descricao,
            dinamico: novasQueries[queryIndex].dinamico,
        };

        setJobConfigurado( {...jobConfigurado, queries: novasQueries} );
        console.log(
            `[CARD-JOB] ${jobConfigurado.nome} config-query[${queryIndex}]='${jobConfigurado.queries[queryIndex].nome}', filtro[${filtroIndex}]='${jobConfigurado.queries[queryIndex].filtros[filtroIndex].valor}'.`
        );
    }

    //Método de tratamento dos inputs do usuário para as Cargas
    function preencherCarga(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const file = e.target.files?.[0];

        if (!file) {
            console.log(`[CARD-JOB]: Usuário solicitou remover arquivo para carga[${index}] do Job '${jobInfo.nome}'.`);
            console.log(`[CARD-JOB]: Removendo arquivo '${jobConfigurado.cargas[index].nome}'.`);
            const novasCargas = [...jobConfigurado.cargas];
            novasCargas[index] = {
                nome: "",
                conteudo: "",
                tipo: "",
            };
            setJobConfigurado( {...jobConfigurado, cargas: novasCargas} );
            return;
        }

        console.log(`[CARD-JOB]: Usuário enaminhou arquivo para carga[${index}] do Job '${jobInfo.nome}'.`);
        console.log(`[CARD-JOB]: Anexando arquivo '${file.name}'.`);
        const maxByteSize = 1 ; // 1MB
        if (file.size > (maxByteSize * 1024 * 1024)) {
            const mensagem = `Tamanho do arquivo excede o limite de ${maxByteSize}MB.`;
            console.warn(mensagem);
            notificacao.toastErro(mensagem, []);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const novasCargas = [...jobConfigurado.cargas];
            novasCargas[index] = {
                nome: file.name,
                conteudo: reader.result as string,
                tipo: file.type,
            };
            setJobConfigurado( {...jobConfigurado, cargas: novasCargas} );
        };
        reader.readAsText(file);
        notificacao.toastOk(`Arquivo '${jobConfigurado.cargas[index].nome}' carregado com sucesso.`, []);
    }

    //Método de tratamento para remoer arquivos de Cargas
    function removerCarga(index: number) {
        
        if (jobConfigurado.cargas.length < index) return;
        console.log(`[CARD-JOB]: Usuário solicitou remover arquivo para carga[${index}] do Job '${jobInfo.nome}'.`);
        console.log(`[CARD-JOB]: Removendo arquivo '${jobConfigurado.cargas[index].nome}'.`);
        const novasCargas = [...jobConfigurado.cargas];
        novasCargas[index] = {
            nome: "",
            conteudo: "",
            tipo: "",
        };
        setJobConfigurado( {...jobConfigurado, cargas: novasCargas} );
    }

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

    //Exibindo os campos de Parâmetros
    function camposInputParametros() {
        if (jobExec.argumentos.length < 1) return;
        return (
            <div className="px-1 mb-2">
                {labelTitulo('PARÂMETROS DE ENTRADA', `job${id}-param`)}
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

    //Mecânica auxiliar para identificar e exibir as queries (veja mais no método 'camposInputQueries')
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
                    { badgeInfo(cmdSql.nome, 0, -50) }
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

    //Exibindo os campos de Queries 
    const camposInputQueries = () => {
        if (jobExec.queries.length < 1) return null;
        //Gerando preenchimento dinâmico para as ConfigQuery's cadastradas
        const queriesDinamicas = jobConfigurado.queries
            .filter((cmdSql) => cmdSql.dinamico)
            .filter((cmdSql) => cmdSql.filtros.length > 0)
            .map((cmdSql, queryIndex) =>
                <div key={queryIndex} className="position-relative glass mx-3 mt-2 mb-4 py-3 px-2">
                    <IonIcon icon={shieldCheckmark}
                        className="btn btn-info border rounded rounded-circle p-2"
                        color="tertiary"
                        title="Validar Query"
                        style={{ position: 'absolute', top: '0%', left: `100%`, transform: `translate(-50%, -50%)` }}
                        onClick={(e) => validarQuery(jobConfigurado.queries[queryIndex])}
                    />
                    {badgeInfo(cmdSql.nome, 0, -50)}
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

    //Exibindo campos de Cargas do Job
    function camposInputCargas() {
        if (!jobInfo.mascaraEntrada || jobInfo.mascaraEntrada.length === 0 || jobConfigurado.cargas.length === 0) return;
        return (
            <div className="px-1 mb-2">
                {labelTitulo('CARGAS DE CONSUMO', `job${id}-carga`)}
                {
                    //form-label
                    jobInfo.mascaraEntrada.map((item, index) => 
                        {
                            const arquivoNome = (jobConfigurado.cargas[index].nome.length > 0) ?
                                jobConfigurado.cargas[index].nome : 
                                "Nenhum arquivo selecionado";
                            const nomeCor = (jobConfigurado.cargas[index].nome.length > 0) ?
                                'light' : "primary";
                            const nomeOpacidade = (jobConfigurado.cargas[index].nome.length > 0) ?
                                '100' : "20";
                            const enableRemove = (jobConfigurado.cargas[index].nome.length > 0) ?
                                true : false;

                            return <div key={index} className="position-relative glass mx-3 mt-2 mb-4 py-3 px-2">
                                {badgeInfo(item, 0, -50)}
                                <form action="/upload" method="post" encType="multipart/form-data" className="" >

                                <label htmlFor="formFile" className="form-label">
                                    Escolha um Arquivo
                                    <span className="px-2 bg-transparent" style={{
                                        position: "absolute", 
                                        top:"24px", 
                                        color: `var(--ion-color-${nomeCor})`,
                                        opacity: `${nomeOpacidade}` 
                                    }}>
                                        {arquivoNome}
                                    </span>
                                </label>
                                <input className="form-control" 
                                    type="file" 
                                    id="formFile" 
                                    accept=".log, .txt, .err, .gz"
                                    multiple={false}
                                    onChange={e => preencherCarga(e, index)} 
                                />
                                </form>
                            </div>
                        }
                    )
                }
            </div>
        );
    }

    //Faz a validação da query já preenchida (tanto manual, quanto autmática)
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

    //Criando a Modal desse componente
    const [modalParamOn, modalParamOff] = useIonModal(
        DynamicModal,
        {
            titulo: <>
                <span className="badge bg-white me-1 text-primary">ID {id}</span>
                {jobExec.nome}
            </>,
            elemento: <div className="p-2">
                {informacoes()}
                {camposInputParametros()}
                {camposInputQueries()}
                {camposInputCargas()}
            </div>,
            onDismiss: () => {
                salvandoItem();
                modalParamOff()
            }
        }
    );

    //const abrirModalInfo = async () => {
    //    if (jobInfo.tabelas.length < 1) {
    //        modalParamOn();
    //        return;
    //    }
    //    console.log(`[CARD-JOB]: Iniciando requisição 'Obter ConfigQueries'.`);
    //    notificacao.toastInfo("OBTER QUERIES: Em execução...", []);
    //    try {
    //        const resultado: ComandoSQL[] = await axiosRequest.getJobConfigQueries(id);
    //        notificacao.toastOk(`OBTER QUERIES: Total de ${resultado.length} registro(s) obtido(s).`, []);
    //        setJobConfigurado( {...jobConfigurado, queries: resultado} );
    //        console.log(`[CARD-JOB]: Requisição 'Obter ConfigQueries' funcionou.`);
    //    }
    //    catch (error) {
    //        notificacao.toastErro(`OBTER QUERIES: ${error} Mas você pode criar e preencher queries manualmente.`, []);
    //        console.error(`[CARD-JOB]: Requisição 'Obter ConfigQueries' falhou.`);
    //    }
    //    modalParamOn();
    //}

    //Renderização do componente
    if (!jobExec) return null;
    return (
        <IonRow className="ion-align-items-center ion-justify-content-between w-100">
            <IonItem className="w-100 border-bottom" lines="none">
                <IonLabel className="p-0 m-0">
                    <IonReorder slot="start" className='w-100 ion-align-items-center'>
                        <IonItem className='container w-100 p-0 m-0' lines='none' >
                            <span><IonIcon icon={reorderFour} /></span>
                            <span><small className="text-white p-0 m-0 h6">Nº{jobExec.ordem+1}</small></span>
                            <span><IonIcon icon={reorderFour} /></span>
                            <IonCard target="_self" className="w-100 border border-2 px-1 py-1 h6" color="tertiary">
                                <span>
                                    <span className="ms-1 badge bg-white me-1 text-dark">
                                        ID <span>{id}</span>
                                    </span>
                                    <span className=" font-monospace text-white text-wrap">
                                        {jobExec.nome}
                                    </span>
                                </span>
                            </IonCard>
                        </IonItem>
                    </IonReorder>
                </IonLabel>
                <IonButton fill="clear" shape="round" size='large' onClick={() => modalParamOn()} >
                    <IonIcon icon={settings} size='large' color='light' />
                </IonButton>
                <IonButton fill="clear" shape="round" size='large' onClick={ () => dispatch(removeOneMainJob(id)) }>
                    <IonIcon icon={trash} size='large' color='light' />
                </IonButton>
            </IonItem>
        </IonRow>
    );
};

export default JobCard;