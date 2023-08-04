import { IonContent, IonIcon, IonPage, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import JobCard, { JobCardProps } from '../components/JobCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { ItemPilha } from '../components/ItemPilha';
import { flash, sync } from 'ionicons/icons';
import blueThunder from '../resources/thunder spark gif blue.gif';
import darkThunder from '../resources/thunder spark gif dark.gif';
import { useState } from 'react';
import { pilha } from '../App';

const ConfigurarJobs = (props: any) => {
    const history = useHistory();
    const [cards, setCards] = useState<JobCardProps[]>(
        pilha.map((itemPilha, index) => {
            return { dto: itemPilha, indexPilha: index }
        })
    )
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
    }, []);

    const handleUpdateChild = (dto: ItemPilha, indexPilha: number) => {
        console.log(`[CONFIGURAR-JOBS] Recebendo callback do card job [${indexPilha}] ${dto.job.job}.`);
        setCards(() => {
            return cards.map((cardAntigo) => {
                if (cardAntigo.dto.job.id === dto.job.id) return {...cardAntigo, dto, indexPilha};
                return cardAntigo;
            });
        });
        const cardsProntos = cards.filter((cardItem) => cardItem.dto.pronto);
        setExecutarStatus(cardsProntos.length < 1 ? "disabled" : "session-buttons");
        setGif(cardsProntos.length > 0);

        const detalhes = cards.map((cardItem) => {
            return cardItem.dto.job.job + ": \n"
                + "Parametros (" + cardItem.dto.job.parametros.join(", ") + "), "
                + "Queries (" + cardItem.dto.queries.map((comandoSql) => comandoSql.query).join(", ") + "), "
                + "Cargas (" + cardItem.dto.cargas.join(", ") + "), "
                + "Pronto = " + cardItem.dto.pronto;
        }).join(".   \n");

        const mensagem = `Temos ${cardsProntos.length} de ${cards.length} jobs prontos para executar:
        ${detalhes}`;
        console.log(`[CONFIGURAR-JOBS] ${mensagem}`);

        //await toastOff();
        acionarToast(mensagem);
    }

/*
    const setItemPilha = async (config: ConfigItemPilha) => {
        console.log(`[CONFIGURAR-JOBS] Recebendo callback do card job [${config.index}] ${config.item.job.job}.`);
        //pilha[config.index] = config.item;

        const detalhes1 = pilha.map((item) => {
            return "detalhes1 -> " + item.job.job + ": \n"
                + "Parametros (" + item.job.parametros.join(", ") + "), "
                + "Queries (" + item.queries.map((comandoSql) => comandoSql.query).join(", ") + "), "
                + "Cargas (" + item.cargas.join(", ") + "), "
                + "Pronto = " + item.pronto;
        }).join(".   \n");
        console.log(`[CONFIGURAR-JOBS] ${detalhes1}`);

        const pilhaPronta = pilha.filter((itemPilha) => itemPilha.pronto);
        setExecutarStatus(pilhaPronta.length < 1 ? "disabled" : "session-buttons");
        setGif(pilhaPronta.length > 0);

        const detalhes = pilhaPronta.map((item) => {
            return item.job.job + ": \n"
                + "Parametros (" + item.job.parametros.join(", ") + "), "
                + "Queries (" + item.queries.map((comandoSql) => comandoSql.query).join(", ") + "), "
                + "Cargas (" + item.cargas.join(", ") + "), "
                + "Pronto = " + item.pronto;
        }).join(".   \n");

        const mensagem = `Temos ${pilhaPronta.length} ce ${pilha.length} jobs prontos para executar:
        ${detalhes}`;
        console.log(`[CONFIGURAR-JOBS] ${mensagem}`);

        await toastOff();
        acionarToast(mensagem);
    }

*/
    const breakpoints = {
        640: { slidesPerView: 1, centeredSlides: centralizarSlides(1), loop: !centralizarSlides(1) },
        768: { slidesPerView: 2, centeredSlides: centralizarSlides(2), loop: !centralizarSlides(2) },
        1024: { slidesPerView: 4, centeredSlides: centralizarSlides(4), loop: !centralizarSlides(4) },
    };

    function centralizarSlides(numero: number): boolean {
        return pilha.length < numero;
    }

    function textoBotao(texto: string) {
        return (
            <span className={`btn btn-outline-primary border border-0 banner-gold ps-2 pe-1 py-0 mx-1 ${executarStatus}`}
                onMouseOver={() => setThunderGif(darkThunder)}
                onMouseLeave={() => setThunderGif(blueThunder)}
            >
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-1" hidden={!gif} />
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-2" hidden={!gif} />
                {texto}
                <IonIcon icon={flash} />
            </span>
        );
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
                        //centeredSlides={true}
                        keyboard={true}
                        //loop={true}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        height={300}
                    >
                        <div className='d-flex justify-items-center'>
                            {
                                pilha.map((item, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <JobCard
                                                dto={item}
                                                indexPilha={index}
                                                key={index}
                                                onCallBack={handleUpdateChild}
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
            </IonContent>
        </IonPage>
    );
};

export default ConfigurarJobs;
