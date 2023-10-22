import { IonContent, IonIcon, IonModal, IonPage, useIonToast } from '@ionic/react';
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


const ConfigurarJobs = (props: any) => {
    const pilhaExec = useSelector((state: RootState) => state.store.pilhaJobs.value);
    const pilhaConfig = pilhaExec.filter((itemPilha) => itemPilha.job.checked).length;
    const pilhaPronta = pilhaExec.filter((itemPilha) => itemPilha.pronto && itemPilha.job.checked).length;
    const history = useHistory();
    const [execModal, setExecModal] = useState<boolean>(false);
    const [thunderGif, setThunderGif] = useState(blueThunder);
    const executarStatus = (pilhaPronta > 0 ? "session-buttons" : "disabled");
    const gif = (pilhaPronta > 0);
    const [toast, toastOff] = useIonToast();
    const acionarToastOK = (mensagem: unknown) => {
        toast({
            message: `${mensagem}`,
            duration: 5000,
            position: 'bottom',
            color: 'primary',
        });
    };
    const acionarToastErro = (mensagem: unknown) => {
        toast({
            message: `${mensagem}`,
            duration: 9900,
            position: 'bottom',
            color: 'warning',
        });
    };
    

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

    const itensParaExecutar = () => {
        const mensagem = `Temos ${pilhaPronta} de ${pilhaConfig} jobs prontos para executar.`;
        console.log(`[CONFIGURAR-JOBS] ${mensagem}`);
        toastOff().then(() => acionarToastOK(mensagem));
    }

    function textoBotao(texto: string) {
        return (
            <span className={`btn btn-outline-primary border border-0 banner-gold ps-2 pe-1 py-0 mx-1 ${executarStatus}`}
                onMouseOver={() => setThunderGif(darkThunder)}
                onMouseLeave={() => setThunderGif(blueThunder)}
                onClick={() => executarJobs()}
            >
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-1" hidden={!gif} />
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-2" hidden={!gif} />
                {texto}
                <IonIcon icon={flash} />
            </span>
        );
    }

    async function executarJobs() {
        setExecModal(true);
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
            toastOff().then(() => acionarToastErro(mensagemErro));
        }
        finally {
            setExecModal(false);
        }

    }

    const breakpoints = {
        640:  { slidesPerView: 1, centeredSlides: true, loop: false },
        768:  { slidesPerView: 2, centeredSlides: true, loop: false },
        1024: { slidesPerView: 4, centeredSlides: true, loop: false },
    };

    function centralizarSlides(numero: number): boolean {
        return pilhaExec.length < numero;
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-5'></div>
                <div id="capa-jobs" 
                    className="row justify-content-center border border-2 rounded rounded-2 bg-white p-3 p-md-0 mx-0 mx-md-4"
                >
                    <h1 className="card-title destaque-low lh-1 m-0 text-center">Pilha de Jobs</h1>
                    <h5 className="card-text text-primary ms-2 text-center">
                        Preencha todos os campos dos cards para {textoBotao('EXECUTAR OS JOBS')}
                    </h5>
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
                    <div className='mb-5'></div>
                </div>
                <div className='pt-3 pt-md-5'></div>
                <IonModal isOpen={execModal} backdropDismiss={false}>
                    <IonContent fullscreen={true} scrollEvents={true} >
                        <div className='pt-3 pt-md-5'></div>
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
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default ConfigurarJobs;