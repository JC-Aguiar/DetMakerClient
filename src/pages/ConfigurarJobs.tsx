import { IonContent, IonIcon, IonModal, IonPage, useIonModal, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import JobCard from '../components/JobCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { ItemPilha } from '../components/ItemPilha';
import { flash } from 'ionicons/icons';
import blueThunder from '../resources/thunder spark gif blue.gif';
import darkThunder from '../resources/thunder spark gif dark.gif';
import { useState } from 'react';
import { pilha } from '../App';
import { AgendaDTO } from '../components/AgendaDTO';
import { ComandoSQL } from '../components/ComandoSQL';

/**
 * Array de {@link ItemPilha} que representa todos os jobs que se encontram prontos para serem executados.
 * Ou seja, todos os seus respectivos requisitos foram preenchidos.
 * A funcional {@link controlePilhaPronta} é responsável por adiministrar esse array e pode ser chamado por qualquer componente.
 */
const pilhaPronta: ItemPilha[] = [];
export const controlePilhaPronta = (
    numeroPilha: number,
    agenda: AgendaDTO,
    parametros: string[],
    queries: ComandoSQL[],
    cargas: string[],
    pronto: boolean
) => {
    //Log
    if (numeroPilha === -1) {
        console.log(`[CONFIGURAR-JOBS] Recebendo callback da planilha schedule referente job ${agenda.job}.`);
    }
    else {
        console.log(`[CONFIGURAR-JOBS] Recebendo callback do card job [${numeroPilha}] ${agenda.job}:` + '\n'
            + ` - Parametros (${parametros.join(", ")})` + '\n'
            + ` - Queries (${queries.map((comandoSql) => comandoSql.query).join(", ")})` + '\n'
            + ` - Cargas (${cargas.join(", ")})` + '\n'
            + ` - Pronto = ${pronto}`
        );
    }
    //Se o Job do callback está pronto para ser executado
    if (pronto) {
        let itemPresente = false;
        const novoItemPronto: ItemPilha = {
            agenda: agenda,
            argumentos: parametros,
            queries: queries,
            cargas: cargas,
            pronto: pronto
        };
        pilhaPronta.map((itemPronto, index) => {
            if (itemPronto.agenda.id === agenda.id) {
                console.log(`[CONFIGURAR-JOBS] Atualizando índice Nº${index} (ID ${agenda.id}) na pilha de jobs prontos.`);
                itemPresente = true;
                return novoItemPronto;
            }
            return itemPronto;
        });
        if (!itemPresente) {
            console.log(`[CONFIGURAR-JOBS] Adicionando índice Nº${pilhaPronta.length} (ID ${agenda.id}) na pilha de jobs prontos.`);
            pilhaPronta.push(novoItemPronto);
        }
    }
    //Se o Job do callback NÃO está pronto para ser executado
    else {
        let removerIndex = -1;
        pilhaPronta.map((itemPronto, index) => {
            if (itemPronto.agenda.id === agenda.id) removerIndex = index;
        });
        if (removerIndex !== -1) {
            console.log(`[CONFIGURAR-JOBS] Removendo índice Nº${removerIndex} (ID ${agenda.id}) na pilha de jobs prontos.`);
            pilhaPronta.splice(removerIndex, 1);
        }
        else {
            console.log(`[CONFIGURAR-JOBS] Nenhum índice precisa ser alterado na pilha de jobs prontos.`);
        }
    }
}

const ConfigurarJobs = (props: any) => {
    const history = useHistory();
    const callBack = props.callBack;
    const [modalOn, setModalOn] = useState<boolean>(false);
    const [thunderGif, setThunderGif] = useState(blueThunder);
    const [executarStatus, setExecutarStatus] = useState<string>("disabled");
    const [gif, setGif] = useState<boolean>(false);
    const [toast, toastOff] = useIonToast();
    const acionarToast = (mensagem: unknown) => {
        toast({
            message: `${mensagem}`,
            duration: 9900,
            position: 'bottom',
            color: 'primary',
        });
    };

    useIonViewDidEnter(() => {
        if (pilha.length === 0) {
            console.log(`[CONFIGURAR-JOBS] A pilha está vazia. Retornando página.`);
            history.goBack();
        }
        else {
            console.log(`[CONFIGURAR-JOBS] Carregando cards da pilha dos jobs selecionados.`);
        }
        itensParaExecutar();
    }, []);

    const callBackJobCard = (
        numeroPilha: number,
        agenda: AgendaDTO,
        parametros: string[],
        queries: ComandoSQL[],
        cargas: string[],
        pronto: boolean
    ) => {
        controlePilhaPronta(numeroPilha, agenda, parametros, queries, cargas, pronto);
        itensParaExecutar();
    }

    const itensParaExecutar = async () => {
        setExecutarStatus(pilhaPronta.length < 1 ? "disabled" : "session-buttons");
        setGif(pilhaPronta.length > 0);

        const mensagem = `Temos ${pilhaPronta.length} de ${pilha.length} jobs prontos para executar.`;
        console.log(`[CONFIGURAR-JOBS] ${mensagem}`);
        await toastOff();
        acionarToast(mensagem);
    }

    function textoBotao(texto: string) {
        return (
            <span className={`btn btn-outline-primary border border-0 banner-gold ps-2 pe-1 py-0 mx-1 ${executarStatus}`}
                onMouseOver={() => setThunderGif(darkThunder)}
                onMouseLeave={() => setThunderGif(blueThunder)}
                onClick={() => setModalOn(true)}
            >
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-1" hidden={!gif} />
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-2" hidden={!gif} />
                {texto}
                <IonIcon icon={flash} />
            </span>
        );
    }

    const breakpoints = {
        640: { slidesPerView: 1, centeredSlides: centralizarSlides(1), loop: !centralizarSlides(1) },
        768: { slidesPerView: 2, centeredSlides: centralizarSlides(2), loop: !centralizarSlides(2) },
        1024: { slidesPerView: 4, centeredSlides: centralizarSlides(4), loop: !centralizarSlides(4) },
    };

    function centralizarSlides(numero: number): boolean {
        return pilha.length < numero;
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-5'></div>
                <div id="capa-jobs" className="row justify-content-center border border-2 rounded rounded-2 bg-white p-3 p-md-0 mx-0 mx-md-4">
                    <h1 className="card-title destaque-low lh-1 m-0 text-center">Pilha de Jobs</h1>
                    <h5 className="card-text text-primary ms-2 text-center">
                        Preencha todos os campos de cada job para poder {textoBotao('EXECUTAR A PILHA')}
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
                                pilha.map((itemPilha, index) => {
                                    let novoItemPilha = pilhaPronta.find(
                                        (itemPilhaPronta) => itemPilha.agenda.id === itemPilhaPronta.agenda.id
                                    );
                                    if (typeof novoItemPilha === 'undefined') {
                                        novoItemPilha = itemPilha;
                                        console.log(`[CONFIGURAR-JOBS] Tipo indefinido detectado. Resetando valor.`)
                                    }
                                    else {
                                        console.log(`[CONFIGURAR-JOBS] Atualizando o job na pilha geral com o job da pilha de prontos.`)
                                    }
                                    return (
                                        <SwiperSlide key={index}>
                                            <JobCard
                                                dto={novoItemPilha}
                                                indexPilha={index}
                                                key={index}
                                                onCallBack={callBackJobCard}
                                            />
                                        </SwiperSlide>
                                    );
                                })
                            }
                        </div>
                    </Swiper>
                    <div className='mb-5'></div>
                </div>
                <div className='pt-3 pt-md-5'></div>
                <IonModal isOpen={modalOn} backdropDismiss={false}>
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
                                Aguarde a aplicação executar toda a pilha de Jobs para termos o log completo.
                            </h5>
                            <div className='d-flex justify-content-center'>
                                <img src={blueThunder} alt="GIF Animado" id="thunder-gif-3" hidden={!gif} sizes='large' />
                                <img src={blueThunder} alt="GIF Animado" id="thunder-gif-4" hidden={!gif}  sizes='large' />
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

