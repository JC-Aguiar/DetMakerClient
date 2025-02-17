import { IonCard, IonAccordionGroup, IonAccordion, IonItem, IonCardHeader, IonCardTitle, IonCardContent, IonTitle, IonBadge, IonButton, IonIcon, IonRow, useIonModal, IonLabel, useIonAlert, IonButtons, IonToolbar, IonInput, IonChip, IonCol, IonTextarea, IonSegment, IonSegmentButton } from "@ionic/react";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addCircle, arrowUndo, close, closeCircle, createOutline, save, server, settings, trash, trashOutline } from "ionicons/icons";
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
import { removerJobs as removerJobsCatalogo } from "../../Store/Reducer/ReducerJobs";
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
    const fonteCodigo = 'font-monospace text-white fw-bold'
    const [loading, setLoading] = useState<boolean>(false);
    const [queryIndex, setQueryIndex] = useState<number>(-1);
    const [alerta] = useIonAlert();
    const queries: QueryInfoDTO[] = useSelector(
        (state: RootState) => state.store.catalogoQueries.catalogo.filter(item => item.jobId === jobDto.id)
    );
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
            titulo: "Editar Configuração de Query",
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
            onClick: () => null,
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
            onClick: () => exibirAlerta(),
            icon: trashOutline,
        },
    ];

    //Separando os tipos de campos em comum, que pertencem ao mesmo grupo/contexto de informação 
    type JobGruposDeCamposType = "Artefato" | "Cargas" | "Logs" | "Remessas" | "Queries";
    const listaGruposDosCampo: JobGruposDeCamposType[] = ["Artefato", "Cargas", "Logs", "Remessas", "Queries"];

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
            grupo: "Artefato",
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
                }, {
                    nome: "Descrição do Artefto",
                    colunas: 12,
                    lista: false,
                    multiline: true,
                    valor: jobDescricao,
                    aoDigitar: setJobDescricao,
                    reverer: () => setJobDescricao(jobDto.descricao)
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

    const [segment, setSegment] = useState<JobGruposDeCamposType>("Artefato");

    //Exibe o conteúdo principal dentro do card (loading ou dados)
    const content = () => {
        if (loading) return <Informativo status="Carregando" />
        return <>
            <IonItem slot="header" color="primary" className='' >
                <IonCardHeader className='p-0'>
                    <IonCardTitle color='dark' className='p-0'>
                        <IonBadge color="light" style={{ transform: 'translate(0, 5px)' }}>ID {jobDto.id}</IonBadge>
                        <span className="ms-1">{jobDto.nome}</span>
                    </IonCardTitle>
                </IonCardHeader>
            </IonItem>
            <div className='glass rounded-0 rounded-bottom' slot="content">
                <IonCardContent color='#' className='m-0 p-0 rounded-0 rounded-bottom small'>
                    <IonToolbar color="light" className="p-0 px-2 m-0">
                        <IonRow className="d-flex ion-justify-content-between">
                            <IonSegment scrollable={true} value={segment} onIonChange={e => {
                                const tipo = listaGruposDosCampo.find(tipo => tipo === e.detail.value)
                                setSegment(tipo ? tipo : "Artefato");
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
                                                    if (!e.detail.value) return;
                                                    item.aoDigitar(e.detail.value);
                                                }}
                                                color="light"
                                                hidden={item.multiline}
                                            />
                                            <IonTextarea
                                                className="font-monospace glass m-0 px-2 pt-1"
                                                value={item.valor}
                                                onIonChange={(e) => {
                                                    if (!e.detail.value) return;
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
                                <IonLabel key={index} className={`font-monospace p-0 pb-2`} >
                                    <Botao text={item.nome} handler={() => abrirModal(index)} icon={server} />
                                    <IonBadge className="stick rounded rounded-circle m-0 p-0"
                                        onClick={() => deletarQuery(index)}
                                        style={{ transform: 'translate(-16px, 0)' }}
                                    >
                                        <IonIcon icon={trash} color="danger" className="btn btn-light p-1 m-0" />
                                    </IonBadge>
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
            <IonAccordionGroup hidden={!retratil}>
                <IonAccordion value="first" className='bg-transparent' >
                    {content()}
                </IonAccordion>
            </IonAccordionGroup>
            <div hidden={retratil}>
                <IonCardHeader className="p-0 m-0">
                    <IonCardTitle color="light" className="h3 w-100 text-center">
                        Cadastro do Job
                    </IonCardTitle>
                </IonCardHeader>
                {content()}
            </div>
        </IonCard>
    );
}

export default JobCard;