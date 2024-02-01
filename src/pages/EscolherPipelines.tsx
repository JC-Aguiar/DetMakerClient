import { InputChangeEventDetail, IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonModal, IonProgressBar, IonRadio, IonRadioGroup, IonRow, IonSplitPane, IonTextarea, RadioGroupChangeEventDetail, TextareaChangeEventDetail, useIonModal, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useRef, useState } from 'react';
import { caretDownOutline, close, closeCircle, cloudUpload, codeSlash, cube, flash, layers, listOutline, openOutline, refresh, save, shieldCheckmark } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { loadingJobs, setJobs, setViewJobs } from '../Store/Reducer/ReducerJobs';
import DynamicModal from '../components/DynamicModal';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { loadingPipelines, setPipelines } from '../Store/Reducer/ReducerPipelines';
import { JobConfig, parseJobInfo } from '../data/JobConfigDTO';
import { Noticacao } from '../components/Noticacao';
import { ButtonLayoutProps, layoutGrupoBotoes } from '../components/ButtonLayout';
import ConfigurarJobs from '../components/ConfigurarJobs';
import { JobInfoDTO } from '../data/JobInfoDTO';
import { setMainPipeline, setMainJobs } from '../Store/Reducer/ReducerAtividade';
import ListarJobs from '../components/ListarJobs';
import Schedule from '../components/Schedule';
import Informativo from '../components/Informativo';
import Carregando from '../components/Carregando';
import { addRevisao, removeRevisao } from '../Store/Reducer/ReducerRevisao';
import { setRelatorios } from '../Store/Reducer/ReducerRelatorios';
import { RelatorioHistoricoDTO } from '../data/RelatorioHistoricoDTO';
import { JobExecuteDTO, parseJobConfigParaJobExecute } from '../data/JobExecuteDTO';
import { PipelineExecDTO } from '../data/PipelineExecDTO';
import { RelatorioInfoDTO } from '../data/RelatorioInfoDTO';
import { UserDTO } from '../data/UserDTO';
import { UserInfoDTO } from '../data/UserInfoDTO';
import { AmbienteInfoDTO } from '../data/AmbienteInfoDTO';
import { ComandoSQL } from '../data/ComandoSQL';
import { ConfigQueryInfoDTO } from '../data/ConfigQueryInfoDTO';
import { loadingQueries, setQueries } from '../Store/Reducer/ReducerQueries';

const EscolherPipelines: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();
    const history = useHistory();

    //Atributos de controle
    const [conectionsCount, setConectionsCount] = useState<number>(0);
    const [jobsSucesso, setJobsSucesso] = useState<boolean | null>(null);
    const [pipelinesSucesso, setPipelinesSucesso] = useState<boolean | null>(null);
    const isLoadingJobs = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const isLoadingPipelines = useSelector((state: RootState) => state.store.catalogoPipelines.loading);
    const isLoading = isLoadingJobs || isLoadingPipelines;
    const [viewConfigQuery, setViewConfigQuery] = useState<ConfigQueryInfoDTO | null>(null);
    const [viewConfigQuerySql, setCiewConfigQuerySql] = useState<string>(
        viewConfigQuery !== null ? viewConfigQuery.comandosSql.sql : "");

    //Atributos de input do usuário
    const mainAmbiente = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const [pipelineNome, setPipelineNome] = useState<string>("");
    const [pipelineDescricao, setPipelineDescricao] = useState<string>("");
    const [projetoId, setProjetoId] = useState<string>("");
    const [projetoNome, setProjetoNome] = useState<string>("");
    const [atividadeNome, setAtividadeNome] = useState<string>("");
    const [configuracao, setConfiguracao] = useState<string>("");
    const [enviar, setEnviar] = useState<boolean | undefined>(false);
    const [anexo, setAnexo] = useState<File | null>(null);

    //Atributos dos principais recursos da página
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
    const catalagoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.catalogoJobs.jobsSelecionados);
    const catalogoJobsSelecionados: JobInfoDTO[] = catalogoJobs
        .filter((item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1);
    const catalogoQueries: ConfigQueryInfoDTO[] = useSelector((state: RootState) => state.store.catalogoQueries.catalogo);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);  
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineIndex: number = catalagoPipelines.findIndex((item) => item.nome === mainPipeline);
    const mainPipelineDescricao: string | undefined = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo)
        .find((item) => item.nome === mainPipeline)?.nome;

    //Atributos de botões
    const botaoAtualizar = {
        title: 'Atualizar',
        icon: refresh,
        trigger: () => coletarRecursos(),
        disable: isLoading,
    } as ButtonLayoutProps;

    const botaoNovaPipeline = {
        title: 'Nova Pipeline',
        icon: layers,
        trigger: () =>  modalNovaPipelineOn(),
        disable: isLoading || catalogoJobs.length < 1,
    } as ButtonLayoutProps;

    const botaoExecutarPipeline = {
        title: 'Executar Pipeline',
        icon: flash,
        trigger: () => modalConfigPipelineOn(),
        disable: isLoading || mainJobs.length < 1,
    } as ButtonLayoutProps;

    const botaoVerSchedule = {
        title: 'Ver Schedule',
        icon: listOutline,
        trigger: () => {
            if (!modalRef || !modalRef.current) return;
            modalRef.current.present();
            setVerModalSchedule(true);
            console.log(`Ativando modal Shedule (var: ${verModalSchedule})`);
        },
        disable: isLoading || catalogoJobs.length < 1,
    } as ButtonLayoutProps;

    const botaoNovaSchedule = {
        title: 'Nova Schedule',
        icon: cloudUpload,
        trigger: () => uploadSchedule(),
        disable: isLoading,
    } as ButtonLayoutProps;

    const butoes = [ botaoAtualizar, botaoNovaPipeline, botaoExecutarPipeline, botaoVerSchedule, botaoNovaSchedule ];

    //Conteúdo da modal 'Nova Pipeline'
    function conteudoModalNovaPipeline() {
        //handler para preencher nome da Pipeline
        const preencherPepilineNome = (event: CustomEvent<InputChangeEventDetail>) => {
            const value = (event.target as HTMLInputElement).value.trim();
            setPipelineNome(value);
            console.log(`[CONFIGURAR-JOBS] Pipeline nome alterada para ${value}.`);
        }
        //Handler para preencher descrição da Pipeline
        const preencherPepilineDescricao = (event: CustomEvent<TextareaChangeEventDetail>) => {
            const value = (event.target as HTMLInputElement).value.trim();
            setPipelineDescricao(value);
            console.log(`[CONFIGURAR-JOBS] Pipeline descrição alterada para ${value}.`);
        }
        return <>
            <div className="container justify-content-center mt-1 px-5">
                <div className='glass px-3'>
                    <div className='h5 text-center text-white py-2 mt-2 mb-4'>
                        Preencha os dados abaixo para prosseguir
                    </div>
                    <div className='text-primary'>
                        <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                            <IonCol size='1' className='text-center p-0 m-0'>
                                <IonLabel className='fw-bold'>Pipeline:</IonLabel>
                            </IonCol>
                            <IonCol size='11' className=''>
                                <IonInput inputmode='text'
                                    maxlength={500}
                                    value={pipelineNome}
                                    className='glass text-white m-1'
                                    onIonChange={(e) => preencherPepilineNome(e)}
                                    required
                                />
                            </IonCol>
                        </IonRow>
                        <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                            <IonCol size='1' className='text-center p-0 m-0'>
                                <IonLabel className='fw-bold'>Descrição:</IonLabel>
                            </IonCol>
                            <IonCol size='11' className=''>
                                <IonTextarea inputmode='text'
                                    maxlength={500}
                                    value={pipelineDescricao}
                                    className='glass text-white m-1'
                                    style={{minHeight: '100px' }}
                                    onIonChange={(e) => preencherPepilineDescricao(e)}
                                    required
                                />
                            </IonCol>
                        </IonRow>
                        <IonRow className='d-flex w-100 ion-align-items-center'>
                            <IonCol size='1' className='text-center p-0 m-0'>
                                <IonLabel className='fw-bold mt-2' >Jobs:</IonLabel>
                            </IonCol>
                            <IonCol size='11' className=''>
                                <div className='ms-1 pt-1 glass'>
                                {
                                    catalogoJobsSelecionados.map((item, index) => 
                                        <IonBadge key={index} className='ion-align-items-center mx-1 mt-1 pt-2 font-monospace small'>
                                            <span style={{backgroundColor: 'var(--ion-color-dark)'}} className='rounded text-white px-1'>
                                                Nº{index+1}
                                            </span>
                                            <span className='ms-1 pt-1'>{item.nome}</span>
                                        </IonBadge>
                                    )
                                }
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonButton fill='solid'
                            className='w-100 mt-4 my-3' 
                            disabled={pipelineNome.trim().length < 2 || pipelineDescricao.trim().length < 2} 
                            onClick={() => salvarNovaPipeline()} 
                        > 
                            <IonIcon icon={save} className='me-2'/>
                            Salvar no Banco
                        </IonButton>
                    </div>
                </div>
            </div>
        </>
    }

    //Conteúdo da modal 'Vizualizar Config Query'
    function conteudoModalConfigQuery() {
        //Validação obrigatória
        if (!viewConfigQuery) return;
        //Handler para preencher query
        const preencherSql = (event: CustomEvent<TextareaChangeEventDetail>) => {
            const value = (event.target as HTMLInputElement).value.trim();
            setCiewConfigQuerySql(value);
            console.log(`[LABORATÓRIO] ConfigQuery ID ${viewConfigQuery.id} teve sua query alterada para: '${value}'.`);
        }
        //Identificando Job da ConfigQuery
        const jobAlvo = catalogoJobs.find((j) => j.id === viewConfigQuery.jobId);
        const queryTamanhoMin = viewConfigQuerySql.trim().length > 15;
        const infoJobAlvo = typeof jobAlvo !== "undefined" ? 
            <h2 className='font-monospace text-white'>{jobAlvo.nome}</h2> : 
            <></>;
        //Conteúdo visual
        return (
            <div className='position-relative mx-3 px-2'>
                <div className="text-center pb-3">
                    {infoJobAlvo}
                    <div className=''>{viewConfigQuery.comandosSql.descricao}</div>
                </div>
                <IonTextarea className='text-start glass font-monospace'
                    inputmode='text'
                    rows={9}
                    maxlength={900}
                    value={viewConfigQuerySql}
                    onIonChange={(e) => preencherSql(e)}
                />
                <div className='d-flex my-2'>
                    <IonButton fill='solid'
                        className='w-100' 
                        disabled={!queryTamanhoMin} 
                        onClick={() => salvarNovaPipeline()} 
                    > 
                        <IonIcon icon={save} className='me-2'/>
                        Salvar
                    </IonButton>
                    <IonButton fill='solid'
                        className='w-100' 
                        disabled={!queryTamanhoMin} 
                        onClick={() => salvarNovaPipeline()} 
                    > 
                        <IonIcon icon={shieldCheckmark} className='me-2'/>
                        Testar
                    </IonButton>
                    <IonButton fill='solid'
                        className='w-100' 
                        disabled={!queryTamanhoMin} 
                        onClick={() => salvarNovaPipeline()} 
                    > 
                        <IonIcon icon={close} className='me-2'/>
                        Cancelar
                    </IonButton>
                </div>
            </div>

        );
    }

    //Handler para preencher id do projeto
    const preencherProjetoId = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setProjetoId(value);
        console.log(`[CONFIGURAR-JOBS] Projeto id alterado para ${value}.`);
    }

    //Handler para preencher nome do projeto
    const preencherProjetoNome = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setProjetoNome(value);
        console.log(`[CONFIGURAR-JOBS] Projeto nome alterado para ${value}.`);
    }

    //Handler para preencher nome da atividade
    const preencherAtividade = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setAtividadeNome(value);
        console.log(`[CONFIGURAR-JOBS] Atividade nome alterada para ${value}.`);
    }

    //Handler para preencher configuração do môdulo
    const preencherConfiguracao = (event: CustomEvent<TextareaChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setConfiguracao(value);
        console.log(`[CONFIGURAR-JOBS] Configuração do môdulo alterado para ${value}.`);
    }

    //Modal para executar a Pipeline
    const [modalConfigPipelineOn, modalConfigPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Executar Pipeline",
            elemento: conteudoConfigPipeline(),
            onDismiss: () => modalConfigPipelineOff(),
        }
    );

    function camposPreenchidos(): boolean {
        if (!mainPipelineDescricao) return false;
        return projetoId.trim().length > 0 && projetoNome.trim().length > 0 && atividadeNome.trim().length > 0;
    }

    //Conteúdo da modal 'Executar Pipeline'
    function conteudoConfigPipeline() {
        if (mainPipeline === "") return;
        return (
            <div id="capa-jobs" className="row justify-content-center px-3 mx-0">
                <div className='col row mt-2 px-0 mx-0 glass'>
                    <div className='h5 bg-primary text-center text-white py-1 mb-3 rounded-top rounded-top-2'>
                        Preencha os dados abaixo para prosseguir
                    </div>
                    <IonItem className='text-primary'>
                        <IonLabel className='fw-bold me-4 '>Projeto Id:</IonLabel>
                        <IonInput inputmode='text'
                            type='text'
                            size={10}
                            maxlength={7}
                            value={projetoId}
                            className='glass text-white m-1 ms-3 me-3'
                            style={{width: '256px', maxWidth: '256px'}}
                            onIonChange={(e) => preencherProjetoId(e)}
                            required
                        />
                        <IonLabel className='fw-bold '>Projeto Nome:</IonLabel>
                        <IonInput inputmode='text'
                            type='text'
                            size={50}
                            maxlength={200}
                            value={projetoNome}
                            className='glass text-white m-1'
                            onIonChange={(e) => preencherProjetoNome(e)}
                            required
                        />
                    </IonItem>
                    <IonItem className='text-primary'>
                        <IonLabel className='fw-bold me-4'>Atividade:</IonLabel>
                        <IonInput inputmode='text'
                            maxlength={300}
                            value={atividadeNome}
                            className='glass text-white m-1 ms-3'
                            onIonChange={(e) => preencherAtividade(e)}
                            required
                        />
                    </IonItem>
                    <IonItem className='text-primary'>
                        <IonLabel className='fw-bold'>Configurações:</IonLabel>
                        <IonTextarea inputmode='text'
                            maxlength={200}
                            value={configuracao}
                            className='glass text-white m-1'
                            onIonChange={(e) => preencherConfiguracao(e)}
                        />
                    </IonItem>
                    <div className='py-3' />
                    <IonButton color='primary' 
                        className='session-login-button' 
                        fill="solid" 
                        disabled={!camposPreenchidos()}
                        onClick={() => executarPipeline()}
                    >
                        EXECUTAR
                    </IonButton>
                    <div className='pb-3' />
                </div>
            </div>
        );
    }

    const conteudoPainelPrincipal = () => {
        if (jobsSelecionados.length > 0) 
            return exibirJobsSelecionados();

        if (mainPipeline !== "") 
            return <ConfigurarJobs toastInfo={toastInfo} toastOk={toastOk} toastErro={toastErro} />;

        const mensagem = 'Use o painel lateral para vizualizar {Jobs} e {Pipelines}\n'
            +'Selecione um {Job}, fora da {Pipeline}, para analisá-lo\n'
            +'Selecione uma {Pipeline} para inserir {Jobs} ou configurar sua execução';
        return <div className='position-absolute'>
            <Informativo mensagem={mensagem} status='Normal' />
        </div>;
    }

    const cancelarMainPipeline = () => {
        if (mainPipeline === "") return;
        dispatch(setMainPipeline({
            id: -1,
            nome: "", 
            jobs: [] 
        }));
    }

    //Listagem das Pipelines no Menu Lateral
    const listarPipelines = (
        <IonRadioGroup value={mainPipeline}
            className='border-0 h-100'
            onIonChange={(e) => selecionarMainPipeline(e)}
        >
            <IonList className='m-0 p-0'>
                <IonItem lines='none'
                    className={`p-0 m-0 ion-align-items-top text-primary small`}
                    style={{ '--min-height': '32px' }}
                >
                    <IonLabel className='btn bg-transparent border-0 p-0 m-0 text-start' onClick={cancelarMainPipeline}>
                        <IonBadge color="#" className="me-1 bg-transparent">
                            <IonIcon icon={closeCircle} 
                                color="primary" 
                                className='pe-1' 
                                style={{ transform: 'translate(-2px, 1px) scale(1.4)' }} 
                            />
                            <span className='text-white'>Desselecionar Pipeline</span>
                        </IonBadge>
                    </IonLabel>
                </IonItem>
                {
                    catalagoPipelines.map((item, index) => {
                        const color = index % 2 === 0 ? 'medium' : 'none';
                        const jobTag = item.jobs.length > 1 ? 'Jobs' : 'Job';
                        return (
                            <IonItem key={index} lines='none'
                                color={color}
                                className='p-0 m-0 ion-align-items-top text-white small'
                                style={{ '--min-height': '32px' }}
                            >
                                <IonLabel className='p-0 m-0'>
                                    <span className='text-white font-monospace'>{item.nome}</span>
                                    <IonBadge color='secondary'
                                        className='ms-1 small fw-normal opacity-25'
                                    >
                                        {item.jobs.length}
                                    </IonBadge>
                                </IonLabel>
                                <IonRadio color='primary'
                                    slot="start"
                                    value={item.nome}
                                    className='p-0 m-0 me-1'
                                    style={{ height: '16px', width: '17px', }}
                                />
                            </IonItem>
                        );
                    })
                }
            </IonList>
        </IonRadioGroup>
    );

    //Listagem das Config-Queries no Menu Lateral
    const listarQueries = (
        <IonList className='m-0 p-0'>
            {
                //TODO: melhorar controle de estado
                catalogoQueries.map((item, index) => {
                    const color = index % 2 === 0 ? 'medium' : 'none';
                    const handler = () => {
                        setViewConfigQuery(item);
                        if (!viewConfigQuery) return;
                        setCiewConfigQuerySql(viewConfigQuery.comandosSql.sql);
                        modalConfigQueryOn();
                    }
                    return (
                        <IonItem key={index} lines='none'
                            color={color}
                            className='p-0 m-0 ion-align-items-top text-white small'
                            style={{ '--min-height': '32px' }}
                        >
                            <IonBadge color="#" className="p-0 m-0 btn bg-transparent" onClick={handler}>
                                <IonIcon icon={openOutline} color="primary" className='pe-1' style={{ transform: 'scale(1.2) translate(0.25px, 1.75px)' }}/>
                            </IonBadge>
                            <IonLabel className='p-0 m-0'>
                                <span className='text-white font-monospace'>{item.comandosSql.tabela}</span>
                                <IonBadge color='secondary'
                                    className='ms-1 small fw-normal opacity-25'
                                >
                                    ID {item.id}
                                </IonBadge>
                            </IonLabel>
                        </IonItem>
                    );
                })
            }
        </IonList>
    );

    function exibirJobsSelecionados() {
        const fonteCodigo = 'font-monospace text-white fw-bold'
        return catalogoJobsSelecionados.map((jobDto, index) =>
            <IonCard key={index}>
                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="primary" className='' >
                            <IonCardHeader className='py-0'>
                                <IonCardTitle className='text-dark py-0'>{jobDto.nome}</IonCardTitle>
                            </IonCardHeader>
                        </IonItem>
                        <div className="glass rounded rounded-top-0" slot="content">
                            <IonCardContent className='glass-content'>
                                <div className='small'>
                                    <section className="">
                                        <table className="table table-stripe"> {/* table-light table-striped */}
                                            <tbody className='text-white fw-bold'>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end' style={{ width: '0%' }}>Descrição:</td>
                                                    <td className='' colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.descricao}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Fase:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.fase}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Programas:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.programa.join(", ")}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Tabelas:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.tabelas.join(", ")}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Máscara Carga:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.mascaraEntrada.join(", ")}</span>
                                                    </td>
                                                </tr>
                                                <tr className='p-0 m-0'>
                                                    <td className='text-end'>Máscara Produto:</td>
                                                    <td colSpan={3}>
                                                        <span className={fonteCodigo}>{jobDto.mascaraSaida.join(", ")}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </section>
                                </div>
                            </IonCardContent>
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
            </IonCard>
        );
    }

    //Configurações e propriedades da modal de nova pipeline
    const [modalNovaPipelineOn, modalNovaPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Criar nova Pipeline",
            elemento: conteudoModalNovaPipeline(),
            onDismiss: () => modalNovaPipelineOff(),
        }
    );

    //Configurações e propriedades da modal de nova pipeline
    const [modalConfigQueryOn, modalConfigQueryOff] = useIonModal(
        DynamicModal,
        {
            titulo: `Query ID ${viewConfigQuery?.id}`,
            elemento: conteudoModalConfigQuery(),
            onDismiss: () => modalConfigQueryOff(),
        }
    );

  //COnfigurações e propriedades da modal personalizada da Schedule  
    const [verModalSchedule, setVerModalSchedule] = useState<boolean>(false);
    const modalRef = useRef<HTMLIonModalElement>(null);

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        if ((catalogoJobs.length < 1 || conectionsCount < 1) && !isLoading) coletarRecursos();
    }, []);


    //Atualizando Pipelines e Jobs com base no banco
    async function coletarRecursos() {
        dispatch(loadingJobs(true));
        dispatch(loadingPipelines(true));
        //dispatch(loadingQueries(true));
        //queries
        await obterJobsBanco().then(() => obterPipelinesBanco()).then(() => obterQueriesBanco());
        dispatch(loadingJobs(false));
        dispatch(loadingPipelines(false));
        //dispatch(loadingQueries(false));
    }

    //Coletando arquivo da máquina local
    function getFile(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile != null) {
            setAnexo(selectedFile);
            setEnviar(true);
        }
        else {
            setAnexo(null);
            setEnviar(false);
        }
    }

    //Requisição para abrir a planilha schedule para obter os jobs
    async function uploadSchedule() {
        try {
            if (!anexo) {
                console.log("[ESCOLHER-PIPELINES]: Nenhum arquivo para envio.");
                return
            };
            console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Abrir Planilha'.`);
            modalNovaPipelineOff();
            toastInfo("ABRIR PLANILHA: Em execução...", []);

            const formData = new FormData();
            formData.append('file', anexo);
            const jobsBanco: JobInfoDTO[] = await axiosRequest.openSchedule(mainAmbienteId, anexo);
            dispatch(setJobs(jobsBanco));
            dispatch(setMainPipeline({ id: -1, nome: "", jobs: [] }));            
            dispatch(setMainJobs([]));

            toastOk("ABRIR PLANILHA: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Abrir Planilha' funcionou.`);

            //console.log(`[APP] Navegando para: ${axiosRequest.URL_JOBS}`);
            //history.push(axiosRequest.URL_JOBS);
        }
        catch (error) {
            toastErro(`ABRIR PLANILHA: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Abrir Planilha' falhou.`);
        }
    }

    //Acionamento ao selecionar uma opção de Pipeline carregada do banco
    function selecionarMainPipeline(e: CustomEvent<RadioGroupChangeEventDetail<string>>): void {
        const valor = e.detail.value;
        if (valor === null || valor === undefined) return;
        console.log(`[ESCOLHER-PIPELINES]: Usuário selecionou opção Pipeline nome '${valor}'.`);

        const userPipeline = catalagoPipelines.find((item) => item.nome === valor);
        if (!userPipeline && userPipeline !== "") {
            console.log(`[ESCOLHER-PIPELINES]: Pipeline '${valor}' não identificada no catálogo Pipelines.`);
            return;
        };
        console.log(`[ESCOLHER-PIPELINES]: Pipeline '${userPipeline.nome}' identificada no catálogo de Pipelines.`);

        //Definido MainJobs com base na MainPipline
        const jobsMainPipline: JobConfig[] = [];
        userPipeline.jobs.forEach((pipelineJob, index) => {
            const atividadeJobs = catalogoJobs.find((jobDto) => jobDto.nome === pipelineJob);
            if (!atividadeJobs) {
                console.log(`[ESCOLHER-PIPELINES]: Nenhum dos Jobs informados na Pipeline selecionada '
                    + ('${userPipeline.nome}') foram identificados no catálogo de Jobs.`);
                return;
            }
            const configJob: JobConfig = parseJobInfo(atividadeJobs, index);
            jobsMainPipline.push(configJob);
        });
        dispatch(setMainPipeline({
            id: userPipeline.id,
            nome: userPipeline.nome,
            jobs: jobsMainPipline
        }));
        dispatch(setViewJobs([]));
        //reordenar();
        //dispatch(setMainJobs(jobsMainPipline));
        //dispatch(setDadosProjeto(novaPipelineConfig));
    }


    //Requisição para obter os jobs diretamente do banco
    async function obterJobsBanco() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Jobs'.`);
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        toastInfo("DOWNLOAD JOBS: Em execução...", []);
        setJobsSucesso(null);
        setConectionsCount(c => c+1);
        try {
            const novosJobs: JobInfoDTO[] = (await axiosRequest.getAllJobs(mainClienteId));
            dispatch(setJobs(novosJobs));
            //const jobsPipeline = (mainPipelineIndex > -1 && aplicarPipeline) ? catalagoPipelines[mainPipelineIndex].jobs : [];
            //console.log(`[APP] Navegando para: ${axiosRequest.URL_JOBS}`);
            //history.push(axiosRequest.URL_JOBS);
            setJobsSucesso(true);
            toastOk("DOWNLOAD JOBS: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Download Jobs' funcionou.`);
        }
        catch (error) {
            setJobsSucesso(false);
            toastErro(`DOWNLOAD JOBS: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Download Jobs' falhou.`);
        }
    }

    //Requisição para obter todas as pipelines do banco
    async function obterPipelinesBanco() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Pipelines'.`);
        toastInfo("DOWNLOAD PIPELINES: Em execução...", []);
        setPipelinesSucesso(null);
        dispatch(setMainPipeline({
            id: -1,
            nome: "",
            jobs: []
        }));
        try {
            const pipelines: PipelineInfoDTO[] = await axiosRequest.getAllPipelines(mainClienteId);
            dispatch(setPipelines(pipelines));

            //history.push('/det-maker/select/');
            //modalGetPipelinesOn();
            setPipelinesSucesso(true);
            toastOk("DOWNLOAD PIPELINES: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Download Pipelines' funcionou.`);
        }
        catch (error) {
            setPipelinesSucesso(false);
            toastErro(`DOWNLOAD PIPELINES: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Download Pipelines' falhou.`);
        }
    }

    //Requisição para obter todas as Config-Queries do banco
    async function obterQueriesBanco() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Download Config-Queries'.`);
        toastInfo("DOWNLOAD QUERIES: Em execução...", []);
        //setQueries([]); Apagar recursos antes de uma nova coleta ou não?
        dispatch(loadingQueries(true));
        try {
            const queriesBanco: ConfigQueryInfoDTO[] = await axiosRequest.getAllConfigQueries(mainClienteId);
            dispatch(setQueries(queriesBanco));
            toastOk("DOWNLOAD QUERIES: Realizado com sucesso.", []);
            console.log(`[ESCOLHER-PIPELINES]: Requisição 'Download Config-Queries' funcionou.`);
        }
        catch (error) {
            toastErro(`DOWNLOAD QUERIES: ${error}`, []);
            console.error(`[ESCOLHER-PIPELINES]: Requisição 'Download Config-Queries' falhou.`);
        }
        dispatch(loadingQueries(false));
    }

    //Requisição para salvar nova Pipeline
    async function salvarNovaPipeline() {
        console.log(`[ESCOLHER-PIPELINES]: Iniciando requisição 'Salvar Nova Pipeline'.`);
        toastInfo("SALVAR NOVA PIPELINE: Em execução...", []);
        modalNovaPipelineOff();
        setConectionsCount(c => c+1);
        dispatch(loadingPipelines(true));
        dispatch(setViewJobs([]));
        try {
            const novaPipeline: PipelineInfoDTO = {
                id: -1,
                nome: pipelineNome,
                descricao: pipelineDescricao,
                clienteId: mainClienteId,
                jobs: catalogoJobsSelecionados.map((item) => item.nome),
                checked: false,
            };
            const novaPipelineSalva = await axiosRequest.salvarNovaPipeline(novaPipeline);
            console.log(`[CONFIGURAR-JOBS]: Nova Pipeline salva: ${novaPipelineSalva}`);

            const jobsNovaPipeline: JobConfig[] = catalogoJobs
                .filter((item) => novaPipelineSalva.jobs.findIndex((jobNome) => jobNome === item.nome) !== -1)
                .map((item, index) => parseJobInfo(item, index));
                
            const catalogoPipelinesAtualizado = catalagoPipelines.slice();
            catalogoPipelinesAtualizado.push(novaPipelineSalva);

            console.log(`[CONFIGURAR-JOBS]: Atualizando catálogo das Pipelines com novo registro.`);
            dispatch(setPipelines(catalogoPipelinesAtualizado));
            console.log(`[CONFIGURAR-/JOBS]: Definindo Main-Pipeline para ${novaPipelineSalva.nome}.`);
            dispatch(setMainPipeline({ 
                id: novaPipelineSalva.id,
                nome: novaPipelineSalva.nome, 
                jobs: jobsNovaPipeline
            }));
            toastOk("SALVAR NOVA PIPELINE: Realizada com sucesso.", []);
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Salvar Nova Pipeline' funcionou.`);
        }
        catch (error) {
            toastErro(`SALVAR NOVA PIPELINE: ${error}`, []);
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Salvar Nova Pipeline' falhou.`);
        }
        dispatch(loadingPipelines(false));
    }

    //Requisição para executar a Pipeline
    async function executarPipeline() {
        console.log(`[CONFIGURAR-JOBS]: Iniciando requisição 'Executar Pipeline'.`);
        modalConfigPipelineOff();
        if (!camposPreenchidos || !mainPipelineDescricao) {
            console.log('[CONFIGURAR-JOBS]: Preencha os campos antes de executar a Pipeline!');
            return;
        };
        toastInfo("EXECUTAR PIPELINE: Em execução...", []);
        try {
            const pipelineDto: PipelineInfoDTO = {
                id: mainPipelineId,
                nome: mainPipeline,
                descricao: mainPipelineDescricao,
                clienteId: mainClienteId,
                jobs: mainJobs.map((item) => item.nome),
                checked: true,
            };
            const relatorioDto: RelatorioInfoDTO = {
                idProjeto: projetoId,
                nomeProjeto: projetoNome,
                nomeAtividade: atividadeNome,
                configuracao: configuracao,
                testeTipo: "Unitário",
            };
            const jobsDto: JobExecuteDTO[] = mainJobs.map((item) => parseJobConfigParaJobExecute(item));
            const body: PipelineExecDTO = {
                pipeline: pipelineDto,              //TODO: informação repetida aqui
                relatorio: relatorioDto,
                jobs: jobsDto,
                userInfo: {
                    nome: user ? user.name : null,
                    papel: user ? "DEV" : null,
                    empresa: user ? "PPW" : null,
                } as UserInfoDTO,
                ambienteId: mainAmbienteId,
            };

            dispatch(removeRevisao());
            const relatorioParaRevisar: RelatorioHistoricoDTO = await axiosRequest.executarPipeline(body);
            //dispatch(loadingRelatorios(true));
            //dispatch(addRevisao({ value: relatorio }));
            const buttons = [
                {
                  text: 'Revisar',
                  role: 'Revisar DET',
                  handler: () => {
                    dispatch(addRevisao(relatorioParaRevisar));
                    console.log(`[CONFIGURAR-JOBS] Navegando para: ${axiosRequest.URL_DET}`);
                    history.push(axiosRequest.URL_DET);
                  },
                }
            ];
            dispatch(setRelatorios([]));
            //dispatch(loadingRelatorios(false));
            toastOk("EXECUTAR PIPELINE: Realizada com sucesso.", buttons);
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Executar Pipeline' funcionou.`);
            
            
        }
        catch (error) {
            toastErro(`EXECUTAR PIPELINE: ${error}`, []);
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Executar Pipeline' falhou.`);
        }
    }


    function conteudo() {
        if (catalogoJobs.length < 1) {
            return <Informativo 
                mensagem='Uma alternativa é fazer o upload da planilha de Jobs, usando o botão {Nova Schedule}' 
                status='SemDados'
            />;
        }
        return (
            <IonSplitPane when="xs" contentId="main" className='px-5 mx-5 '>
                <IonMenu contentId="main" className='glass' color='#'>
                    <IonContent className='glass-content p-0 m-0 mx-5'>
                            <IonAccordionGroup multiple={true} className='px-2'>
                                <IonAccordion value="jobs" className='lista-navegacao glass mb-1'>
                                    <IonItem slot="header" color="#" className='rounded rounded-0'>
                                        <IonFabButton className="p-2 m-0" size='small' color='#'>
                                            <IonIcon icon={caretDownOutline} size='small' color="light" className="ion-accordion-toggle-icon" />
                                        </IonFabButton>
                                        <IonLabel className='d-flex py-0 my-0 ion-align-items-center ion-justify-content-between p-0 m-0'>
                                            <span className='ms-1 text-white'>
                                                Jobs
                                                <IonIcon icon={cube} color='light' className='ms-1' style={{transform: 'translate(0, 3px)'}}/>
                                            </span>
                                        </IonLabel>
                                    </IonItem>
                                    <div className="p-0 m-0" slot="content">
                                        <div className='p-0 m-0'>
                                            <ListarJobs />
                                        </div>
                                    </div>
                                </IonAccordion>

                                <IonAccordion value="pipelines" className='lista-navegacao glass'>
                                    <IonItem slot="header" color="#" className='rounded rounded-0'>
                                        <IonFabButton className="p-2 m-0" size='small' color='#'>
                                            <IonIcon icon={caretDownOutline} size='small' color="light" className="ion-accordion-toggle-icon" />
                                        </IonFabButton>
                                        <IonLabel className='d-flex ion-align-items-center ion-justify-content-between py-0 my-0'>
                                            <span className='ms-1 text-white'>
                                                Pipelines
                                                <IonIcon icon={layers} color='light' className='ms-1' style={{transform: 'translate(0, 3px)'}}/>
                                            </span>
                                        </IonLabel>
                                    </IonItem>
                                    <div className="p-0 m-0" slot="content">
                                        <div className='p-0 m-0'>
                                            {listarPipelines}
                                    </div>
                                </div>
                            </IonAccordion>

                            <IonAccordion value="queries" className='lista-navegacao glass'>
                                <IonItem slot="header" color="#" className='rounded rounded-0'>
                                    <IonFabButton className="p-2 m-0" size='small' color='#'>
                                        <IonIcon icon={caretDownOutline} size='small' color="light" className="ion-accordion-toggle-icon" />
                                    </IonFabButton>
                                    <IonLabel className='d-flex ion-align-items-center ion-justify-content-between py-0 my-0'>
                                        <span className='ms-1 text-white'>
                                            Queries
                                            <IonIcon icon={codeSlash} color='light' className='ms-1' style={{ transform: 'translate(0, 3px)' }} />
                                        </span>
                                    </IonLabel>
                                </IonItem>
                                <div className="p-0 m-0" slot="content">
                                    <div className='p-0 m-0'>
                                        {listarQueries}
                                    </div>
                                </div>
                            </IonAccordion>

                            </IonAccordionGroup>
                    </IonContent>
                </IonMenu>
                <div className="container" id="main" >
                    <IonContent className='w-100 h-100'>
                        {conteudoPainelPrincipal()}
                    </IonContent>
                </div>
            </IonSplitPane>
        );
    }

    if (isLoading) return <Carregando />;
    return (
        <div className='p-0 m-0'> 
            <IonLabel className='m-0 p-0 h-100' >
                {layoutGrupoBotoes(butoes)}
                {conteudo()}
            </IonLabel>

            {/* Modal personalizada da Schedule */}
            <IonModal style={{'--min-width': '94%', '--min-height': '90%'}} isOpen={verModalSchedule} ref={modalRef}>
                <DynamicModal
                    titulo="Schedule Completa"
                    elemento={<Schedule />}
                    onDismiss={() => {
                        if (!modalRef || !modalRef.current) return;
                        modalRef.current.dismiss();
                        setVerModalSchedule(false);
                        console.log(`Desativando modal Shedule (var: ${verModalSchedule})`);
                    }}
                    padding={false}
                />
            </IonModal>
        </div>
    );
};

export default EscolherPipelines;

