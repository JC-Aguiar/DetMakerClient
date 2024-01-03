import { InputChangeEventDetail, IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonModal, IonProgressBar, IonRadio, IonRadioGroup, IonRow, IonSplitPane, IonTextarea, RadioGroupChangeEventDetail, TextareaChangeEventDetail, useIonModal, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import { useRef, useState } from 'react';
import { caretDownOutline, closeCircle, cloudUpload, cube, informationCircleOutline, layers, listOutline, refresh, save } from 'ionicons/icons';
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from '../Store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { loadingJobs, setJobs, setViewJobs } from '../Store/Reducer/ReducerJobs';
import DynamicModal from '../components/DynamicModal';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { loadingPipelines, setPipelines } from '../Store/Reducer/ReducerPipelines';
import { JobConfig, JobConfigDTO, parseJobInfo } from '../data/JobConfigDTO';
import { Noticacao } from '../components/Noticacao';
import ButtonLayout, { ButtonLayoutProps, layoutGrupoBotoes } from '../components/ButtonLayout';
import ConfigurarJobs from './ConfigurarJobs';
import { JobInfoDTO } from '../data/JobInfoDTO';
import { setMainPipeline, setMainJobs } from '../Store/Reducer/ReducerAtividade';
import ListarJobs from '../components/ListarJobs';
import Schedule from './Schedule';
import iconPipeline from '../resources/pipeline.svg';
import Informativo from '../components/Informativo';
import Carregando from '../components/Carregando';


const EscolherPipelines: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atrbiutos úteis
    const dispatch = useDispatch();
    const history = useHistory();
    const [conectionsCount, setConectionsCount] = useState<number>(0);
    const isLoadingJobs = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const isLoadingPipelines = useSelector((state: RootState) => state.store.catalogoPipelines.loading);
    const isLoading = () => {
        return isLoadingJobs || isLoadingPipelines;
    };

    //Atributos dos principais recursos da aplicação
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
    const jobsSelecionados: number[] = useSelector((state: RootState) => state.store.catalogoJobs.jobsSelecionados);
    const catalogoJobsSelecionados: JobInfoDTO[] = catalogoJobs
        .filter((item) => jobsSelecionados.findIndex((id) => id === item.id) !== -1);
    const catalagoPipelines: PipelineInfoDTO[] = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineIndex: number = catalagoPipelines.findIndex((item) => item.nome === mainPipeline);
    const [jobsSucesso, setJobsSucesso] = useState<boolean | null>(null);
    const [pipelinesSucesso, setPipelinesSucesso] = useState<boolean | null>(null);

    //Atributos para carregar schedule
    const [enviar, setEnviar] = useState<boolean | undefined>(false);
    const [anexo, setAnexo] = useState<File | null>(null);

    let pipelineNome: string = ("");
    let pipelineDescricao: string = ("");

    //Atributos de botões
    const botaoAtualizar = {
        title: 'Atualizar',
        icon: refresh,
        trigger: () => coletarRecursos(),
        disable: isLoading(),
    } as ButtonLayoutProps;

    const botaoNovaPipeline = {
        title: 'Nova Pipeline',
        icon: layers,
        trigger: () =>  modalNovaPipelineOn(),
        disable: isLoading() || catalogoJobs.length < 1,
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
        disable: isLoading() || catalogoJobs.length < 1,
    } as ButtonLayoutProps;

    const botaoNovaSchedule = {
        title: 'Nova Schedule',
        icon: cloudUpload,
        trigger: () => uploadSchedule(),
        disable: isLoading(),
    } as ButtonLayoutProps;

    /*
    <ButtonLayout key={index} 
        title={item.title} 
        icon={item.icon} 
        disable={item.disable} 
        trigger={item.trigger} 
    />
    */

    //Conteúdo da modal 'Nova Pipeline'
    function conteudoNovaPipeline() {

        //handler para preencher nome da Pipeline
        const preencherPepilineNome = (event: CustomEvent<InputChangeEventDetail>) => {
            const value = (event.target as HTMLInputElement).value.trim();
            pipelineNome = (value);
            console.log(`[CONFIGURAR-JOBS] Pipeline nome alterada para ${value}.`);
        }

        //Handler para preencher descrição da Pipeline
        const preencherPepilineDescricao = (event: CustomEvent<TextareaChangeEventDetail>) => {
            const value = (event.target as HTMLInputElement).value.trim();
            pipelineDescricao = (value);
            console.log(`[CONFIGURAR-JOBS] Pipeline descrição alterada para ${value}.`);
        }
        
        return <>
            <div id="capa-jobs" className="row justify-content-center px-3 mx-0">
                <div className='col row text-primary border border-1 rounded mt-2 bg-white'>
                    <div className='h5 text-center text-primary py-1'>Preencha os dados abaixo para prosseguir</div>
                    <IonItem className='text-primary'>
                        <IonLabel className='fw-bold' >*Pipeline:</IonLabel>
                        <IonInput inputmode='text'
                            maxlength={200}
                            value={pipelineNome}
                            className='card m-2 ms-4'
                            onIonChange={(e) => preencherPepilineNome(e)}
                            required
                        />
                    </IonItem>
                    <IonItem className='text-primary'>
                        <IonLabel className='fw-bold' >*Descrição:</IonLabel>
                        <IonTextarea inputmode='text'
                            maxlength={500}
                            value={pipelineDescricao}
                            className='card m-2'
                            style={{minHeight: '128px' }}
                            onIonChange={(e) => preencherPepilineDescricao(e)}
                            required
                        />
                    </IonItem>
                    <IonItem className='text-primary' lines='full' >
                        <IonRow className='d-flex'>
                        <IonCol size='1'><IonLabel className='fw-bold' >Jobs:</IonLabel></IonCol>
                        <IonCol size='10' className='ms-3'>
                        {
                            catalogoJobsSelecionados.map((item, index) => 
                                <IonBadge key={index} className='mx-1'>
                                    {item.nome}
                                </IonBadge>
                            
                            )
                        }
                        </IonCol>
                        </IonRow>
                    </IonItem>
                    <IonButton className='w-100 mt-4 my-3' onClick={() => salvarNovaPipeline()} > 
                        <IonIcon icon={save} className='me-2'></IonIcon>
                        Salvar no Banco
                    </IonButton>
                </div>
            </div>
        </>
    }

    const conteudoPainelPrincipal = () => {
        if (jobsSelecionados.length > 0) return exibirJobsSelecionados();
        if (mainPipeline !== "") return <ConfigurarJobs toastInfo={toastInfo} toastOk={toastOk} toastErro={toastErro} />;
        const mensagem = 'Use o painel lateral para vizualizar {Jobs} e {Pipelines}\n'
            +'Selecione um {Job}, fora da {Pipeline}, para analisá-lo\n'
            +'Selecione uma {Pipeline} para inserir {Jobs} ou configurar sua execução';
        return <Informativo mensagem={mensagem} status='Normal' />;
    }

    const cancelarMainPipeline = () => {
        if (mainPipeline !== "") dispatch(setMainPipeline({ nome: "", jobs: [] }));
    }

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
                            <IonIcon icon={closeCircle} color="primary" className='pe-1' style={{ transform: 'scale(1.4)' }} />
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

    //Conteúdo da modal 'Carregar Pipeline'
    const painelDeControle = (
        
            <IonSplitPane when="xs" contentId="main" className='px-5 mx-5 '>
                <IonMenu contentId="main" className='glass' color='#'>
                    <IonContent className='glass-content p-0 m-0 mx-5'>

                            <IonAccordionGroup multiple={true}>
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
                                                <IonIcon icon={iconPipeline} className='ms-1' style={{fill: 'white', transform: 'translate(0, 3px)'}}/>
                                            </span>
                                        </IonLabel>
                                    </IonItem>
                                    <div className="p-0 m-0" slot="content">
                                        <div className='p-0 m-0'>
                                            {listarPipelines}
                                        </div>
                                    </div>
                                </IonAccordion>

                            </IonAccordionGroup>
                    </IonContent>
                </IonMenu>
                <div className="container" id="main" >
                    {conteudoPainelPrincipal()}
                </div>
            </IonSplitPane>
    );

    function exibirJobsSelecionados() {
        const fonteCodigo = 'font-monospace text-secondary fw-bold'
        return catalogoJobsSelecionados.map((jobDto, index) =>
            <IonCard key={index}>
                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="#" className='banner' >
                            <IonCardHeader className='py-0'>
                                <IonCardTitle className='text-white py-0'>{jobDto.nome}</IonCardTitle>
                            </IonCardHeader>
                        </IonItem>
                        <div className="p-0 m-0" slot="content">
                            <IonCardContent className='bg-white text-primary'>
                                <div className='small'>
                                    <section className="">
                                        <table className="table table-stripe"> {/* table-light table-striped */}
                                            <tbody>
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
                                                    <td className='text-end'>Máscara de Carga:</td>
                                                    <td colSpan={1}>
                                                        <span className={fonteCodigo}>{jobDto.mascaraEntrada.join(", ")}</span>
                                                    </td>
                                                    <td className='text-end'>Máscara de Saída:</td>
                                                    <td colSpan={1}>
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
            elemento: conteudoNovaPipeline(),
            onDismiss: () => modalNovaPipelineOff(),
        }
    );

    const [verModalSchedule, setVerModalSchedule] = useState<boolean>(false);
    const modalRef = useRef<HTMLIonModalElement>(null);

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        if ((catalogoJobs.length < 1 || conectionsCount < 1) && !isLoading()) coletarRecursos();
    }, []);


    //Atualizando Pipelines e Jobs com base no banco
    async function coletarRecursos() {
        dispatch(loadingJobs(true));
        dispatch(loadingPipelines(true));
        await obterJobsBanco().then(() => obterPipelinesBanco());
        dispatch(loadingJobs(false));
        dispatch(loadingPipelines(false));
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
            const jobsBanco: JobInfoDTO[] = await axiosRequest.openSchedule(anexo);
            dispatch(setJobs(jobsBanco));
            dispatch(setMainPipeline({ nome: "", jobs: [] }));            
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
            const novosJobs: JobInfoDTO[] = (await axiosRequest.getAllJobs());
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
        dispatch(setMainPipeline({ nome: "", jobs: [] }));
        try {
            const pipelines: PipelineInfoDTO[] = await axiosRequest.getAllPipelines();
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
                nome: pipelineNome,
                descricao: pipelineDescricao,
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
            console.log(`[CONFIGURAR-JOBS]: Definindo Main-Pipeline para ${novaPipelineSalva.nome}.`);
            dispatch(setMainPipeline({ 
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

    function conteudo() {
        if (catalogoJobs.length < 1) {
            return <Informativo 
                mensagem='Uma alternativa é fazer o upload da planilha de Jobs, usando o botão {Nova Schedule}' 
                status='SemDados'
            />;
        }
        return painelDeControle;
    }

    if (isLoading()) return <Carregando />;

    return (
        <div className='p-0 m-0'> 
            <IonLabel className='m-0 p-0 h-100' >
                {layoutGrupoBotoes([ botaoAtualizar, botaoNovaPipeline, botaoVerSchedule, botaoNovaSchedule ])}
                {conteudo()}
            </IonLabel>
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

