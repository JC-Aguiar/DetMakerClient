import { InputChangeEventDetail, IonButton, IonCard, IonCardHeader, IonCardTitle, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonReorderGroup, IonRow, IonTextarea, IonTitle, ItemReorderEventDetail, TextareaChangeEventDetail, useIonModal, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import JobCard from '../components/JobCard';
//import { Swiper, SwiperSlide } from 'swiper/react';
//import 'swiper/css';
//import 'swiper/css/pagination';
//import 'swiper/css/navigation';
//import { Pagination, Navigation } from 'swiper/modules';
import { flash } from 'ionicons/icons';
import blueThunder from '../resources/thunder spark gif blue.gif';
import darkThunder from '../resources/thunder spark gif dark.gif';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/ReduxStore';
import * as axiosRequest from "../data/AxiosRequest";
import { JobConfigDTO, JobConfig, } from '../data/JobConfigDTO';
import { useDispatch } from 'react-redux';
import DynamicModal from '../components/DynamicModal';
import { ReducerProjetoTYPE, setDadosProjeto } from '../Store/Reducer/ReducerProjetos';
import { addRevisao, removeRevisao } from '../Store/Reducer/ReducerRevisao';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { PipelineNovaExecDTO } from '../data/PipelineNovaExecDTO';
import { RelatorioInfoDTO } from '../data/RelatorioInfoDTO';
import { UserInfoDTO } from '../data/UserInfoDTO';
import { RelatorioHistoricoDTO } from '../data/RelatorioHistoricoDTO';
import { Noticacao } from '../components/Noticacao';
import { reorderMainJobs, setMainJobs } from '../Store/Reducer/ReducerAtividade';
import { UserDTO } from '../data/UserDTO';
import { RelatorioResumoDTO } from '../data/RelatorioResumoDTO';
import { addRelatorio, loadingRelatorios, setRelatorios } from '../Store/Reducer/ReducerRelatorios';
import { JobExecuteDTO, parseJobConfigParaJobExecute } from '../data/JobExecuteDTO';


const ConfigurarJobs: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Propriedades do <ConfigurarJobs>
    const dispatch = useDispatch();
    const reorderGroupRef = useRef<HTMLIonReorderGroupElement>(null);
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const catalogoRelatorios: RelatorioResumoDTO[] = useSelector((state: RootState) => state.store.catalogoRelatorios.catalogo);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineDescricao: string | undefined = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo)
        .find((item) => item.nome === mainPipeline)?.nome;
    const history = useHistory();
    const [thunderGif, setThunderGif] = useState(blueThunder);
    const gif = mainPipeline !== "";
    const [projetoId, setProjetoId] = useState<string>("");
    const [projetoNome, setProjetoNome] = useState<string>("");
    const [atividadeNome, setAtividadeNome] = useState<string>("");
    const [configuracao, setConfiguracao] = useState<string>("");
    const [modalConfigPipelineOn, modalConfigPipelineOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Executar Pipeline",
            elemento: conteudoConfigPipeline(),
            onDismiss: () => modalConfigPipelineOff(),
        }
    );

    //Acionamento assim que esta página for montada
    useIonViewDidEnter(() => {
        //dispatch(show());
        //console.log(`[CONFIGURAR-JOBS] Jobs: ${pilhaExec.map((itemPilha) => itemPilha.job.nome).join(", ")}`);
        if (mainJobs.length === 0) {
            console.log(`[CONFIGURAR-JOBS] A pilha de jobs está vazia. Retornando página.`);
            //history.push(axiosRequest.URL_PIPELINES);
        }
        else {
            console.log(`[CONFIGURAR-JOBS] Carregando cards da pilha dos jobs selecionados.`);
        }
    }, []);

    /*
    //Acionamento nesta página sempre que o catálogo de Jobs for atualizado
    useEffect(() => {
        //itensParaExecutar();
        const reordenador = reorderGroupRef.current;
        if (reordenador) {
            console.log(`[CONFIGURAR-JOBS] Reordenando a pilha de Jobs na página.`);
            //const fakeEvent
            reordenador.complete();
        }
    }, [mainJobs]);
    */

    //Mensagem em log e em Tost da quantidade de Job na Pipeline para executar
    //const itensParaExecutar = () => {
    //    const mensagem = `Temos ${numPilhaPronta} de ${numPilhaConfig} jobs prontos para executar.`;
    //    console.log(`[CONFIGURAR-JOBS] ${mensagem}`);
    //    toastOk(mensagem, []);
    //}

    function camposPreenchidos(): boolean {
        if (!mainPipelineDescricao) return false;
        return projetoId.trim().length > 0 && projetoNome.trim().length > 0 && atividadeNome.trim().length > 0;
    }

    //Botão customizado com efeitos visuais
    function textoBotao(texto: string) {
        const ativo = mainPipeline !== "" ?  "banner-gold session-buttons" : "disabled border-2 border-white text-white";
        return (
            <span className={`btn btn-outline-primary border ${ativo} ps-2 pe-1 py-0 mx-1`}
                onMouseOver={() => setThunderGif(darkThunder)}
                onMouseLeave={() => setThunderGif(blueThunder)}
                onClick={() => modalConfigPipelineOn()}
            >
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-1" hidden={!gif} />
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-2" hidden={!gif} />
                {texto}
                <IonIcon icon={flash} />
            </span>
        );
    }

    //Requisição para executar a Pipeline
    async function executarPipeline() {
        console.log(`[CONFIGURAR-JOBS]: Iniciando requisição 'Executar Pipeline'.`);
        toastInfo("EXECUTAR PIPELINE: Em execução...", []);

        modalConfigPipelineOff();
        if (!mainPipelineDescricao) {
            console.log('[CONFIGURAR-JOBS]: Descrição da Main-Pipeline está indefinida!');
            return;
        };
        //const novoDadosProjeto: ReducerProjetoTYPE = {
        //    pipelineNome: mainPipeline,
        //    pipelineDescricao: mainPipelineDescricao,
        //    projetoId: projetoId,
        //    projetoNome: projetoNome,
        //    atividadeNome: atividadeNome,
        //    configuracao: configuracao,
        //};
        //dispatch(setDadosProjeto(novoDadosProjeto));

        try {
            //const pilhaJobs: JobConfig[] = pilhaChecked
            //    .filter((itemPilha) => itemPilha.pronto)
            //    .map((itemPilha) => configToExecuteDto(itemPilha)); //TODO: melhorar?
            const pipelineDto: PipelineInfoDTO = {
                nome: mainPipeline,
                descricao: mainPipelineDescricao,
                jobs: mainJobs.map((item) => item.nome),
                checked: true,
            };
            const relatorioDto: RelatorioInfoDTO = {
                idProjeto: projetoId,
                nomeProjeto: projetoNome,
                nomeAtividade: atividadeNome,
                configuracao: configuracao,
                testeTipo: "Unitário",
                //sistema: "",
                //ambiente: "",
            };
            const jobsDto: JobExecuteDTO[] = mainJobs.map((item) => parseJobConfigParaJobExecute(item));
            const body: PipelineNovaExecDTO = {
                pipeline: pipelineDto,              //TODO: informação repetida aqui
                relatorio: relatorioDto,
                jobs: jobsDto,
                userInfo: {
                    nome: user ? user.name : "Anônimo",
                    papel: "DEV",
                    empresa: "PPW",
                } as UserInfoDTO,
            };
            //const arquivoDet: Blob = await axiosRequest.executarPilha(body);
            //const buttons = [
            //    {
            //      text: 'Abrir',
            //      role: 'Abrir DET',
            //      handler: () => abrirDet(arquivoDet),
            //    }
            //  ]
            console.log(`JSON de envio: ${JSON.stringify(body)}`);

            dispatch(removeRevisao());
            dispatch(loadingRelatorios(true));
            const relatorioParaRevisar: RelatorioHistoricoDTO = await axiosRequest.executarPipeline(body);
            //dispatch(addRevisao({ value: relatorio }));
            dispatch(setRelatorios([]));
            dispatch(addRevisao({ value: relatorioParaRevisar }));
            dispatch(loadingRelatorios(false));
            toastOk("EXECUTAR PIPELINE: Realizada com sucesso.", []);
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Executar Pipeline' funcionou.`);
            console.log(`[CONFIGURAR-JOBS] Navegando para: ${axiosRequest.URL_DET}`);
            history.push(axiosRequest.URL_DET);
        }
        catch (error) {
            toastErro(`EXECUTAR PIPELINE: ${error}`, []);
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Executar Pipeline' falhou.`);
        }
    }

    function abrirDet(fileBlob: Blob) {
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
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

    //Configurando as quebras dos slides usado pelo Swiper
    const breakpoints = {
        640: { slidesPerView: 1, centeredSlides: true, loop: false },
        768: { slidesPerView: 2, centeredSlides: true, loop: false },
        1024: { slidesPerView: 4, centeredSlides: true, loop: false },
    };

    //Definie se os slides devem ou não serem centralizados pelo Swiper
    function centralizarSlides(numero: number): boolean {
        return mainJobs.length < numero;
    }

    //Conteúdo da modal para configurar informações da Pipeline
    function conteudoConfigPipeline() {
        if (mainPipeline === "") return;
        return (
            <div id="capa-jobs" className="row justify-content-center px-3 mx-0">
                <div className='col row border border-1 rounded mt-2 px-0 mx-0 bg-white'>
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
                            className='card m-1 ms-3 me-3'
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
                            className='card m-1'
                            onIonChange={(e) => preencherProjetoNome(e)}
                            required
                        />
                    </IonItem>
                    <IonItem className='text-primary'>
                        <IonLabel className='fw-bold me-4'>Atividade:</IonLabel>
                        <IonInput inputmode='text'
                            maxlength={300}
                            value={atividadeNome}
                            className='card m-1 ms-3'
                            onIonChange={(e) => preencherAtividade(e)}
                            required
                        />
                    </IonItem>
                    <IonItem className='text-primary'>
                        <IonLabel className='fw-bold'>Configurações:</IonLabel>
                        <IonTextarea inputmode='text'
                            maxlength={200}
                            value={configuracao}
                            className='card m-1'
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

    //Conteúdo da modal para configurar a tela de espera de execução da Pipeline (será usado?)
    function conteudo2() {
        return (
        <div className="card border border-2 p-3 mx-0 mx-md-4" id="capa-abrir">
            <div className="progress" role="progressbar" aria-label="carregando..." >
                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: "100%" }}></div>
            </div>
            <h1 className="card-title destaque-low lh-1 m-0 text-center">
                Executando
            </h1>
            <h5 className="card-text h5 text-primary ms-2 mt-2 text-center">
                Aguarde a aplicação retonar o resultado da pilha de Jobs.
            </h5>
            <div className='d-flex justify-content-center'>
                <img src={blueThunder} alt="GIF Animado" id="thunder-gif-3" hidden={!gif} sizes='large' />
                <img src={blueThunder} alt="GIF Animado" id="thunder-gif-4" hidden={!gif} sizes='large' />
                <IonIcon id="flash" className="text-primary" icon={flash} ></IonIcon>
            </div>
            <div className='mb-5'></div>
        </div>
        );
    }

    function reordenar(event: CustomEvent<ItemReorderEventDetail>) {
        //Valida se a referência ao IonReorderGroup existe
        const itens = reorderGroupRef?.current?.children;
        if (!itens) return;

        //Métodos `from` e `to` contêm os índices (antes e depois) do item movido
        const ordemAntiga = event.detail.from;
        const ordemNova = event.detail.to;
        event.detail.complete();
        
        let jobDto: JobConfig | undefined = mainJobs.find((item) => item.ordem === ordemAntiga);
        if (!jobDto) return;
        console.log(`[CONFIG-JOBS]: Movendo job ${jobDto.nome} do index ${ordemAntiga} para ${ordemNova}.`);

        //Coleta no DOM do html o elemento interno com a informação do Job.id
        const ordemIds: number[] = [];
        Array.from(itens).map((item, ordem) => {
            //Expressão XPath para realizar a coleta
            const elementoAlvo = item.querySelector('ion-row ion-item ion-label ion-reorder ion-item ion-card span span span');
            if (!elementoAlvo) return
            console.log(`elementoAlvo: ${elementoAlvo.textContent}`);

            const id = elementoAlvo.textContent ? Number.parseInt(elementoAlvo.textContent) : -999;
            if (id === -999 || Number.isNaN(id)) return;
            //console.log(`ID: ${id}`);
            ordemIds.push(id);
        });

        console.log(`[CONFIG-JOBS]: IDS nova ordem: ${ordemIds}`);

        //Atualizando estado no Redux
        dispatch(reorderMainJobs({ ids: ordemIds }));
    }

    //Renderização principal desta página
    /*
                <Swiper
                spaceBetween={24}
                breakpoints={breakpoints}
                keyboard={true}
                pagination={{ clickable: false }}
                navigation={true}
                modules={[Pagination, Navigation]}
                height={300}
            >
    */

    //Renderização do componente
    return (
        <div className='container'>
            <IonCard>
                <IonCardTitle className='p-0 py-1 m-0 banner text-white text-center'>
                    <span className='h6'>
                        Ordene os Jobs e configure suas propriedades no ícone da engrenagem. <br/>
                        Quando estive pronto:{textoBotao('EXECUTAR A PIPELINE')}
                    </span>
                </IonCardTitle>
            </IonCard>
            <IonRow className=' ion-justify-content-center p-0 m-0 w-100'>
                <IonList className='w-100 py-2 px-2'>
                    <IonReorderGroup disabled={false} onIonItemReorder={reordenar} ref={reorderGroupRef} className='p-0 m-0' >
                    {
                        mainJobs.map((item, index) => 
                            <JobCard key={index}
                                id={item.id}
                                notificacao={{ toastInfo, toastOk, toastErro } as Noticacao}
                                callback={() => null}
                            />
                        )
                    }
                    </IonReorderGroup>
                </IonList>
            </IonRow>
        </div>
    );
};

export default ConfigurarJobs;