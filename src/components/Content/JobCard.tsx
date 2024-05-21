import { InputChangeEventDetail, IonBadge, IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonReorder, IonRow, IonTextarea, TextareaChangeEventDetail, useIonModal } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { JobCarga, JobConfig } from "../../data/JobConfigDTO";
import { ComandoSQL } from "../../data/ComandoSQL";
import { reorderFour, save, settings, shieldCheckmark, trash } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import DynamicModal from "../Core/DynamicModal";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addMensagem, atualizarMensagem, removeOneMainJob, updateOneMainJob } from "../../Store/Reducer/ReducerAtividade";
import { FiltroSQL } from "../../data/FiltroSQL";
import Botao from "../Core/Botao";
import Uploader from "../Core/Uploader";

export interface JobCardProps {
    index: number,
    //jobExec: JobConfig,
    //jobUserInput: JobConfig,
}

const JobCard: React.FC<JobCardProps> = ({ index }) => {
    //Atributos principais de controle
    const dispatch = useDispatch();
    const jobExec: JobConfig | undefined = useSelector((state: RootState) => state.store.configAtividade.mainJobs)[index];
    const id = jobExec != undefined ? jobExec.id : -1;
    const nome = jobExec !== undefined ? jobExec.nome : "";
    const jobInfo: JobInfoDTO | undefined = useSelector((state: RootState) => state.store.catalogoJobs.catalogo)
        .filter((item) => item.id === id)[0];
    const [jobConfigurado, setJobConfigurado] = useState<JobConfig>({...jobExec});
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    
    //Atributos para padrões de estilização
    const textoCodigo = (texto: string, info: string) => {
        return <span className="mx-1">
            <span className="text-white">{texto}</span> <span className="font-monospace">{info}</span>
        </span>
    };
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
        //console.log(`[CARD-JOB] JobConfig: ${JSON.stringify(jobExec)}`);
        //console.log(`[CARD-JOB] Queries: ${JSON.stringify(jobExec.queries)}`);
        //console.log(`[CARD-JOB] jobExec.queries:  ${jobExec.queries.map((item) => JSON.stringify(item)).join('\n')}.`);
        //console.log(`[CARD-JOB] jobUserInput.queries: ${jobConfigurado.queries.map((item) => JSON.stringify(item)).join('\n')}.`);
    }, [jobExec]); 

    //Método para salvar este JobCard (objeto ConfigJob) preenchido pelo usuário no banco
    async function salvandoItem() {
        console.log(JSON.stringify(jobConfigurado));
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
    const preencherCarga = (files: FileList | null) => {
        const mensagemId = `Set_Cargas@${Date.now()}`;
        try {
            if (!files || files.length < 1) {
                dispatch(addMensagem({ 
                    id: mensagemId, 
                    texto: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Arquivos de carga removidos.`,
                    status: 'INFO'
                }));
                setJobConfigurado({ ...jobConfigurado, cargas: [] });
                return;
            }
            const novasCargas = [...jobConfigurado.cargas];
            let sucessos = 0;
            for (let index = 0; index < files.length; index++) {
                const file = files?.[index];
                console.log(`[CARD-JOB]: Anexando arquivo '${file.name}'.`);
                const reader = new FileReader();
                reader.onload = () => {
                    const cargaNova: JobCarga = {
                        nome: file.name,
                        conteudo: reader.result as string,
                        tipo: file.type,
                    };
                    if (novasCargas.length <= index)
                        novasCargas.push(cargaNova);
                    else
                        novasCargas[index] = cargaNova;
                };
                reader.readAsText(file);
                console.log(`[CARD-JOB]: Arquivo '${file.name}' anexado com sucesso.`);
                sucessos++;
            }
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Total de ${sucessos}/${files.length} de carga(s) carregadas com sucesso.`,
                status: 'INFO'
            }));
            setJobConfigurado( {...jobConfigurado, cargas: novasCargas} );
        }
        catch (error) {
            //e.target.value = '';
            /*
            let errorMessage: string;

            if (typeof error === "string")
              errorMessage = error;
            else if (error instanceof Error)
              errorMessage = error.message;
            else
              errorMessage = String(error);
            */
            //console.warn(errorMessage);
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Erro no processo de carga. ${error}`,
                status: 'INFO'
            }));
        }
    }

    //Exibindo dados do Job no card
    const informacoes = () => {
        if (!jobInfo || !jobExec) return;
        
        const sessaoes: JSX.Element[] = [];
        
        if (jobInfo.executarAposJob.length > 0)
            sessaoes.push(textoCodigo("Executar após IDs:", jobInfo.executarAposJob.join(", ")));
        if (jobInfo.programa.length > 0)
            sessaoes.push(textoCodigo("Programas: ", jobInfo.programa.join(", ")));
        if (jobInfo.grupoUda.length > 0)
            sessaoes.push(textoCodigo(`Grupo: `, `UDA${jobInfo.grupoUda}`));
        sessaoes.push(textoCodigo(`Descrição: `, jobInfo.descricao));
        
        return (
            <>
                {labelTitulo('INFORMAÇÕES', `job${id}-param`)}
                <div className="glass mx-4 mt-1 mb-4 pt-2 pb-4 px-2">
                    {
                        sessaoes.map((item, index) => <div key={index}>{item}</div>)
                    }
                </div>
            </>
        );
    }

    //Exibindo os campos de Parâmetros
    const camposInputParametros = () => {
        if (!jobExec || jobExec.argumentos.length < 1 || !jobInfo) return;
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
        if (!jobInfo || !jobExec) return;
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
        if (!jobInfo || !jobExec || jobExec.queries.length < 1) return null;
        
        //Gerando preenchimento dinâmico para as ConfigQuery's cadastradas
        const queriesDinamicas = jobConfigurado.queries
            .filter((cmdSql) => cmdSql.dinamico)
            //.filter((cmdSql) => cmdSql.filtros.length > 0)
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
    const camposInputCargas = () => {
        if (!jobInfo || !jobExec || !jobInfo.mascaraEntrada || jobInfo.mascaraEntrada.length === 0) 
            return;
        return (
            <div className="px-1 mb-2">
                {labelTitulo('CARGAS DE CONSUMO', `job${id}-carga`)}
                {
                    jobInfo.mascaraEntrada.map((item, index) => <Uploader 
                            key={index} 
                            accept=".log, .txt, .gz" 
                            arquivosAtuais={jobExec.cargas.map(item => item.nome)}
                            multiple={true}
                            titulo={item}
                            trigger={(arquivos) => preencherCarga(arquivos)}
                        />
                    )
                }
            </div>
        );
    }

    //Faz a validação da query já preenchida (tanto manual, quanto autmática)
    const validarQuery = async (comandoSql: ComandoSQL | string) => {
        const mensagemId = `Check_Query@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Validando query.`,
            status: 'INFO'
        }));
        try {
            const resultado: string = await axiosRequest.validarQuery(mainAmbienteId, comandoSql);
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${resultado}`,
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
    }

    //Criando a Modal desse componente
    const [modalParamOn, modalParamOff] = useIonModal(DynamicModal,
        {
            titulo: <>
                        <span className="badge bg-white me-1 text-primary">ID {id}</span>
                        {nome}
                    </>,
            elemento: <div className="p-2">
                        {informacoes()}
                        {camposInputParametros()}
                        {camposInputQueries()}
                        {camposInputCargas()}
                        <div className="d-flex ion-justify-content-end me-2 pe-1">
                            <Botao icon={save} texto="Salvar" handler={salvandoItem} />
                        </div>
                    </div>,
            onDismiss: () => modalParamOff(),
        }
    );

    //Renderização do componente
    if (!jobExec || !jobInfo) return null;
    return (
        <IonRow className="ion-align-items-center ion-justify-content-between w-100">
            <IonItem className="w-100 border-bottom" lines="none">
                <IonLabel className="p-0 m-0">
                    <IonReorder slot="start" className='w-100 ion-align-items-center'>
                        <IonItem className='container w-100 p-0 m-0' lines='none' >
                            <span><IonIcon icon={reorderFour} /></span>
                            <span><small className="text-white p-0 m-0 h6">Nº{jobExec.ordem}</small></span>
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
                <IonButton fill="clear" shape="round" size='large' onClick={() => modalParamOn({cssClass: 'modal-job-card'})} >
                    <IonIcon icon={settings} size='large' color='light' />
                </IonButton>
                <IonButton fill="clear" shape="round" size='large' onClick={ () => dispatch(removeOneMainJob(index)) }>
                    <IonIcon icon={trash} size='large' color='light' />
                </IonButton>
            </IonItem>
        </IonRow>
    );
};

export default JobCard;