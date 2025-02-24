import { IonChip, IonCol, IonContent, IonFabButton, IonIcon, IonImg, IonItem, IonLabel, IonList, IonRow, IonThumbnail, IonTitle, useIonModal } from '@ionic/react';
import { useRef, useState } from 'react';
import { addCircle, closeCircle, radioButtonOff, radioButtonOn } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setMainAmbiente, setMainJobs, setMainMassas, setMainPipeline, setViewJob } from '../Store/Reducer/ReducerAtividade';
import { RootState } from '../Store/ReduxStore';
import { Navigation } from 'swiper/modules';
import { ClienteInfoDTO } from '../data/ClienteInfoDTO';
import Informativo from '../components/Core/Informativo';
import Carregando from '../components/Core/Carregando';
import { AmbienteInfoDTO } from '../data/AmbienteInfoDTO';
import Botao from '../components/Core/Botao';
import ModalNovoAmbiente from '../components/Modals/ModalNovoAmbiente';
import DynamicModal from '../components/Core/DynamicModal';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { setMassas } from '../Store/Reducer/ReducerMassas';
import { setJobs } from '../Store/Reducer/ReducerJobs';
import { setPipelines } from '../Store/Reducer/ReducerPipelines';
import { setQueries } from '../Store/Reducer/ReducerQueries';


const EscolherClientes: React.FC = () => {
    //Atrbiutos úteis
    const dispatch = useDispatch();
    const [conectionsCount, setConectionsCount] = useState<number>(0);
    const catalogoClientes = useSelector((state: RootState) => state.store.catalogoClientes.catalogo);
    const isLoading = useSelector((state: RootState) => state.store.catalogoClientes.loading);
    const mainCliente = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const mainAmbiente = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);

    //Atributos relacionados a modals
    const [clienteId, setClienteId] = useState<number>(-1);
    const [index, setIndex] = useState<number>(-1);
    const swiperRef = useRef<SwiperRef>(null);
    const [modalNovoAmbienteOn, modalNovoAmbienteOff] = useIonModal(DynamicModal,
        {
            titulo: "Criar Novo Ambiente",
            elemento: <ModalNovoAmbiente clienteId={clienteId} onSave={() => modalNovoAmbienteOff()} />,
            onDismiss: () => modalNovoAmbienteOff(),
        }
    );

    //Acionamento ao selecionar uma opção de Cliente
    function setClienteAmbiente(cliente: ClienteInfoDTO, ambiente: AmbienteInfoDTO): void {
        console.log(`[ESCOLHER-CLIENTES]: Usuário selecionou Cliente: '${cliente.nome}', Ambiente: '${ambiente.nome}'.`);
        dispatch(setMainAmbiente({
            cliente: cliente.nome,
            clienteId: cliente.id,
            ambiente: ambiente.nome,
            ambienteId: ambiente.id,
        }));
        dispatch(setPipelines([]));
        dispatch(setJobs([]));
        dispatch(setMassas([]));
        dispatch(setQueries([]));
        dispatch(setMainPipeline());
        dispatch(setMainJobs([]));
        dispatch(setMainMassas({}));
        dispatch(setViewJob(-1));
        /*
        dispatch(setRelatorios(
            Page.empty<RelatorioResumoDTO>()
        ));
        */
    }

    //Renderiza (ou não) a lista dos Ambientes no card de cada Cliente
    const listarAmbientes = (cliente: ClienteInfoDTO, indexCliente: number) => {
        if (cliente.ambientes.length < 1) return (
            <div className='m-3 p-2 opacity-50'>
                Cliente sem ambientes disponíveis
            </div>
        );
        return (
            <IonList className='m-3 p-2 glass'>
                {
                    cliente.ambientes.map((ambiente, indexAmbiente) => {
                        const checked = (mainCliente === cliente.nome && mainAmbiente === ambiente.nome) ?
                            radioButtonOn : radioButtonOff;
                        return (
                            <IonItem key={indexCliente * 10 + indexAmbiente} lines='none'
                                color='#'
                                className='p-0 m-0 align-items-center text-white w-100'
                                style={{ '--min-height': '32px' }}
                            >
                                <IonChip
                                    color="#"
                                    className="m-0 p-0 bg-transparent"
                                    style={{ transform: 'scale(0.75)' }}
                                    onClick={(e) => setClienteAmbiente(cliente, ambiente)}
                                >
                                    <IonIcon icon={checked}
                                        color="light"
                                        size="large"
                                        className="m-0 p-0"
                                    />
                                </IonChip>

                                <IonLabel className='px-1 py-2 m-0 rounded rounded-3'>
                                    <p className='lh-1 p-0 m-0 mx-1 mt-1 fw-bold text-white '>
                                        Ambiente {ambiente.nome}
                                    </p>
                                    <p className='lh-1 p-0 m-0'>
                                        <span className='text-white p-0 mx-1'>
                                            <span>SFTP: </span>
                                            <span className='font-monospace'>{ambiente.ftp.conexao}</span>
                                        </span>
                                    </p>
                                    <p className='lh-1 p-0 m-0'>
                                        <span className='text-white p-0 mx-1'>
                                            <span>BANCO: </span>
                                            <span className='font-monospace'>{ambiente.banco.conexao}</span>
                                        </span>
                                    </p>
                                </IonLabel>
                            </IonItem>
                        );
                    })
                }
            </IonList>
        );
    }

    if (isLoading) return <Carregando />;
    if (catalogoClientes.length < 1) {
        return <Informativo status='SemDados' />
    };
    return (
        <div className='container'>
            <div className='ion-justify-content-center '>
                <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    ref={swiperRef}
                    shortSwipes={false}
                    longSwipesRatio={0.1}
                    longSwipesMs={100}
                >
                    {
                        catalogoClientes.map((cliente, indexCliente) =>
                            <SwiperSlide key={indexCliente} className=''>
                                <IonRow key={indexCliente} id="card-filme" className='ion-justify-content-center mb-4'>
                                    <IonCol size='12' sizeMd='5' id="filme-texto" className="glass m-2">
                                        <IonThumbnail>
                                            <IonImg
                                                id="filme-capa"
                                                alt="Logo do cliente"
                                                src={`data:image/png;base64,${cliente.banner}`}
                                                className=''
                                            />
                                        </IonThumbnail>
                                    </IonCol>
                                    <IonCol size='12' sizeMd='5' className='glass m-2'>
                                        <IonContent className='ion-justify-content-center p-0 m-0'>
                                            <IonTitle color='#' className='text-white m-0 py-3 text-center w-100'>
                                                <span id="filme-title" className='h3 align-middle'>{cliente.nome}</span>
                                            </IonTitle>
                                            {listarAmbientes(cliente, indexCliente)}
                                            <IonRow className='ion-justify-content-center'>
                                                <Botao text='Novo Ambiente'
                                                    icon={addCircle}
                                                    handler={() => {
                                                        setClienteId(cliente.id);
                                                        modalNovoAmbienteOn();
                                                    }}
                                                />
                                            </IonRow>
                                        </IonContent>
                                    </IonCol>
                                </IonRow>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
            </div>
        </div>
    );
};

export default EscolherClientes;