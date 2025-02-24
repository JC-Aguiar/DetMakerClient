import { IonButton, IonIcon, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRow, IonFab, IonItem, IonChip, IonCol, IonLabel } from "@ionic/react";
import { alertCircleOutline, calendarOutline, checkmarkCircleOutline, cubeOutline, eye, flag, flash, layers, newspaperOutline, pricetagOutline, document, ticket, personCircle, cube, pricetag, flagOutline, ticketOutline } from "ionicons/icons";
import * as axiosRequest from "../../data/AxiosRequest";
import { useDispatch, useSelector } from "react-redux";
import { RelatorioResumoDTO } from "../../data/RelatorioResumoDTO";
import { offsetDateTimeParaString } from "../../App";
//import { addRelatorio } from "../../Store/Reducer/ReducerRelatorios";
import { removeRevisao, addRevisao } from "../../Store/Reducer/ReducerRevisao";
import { RelatorioHistoricoDTO } from "../../data/RelatorioHistoricoDTO";
import { useHistory } from "react-router";
import { RootState } from "../../Store/ReduxStore";
import { UserDTO } from "../../data/UserDTO";
import { addMensagem, addMeuTicket, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";
import ButtonLayout, { ButtonLayoutProps } from "../Core/ButtonLayout";
import GlassInput from "../Core/GlassInput";
import { Page } from "../../data/Page";

//Atributos de entrada do componente ListaRelatorios
export interface ListaRelatoriosProps {
    relatorio: RelatorioResumoDTO,
    index: number,
}

const ListaRelatorios: React.FC<ListaRelatoriosProps> = ({ relatorio, index }) => { 
    //Atributos do componente
    const dispatch = useDispatch();
    const history = useHistory();
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const catalogoRelatorios: Page<RelatorioResumoDTO> = useSelector(
        (state: RootState) => state.store.catalogoRelatorios.catalogo);
    const tagSucesso = !relatorio.erro ? undefined : tag(alertCircleOutline, null, true);
    const jaRevisado = relatorio.revisados === relatorio.evidencias;

    //Botões renderizados por esse componente
    const butoes: ButtonLayoutProps[] = [ 
        {
            title: 'Reexecutar',
            icon: flash,
            trigger: () =>  reexecutarRelatorio(),
            disabled: false,
        },
        {
            title: 'Revisar',
            icon: eye,
            trigger: () =>  obterUmaRevisao(),
            disabled: false,
        },
        //{
        //    title: 'Gerar DET',
        //    icon: document,
        //    trigger: () =>  obterDet(),
        //    disabled: false,
        //}
    ];

    //Permite configurar diferentes tipos de tag, para renderizar diferentes símbolos
    function tag(icone: string | undefined = undefined, conteudo: string | number | null, alerta: boolean = false) {
        const padding = conteudo === null ? "pe-0" : "me-1 pe-2";
        const corFundo = alerta ? "danger" : "primary";
        const corTexto = alerta ? "light" : "dark";
        return <IonBadge className={`mb-0 ${padding} h6`} color={corFundo}>
            <IonIcon icon={icone} color={corTexto} className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
            {conteudo}
        </IonBadge>
    }

     //Requisição para obter o relatório no banco a ser revisado
     async function obterUmaRevisao() {
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        const mensagemId = `Open_Report@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Abrindo Relatório ticket ${relatorio.ticket}.`,
            status: 'INFO'
        }));
        try {
            const relatorioParaRevisar: RelatorioHistoricoDTO = await axiosRequest.getUmaRevisao(relatorio.id);
            iniciarRevisao(relatorioParaRevisar);
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Sucesso.`,
                status: 'OK'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
    }

    //Requisição para reexecugar Jobs com base nos dados de um Relatório
    async function reexecutarRelatorio() {
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        const mensagemId = `Rerun_Report@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Reexecutando Relatório ticket ${relatorio.ticket}.`,
            status: 'INFO'
        }));
        try {
            const relatorioReexecutado: RelatorioHistoricoDTO = await axiosRequest.reexecutarRelatorio(relatorio.id);
            const buttons = [
                {
                  text: 'Revisar',
                  role: 'Revisar DET',
                  handler: () => iniciarRevisao(relatorioReexecutado),
                }
            ];
            dispatch(addMeuTicket(relatorioReexecutado.ticket));
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: 'Sucesso.',
                status: 'OK'
            }));
            //toastOk(`${titulo}: Realizado com sucesso.`, buttons);
            //const novoRelatorioResumo: RelatorioResumoDTO = await axiosRequest.getUmRelatorio(relatorioReexecutado.id);
            //dispatch(addRelatorio(novoRelatorioResumo));
            //dispatch()
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
    }

    //Requisição para obter o DET no banco
    async function obterDet() {
        const mensagemId = `Get_DET@${Date.now()}`;
        if (!user) {
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `Usuário não definido. Não será possível obter DET do ticket ${relatorio.ticket}.`,
                status: 'INFO'
            }));
            return;
        };
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Obtendo DET do ticket ${relatorio.ticket}.`,
            status: 'INFO'
        }));

        try {
            const fileBlob: Blob = await axiosRequest.getDet(relatorio.id, user.name, user.email);
            const buttons = [
                {
                  text: 'Abrir',
                  role: 'Abrir DET',
                  handler: () => abrirDet(fileBlob),
                }
            ];
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Sucesso.`,
                status: 'OK'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
    }

    //Handler para navegar o usuário à tela de Revisão
    function iniciarRevisao(revisao: RelatorioHistoricoDTO) {
        dispatch(removeRevisao())
        dispatch(addRevisao(revisao));
        console.log(`[ESCOLHER-RELATORIOS] Navegando para: ${axiosRequest.URL_DET}`);
        history.push(axiosRequest.URL_DET);
    }

    //Handler para abrir o arquivo DET gerado
    function abrirDet(fileBlob: Blob) {
        //TODO: >>> MOVER PARA UM OUTRO ESCOPO/CLASSE  <<<
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
    }

    //Renderiza o componente
    return (
        <GlassInput text={`Ticket ${relatorio.ticket}`} icon={ticketOutline}>
            <IonRow className="d-flex w-100 glass-content align-content-end ion-align-items-center m-0 p-0">
                <IonLabel className="text-center">
                    <IonIcon icon={newspaperOutline} 
                        color={relatorio.erro ? 'danger' : 'success'} 
                        size="large"
                        className="ms-3 px-1 mt-2" 
                        style={{transform: 'translate(-8px, 3px)'}} 
                    />
                    <br/>
                    <IonBadge color={relatorio.erro ? 'danger' : 'success'}>
                        Nº {catalogoRelatorios.pageable.pageNumber * catalogoRelatorios.pageable.pageSize + index +1}
                    </IonBadge>
                </IonLabel>
                <IonCol size="6">
                    <IonCard className="ms-0 mb-0 w-100 bg-transparent border-0" style={{boxShadow: '0 0 0 '}}>
                        <IonCardContent className='h6 lh-1 font-monospace text-white m-0 p-0'>
                            <IonBadge className="m-0 p-0 text-start h6" color="none">

                                <div>
                                    <IonIcon icon={personCircle} color="light"/> {relatorio.autor} <span className="mx-2" /> 
                                    <IonIcon icon={calendarOutline} color="light"/> {offsetDateTimeParaString(relatorio.data)}
                                </div>
                                <div>
                                    <IonIcon icon={layers} color="light"/> Pipeline {relatorio.nomePipeline}
                                </div>
                                {
                                /*
                                <div>
                                    <IonIcon icon={checkmarkCircleOutline} color="light"/> Evidências 
                                    revisadas: {relatorio.revisados}/{relatorio.evidencias}
                                </div>
                                */
                                }
                                <div>
                                    <IonIcon icon={pricetag} color="light"/> Projeto {relatorio.idProjeto} {relatorio.nomeProjeto !== null ? relatorio.nomeProjeto : "(Pendente)"}
                                </div>
                                <div>
                                    <IonIcon icon={flag} color="light"/> Atividade {relatorio.nomeAtividade !== null ? relatorio.nomeAtividade : "(Pendente)"}
                                </div>
                            </IonBadge>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol className="p-0 pe-2">
                    <IonRow className="m-0 p-0 mb-2 ion-justify-content-around ">
                        {
                            butoes.map((item, index) => <IonCol className="w-100" >
                                    <ButtonLayout key={index} {...item} />
                                </IonCol>
                            )
                        }
                    </IonRow>
                </IonCol>
            </IonRow>
        </GlassInput>
    );
}

export default ListaRelatorios;