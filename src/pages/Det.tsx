import { InputChangeEventDetail, IonButton, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRadio, IonRadioGroup, IonRow, IonTextarea, RadioGroupChangeEventDetail, TextareaChangeEventDetail, ToastButton, useIonToast, useIonViewDidEnter } from '@ionic/react';
import capaDet from '../resources/VIVO_DET_PAGE_BACKGROUND_3.png';
//import { Page, View, Document, PDFDownloadLink } from '@react-pdf/renderer';
//import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { RelatorioHistoricoDTO } from '../data/RelatorioHistoricoDTO';
import { RootState } from '../Store/ReduxStore';
import { setTestcaseExpectativa, setTestcaseResultado, setTestcaseRevisor, setTestcaseLock } from '../Store/Reducer/ReducerRelatorios';
import { dataParaString } from '../App';
import { EvidenciaInfoDTO } from '../data/EvidenciaInfoDTO';
import './template/template.css';
import { alertCircle, checkmarkCircle, closeCircle, document, helpCircle, save } from 'ionicons/icons';
import { UserDTO } from '../data/UserDTO';
import { EvidenciaRevisadaDTO } from '../data/EvidenciaRevisadaDTO';
import * as axiosRequest from '../data/AxiosRequest';
import { EvidenciasRevisadasDTO } from '../data/AxiosRequest';


//Interface das tabelas da sessão 'Evolução dos Testes' no DET
export interface DetTestcase {
    evidenciaId: number,
    nome: string,
    descricao: string,
    preCondicoes: string,
    comentario: string,
    resultado: string,
    parametros: string,
    revisor: string,
    data: string,
    queries: string[],
    tabelasNome: string[],
    tabelasPreJob: string[],
    tabelasPosJob: string[],
    logsConteudo: string[],
    logsNome: string[],
    cargasConteudo: string[],
    cargasNome: string[],
    saidasConteudo: string[],
    saidasNome: string[],
    anexosTotais: JSX.Element[],
    pronto: boolean,
    lock: boolean,
}

export type DetStatusTYPE = "Aprovado" | "Reprovado" | "Parcial";


const Det = (props: any) => {
    const dispatch = useDispatch();
    const [toast, toastOff] = useIonToast();
    const acionarToast = (mensagem: string, tempo: number, cor: string, buttons: ToastButton[]) => {
        toast({
            message: `${mensagem}`,
            duration: tempo,
            position: 'bottom',
            color: cor,
            buttons: buttons,
        });
    };
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const relatorio: RelatorioHistoricoDTO | null = useSelector((state: RootState) => state.store.relatorios.value);
    if (relatorio === null) {
        throw "O RelatorioHistoricoDTO no ReducerRelatorio está nulo. A página Evidência não poderá ser gerada.";
    };

    const resultadoStatus: DetStatusTYPE[] = ["Aprovado", "Reprovado", "Parcial"];

    //campos da sessão 'identificação' no DET
    const idProjeto = relatorio.idProjeto;
    const nomeProjeto = relatorio.nomeProjeto;
    const nomeAtividade = relatorio.nomeAtividade;
    const testeTipo = relatorio.testeTipo;
    const sistema = relatorio.sistema;
    const nome = "Autopilot DetMaker User";
    const cargo = "IA";
    const empresa = "PPW";
    const email = "";
    const phone = "";

    //campos da sessão 'detalhamento' no DET
    const modulos = relatorio.pipeline;
    const parametros = relatorio.parametros;
    const dados = relatorio.dados;
    const config = relatorio.configuracao;
    const ambiente = relatorio.ambiente;
    const testcases: DetTestcase[] = relatorio.evidencias.map((evidencia: EvidenciaInfoDTO) => {
        const logsConteudo: string[] = [];
        const logsNome: string[] = [];
        const cargasConteudo: string[] = [];
        const cargasNome: string[] = [];
        const saidasConteudo: string[] = [];
        const saidasNome: string[] = [];

        evidencia.logs.forEach((anexo) => {
            logsConteudo.push(anexo.conteudo);
            logsNome.push(anexo.nome);
        });
        evidencia.cargas.forEach((anexo) => {
            cargasConteudo.push(anexo.conteudo);
            cargasNome.push(anexo.nome);
        });
        evidencia.saidas.forEach((anexo) => {
            saidasConteudo.push(anexo.conteudo);
            saidasNome.push(anexo.nome);
        });
        const pronto: boolean = evidencia.resultado !== null
            && evidencia.revisor !== null
            && evidencia.resultado.length > 0
            && evidencia.revisor.length > 0;
        return ({
            evidenciaId: evidencia.id,
            nome: evidencia.job,
            descricao: evidencia.jobDescricao,
            preCondicoes: "(TODO)",
            comentario: evidencia.comentario,
            resultado: evidencia.resultado,
            parametros: evidencia.argumentos,
            revisor: evidencia.revisor,
            data: dataParaString(evidencia.dataFim),
            queries: evidencia.queries,
            tabelasNome: evidencia.tabelasNome,
            tabelasPreJob: evidencia.tabelasPreJob,
            tabelasPosJob: evidencia.tabelasPosJob,
            logsConteudo: logsConteudo,
            logsNome: logsNome,
            cargasConteudo: cargasConteudo,
            cargasNome: cargasNome,
            saidasConteudo: saidasConteudo,
            saidasNome: saidasNome,
            anexosTotais: [],
            pronto: pronto,
            lock: evidencia.lock,
        } as DetTestcase);
    });


    //Montando as tabelas Testcase 
    testcases.forEach((teste) => {
        //Preenchendo anexos de tabelas por query
        teste.queries.forEach((query, index) => {
            const nomePreJob = `Tabela ${teste.tabelasNome[index]} antes` + '\n';
            const nomePosJob = `Tabela ${teste.tabelasNome[index]} depois` + '\n';
            const bancoInfo = <div>
                <h5 className='fw-bold mt-3'>{teste.tabelasNome[index]}</h5>
                <p className='my-0 px-2 py-0 small font-monospace bg-light'>{query + '\n'}</p>
                <div id='list-group-item'
                    className='btn btn-outline-primary py-0 px-1 me-2'
                    onClick={() => abrirAnexo(nomePreJob, teste.tabelasPreJob[index])}
                >
                    {nomePreJob}
                </div>
                <div id='list-group-item'
                    className='btn btn-outline-primary py-0 px-1 me-2'
                    onClick={() => abrirAnexo(nomePosJob, teste.tabelasPosJob[index])}
                >
                    {nomePosJob}
                </div>
            </div>
            teste.anexosTotais.push(bancoInfo);
        });
        //Preenchendo anexos de logs
        teste.logsNome.forEach((nome, index) => {
            const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>LOGS</h5>) : (null);
            const logInfo = <div>
                {sessao}
                <div id='list-group-item'
                    className='btn btn-outline-primary py-0 px-1 me-2 '
                    onClick={() => abrirAnexo(nome, teste.logsConteudo[index])}
                >
                    {nome + "\n"}
                </div>
            </div>
            teste.anexosTotais.push(logInfo);
        });
        //Preenchendo anexos de cargas
        teste.cargasNome.forEach((nome, index) => {
            const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>CARGAS</h5>) : (null);
            const cargaInfo = <div>
                {sessao}
                <div id='list-group-item'
                    className='btn btn-outline-primary py-0 px-1 me-2'
                    onClick={() => abrirAnexo(nome, teste.cargasConteudo[index])}
                >
                    {nome + "\n"}
                </div>
            </div>
            teste.anexosTotais.push(cargaInfo);
        })
        //Preenchendo anexos de saídas
        teste.saidasNome.forEach((nome, index) => {
            const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>SAÍDAS</h5>) : (null);
            const saidaInfo = <div>
                {sessao}
                <div id='list-group-item'
                    className='btn btn-outline-primary py-0 px-1 me-2'
                    onClick={() => abrirAnexo(nome, teste.saidasConteudo[index])}
                >
                    {nome + "\n"}
                </div>
            </div>
            teste.anexosTotais.push(saidaInfo);
        });
    })

    //Definindo o id do elemento de cada tabela testecase com base no índice dela na lista
    //testcases.map((tabela, index) => {
    //    const idString = tabela.titulo.replaceAll(" ", "-").toLocaleLowerCase();
    //    tabela.id = `teste-${index}-${idString}`;
    //    return tabela;
    //});

    useIonViewDidEnter(() => {
        //dispatch(hide());
    }, []);

    const iconCampoObrigatorio = (texto: string) => {
        const valido = (texto && texto.length > 0);
        const status = valido ? checkmarkCircle : alertCircle;
        const opacity = valido ? 'opacity-50' : 'opacity-75';
        return <IonIcon icon={status} size='large' color={valido ? 'primary' : 'warning'} className={opacity} />
    }

    const iconCampoFacultativo = (texto: string) => {
        const status = (texto && texto.length > 0) ? checkmarkCircle : helpCircle;
        return <IonIcon icon={status} size='large' color='primary' className='opacity-50' />
    }

    const gerarTabelaTeste = (teste: DetTestcase, index: number) => <div className='table-responsive' key={index}>
        <IonGrid className='ion-align-items-center pt-3 pb-0'>
            <IonRow>
                {iconCampoObrigatorio(teste.pronto ? "sim" : "")}
                <span id={`${teste.evidenciaId}`} className='h3'>{teste.nome}</span>
            </IonRow>
        </IonGrid>
        <table className='table table-light table-striped m-0 mb-5 text-start'>
            <tbody>
                <tr>
                    <th>Evidência ID</th>
                    <td>EVIDÊNCIA ID {teste.evidenciaId}</td>
                </tr>
                <tr>
                    <th>Descrição do Job</th>
                    <td>{teste.descricao}</td>
                </tr>
                <tr>
                    <th>Parâmetros do Job</th>
                    <td>{teste.parametros}</td>
                </tr>
                <tr>
                    <th>Pré-Condições</th>
                    <td>{teste.preCondicoes}</td>
                </tr>
                <tr>
                    <th>
                        <IonGrid>
                            <IonRow className='ion-align-items-center'>
                                <IonCol className='p-0 m-0'>Resultado Obtido</IonCol>
                                <IonCol className='p-0 m-0' size='auto'>{iconCampoObrigatorio(teste.resultado)}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </th>
                    <td>
                        <IonRadioGroup
                            value={teste.resultado}
                            onIonChange={(e) => {
                                dispatch(
                                    setTestcaseResultado({ index: index, valor: e.detail.value }));
                                dispatch(
                                    setTestcaseRevisor({ index: index, valor: user!.name }));
                            }}
                        >
                            <div className='d-flex justify-items-center'>
                            {
                                resultadoStatus.map((item, index) => {
                                    return (
                                        <IonItem key={index} 
                                            lines='none' 
                                            className='bg-info bg-opacity-25 rounded rounded-4 m-1 my-2'
                                            disabled={teste.lock}
                                        >
                                            <IonLabel color='primary' className='p-0 m-0'>{item}</IonLabel>
                                            <IonRadio color='primary' className='p-0 m-1' slot="start" value={item} />
                                        </IonItem>
                                    );
                                })
                            }
                            </div>
                        </IonRadioGroup>
                    </td>
                </tr>
                <tr>
                    <th>
                        <IonGrid>
                            <IonRow className='ion-align-items-center'>
                                <IonCol className='p-0 m-0'>Comentário</IonCol>
                                <IonCol className='p-0 m-0' size='auto'>{iconCampoFacultativo(teste.comentario)}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </th>
                    <td>
                        <IonTextarea inputmode='text'
                            maxlength={280}
                            className='text-dark bg-white bg-opacity-50 ps-2 mb-2 rounded rounded-3 border'
                            value={teste.comentario}
                            disabled={teste.lock}
                            onIonChange={
                                (e) => dispatch(setTestcaseExpectativa({ index: index, valor: e.detail.value }))
                            }
                        />
                    </td>
                </tr>
                <tr>
                    <th>
                        <IonGrid>
                            <IonRow className='ion-align-items-center'>
                                <IonCol className='p-0 m-0'>Revisor</IonCol>
                                <IonCol className='p-0 m-0' size='auto'>{iconCampoObrigatorio(teste.revisor)}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </th>
                    <td className='align-middle'>
                        <span className='text-primary h6'>{teste.revisor}</span>
                    </td>
                </tr>
                <tr>
                    <th>Data do Teste</th>
                    <td>{teste.data}</td>
                </tr>
                <tr>
                    <th>Anexos de Evidência</th>
                    <td>{teste.anexosTotais}</td>
                </tr>
            </tbody>
        </table>
    </div>

    const gerarEstatisticas = () => {
        let aprovados = 0;
        let reprovados = 0;
        let parciais = 0;
        testcases.forEach((teste, index) => {
            if (teste.resultado === "Reprovado") reprovados++;
            else if (teste.resultado === "Parcial") parciais++;
            else if (teste.resultado === "Aprovado") aprovados++;
        });
        let aprovadosPorcent = Math.round((aprovados * 100) / testcases.length);
        let reprovadosPorcent = Math.round((reprovados * 100) / testcases.length);
        let parciaisPorcent = Math.round((parciais * 100) / testcases.length);

        const elementos: { valor: string, cor: string }[] = [];
        if (aprovados > 0)
            elementos.push({ valor: `Jobs Aprovados: ${aprovados} (${aprovadosPorcent}%)`, cor: 'bg-primary' });
        if (parciais > 0)
            elementos.push({ valor: `Jobs Parciais: ${parciais} (${parciaisPorcent}%)`, cor: 'bg-secondary' });
        if (reprovados > 0)
            elementos.push({ valor: `Jobs Reprovados: ${reprovados} (${reprovadosPorcent}%)`, cor: 'bg-warning' });

        return (
            <h4 className='py-0 my-0'>
                {
                    elementos.map((item, index) =>
                        <span key={index} className={`me-2 badge bg-opacity-75 ${item.cor}`}> {item.valor} </span>
                    )
                }
            </h4>
        );
    }

    //Método usado nas tabelas testcases para abrir o conteúdo dos anexos
    function abrirAnexo(nome: string, conteudo: string) {
        //const bytes = Uint8Array.from(atob(conteudo), c => c.charCodeAt(0));
        //const decodificador = new TextDecoder('utf-8');
        //conteudo = decodificador.decode(bytes);
        const newWindow = window.open('', '_blank');
        newWindow?.document.write(`<head><title>${nome}</title></head><pre>${conteudo}</pre>`);
        newWindow?.document.close();
    }

    //Método usado nas tabelas testcases para abrir uma nova aba
    function abrirNovaAba(conteudo) {
        const newWindow = window.open('', '_blank');
        newWindow?.document.write(`<img src=${conteudo} class="card-img" alt="Imagem" />`);
        newWindow?.document.close();
    }

    const salvarRevisao = async () => {
        const data = new Date();
        const evidencias: EvidenciaRevisadaDTO[] = testcases.filter((item) => item.pronto)
            .map((item) => {
                return {
                    evidenciaId: item.evidenciaId,
                    resivor: item.revisor,
                    dataRevisao: data,
                    comentario: item.comentario,
                    resultado: item.resultado,
                } as EvidenciaRevisadaDTO;
            });
        console.log(`[DET]: Total de Evidências revisadas para salvar: ` + evidencias.length);
        if (evidencias.length < 1) return;

        console.log(`[DET]: Iniciando requisição 'Salvar Revisoão'.`);
        console.log(`[DET]: IDs das Evidências revisadas para salvar: ` + evidencias.map((item) => item.evidenciaId));
        toastOff().then(() => acionarToast("SALVAR REVISÃO: Em execução...", 5000, 'medium', []));
        try {
            const evidenciasSalvas: EvidenciasRevisadasDTO = await axiosRequest.saveRevisaoEvidencia(evidencias);
            dispatch(setTestcaseLock(evidenciasSalvas.saved))
            toastOff().then(() => acionarToast("SALVAR REVISÃO: Realizada com sucesso.", 5000, 'primary', []));
            console.log(`[DET]: Requisição 'Salvar Revisoão' funcionou.`);
        }
        catch (error) {
            toastOff().then(() => acionarToast(`SALVAR REVISÃO: ${error}`, 9900, 'warning', []));
            console.error(`[DET]: Requisição 'Salvar Revisoão' falhou.`);
        }
    };

    const gerarDet = async () => {
        console.log(`[DET]: Iniciando requisição 'Obter Det'.`);
        toastOff().then(() => acionarToast("OBTER DET: Em execução...", 5000, 'medium', []));
        try {
            const fileBlob: Blob = await axiosRequest.getDet(relatorio.id);
            const buttons = [
                {
                  text: 'Abrir',
                  role: 'Abrir DET',
                  handler: () => abrirDet(fileBlob),
                }
            ];
            toastOff().then(() => acionarToast("OBTER DET: Realizada com sucesso.", 5000, 'primary', buttons));
            console.log(`[DET]: Requisição 'Obter Det' funcionou.`);
        }
        catch (error) {
            toastOff().then(() => acionarToast(`OBTER DET: ${error}`, 9900, 'warning', []));
            console.error(`[DET]: Requisição 'Obter Det' falhou.`);
        }
    }

    function abrirDet(fileBlob: Blob) {
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
    }

    const podeGerarDet = (): boolean => {
        const totalPronto = testcases.filter((teste) => teste.pronto).length;
        const totalLock = relatorio.evidencias.filter((ev) => !ev.lock).length;
        return totalLock === 0 && totalPronto === testcases.length;
    }

    //Renderização do componente
    return (
        <IonPage>
            <IonContent fullscreen={false} scrollEvents={false} >
                <IonFab slot="fixed" vertical="bottom" horizontal="end" className='pe-5'>
                    <IonGrid className='py-0 my-0'>
                        <IonRow className="ion-justify-content-center">
                            <IonLabel color='#' className="ion-justify-content-center">
                                <IonFabButton className='ms-3 mb-1' onClick={(e) => salvarRevisao()}>
                                    <IonIcon icon={save}></IonIcon>
                                </IonFabButton>
                                <small className="text-center text-primary fw-bold me-3">
                                    Salvar Revisão
                                </small>
                            </IonLabel>
                            <IonLabel color='#' className="ion-justify-content-center">
                                <IonFabButton className='mb-1' onClick={(e) => gerarDet()} disabled={!podeGerarDet()}>
                                    <IonIcon icon={document}></IonIcon>
                                </IonFabButton>
                                <small className="text-center text-primary fw-bold me-5">
                                    Gerar DET
                                </small>
                            </IonLabel>
                        </IonRow>
                    </IonGrid>
                </IonFab>

                {/* Corpo principal */}
                <div className="container justify-content-center bg-white px-0 pb-5 my-5">
                    {/*-----[PARTE 1: CAPA]--------------------------------------------------------------*/}
                    <div className="card border border-0 mb-5 px-3 mx-3" id="capa">
                        <img src={capaDet} id="capa-background" className="card-img opacity-25" alt="Imagem" />
                        <div className="card-img-overlay text-center text-md-start ">
                            <div className="row">
                                <h1 className="card-title destaque lh-1">DET</h1>
                                <h1 className="card-text h1 mx-3 text-primary">Documento de Evidência e Testes</h1>
                                <h3 className="card-text h3 mx-3 text-primary">Sistema Cyber</h3>
                                <h3 id="atividade-nome" className="card-text h3 mx-3 text-primary">{nomeAtividade}</h3>
                            </div>
                        </div>
                    </div>
                    {/*-----[PARTE 2: IDENTIFICAÇÃO]------------------------------------------------------*/}
                    <div id="identificacao" className="text-center text-dark p-5">
                        <div className="card">
                            <div className="font-weight-bold banner py-3 mt-5 mt-md-0 rounded-top">
                                <h1 id="identificacao-titulo" className="h1">IDENTIFICAÇÃO</h1>
                            </div>
                            {/* Sobre o projeto */}
                            <h3 className="pt-2">SOBRE O PROJETO</h3>
                            <div className="table-responsive px-3">
                                <table className="table table-light table-striped">
                                    <tbody>
                                        <tr>
                                            <th>ID(S) DA ORIGEM</th>
                                            <th>NOME/DESCRIÇÃO DA ORIGEM</th>
                                        </tr>
                                        {/* Conteúdo */}
                                        <tr>
                                            <td id="projeto-id">{idProjeto}</td>
                                            <td id="projeto-nome">{nomeProjeto}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="pt-2">SOBRE OS TESTES</h3>
                            <div className="table-responsive px-3">
                                <table className="table table-light table-striped">
                                    <tbody>
                                        <tr>
                                            <th>TIPO DE TESTE</th>
                                            <th>SISTEMA(S)</th>
                                        </tr>
                                        {/* Conteúdo */}
                                        <tr>
                                            <td id="teste-tipo">{testeTipo}</td>
                                            <td id="teste-sistema">{sistema}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* Sobre os envolvidos */}
                            <h3 className="pt-2">SOBRE OS ENVOLVIDOS</h3>
                            <div className="table-responsive px-3">
                                <table className="table table-light table-striped">
                                    <tbody>
                                        <tr>
                                            <th>NOME COMPLETO</th>
                                            <th>PAPEL</th>
                                            <th>EMPRESA ÁREA</th>
                                            <th>E-MAIL</th>
                                            <th>TELEFONE</th>
                                        </tr>
                                        {/* Conteúdo */}
                                        <tr>
                                            <td id="user-nome-1">{nome}</td>
                                            <td id="user-cargo-1">{cargo}</td>
                                            <td id="user-empresa-1">{empresa}</td>
                                            <td id="user-email-1">{email}</td>
                                            <td id="user-phone-1">{phone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                    {/*-----[PARTE 3: DETALHAMENTO DOS TESTES]--------------------------------------------------*/}
                    <div id="detalhamento" className="p-5 text-center">
                        <div className="card">
                            <div className="font-weight-bold banner py-3 mt-5 mt-md-0 rounded-top">
                                <h1 id="detalhamento-titulo" className="h1">DETALHAMENTO DOS TESTES</h1>
                            </div>
                            {/* Conteúdo */}
                            <div className="table-responsive my-3 px-3 ">
                                <table className="table table-light table-striped text-start">
                                    <tbody>
                                        <tr>
                                            <th>Módulos Necessários</th>
                                            <td id="modulos">{modulos}</td>
                                        </tr>
                                        <tr>
                                            <th>Parâmetros da Execução do Sistema</th>
                                            <td id="parametros">
                                            {
                                                parametros.split(" ").map((item, index) => 
                                                    <p key={index} className='my-0' >{item}</p>
                                                )
                                            }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Dados de Teste</th>
                                            <td id="dados">{dados}</td>
                                        </tr>
                                        <tr>
                                            <th>Configuração</th>
                                            <td id="configuracao">{config}</td>
                                        </tr>
                                        <tr>
                                            <th>Ambiente</th>
                                            <td id="ambiente">{ambiente}</td>
                                        </tr>
                                        <tr>
                                            <th>Estatística</th>
                                            <td id="estatistica">{gerarEstatisticas()}</td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <IonGrid>
                                                    <IonRow className='ion-align-items-center'>
                                                        <IonCol className='p-0 m-0'>Considerações</IonCol>
                                                        {/* <IonCol className='p-0 m-0' size='auto'>{iconCampoFacultativo(teste.expectativa)}</IonCol> */}
                                                    </IonRow>
                                                </IonGrid>
                                            </th>
                                            <td>
                                                <IonTextarea inputmode='text'
                                                    maxlength={500}
                                                    className='text-dark bg-white bg-opacity-50 ps-2 mb-2 rounded rounded-3 border'
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/*-----[PARTE 4: EVOLUÇÃO DOS TESTES]-------------------------------------------------*/}
                    <div id="evolucao-testes" className="p-5 text-center ">
                        <div className='card'>
                            <div className="font-weight-bold banner py-3 mt-5 mt-md-0 rounded-top">
                                <h1 className='h1'>EVOLUÇÃO DOS TESTES</h1>
                            </div>
                            {/* Conteúdo */}
                            <div className="table-responsive m-0 text-start">
                                <div className=" table-light table-striped px-3">
                                    {
                                        testcases.map((tabela, index) => gerarTabelaTeste(tabela, index))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Fim do Corpo principal */}

                {/* Recuo */}
                <div className="p-5"></div>
            </IonContent>
        </IonPage>
    );
};

export default Det;
