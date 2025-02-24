import { IonCard, IonAccordionGroup, IonAccordion, IonItem, IonCardHeader, IonCardTitle, IonCardContent, IonTitle, IonBadge, IonButton, IonIcon, IonRow, useIonModal, IonLabel, useIonAlert, IonButtons, IonToolbar, IonInput, IonChip, IonCol, IonTextarea, IonSegment, IonSegmentButton, IonFab, IonFabButton } from "@ionic/react";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addCircle, arrowUndo, chevronForwardCircle, close, closeCircle, createOutline, save, server, settings, trash, trashOutline } from "ionicons/icons";
import DynamicModal from "../Core/DynamicModal";
import ModalConfigQuery from "../Modals/ModalConfigQuery";
import { useEffect, useRef, useState } from "react";
import GlassInput from "../Core/GlassInput";
import { useDispatch, useSelector } from "react-redux";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";
import * as AxiosRequest from "../../data/AxiosRequest";
import Informativo from "../Core/Informativo";
import { RootState } from "../../Store/ReduxStore";
import { removeQuery } from "../../Store/Reducer/ReducerQueries";
import { QueryInfoDTO } from "../../data/QueryInfoDTO";
import { removerJobs as removerJobsCatalogo, updateJob } from "../../Store/Reducer/ReducerJobs";
import { removerJobs as removerJobsPiepline } from "../../Store/Reducer/ReducerPipelines";
import Botao from "../Core/Botao";
import { format, FormatOptionsWithLanguage } from "sql-formatter";

export interface JobCardProps {
    jobDto: JobInfoDTO,
    retratil?: boolean,
}

//Componente <JobCard>
const JobCard: React.FC<JobCardProps> = ({ jobDto, retratil = true }) => {

    //Atributos do componente
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [queryIndex, setQueryIndex] = useState<number>(-1);
    const [alerta] = useIonAlert();
    const queries: QueryInfoDTO[] = useSelector(
        (state: RootState) => state.store.catalogoQueries.catalogo.filter(item => item.jobId === jobDto.id)
    );
    const clienteId = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const [jobNome, setJobNome] = useState<string>(
        jobDto.nome
    );
    const [jobDescricao, setJobDescricao] = useState<string>(
        jobDto.descricao
    );
    const [jobDiretorioExec, setJobDiretorioExec] = useState<string>(
        jobDto.caminhoExec
    );
    const [jobParametrosExec, setJobParametrosExec] = useState<string>(
        jobDto.parametros.join("\n")
    );
    const [jobParametrosDescricao, setJobParametrosDescricao] = useState<string>(
        jobDto.descricaoParametros.join("\n")
    );
    const [jobDiretorioCarga, setJobDiretorioCarga] = useState<string>(
        jobDto.diretorioEntrada
    );
    const [jobMascarasCarga, setJobMascarasCarga] = useState<string>(
        jobDto.mascaraEntrada.join("\n")
    );
    const [jobDiretorioLog, setJobDiretorioLog] = useState<string>(
        jobDto.diretorioLog
    );
    const [jobMascarasLog, setJobMascarasLog] = useState<string>(
        jobDto.mascaraLog.join("\n")
    );
    const [jobDiretorioRemessa, setJobDiretorioRemessa] = useState<string>(
        jobDto.diretorioSaida
    );
    const [jobMascarasRemessa, setJobMascarasRemessa] = useState<string>(
        jobDto.mascaraSaida.join("\n")
    );

    useEffect(() => {
        setJobNome(jobDto.nome);
        setJobDescricao(jobDto.descricao);
        setJobDiretorioExec(jobDto.caminhoExec);
        setJobParametrosExec(jobDto.parametros.join("\n"));
        setJobParametrosDescricao(jobDto.descricaoParametros.join("\n"));
        setJobDiretorioCarga(jobDto.diretorioEntrada);
        setJobMascarasCarga(jobDto.mascaraEntrada.join("\n"));
        setJobDiretorioLog(jobDto.diretorioLog);
        setJobMascarasLog(jobDto.mascaraLog.join("\n"));
        setJobDiretorioRemessa(jobDto.diretorioSaida);
        setJobMascarasRemessa(jobDto.mascaraSaida.join("\n"));
    }, [jobDto]);

    const configSqlFormatter: FormatOptionsWithLanguage = {
        tabWidth: 2,
        useTabs: true,
        language: 'plsql',
        keywordCase: 'upper',
        dataTypeCase: 'upper',
        functionCase: 'upper',
        identifierCase: 'upper',
        indentStyle: "tabularLeft",
        logicalOperatorNewline: "before",
        linesBetweenQueries: 2,
    };

    //Atributo da modal acionada pelo componente
    const [modalQueryOn, modalQueryOff] = useIonModal(DynamicModal,
        {
            titulo: <>
                <div>Editar Query</div>
                <IonBadge color="tertiary" className="">{jobDto.nome}</IonBadge>
                <IonBadge color="light" className="ms-1">ID {jobDto.id}</IonBadge>
            </>,
            elemento: <ModalConfigQuery
                jobId={jobDto.id}
                jobNome={jobDto.nome}
                queryInfo={queries[queryIndex]}
                onSave={() => modalQueryOff()}
            />,
            onDismiss: () => modalQueryOff(),
        }
    );

    //Handler para alertar ao usuário caso ele queira excluir o Jobs
    const exibirAlerta = () => {
        alerta({
            header: 'Deletar Job!',
            message: 'Tem certeza que deseja deletar esse Job da base da dados?',
            buttons: [
                'Não',
                { text: 'Sim', handler: (d) => deletarJob() }
            ],
        });
    };

    //Acionamento para abrir modal para editar as configurações da query
    const abrirModal = (index: number) => {
        setQueryIndex(index);
        modalQueryOn({ cssClass: 'modal-large' });
    }

    //Handler para gerar requisição que deleta Job no banco de dados
    const atualizarJob = async () => {
        const mensagemId = `Update_Job@${Date.now()}`;
        try {
            setLoading(true);
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Atualizando Job ${jobDto.nome} [${jobDto.id}].`,
                status: 'INFO'
            }));
            const dtoEnvio: JobInfoDTO = {
                ...jobDto,
                nome: jobNome,
                descricao: jobDescricao,
                caminhoExec: jobDiretorioExec,
                parametros: jobParametrosExec.split(", "),
                descricaoParametros: jobParametrosDescricao.split(", "),
                diretorioEntrada: jobDiretorioCarga,
                mascaraEntrada: jobMascarasCarga.split(", "),
                diretorioLog: jobDiretorioLog,
                mascaraLog: jobMascarasLog.split(", "),
                diretorioSaida: jobDiretorioRemessa,
                mascaraSaida: jobMascarasRemessa.split(", "),
            };
            const jobAtualizado = await AxiosRequest.saveJob(clienteId, dtoEnvio);
            dispatch(updateJob(jobAtualizado));
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

    //Handler para gerar requisição que deleta Job no banco de dados
    const deletarJob = async () => {
        const mensagemId = `Delete_Job@${Date.now()}`;
        try {
            setLoading(true);
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Deletando Job ${jobDto.nome} [${jobDto.id}].`,
                status: 'INFO'
            }));
            await AxiosRequest.deleteJobs([jobDto.id]);
            dispatch(removerJobsPiepline([jobDto.nome]));
            dispatch(removerJobsCatalogo([jobDto.nome]));
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

    //Requisição para deletar uma configuração de query já existente
    const deletarQuery = async (index: number) => {
        const queryAlvo = queries[index];
        const mensagemId = `Delete_Query@${Date.now()}`;
        try {
            if (!queryAlvo)
                throw new String(`Erro ao deletar query configurada! Não localizada: Job ${jobDto.nome}, Query Nº${index}.`);
            if (!queryAlvo.id)
                throw new String(`Erro ao deletar query configurada! Id inválido: Job ${jobDto.nome}, Query Nº${index}.`);

            setLoading(true);
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Deletando query configurada ID ${queryAlvo.id}.`,
                status: 'INFO'
            }));
            await AxiosRequest.deleteConfigQuery(queryAlvo.id);
            dispatch(removeQuery(index));
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

    //Botões de cada card de Job
    const botoesPorJob = [
        {
            text: "Salvar",
            color: "tertiary",
            onClick: atualizarJob,
            icon: save,
        },
        {
            text: "Reverter",
            color: "tertiary",
            onClick: () => null,
            icon: arrowUndo,
        },
        {
            text: "Excluir",
            color: "danger",
            onClick: exibirAlerta,
            icon: trashOutline,
        },
    ];

    //Separando os tipos de campos em comum, que pertencem ao mesmo grupo/contexto de informação 
    type JobGruposDeCamposType = "Acionamento" | "Cargas" | "Logs" | "Remessas" | "Queries";
    const listaGruposDosCampo: JobGruposDeCamposType[] = ["Acionamento", "Cargas", "Logs", "Remessas", "Queries"];

    //Interface das propriedades gerais dos campos dos Jobs
    interface JobCampoProps<T> {
        nome: string,
        colunas: number,
        lista: boolean,
        valor: T,
        aoDigitar: (texto: T) => void,
        reverer: () => void,
        multiline?: boolean
    }

    //Interface que organiza os campos do Job em grupos 
    interface JobGrupoDeCampoProps<T> {
        grupo: JobGruposDeCamposType,
        campos: JobCampoProps<T>[]
    }

    const adaptarStringEmLista = (texto: string) => texto.replaceAll(",", "\n");

    const valoresDosGrupoDeCampos: JobGrupoDeCampoProps<string>[] = [
        {
            grupo: "Acionamento",
            campos: [
                {
                    nome: "Diretório",
                    colunas: 4,
                    lista: false,
                    valor: jobDiretorioExec,
                    aoDigitar: setJobDiretorioExec,
                    reverer: () => setJobDiretorioExec(jobDto.caminhoExec)
                }, {
                    nome: "Nome Completo",
                    colunas: 8,
                    lista: false,
                    valor: jobNome,
                    aoDigitar: setJobNome,
                    reverer: () => setJobNome(jobDto.nome)
                }, {
                    nome: "Descrição do Job",
                    colunas: 12,
                    lista: false,
                    multiline: true,
                    valor: jobDescricao,
                    aoDigitar: setJobDescricao,
                    reverer: () => setJobDescricao(jobDto.descricao)
                }, {
                    nome: "Lista dos Parâmetros",
                    colunas: 4,
                    lista: true,
                    multiline: true,
                    valor: jobParametrosExec,
                    aoDigitar: (texto) => setJobParametrosExec(adaptarStringEmLista(texto)),
                    reverer: () => setJobParametrosExec(jobDto.parametros.join("\n"))
                }, {
                    nome: "Descrição dos Parâmetros",
                    colunas: 8,
                    lista: true,
                    multiline: true,
                    valor: jobParametrosDescricao,
                    aoDigitar: (texto) => setJobParametrosDescricao(adaptarStringEmLista(texto)),
                    reverer: () => setJobParametrosDescricao(jobDto.descricaoParametros.join("\n"))
                }
            ]
        }, {
            grupo: "Cargas",
            campos: [
                {
                    nome: "Diretório",
                    colunas: 5,
                    lista: false,
                    valor: jobDiretorioCarga,
                    aoDigitar: setJobDiretorioCarga,
                    reverer: () => setJobDiretorioCarga(jobDto.diretorioEntrada)
                }, {
                    nome: "Lista das Máscaras",
                    colunas: 7,
                    lista: true,
                    multiline: true,
                    valor: jobMascarasCarga,
                    aoDigitar: (texto) => setJobMascarasCarga(adaptarStringEmLista(texto)),
                    reverer: () => setJobMascarasCarga(jobDto.mascaraEntrada.join("\n"))
                },
            ]
        }, {
            grupo: "Logs",
            campos: [
                {
                    nome: "Diretório",
                    colunas: 5,
                    lista: false,
                    valor: jobDiretorioLog,
                    aoDigitar: setJobDiretorioLog,
                    reverer: () => setJobDiretorioLog(jobDto.diretorioLog)
                }, {
                    nome: "Lista das Máscaras",
                    colunas: 7,
                    lista: true,
                    multiline: true,
                    valor: jobMascarasLog,
                    aoDigitar: (texto) => setJobMascarasLog(texto.replaceAll(",", "\n")),
                    reverer: () => setJobMascarasLog(jobDto.mascaraLog.join("\n"))
                },
            ]
        }, {
            grupo: "Remessas",
            campos: [
                {
                    nome: "Diretório",
                    colunas: 5,
                    lista: false,
                    valor: jobDiretorioRemessa,
                    aoDigitar: setJobDiretorioRemessa,
                    reverer: () => setJobDiretorioRemessa(jobDto.diretorioSaida)
                }, {
                    nome: "Lista das Máscaras",
                    colunas: 7,
                    lista: true,
                    multiline: true,
                    valor: jobMascarasRemessa,
                    aoDigitar: (texto) => setJobMascarasRemessa(adaptarStringEmLista(texto)),
                    reverer: () => setJobMascarasRemessa(jobDto.mascaraSaida.join("\n"))
                },
            ]
        }
    ];

    const [segment, setSegment] = useState<JobGruposDeCamposType>("Acionamento");

    //Exibe os detalhes do cadastro do Job se não estiver realizando request ao banco
    const jobContent = () => {
        if (loading) return <Informativo status="Carregando" />
        return <>
            <IonItem slot="header" color="primary" className='' >
                <IonCardHeader className={`p-0 w-100 ${retratil ? 'text-start' : 'text-center'} `}>
                    <IonCardTitle color='dark' className='p-0'>
                        <span className="me-1">{jobDto.nome}</span>
                        <IonBadge color="light" style={{ transform: 'translate(0, 3px)' }}>ID {jobDto.id}</IonBadge>
                    </IonCardTitle>
                </IonCardHeader>
            </IonItem>
            <div className='glass rounded-0 rounded-bottom' slot="content">
                <IonCardContent color='#' className='m-0 p-0 rounded-0 rounded-bottom small'>
                    <IonToolbar color="light" className="p-0 px-2 m-0">
                        <IonRow className="d-flex ion-justify-content-between">
                            <IonSegment scrollable={true} value={segment} onIonChange={e => {
                                const tipo = listaGruposDosCampo.find(tipo => tipo === e.detail.value)
                                setSegment(tipo ? tipo : "Acionamento");
                            }}>
                                {
                                    listaGruposDosCampo.map((grupo, index) =>
                                        <>
                                            <IonSegmentButton value={grupo} key={index}>
                                                {grupo}
                                            </IonSegmentButton>
                                        </>
                                    )
                                }
                            </IonSegment>
                            <IonButtons className="ion-justify-content-end p-0 m-0">
                                {
                                    botoesPorJob.map((obj, index) =>
                                        <IonButton
                                            key={index}
                                            fill="outline"
                                            shape="round"
                                            size="small"
                                            className="me-2 p-0"
                                            color={obj.color}
                                            onClick={e => obj.onClick()}
                                        >
                                            <IonIcon icon={obj.icon} size="small" style={{ transform: 'translate(0, -2px)' }} />
                                            <small>{obj.text}</small>
                                        </IonButton>
                                    )
                                }
                            </IonButtons>
                        </IonRow>
                    </IonToolbar>
                    <IonRow className="my-2" hidden={segment === "Queries"}>
                        {
                            valoresDosGrupoDeCampos
                                .find(grupo => grupo.grupo === segment)?.campos
                                .map((item, itemIndex) =>
                                    <IonCol key={itemIndex} size={`${item.colunas}`} className="p-0 m-0">
                                        <GlassInput text={item.nome}>
                                            <IonInput
                                                type="text"
                                                className="font-monospace glass m-0 px-2 pt-1"
                                                value={item.valor}
                                                onIonChange={(e) => {
                                                    if (!e.detail.value) {
                                                        item.aoDigitar("")
                                                        return;
                                                    }
                                                    item.aoDigitar(e.detail.value);
                                                }}
                                                color="light"
                                                hidden={item.multiline}
                                            />
                                            <IonTextarea
                                                className="font-monospace glass m-0 px-2 pt-1"
                                                value={item.valor}
                                                onIonChange={(e) => {
                                                    if (!e.detail.value) {
                                                        item.aoDigitar("")
                                                        return;
                                                    }
                                                    item.aoDigitar(e.detail.value);
                                                }}
                                                color="light"
                                                hidden={!item.multiline}
                                            />
                                        </GlassInput>
                                    </IonCol>
                                )
                        }
                    </IonRow>
                    <IonRow className="w-100 m-0 mt-2 px-3 ion-justify-content-around" hidden={segment !== "Queries"}>
                        {
                            queries.map((item, index) =>
                                <IonLabel key={index} className={`font-monospace p-0 py-2 mt-2`} >
                                    <Botao text={item.nome} handler={() => abrirModal(index)} icon={server} className="h-100" />
                                    <IonChip 
                                        color="#"
                                        className="position-absolute p-0 m-0 ms-1 bg-light" 
                                        onClick={() => deletarQuery(index)}
                                        style={{ transform: 'scale(0.75) translate(-40px, -16px)' }}
                                    >
                                        <IonIcon icon={trash} color="danger" className="p-1 m-0 item-lista" />
                                    </IonChip>
                                </IonLabel>
                            )
                        }
                        <IonRow className="w-100 m-0 p-0 py-2 ion-justify-content-center text-center">
                            <IonButton color='secondary'
                                fill="clear"
                                className="m-0 w-100 opacity-75"
                                onClick={() => abrirModal(-1)}
                            >
                                <IonIcon icon={addCircle} size="large" />
                                Adicionar nova query
                            </IonButton>
                        </IonRow>
                    </IonRow>
                </IonCardContent>
            </div>
        </>
    }

    //Renderização do componente
    return (
        <IonCard className="shadow-none">

            {/* Opção de visualização para modo retrátil */}
            <IonAccordionGroup hidden={!retratil}>
                <IonAccordion value="first" className='bg-transparent' >
                    {jobContent()}
                </IonAccordion>
            </IonAccordionGroup>

            {/* Opção de visualização para modo card simples */}
            <div hidden={retratil}>
                <IonCardHeader color="primary" className="p-0 m-0">
                    <IonCardTitle className="h3 m-0 p-0 w-100 text-center">
                        Cadastro do Job
                    </IonCardTitle>
                </IonCardHeader>
                {jobContent()}
            </div>

        </IonCard>
    );
}

export default JobCard;