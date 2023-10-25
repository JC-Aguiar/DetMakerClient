import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonTextarea, useIonModal, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import JobCard from '../components/JobCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { flash } from 'ionicons/icons';
import blueThunder from '../resources/thunder spark gif blue.gif';
import darkThunder from '../resources/thunder spark gif dark.gif';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/ReduxStore';
import { EvidenciaDTO } from '../data/EvidenciaDTO';
import * as axiosRequest from "../data/AxiosRequest";
import { AxiosError } from 'axios';
import { converterEmDto } from '../data/ItemPilha';
import { useDispatch } from 'react-redux';
import { show } from '../Store/Reducer/ReducerTabMenu';
import ModalGenerica from '../components/ModalGenerica';


const ConfigurarJobs = (props: any) => {
    const dispatch = useDispatch();
    const pilhaExec = useSelector((state: RootState) => state.store.pilhaJobs.value);
    const pilhaConfig = pilhaExec.filter((itemPilha) => itemPilha.job.checked).length;
    const pilhaPronta = pilhaExec.filter((itemPilha) => itemPilha.pronto && itemPilha.job.checked).length;
    const history = useHistory();
    const [thunderGif, setThunderGif] = useState(blueThunder);
    const executarStatus = (pilhaPronta > 0 ? "session-buttons" : "disabled");
    const gif = (pilhaPronta > 0);
    const [toast, toastOff] = useIonToast();
    const [modalConfigPipelineOn, modalConfigPipelineOff] = useIonModal(
        ModalGenerica,
        {
            titulo: "Executar Pipeline",
            elemento: conteudo1(),
            onDismiss: () => modalConfigPipelineOff(),
        }
    );

    //Propriedades para chamar o Tost na parte inferior da tela
    const acionarToast = (mensagem: string, tempo: number, cor: string) => {
        toast({
            message: mensagem,
            duration: tempo,
            position: 'bottom',
            color: cor,
        });
    };

    //Acionamento assim que esta página for montada
    useIonViewDidEnter(() => {
        dispatch(show());
    }, []);

    //Acionamento sempre que esta página tiver algum dos seus componentes atualizados
    useEffect(() => {
        console.log(`[CONFIGURAR-JOBS] Jobs: ${pilhaExec.map((itemPilha) => itemPilha.job.nome).join(", ")}`);
        if (pilhaExec.length === 0) {
            console.log(`[CONFIGURAR-JOBS] A pilha de jobs está vazia. Retornando página.`);
            history.push('/det-maker/open/');
        }
        else {
            console.log(`[CONFIGURAR-JOBS] Carregando cards da pilha dos jobs selecionados.`);
        }
        itensParaExecutar();
    }, [pilhaExec]);

    //Mensagem em log e em Tost da quantidade de Job na Pipeline para executar
    const itensParaExecutar = () => {
        const mensagem = `Temos ${pilhaPronta} de ${pilhaConfig} jobs prontos para executar.`;
        console.log(`[CONFIGURAR-JOBS] ${mensagem}`);
        toastOff().then(() => acionarToast(mensagem, 5000, 'primary'));
    }

    //Botão customizado com efeitos visuais
    function textoBotao(texto: string) {
        return (
            <span className={`btn btn-outline-primary border border-0 banner-gold ps-2 pe-1 py-0 mx-1 ${executarStatus}`}
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
        console.log("[CONFIGURAR-JOBS] Realizando request da pilha de jobs.");
        try {
            const pilhaJobs = pilhaExec
                .filter((itemPilha) => itemPilha.pronto)
                .map((itemPilha) => converterEmDto(itemPilha));
            const evidencias: EvidenciaDTO[] = await axiosRequest.executarPilha(pilhaJobs);
            const sucessos = evidencias.filter((evidencia) => evidencia.sucesso).length;
            console.log(`[CONFIGURAR-JOBS] Total de jobs executados com sucesso: ${sucessos}.`);
        }
        catch (error) {
            const axiosError = error as AxiosError;
            let mensagemErro = "";

            //O servidor respondeu com um status diferente de 2xx
            if (axiosError.response) {
                mensagemErro = `O servidor respondeu com status diferente de sucesso.` + '\n'
                    + `Status ${axiosError.response.status}: ${axiosError.response.data}.`;
            }
            else if (axiosError.request) {
                mensagemErro = "Falha de conexão. Sem resposta do servidor.";
            }
            else {
                mensagemErro = `Erro ao fazer a requisição: ${axiosError.message}.`;
            }
            console.error(`[CONFIGURAR-JOBS] ${mensagemErro}`);
            toastOff().then(() => acionarToast(mensagemErro, 9900, 'warning'));
        }
        finally {
            
        }

    }

    //Configurando as quebras dos slides usado pelo Swiper
    const breakpoints = {
        640: { slidesPerView: 1, centeredSlides: true, loop: false },
        768: { slidesPerView: 2, centeredSlides: true, loop: false },
        1024: { slidesPerView: 4, centeredSlides: true, loop: false },
    };

    //Definie se os slides devem ou não serem centralizados pelo Swiper
    function centralizarSlides(numero: number): boolean {
        return pilhaExec.length < numero;
    }

    //Conteúdo da modal para configurar informações da Pipeline
    function conteudo1() {
        return (
        <div id="capa-jobs" className="row justify-content-center px-3 mx-0">
            <div className='col row text-primary border border-1 rounded mt-2 bg-white'>
                <div className='h5 text-center text-primary py-1'>Preencha os dados abaixo para prosseguir</div>
                <IonItem className='text-primary'>
                    <IonLabel >*Pipeline:</IonLabel>
                    <IonInput inputmode='text' maxlength={200} placeholder='' required></IonInput>
                </IonItem>
                <IonItem className='text-primary'>
                    <IonLabel >*Descrição:</IonLabel>
                    <IonTextarea inputmode='text' maxlength={500} placeholder='' required></IonTextarea>
                </IonItem>
                <IonItem className='text-primary'>
                    <IonLabel className=''>Atividade:</IonLabel>
                    <IonInput inputmode='text' maxlength={300} placeholder=''></IonInput>
                </IonItem>
                <IonItem className='text-primary'>
                    <IonLabel className=''>Projeto:</IonLabel>
                    <IonInput inputmode='text' maxlength={200} placeholder=''></IonInput>
                </IonItem>
                <IonItem className='text-primary'>
                    <IonLabel className=''>Configurações:</IonLabel>
                    <IonTextarea inputmode='text' maxlength={200} placeholder=''></IonTextarea>
                </IonItem>
                <div className='py-3'></div>
                <IonButton color='primary' 
                    className='session-login-button' 
                    fill="solid" 
                    disabled={true}
                >
                    EXECUTAR
                </IonButton>
                <div className='pb-3'></div>
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

    //Renderização principal desta página
    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-5'></div>
                <h1 className="card-title destaque-low lh-1 m-0 text-center">Pilha de Jobs</h1>
                <h5 className="card-text text-primary ms-2 text-center">
                    Configure os Jobs clicando nos cards para {textoBotao('EXECUTAR PIPELINE')}
               </h5>

                {/* Slides dos Job-Cards */}
                <Swiper
                    spaceBetween={24}
                    breakpoints={breakpoints}
                    keyboard={true}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    height={300}
                >
                    <div className='d-flex justify-items-center'>
                    {
                        pilhaExec.filter((itemPilha) => itemPilha.job.checked)
                            .map((itemPilha, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <JobCard id={itemPilha.job.id} key={index} callback={itensParaExecutar} />
                                    </SwiperSlide>
                                );
                            })
                    }
                    </div>
                </Swiper>

                {/* Recuo */}
                <div className='pt-3 pt-md-5'></div>
            </IonContent>
        </IonPage>
    );
};

export default ConfigurarJobs;