import { InputChangeEventDetail, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonPopover, IonRow, IonSelect, IonSelectOption, IonSplitPane, SelectChangeEventDetail, useIonModal, useIonViewWillEnter, } from "@ionic/react";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as axiosRequest from "../data/AxiosRequest";
import { RootState } from "../Store/ReduxStore";
import { RelatorioResumoDTO } from "../data/RelatorioResumoDTO";
import { loadingRelatorios, setRelatorios } from "../Store/Reducer/ReducerRelatorios";
import { calendar, caretBack, caretForward, closeCircle, document, filter, flag, helpCircle, layers, play, pricetag, refresh, search, swapVertical, text } from "ionicons/icons";
import { layoutGrupoBotoes, ButtonLayoutProps } from "../components/Core/ButtonLayout";
import { PipelineInfoDTO } from "../data/PIpelineInfoDTO";
import Carregando from "../components/Core/Carregando";
import Informativo from "../components/Core/Informativo";
import TicketRelatorio from "../components/Content/TicketRelatorio";
import { addMensagem, atualizarMensagem } from "../Store/Reducer/ReducerAtividade";
import ModalConsultaRelatorio from "../components/Modals/ModalConsultaRelatorio";
import DynamicModal from "../components/Core/DynamicModal";
import Botao, { BotaoProps } from "../components/Core/Botao";
import ItemLista from "../components/Core/ItemLista";
import GlassInput from "../components/Core/GlassInput";
import { close } from "inspector";
import { ListaRetratrilAgrupada } from "../components/Core/ListaRetratil";
import dayjs from "dayjs";
import { Page } from "../data/Page";


//Componente <EscolherRelatorios>
const EscolherRelatorios: React.FC = () => {

    //Atributos do componente
    const dispatch = useDispatch();
    const [relatoriosSucesso, setRelatoriosSucesso] = useState<boolean | null>(null);
    const catalogoRelatorios: Page<RelatorioResumoDTO> = useSelector(
        (state: RootState) => state.store.catalogoRelatorios.catalogo);
    const isLoading: boolean = useSelector((state: RootState) => state.store.catalogoRelatorios.loading);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);

    //TODO: concertar!!!
    const [pageIndex, setPageIndex] = useState<number>(catalogoRelatorios.number +1);
    const [filtroAplicado, setFiltroAplicado] = useState<boolean>(false);
    const [idProjeto, setIdProjeto] = useState<string>("");
    const [nomeProjeto, setNomeProjeto] = useState<string>("");
    const [nomeAtividade, setNomeAtividade] = useState<string>("");
    const [nomePipeline, setNomePipeline] = useState<string>("");
    const [dataExec, setDataExec] = useState<Date | null>(null);

    //Retorna o total de páginas disponíveis na navegação
    const totalPages = () => {
        return catalogoRelatorios.totalPages;
    }

    //Propriedades de cada filtro de consulta
    interface OpcoesConsulta<T> {
        nome: string;
        tamanho: number;
        type?: "text" | "date";
        icon?: string;
        valor: T,
        handler: React.Dispatch<React.SetStateAction<T>>;
        reset: () => void;
    }

    //Declaração de cada filtro de consulta para renderização automática
    const opcoesConsulta: OpcoesConsulta<any>[] = [
        {
            nome: "ID Projeto",
            icon: pricetag,
            tamanho: 7,
            valor: idProjeto,
            handler: setIdProjeto, 
            reset: () => setIdProjeto(""), 
        },
        {
            nome: "Nome Projeto",
            icon: pricetag,
            tamanho: 200,
            valor: nomeProjeto,
            handler: setNomeProjeto,
            reset: () => setNomeProjeto(""),
        },
        {
            nome: "Nome Atividade",
            icon: flag,
            tamanho: 300,
            valor: nomeAtividade,
            handler: setNomeAtividade,
            reset: () => setNomeAtividade(""),
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
            nome: "Data da Execução",
            icon: calendar,
            type: "date",
            tamanho: 10,
            valor: dataExec,
            handler: setDataExec,
            reset: () => setDataExec(null),
        },
    ];

    //Propeidades para definir se o botão 'Aplicar Filtro' estará ON ou OFF
    const botaoAplicarFIltros: BotaoProps = {
        text: filtroAplicado ? "Remover" : "Aplicar", 
        icon: filtroAplicado ? closeCircle : filter,
        color: filtroAplicado ? "warning" : "light",
        handler: () => aplicarFiltros(),
    }

    //Ações ao carregar esta página
    //    useIonViewWillEnter(() => {
    //        if (catalogoRelatorios.length < 1 && !isLoading) coletarRecursos();
    //    }, []);

    //Acionamento para componentes específicos
    useEffect(() => {
        setPageIndex(catalogoRelatorios.number +1);
    }, [catalogoRelatorios.number]);

    //Define se o atual catálogo de Relatórios em memória deve ou não ser filtrado 
    const aplicarFiltros = () => {
        setFiltroAplicado(estado => !estado);
    }

    //Define se aplica ou não os filtros definidos pelo usuário
    const filtrar = (item: RelatorioResumoDTO): boolean => {
        if (!filtroAplicado) return true;

        const compararDatas = (data: number): boolean => {
            const novaData = dayjs.unix(data).format('YYYY-MM-DD');
            return novaData === `${dataExec}`; 
        };

        return true  
            && (idProjeto === "" ? true : item.idProjeto.includes(idProjeto))
            && (nomeProjeto === "" ? true : item.nomeProjeto.includes(nomeProjeto))
            && (nomeAtividade === "" ? true : item.nomeAtividade.includes(nomeAtividade))
            && (nomePipeline === "" ? true : item.nomePipeline.includes(nomePipeline))
            && (dataExec === null ? true : compararDatas(item.data));
    }

    //Atualizando catálogo de Relatórios com base no banco e nos filtros (ou não)
    async function coletarRecursos(index: number) {
        await obterRelatoriosBanco(index);
    }

    //Requisição para obter os relatórios diretamente do banco
    async function obterRelatoriosBanco(index: number) {
        dispatch(loadingRelatorios(true));
        const mensagemId = `Get_Reports@${Date.now()}`;
        const mensagemFiltros: string[] = [];
        if (idProjeto !== "")  mensagemFiltros.push(`ID Projeto: '${idProjeto}'`);
        if (nomeProjeto !== "") mensagemFiltros.push(`Nome Projeto: '${nomeProjeto}'`);
        if (nomeAtividade !== "") mensagemFiltros.push(`Nome Atividade: '${nomeAtividade}'`);
        if (dataExec !== null) mensagemFiltros.push(`Data Execução: ${dataExec}`);
        const mensagemComplemento = mensagemFiltros.length > 0 ? 
            ('\n' + mensagemFiltros.join(", ") + '\n') : 
            "Nenhum";

        dispatch(addMensagem({
            id: mensagemId,
            texto: `Obtendo catálogo de Relatórios no banco. Filtros: ${mensagemComplemento}.`,
            status: 'INFO'
        }));
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        //setConectionsCount(c => c+1);
        try {
            const relatoriosBanco: Page<RelatorioResumoDTO> = await axiosRequest.getAllRelatorios(
                index,
                mainAmbienteId,
                idProjeto,
                nomeProjeto,
                nomeAtividade,
                nomePipeline,
                (dataExec === null ? "" : String(dataExec))
            );
            dispatch(setRelatorios(relatoriosBanco));
            setRelatoriosSucesso(true);
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `Sucesso.`,
                status: 'OK'
            }));
            //modalPesquisaOn();
        }
        catch (error) {
            setRelatoriosSucesso(false);
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
        dispatch(loadingRelatorios(false));
    }

    //Define o conteúdo princial do componente, dependente se existem ou não dados de relatório no Redux
    function conteudo() {
        if (paginaVazia()) {
            return <Informativo status='SemDados' />;
        }
        return <IonList className='ion-justify-content-center p-1 px-3'>
            {
                catalogoRelatorios.content
                    .filter(item => filtrar(item))
                    .map((item, index) => 
                        <TicketRelatorio key={index} index={index} relatorio={item} />
                    )
            }
        </IonList>;
    }

    //Verifica se a página atual possui algum conteúdo a ser listado e navegado
    const paginaVazia = () => {
        return catalogoRelatorios.size < 1; 
    }

    //Acionamento para nova consulta ao banco com base no ídice da página minupulada pelo usuário
    const novaConsultaPageIndex = () => {
        if (pageIndex <= totalPages())
            obterRelatoriosBanco(pageIndex-1);
    }

    //Renderizando componente
    if (isLoading) return <Carregando />;
    return (
        <div className='p-0 m-0'>
            <IonSplitPane when="xs" contentId="relatorioContent" className='p-0 m-0'>
                <IonMenu contentId="relatorioContent" className='glass' color='#'>
                    <IonContent className='glass-content p-0 m-0'>
                        <IonCard className="glass shadow shadow-0" disabled={paginaVazia()}>
                            <IonCardHeader color="primary" className="m-0 p-0 text-center">
                                <IonCardSubtitle>Navegação</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent className="m-0 p-0">
                                <p className="text-center w-100 mt-1">
                                    Exibindo {catalogoRelatorios?.numberOfElements}
                                    /{catalogoRelatorios?.size} Relatórios na página atual.
                                </p>
                                <IonRow className="p-0 m-0 my-2 w-100 ion-align-items-center ion-justify-content-center" >
                                    <IonIcon icon={caretBack} 
                                        color="primary" 
                                        size="large" 
                                        className="btn m-0 p-0"
                                        onClick={(e) => {
                                            if (catalogoRelatorios.first) return;
                                            obterRelatoriosBanco(catalogoRelatorios.number-1);
                                        }}
                                    />
                                    <IonRow className="glass d-flex ion-align-items-center pe-1" >
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
                                            className="m-0 p-0 text-end lh-0 "
                                            style={{ height: '32px', width: '40px' }}
                                            disabled={paginaVazia()}
                                        />
                                        /{totalPages()}
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
                                            if (catalogoRelatorios.last) return;
                                            obterRelatoriosBanco(catalogoRelatorios.number+1);
                                        }} 
                                    />
                                </IonRow>
                            </IonCardContent>
                        </IonCard>
                        <IonCard className="glass mt-3 shadow shadow-0">
                            <IonCardHeader color="primary" className="m-0 p-0 text-center">
                                <IonCardSubtitle>Filtros</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent className="m-0 p-0 mt-1">
                                {
                                    opcoesConsulta.map((opcao, index) => {
                                        return (
                                            <GlassInput key={index} text={opcao.nome} icon={opcao.icon} >
                                                <IonInput type={!opcao.type ? "text" : opcao.type}
                                                    maxlength={opcao.tamanho}
                                                    value={opcao.valor}
                                                    onIonChange={(e) => opcao.handler(e.detail.value)}
                                                    className="small pt-2"
                                                />
                                                <IonIcon
                                                    icon={closeCircle}
                                                    size='small'
                                                    className="glass btn position-fixed m-0 p-0"
                                                    style={{ top: '0.8em', right: '5px', zIndex: '500' }}
                                                    onClick={() => opcao.reset()}
                                                />
                                            </GlassInput>
                                        );
                                    })
                                }
                                <IonRow className="w-100 ion-justify-content-center p-2 pe-3">
                                    <Botao {...botaoAplicarFIltros} />
                                    <span className="mx-1"/>
                                    <Botao text="Nova Consulta" icon={search} handler={() => obterRelatoriosBanco(0)} />
                                </IonRow>
                            </IonCardContent>
                        </IonCard>
                    </IonContent>
                </IonMenu>
                <div className="container" id="relatorioContent" >
                    <IonContent className='w-100 h-100' scrollY fullscreen>
                        {conteudo()}
                    </IonContent>
                </div>
            </IonSplitPane>

            {/*layoutGrupoBotoes([botaoPageInedx, botaoOrdenar, botaoFiltrarTipo, botaoFiltrarValor, botaoConsultar])*/}
        </div>
    );
};

export default EscolherRelatorios;