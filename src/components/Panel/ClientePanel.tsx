import { checkmark, personAdd, refresh } from "ionicons/icons";
import ButtonLayout, { ButtonLayoutProps } from "../Core/ButtonLayout";
import { useDispatch, useSelector } from "react-redux";
import { addMensagem, atualizarMensagem, setMainAmbiente, setMainJobs, setMainMassas, setMainPipeline, setViewJob } from "../../Store/Reducer/ReducerAtividade";
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import { useState, forwardRef, useImperativeHandle } from "react";
import { IonCol, IonIcon, IonList, IonRow, useIonModal, useIonViewWillEnter } from "@ionic/react";
import DynamicModal from "../Core/DynamicModal";
import { ClienteInfoDTO } from "../../data/ClienteInfoDTO";
import ModalNovoCliente from "../Modals/ModalNovoCliente";
import { loadingClientes, setClientes } from "../../Store/Reducer/ReducerClientes";
import ItemLista from "../Core/ItemLista";
import iconUserTie from '../../resources/user-tie.svg';
import { AmbienteInfoDTO } from "../../data/AmbienteInfoDTO";
import { setMassas } from "../../Store/Reducer/ReducerMassas";
import { setPipelines } from "../../Store/Reducer/ReducerPipelines";
import { setJobs } from "../../Store/Reducer/ReducerJobs";
import { setQueries } from "../../Store/Reducer/ReducerQueries";
import { setRelatorios } from "../../Store/Reducer/ReducerRelatorios";


const ClientePanel: React.FC = () => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();

    //Atributos com estado gerenciado via Redux
    const isLoading = useSelector((state: RootState) => state.store.catalogoClientes.loading);
    const mainClienteId = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const mainCliente = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const catalogoClientes = useSelector((state: RootState) => state.store.catalogoClientes.catalogo);
    const mainAmbiente = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);
    const mainAmbienteId = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    
    //Atributos com estado gerenciado pelo React
    const [clienteId, setClienteId] = useState<number>(-1);
    const [modalNovoClienteOn, modalNovoClienteOff] = useIonModal(DynamicModal,
        {
            titulo: "Criar Novo Cliente",
            elemento: <ModalNovoCliente onSave={() => { coletarRecursos(); modalNovoClienteOff(); }} />,
            onDismiss: () => modalNovoClienteOff()
        }
    );

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
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
    
    //Botões renderizados por esse componente
    const butoes: ButtonLayoutProps[] = [ 
        {
            title: 'Atualizar',
            icon: refresh,
            trigger: () =>  coletarRecursos(),
            disabled: isLoading,
        },
        {
            title: 'Novo Cliente',
            icon: personAdd,
            trigger: () =>  modalNovoClienteOn(),
            disabled: isLoading,
        }
    ];

    //Acionamento ao selecionar uma opção de Cliente
    function setClienteAmbiente(cliente: ClienteInfoDTO, ambiente: AmbienteInfoDTO): void {
        console.log(`[PAINEL-CLIENTES]: Usuário selecionou Cliente: '${cliente.nome}', Ambiente: '${ambiente.nome}'.`);
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
        dispatch(setViewJob([]));
    }

    return(
        <div className="p-0 m-0">
            <IonRow className="m-0 p-0 mb-2 ion-justify-content-around ">
                {
                    butoes.map((item, index) => <IonCol className="w-100">
                            <ButtonLayout key={index} {...item} />
                        </IonCol>
                    )
                }
            </IonRow>
            <div className='glass p-1 m-0 text-white text-center '>
                <span className='h5'>Lista de clientes disponíveis</span>
            <IonList className='m-0 p-0'>
                {
                    catalogoClientes.map((cliente, clienteIndex) => cliente.ambientes.map(
                        (ambiente, ambienteIndex) => {
                            const index  = clienteIndex * 10 + ambienteIndex;
                            //const color = index % 2 === 0 ? 'medium' : 'none';
                            return <ItemLista key={index}
                                    text={cliente.nome + " " + ambiente.nome}
                                    icon={iconUserTie}
                                    trigger={() => setClienteAmbiente(cliente, ambiente)}
                                >
                                    <IonIcon icon={checkmark} 
                                        hidden={mainClienteId !== cliente.id || mainAmbienteId !== ambiente.id} 
                                    />
                                </ItemLista>
                        }
                    ))
                }
            </IonList>
            </div>
        </div>
    );
}

export default ClientePanel;