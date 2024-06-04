import { IonButton, IonIcon, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRow, IonFab } from "@ionic/react";
import { alertCircleOutline, calendarOutline, checkmarkCircleOutline, cubeOutline, eye, flag, flash, layers, newspaperOutline, pricetagOutline, document } from "ionicons/icons";
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
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";

//Atributos de entrada do componente TicketRelatorio
export interface TicketRelatorioProps {
    relatorio: RelatorioResumoDTO,
    index: number,
}

const TicketRelatorio: React.FC<TicketRelatorioProps> = ({ relatorio, index }) => { 
    //Atributos do componente
    const dispatch = useDispatch();
    const history = useHistory();
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const fonteCodigo = 'h6 lh-1 font-monospace text-white ';
    const tagSucesso = !relatorio.sucesso ? tag(alertCircleOutline, null, true) : <></>;
    const jaRevisado = relatorio.revisados === relatorio.evidencias;
    const buttonClass = `btn btn-outline-dark border-0 my-1 p-0 w-100`;

    //Botões renderizados dentro de cada TicketRelatorio 
    const butoes = [
        layoutButao("Reexecutar", flash, () => reexecutarRelatorio()),
        layoutButao("Revisar", eye, () => obterUmaRevisao()),
        layoutButao("Gerar DET", document, () => obterDet()),
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

    //Contêm o padrão de renderização dos botões 
    function layoutButao(texto: string, icon: string, trigger: () => void) {
        return <IonBadge color="#" className={buttonClass}>
            <IonButton size="small" 
                expand="block"
                fill="outline"
                className='m-0'
                onClick={trigger}
            >
            <IonIcon icon={icon} className="pe-1" style={{transform: 'translate(0px, -1px)'}} />
                {texto}
            </IonButton>
        </IonBadge>
    }

     //Requisição para obter o relatório no banco a ser revisado
     async function obterUmaRevisao() {
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        const mensagemId = `Open_Report@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Abrindo Relatório ID ${relatorio.id}.`,
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
            texto: `Reexecutando Relatório ID ${relatorio.id}.`,
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
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: 'Sucesso.\n'
                    + `Atualize a página de Relatórios e produce pelo ID ${relatorioReexecutado.id}.`,
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
                texto: `Usuário não definido. Não será possível obter DET do Relatório ID ${relatorio.id}.`,
                status: 'INFO'
            }));
            return;
        };
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Obtendo DET do Relatório ID ${relatorio.id}.`,
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
        <IonRow className="ion-align-items-center p-2 px-4 ">
            <div className="glass d-flex w-100 glass-content align-content-end ion-align-items-center">
                <IonFab slot="fixed" 
                    vertical="top" 
                    horizontal="start" 
                    edge
                >
                    <IonBadge color="primary" 
                        className="text-center" 
                        style={{ transform: 'translate(-11px, 27px)', minWidth: '24px' }}
                    >
                        <small>{index+1}</small>
                    </IonBadge>
                </IonFab>
                <div className="ms-3">
                    <IonIcon icon={newspaperOutline} 
                        color='primary' 
                        size="large"
                        className="pe-1" 
                        style={{transform: 'translate(0px, 3px)'}} 
                    />
                    {relatorio.id}
                </div>
                <IonCard className="ms-0 mb-0 w-100 bg-transparent border-0" style={{boxShadow: '0 0 0 '}}>
                    <IonCardHeader className='m-0 p-0'>
                        <IonCardTitle className='text-white py-0 ion-align-items-center'>
                            {tag(calendarOutline, offsetDateTimeParaString(relatorio.data))}
                            {tag(pricetagOutline, relatorio.idProjeto +" - "+ relatorio.nomeProjeto)}
                            {tag(cubeOutline, relatorio.evidencias)}
                            {tag(checkmarkCircleOutline, relatorio.revisados, !jaRevisado)}
                            {tagSucesso}
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className='p-0 m-0'>
                        <div className={fonteCodigo}>
                            <div className="">
                                <IonIcon icon={flag} color="light" className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
                                {relatorio.nomeAtividade}
                            </div>
                            <div className="">
                                <IonIcon icon={layers} className='ms-1' style={{fill: 'var(--ion-color-light)', transform: 'translate(-3px, 3px)'}}/>
                                {relatorio.nomePipeline}
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>
                <div className="p-0 pe-2">
                    {butoes}
                </div>
            </div>
        </IonRow>
    );
}

export default TicketRelatorio;