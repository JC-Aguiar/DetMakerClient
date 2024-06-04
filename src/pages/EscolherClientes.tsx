import { IonCol, IonContent, IonIcon, IonImg, IonItem, IonLabel, IonList, IonRow, IonThumbnail, IonTitle, useIonModal, useIonViewWillEnter, } from '@ionic/react';
import { useState } from 'react';
import { addCircle, personAdd, radioButtonOff, radioButtonOn, refresh, } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setMainAmbiente } from '../Store/Reducer/ReducerAtividade';
import { RootState } from '../Store/ReduxStore';
import { ButtonLayoutProps, layoutGrupoBotoes } from '../components/Core/ButtonLayout';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { loadingClientes, setClientes } from '../Store/Reducer/ReducerClientes';
import * as axiosRequest from "../data/AxiosRequest";
import { ClienteInfoDTO } from '../data/ClienteInfoDTO';
import Informativo from '../components/Core/Informativo';
import Carregando from '../components/Core/Carregando';
import { AmbienteInfoDTO } from '../data/AmbienteInfoDTO';
import Botao from '../components/Core/Botao';
import ModalNovoAmbiente from '../components/Modals/ModalNovoAmbiente';
import DynamicModal from '../components/Core/DynamicModal';
import ModalNovoCliente from '../components/Modals/ModalNovoCliente';
import { addMensagem, atualizarMensagem } from '../Store/Reducer/ReducerAtividade';

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
    const [modalNovoClienteOn, modalNovoClienteOff] = useIonModal(DynamicModal,
        {
            titulo: "Criar Novo Cliente",
            elemento: <ModalNovoCliente onSave={() => { coletarRecursos(); modalNovoClienteOff(); }} />,
            onDismiss: () => modalNovoClienteOff()
        }
    );
    const [modalNovoAmbienteOn, modalNovoAmbienteOff] = useIonModal(DynamicModal,
        {
            titulo: "Criar Novo Ambiente",
            elemento: <ModalNovoAmbiente clienteId={clienteId} onSave={() => modalNovoAmbienteOff()} />,
            onDismiss: () => modalNovoAmbienteOff(),
        }
    );

    //Atributos de botões
    const botaoAtualizar = {
        title: 'Atualizar',
        icon: refresh,
        trigger: () =>  coletarRecursos(),
        disabled: isLoading,
    } as ButtonLayoutProps;

    const botaoNovoCliente = {
        title: 'Novo Cliente',
        icon: personAdd,
        trigger: () =>  modalNovoClienteOn(),
        disabled: isLoading,
    } as ButtonLayoutProps;

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        //dispatch(setButtons( [botaoAtualizar, botaoNovaPipeline] ));
        if (catalogoClientes.length < 1) coletarRecursos();
    }, []);

    //Atualizando Pipelines e Jobs com base no banco
    async function coletarRecursos() {
        if (isLoading) return;

        const mensagemId = `Get_Clients@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Obtendo catálogo de cliente.`,
            status: 'INFO'
        }));
        dispatch(loadingClientes(true));
        /*
        dispatch(setMainAmbiente({
            cliente: "",
            clienteId: -1, 
            ambiente: "",
            ambienteId: -1
        }));
        dispatch(setJobs([]));
        dispatch(setPipelines([]));
        dispatch(setQueries([]));
        dispatch(setMassas([]));
        */
        try {
            const clientes: ClienteInfoDTO[] = await axiosRequest.getAllClientes();
            dispatch(setClientes(clientes));
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: 'Sucesso.',
                status: 'OK'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: String(error),
                status: 'ERROR'
            }));
        }
        dispatch(loadingClientes(false));
    }

    //Acionamento ao selecionar uma opção de Cliente
    function setClienteAmbiente(cliente: ClienteInfoDTO, ambiente: AmbienteInfoDTO): void {
        console.log(`[ESCOLHER-CLIENTES]: Usuário selecionou Cliente: '${cliente.nome}', Ambiente: '${ambiente.nome}'.`);
        dispatch(setMainAmbiente({
            cliente: cliente.nome, 
            clienteId: cliente.id,
            ambiente: ambiente.nome,
            ambienteId: ambiente.id,
        }));
    }


    //Renderiza cada card de cada Cliente disponível no catálogo
    const cardsDeClientes = () => catalogoClientes.map((cliente, indexCliente) =>
        <SwiperSlide key={indexCliente} className=''>
             <IonRow key={indexCliente} id="card-filme" className='ion-justify-content-center mb-4'>
                <IonCol size='12' sizeMd='6' id="filme-texto" className="glass m-2">
                    <IonThumbnail>
                        <IonImg id="filme-capa" alt="Logo do cliente" src={`data:image/png;base64,${cliente.banner}`} className=''/>
                    </IonThumbnail> 
                </IonCol>
                <IonCol size='12' sizeMd='4' className='glass m-2'>
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
    );

    //Renderiza (ou não) a lista dos Ambientes no card de cada Cliente
    const listarAmbientes = (cliente: ClienteInfoDTO, indexCliente: number) => {
        if (cliente.ambientes.length < 1) return(
            <div className='m-3 p-2 opacity-50'>
                Cliente sem ambientes disponíveis
            </div>
        );
        return(
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
                            <IonIcon icon={checked} 
                                color="primary" 
                                size='large'
                                className='btn border-0 p-0 pe-1' 
                                style={{ transform: 'scale(1.2) translate(0.25px, 1.75px)' }}
                                onClick={(e) => setClienteAmbiente(cliente, ambiente)}
                            />
                            <IonLabel className='px-1 py-2 m-0 rounded rounded-3'>
                                <p className='lh-1 p-0 m-0 mx-1 mt-1 fw-bold text-white '>
                                    Ambiente {ambiente.nome}
                                </p>
                                <p className='lh-1 p-0 m-0'>
                                    <span className='text-white p-0 mx-1'>
                                        <span>STP: </span> 
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
        return <>
            {layoutGrupoBotoes([ botaoAtualizar, botaoNovoCliente ])}
            <Informativo status='SemDados'/>
        </>
    };
    return (
        <div className='container'>
            {layoutGrupoBotoes([ botaoAtualizar, botaoNovoCliente ])}
            <div className='ion-justify-content-center '>
                <div className=''>
                    <div className='p-0 m-0 text-white text-center '>
                        <span className='h5'>Lista de clientes disponíveis</span>
                    </div>
                    <Swiper navigation={true} modules={[Navigation]} >
                        {cardsDeClientes()}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default EscolherClientes;