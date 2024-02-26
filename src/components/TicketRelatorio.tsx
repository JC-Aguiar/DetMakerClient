import { IonButton, IonIcon, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRow } from "@ionic/react";
import { alertCircleOutline, calendarOutline, checkmarkCircleOutline, cubeOutline, eye, flag, flash, layers, newspaperOutline, pricetagOutline, document } from "ionicons/icons";
import * as axiosRequest from "../data/AxiosRequest";
import { useDispatch, useSelector } from "react-redux";
import { RelatorioResumoDTO } from "../data/RelatorioResumoDTO";
import { offsetDateTimeParaString } from "../App";
import { addRelatorio } from "../Store/Reducer/ReducerRelatorios";
import { removeRevisao, addRevisao } from "../Store/Reducer/ReducerRevisao";
import { RelatorioHistoricoDTO } from "../data/RelatorioHistoricoDTO";
import { Notificacao } from "./Noticacao";
import { useHistory } from "react-router";
import { RootState } from "../Store/ReduxStore";
import { UserDTO } from "../data/UserDTO";

export interface ModalConfigQueryProps {
    relatorio: RelatorioResumoDTO,
    notificacao: Notificacao,
}

const TicketRelatorio: React.FC<ModalConfigQueryProps> = ({ relatorio, notificacao }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const toastInfo = notificacao.toastInfo;
    const toastOk = notificacao.toastOk;
    const toastErro = notificacao.toastErro;
    const fonteCodigo = 'h6 lh-1 font-monospace text-white ';
    const tagSucesso = !relatorio.sucesso ? tag(alertCircleOutline, null, true) : <></>;
    const jaRevisado = relatorio.revisados === relatorio.evidencias;
    const buttonClass = `btn btn-outline-dark border-0 my-1 p-0 w-100`;

    const butoes = [
        layoutButao("Reexecutar", flash, () => reexecutarRelatorio(relatorio.id)),
        layoutButao("Revisar", eye, () => obterUmaRevisao(relatorio.id)),
        layoutButao("Gerar DET", document, () => obterDet(relatorio.id)),
    ];

    function tag(icone: string | undefined = undefined, conteudo: string | number | null, alerta: boolean = false) {
        const padding = conteudo === null ? "pe-0" : "me-1 pe-2";
        const corFundo = alerta ? "danger" : "primary";
        const corTexto = alerta ? "light" : "dark";
        return <IonBadge className={`mb-0 ${padding} h6`} color={corFundo}>
            <IonIcon icon={icone} color={corTexto} className="pe-1" style={{transform: 'translate(0px, 3px)'}} />
            {conteudo}
        </IonBadge>
    }

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
     async function obterUmaRevisao(id: number) {
        const titulo = `OBTER REVISÃO ID ${id}`;
        console.log(`[ESCOLHER-RELATORIOS]: Iniciando requisição '${titulo}'.`);
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        toastInfo(`${titulo}: Em execução...`, []);
        try {
            const relatorioParaRevisar: RelatorioHistoricoDTO = await axiosRequest.getUmaRevisao(id);
            toastOk(`${titulo}: Realizado com sucesso.`, []);
            console.log(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' funcionou.`);
            iniciarRevisao(relatorioParaRevisar);
        }
        catch (error) {
            toastErro(`${titulo}: ${error}`, []);
            console.error(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' falhou.`);
        }
    }

    //Requisição para reexecugar Jobs com base nos dados de um Relatório
    async function reexecutarRelatorio(id: number) {
        const titulo = `REEXECUTAR RELÁTORIO ID ${id}`;
        console.log(`[ESCOLHER-RELATORIOS]: Iniciando requisição '${titulo}'.`);
        //modalGetPipelinesOff();
        //modalNovaPipelineOff();
        toastInfo(`${titulo}: Em execução...`, []);
        try {
            const relatorioReexecutado: RelatorioHistoricoDTO = await axiosRequest.reexecutarRelatorio(id);
            const buttons = [
                {
                  text: 'Revisar',
                  role: 'Revisar DET',
                  handler: () => iniciarRevisao(relatorioReexecutado),
                }
            ];
            toastOk(`${titulo}: Realizado com sucesso.`, buttons);
            console.log(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' funcionou.`);

            const novoRelatorioResumo: RelatorioResumoDTO = await axiosRequest.getUmRelatorio(relatorioReexecutado.id);
            dispatch(addRelatorio(novoRelatorioResumo));
        }
        catch (error) {
            toastErro(`${titulo}: ${error}`, []);
            console.error(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' falhou.`);
        }
    }

    //Requisição para obter o DET no banco
    async function obterDet(id: number) {
        if (!user) {
            toastErro("ERRO: Usuário não definido!", []);
            return;
        };
        const titulo = `OBTER DET ID ${id}`;
        console.log(`[ESCOLHER-RELATORIOS]: Iniciando requisição '${titulo}'.`);
        toastInfo(`${titulo}: Em execução...`, []);
        try {
            const fileBlob: Blob = await axiosRequest.getDet(id, user.name, user.email);
            const buttons = [
                {
                  text: 'Abrir',
                  role: 'Abrir DET',
                  handler: () => abrirDet(fileBlob),
                }
            ];
            toastOk(`${titulo}: Realizado com sucesso.`, buttons);
            console.log(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' funcionou.`);
        }
        catch (error) {
            toastErro(`${titulo}: ${error}`, []);
            console.error(`[ESCOLHER-RELATORIOS]: Requisição '${titulo}' falhou.`);
        }
    }

    function iniciarRevisao(revisao: RelatorioHistoricoDTO) {
        dispatch(removeRevisao())
        dispatch(addRevisao(revisao));
        console.log(`[ESCOLHER-RELATORIOS] Navegando para: ${axiosRequest.URL_DET}`);
        history.push(axiosRequest.URL_DET);
    }

    function abrirDet(fileBlob: Blob) {
        //TODO: >>> MOVER PARA UM OUTRO ESCOPO/CLASSE  <<<
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
    }

    return (
        <IonRow className="ion-align-items-center p-2 px-4 ">
            <div className="glass d-flex w-100 p-0 m-0">
                <div className="d-flex glass-content align-content-end ion-align-items-center">
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
            </div>
        </IonRow>
    );
}

export default TicketRelatorio;