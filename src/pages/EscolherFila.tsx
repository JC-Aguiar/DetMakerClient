import { IonCard, IonCardContent, IonCol, IonContent, IonIcon, IonInput, IonItem, IonList, IonRow, } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from "../Store/ReduxStore";
import { loadingRelatorios } from "../Store/Reducer/ReducerRelatorios";
import { calendar, caretBack, caretForward, closeCircle, filter, layers, personCircle, search, ticketOutline } from "ionicons/icons";
import Carregando from "../components/Core/Carregando";
import Informativo from "../components/Core/Informativo";
import { addMensagem, atualizarMensagem } from "../Store/Reducer/ReducerAtividade";
import Botao, { BotaoProps } from "../components/Core/Botao";
import GlassInput from "../components/Core/GlassInput";
import dayjs from "dayjs";
import { Page } from "../data/Page";
import { FilaResumoDTO } from "../data/FilaResumoDTO";
import ListaFilas from "../components/Lists/ListaFila";


//Componente <EscolherFila>
const EscolherFila: React.FC = () => {

    //Acionador de controladores Redux
    const dispatch = useDispatch();

    //Atributos com estado gerenciado pelo Redux
    //const isLoading: boolean = useSelector((state: RootState) => state.store.catalogoFila.loading);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    const mainClienteId = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const mainCliente = useSelector((state: RootState) => state.store.configAtividade.mainCliente);
    const meusTickets = useSelector((state: RootState) => state.store.configAtividade.meusTickets);
    const usuario = useSelector((state: RootState) => state.store.login.user);

    //Atributos com estado gerenciado pelo React 
    const [isLoading, setLoading] = useState<boolean>(false);
    const [filaSucesso, setFilaSucesso] = useState<boolean | null>(null);
    const [catalogoFila, setCatalogoFila] = useState<Page<FilaResumoDTO>>(Page.empty());
    const [pageIndex, setPageIndex] = useState<number>(catalogoFila.number +1);
    const [filtroAplicado, setFiltroAplicado] = useState<boolean>(false);
    const [ticket, setTicket] = useState<string>("");
    const [nomePipeline, setNomePipeline] = useState<string>("");
    const [autor, setAutor] = useState<string>("");
    const [dataSolic, setDataSolic] = useState<Date | null>(null);

    //Retorna o total de páginas disponíveis na navegação
    const totalPages = () => {
        return catalogoFila.totalPages;
    }

    //Propriedades de cada filtro de consulta
    interface OpcoesConsulta<T> {
        nome: string,
        tamanho: number,
        type?: "text" | "date";
        icon?: string,
        valor: T,
        handler: React.Dispatch<React.SetStateAction<T>>,
        reset: () => void,
        autofill?: string[], 
    }

    //Declaração de cada filtro de consulta para renderização automática
    const opcoesConsulta: OpcoesConsulta<any>[] = [
        {
            nome: "Ticket",
            icon: ticketOutline,
            tamanho: 100,
            valor: ticket,
            handler: setTicket, 
            reset: () => setTicket(""), 
            autofill: meusTickets,
        },
        {
            nome: "Nome Pipeline",
            icon: layers,
            tamanho: 200,
            valor: nomePipeline,
            handler: setNomePipeline,
            reset: () => setNomePipeline(""),
        },
        {
            nome: "Autor",
            icon: personCircle,
            tamanho: 100,
            valor: autor,
            handler: setAutor,
            reset: () => setAutor(""),
            autofill: usuario ? [usuario.name] : [],
        },
        {
            nome: "Data da Solicitação",
            icon: calendar,
            type: "date",
            tamanho: 10,
            valor: dataSolic,
            handler: setDataSolic,
            reset: () => setDataSolic(null),
        },
    ];


    //Propeidades para definir se o botão 'Aplicar Filtro' estará ON ou OFF
    const botaoAplicarFIltros: BotaoProps = {
        text: filtroAplicado ? "Remover" : "Aplicar", 
        icon: filtroAplicado ? closeCircle : filter,
        color: filtroAplicado ? "warning" : "light",
        handler: () => aplicarFiltros(),
    }

    //Acionamento para componentes específicos
    useEffect(() => {
        setCatalogoFila(Page.empty());
    }, [mainClienteId, mainCliente]);

    //Acionamento para componentes específicos
    useEffect(() => {
        setPageIndex(catalogoFila.number +1);
    }, [catalogoFila.number]);

    //Define se o atual catálogo de Filas em memória deve ou não ser filtrado 
    const aplicarFiltros = () => {
        setFiltroAplicado(estado => !estado);
    }

    //Aplicação inteligente dos filtros definidos pelo usuário
    const filtrar = (item: FilaResumoDTO): boolean => {
        if (!filtroAplicado) return true;
        const compararDatas = (data: number): boolean => {
            const novaData = dayjs.unix(data).format('YYYY-MM-DD');
            return novaData === `${dataSolic}`; 
        };
        return true
            && (ticket === "" ? true : item.ticket !== null && item.ticket.includes(ticket))  
            && (nomePipeline === "" ? true : item.nomePipeline !== null && item.nomePipeline.includes(nomePipeline))
            && (autor === "" ? true : item.autor !== null && item.autor.includes(autor))
            && (dataSolic === null ? true : item.data !== null && compararDatas(item.data));
    }

    //Atualizando catálogo de Filas com base no banco e nos filtros (ou não)
    async function coletarRecursos(index: number) {
        await obterFilasBanco(index);
    }

    //Requisição para obter os relatórios diretamente do banco
    async function obterFilasBanco(index: number) {
        const mensagemId = `Get_Queue@${Date.now()}`;
        const mensagemFiltros: string[] = [];
        if (ticket !== "")  mensagemFiltros.push(`Ticket: '${ticket}'`);
        if (dataSolic !== null) mensagemFiltros.push(`Data Execução: ${dataSolic}`);
        if (autor !== "")  mensagemFiltros.push(`Autor: '${autor}'`);
        const mensagemComplemento = mensagemFiltros.length > 0 ? 
            ('\n' + mensagemFiltros.join(", ") + '\n') : 
            "Nenhum";

        dispatch(addMensagem({
            id: mensagemId,
            texto: `Obtendo catálogo de Filas no banco. Filtros: ${mensagemComplemento}.`,
            status: 'INFO'
        }));
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        //setConectionsCount(c => c+1);
        setLoading(true);
        const thisAmbiente = mainAmbienteId;
        try {
            const filasBanco: Page<FilaResumoDTO> = await axiosRequest.getAllQueues(
                index,
                mainAmbienteId,
                ticket,
                nomePipeline,
                (dataSolic === null ? "" : String(dataSolic)),
                autor,
            );
            if (thisAmbiente !== mainAmbienteId) return;

            setCatalogoFila(filasBanco);
            setFilaSucesso(true);
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `Sucesso.`,
                status: 'OK'
            }));
            //modalPesquisaOn();
        }
        catch (error) {
            setFilaSucesso(false);
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
        finally {
            setLoading(false);
        }
    }

    //Define o conteúdo princial do componente, dependente se existem ou não dados de relatório no Redux
    function conteudo() {
        if (paginaVazia()) {
            return <Informativo status='SemDados' />;
        }
        return <IonList className='ion-justify-content-center p-1 px-3'>
            {
                catalogoFila.content
                    .filter(item => filtrar(item))
                    .map((item, index) => 
                        <ListaFilas key={index} index={index} fila={item} />
                    )
            }
        </IonList>;
    }

    //Verifica se a página atual possui algum conteúdo a ser listado e navegado
    const paginaVazia = () => {
        return catalogoFila.size < 1; 
    }

    //Acionamento para nova consulta ao banco com base no ídice da página minupulada pelo usuário
    const novaConsultaPageIndex = () => {
        if (pageIndex <= totalPages())
            obterFilasBanco(pageIndex-1);
    }

    //Renderizando componente
    if (isLoading) return <Carregando />;
    return (
        <IonRow className='p-0 m-0 fixed-top w-100 h-100 ion-justify-content-end'>
            <IonCol className='glass p-0 m-0 mt-4' size="3" color='#' >
                <IonContent className='glass-content p-0 m-0'>
                    <div className="w-100 text-center mt-2">Parâmetros de pesquisa</div>
                    <IonCard className="p-0 m-0 ms-2" style={{ "box-shadow": 'none' }}>
                        <IonCardContent className="m-0 p-0 mt-1">
                            {
                                opcoesConsulta.map((opcao, opcaoIndex) => {
                                    return (
                                        <GlassInput key={opcaoIndex} text={opcao.nome} icon={opcao.icon} >
                                            <IonItem detail={false} lines="none" shape="round" >
                                                <input type={!opcao.type ? "text" : opcao.type}
                                                    maxLength={opcao.tamanho}
                                                    value={opcao.valor}
                                                    onChange={(e) => opcao.handler(e.target.value)}
                                                    className="native-input sc-ion-input-md small p-0 m-0 pt-2 pe-3"
                                                    list={`txtautocompletelist-${opcao.nome}`}
                                                />
                                                <datalist id={`txtautocompletelist-${opcao.nome}`}>
                                                    {
                                                        opcao.autofill?.map((autofill, autofillIndex) => 
                                                            <option key={opcaoIndex * 10 + autofillIndex}>
                                                                {autofill}
                                                            </option>
                                                        )
                                                    }
                                                </datalist>
                                                <IonIcon
                                                    icon={closeCircle}
                                                    size='small'
                                                    className="glass btn position-fixed m-0 p-0"
                                                    style={{ top: '0.8em', right: '5px', zIndex: '500' }}
                                                    onClick={() => opcao.reset()}
                                                />
                                            </IonItem>
                                        </GlassInput>
                                    );
                                })
                            }
                            <IonRow className="w-100 ion-justify-content-center p-1">
                                <Botao {...botaoAplicarFIltros} />
                                <span className="mx-1" />
                                <Botao text="Nova Consulta" icon={search} handler={() => obterFilasBanco(0)} />
                            </IonRow>
                        </IonCardContent>
                    </IonCard>
                    <IonCard className="p-0 m-0 ms-2 shadow shadow-0" disabled={paginaVazia()}>
                        <IonRow className="p-0 m-0 my-2 w-100 ion-align-items-center ion-justify-content-center">
                            <IonIcon icon={caretBack}
                                color="primary"
                                size="large"
                                className="btn m-0 p-0"
                                onClick={(e) => {
                                    if (catalogoFila.first) return;
                                    obterFilasBanco(catalogoFila.number - 1);
                                }}
                            />
                            <IonRow className="glass d-flex ion-align-items-center pe-1" >
                                <span className="ms-1">Página </span> 
                                <IonInput value={pageIndex}
                                    type='number'
                                    inputMode="numeric"
                                    max={`${totalPages()}`}
                                    min='1'
                                    onIonChange={(e) => {
                                        if (!e.detail.value) return;
                                        const index = parseInt(e.detail.value);
                                        if (typeof index === "number")
                                            setPageIndex(index);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter')
                                            novaConsultaPageIndex();
                                    }}
                                    className="m-0 p-0 text-end lh-0 w-100"
                                    style={{ height: '32px'}}
                                    disabled={paginaVazia()}
                                />
                                <span>/{totalPages()}</span>
                                <IonIcon icon={search}
                                    color="light"
                                    className="glass btn item-lista ms-1 my-1 p-2"
                                    style={{ height: '16px' }}
                                    onClick={(e) => novaConsultaPageIndex()}
                                />
                            </IonRow>
                            <IonIcon icon={caretForward}
                                color="primary"
                                size="large"
                                className="btn m-0 p-0"
                                onClick={(e) => {
                                    if (catalogoFila.last) return;
                                    obterFilasBanco(catalogoFila.number + 1);
                                }}
                            />
                        </IonRow>
                    </IonCard>
                </IonContent>
            </IonCol>
            <IonCol className="p-0 m-0" id="relatorio-menu" >
                <IonContent className='w-100 h-100' scrollY>
                    {conteudo()}
                </IonContent>
            </IonCol>
        </IonRow>
    );
};

export default EscolherFila;