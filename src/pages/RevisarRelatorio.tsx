import { IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRow, IonTextarea, RadioGroupChangeEventDetail, TextareaChangeEventDetail, useIonViewWillEnter } from '@ionic/react';
import capaDet from '../resources/VIVO_DET_PAGE_BACKGROUND_3.png';
import { useDispatch, useSelector } from 'react-redux';
import { RelatorioHistoricoDTO } from '../data/RelatorioHistoricoDTO';
import { RootState } from '../Store/ReduxStore';
import { setTestcaseExpectativa, setTestcaseResultado, setTestcaseLock } from '../Store/Reducer/ReducerRevisao';
import { checkEvidenciaPronta } from '../data/EvidenciaInfoDTO';
import './template/template.css';
import { alertCircle, checkmarkCircle, closeCircle, document, helpCircle, refresh, save } from 'ionicons/icons';
import { UserDTO } from '../data/UserDTO';
import { EvidenciaRevisadaDTO } from '../data/EvidenciaRevisadaDTO';
import * as axiosRequest from '../data/AxiosRequest';
import { EvidenciasRevisadasDTO } from '../data/AxiosRequest';
import { Notificacao } from '../components/Noticacao';
import dayjs from 'dayjs';
import { offsetDateTimeParaString } from '../App';
import { useHistory } from 'react-router';
import { layoutGrupoBotoes, ButtonLayoutProps } from '../components/ButtonLayout';
import { exitCode } from 'process';


//Interface das tabelas da sessão 'Evolução dos Testes' no DET
export interface DetTestcase {
    evidenciaId: number,
    nome: string,
    descricao: string,
    requisitos: string,
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


const RevisarRelatorio: React.FC<Notificacao> = ({ toastInfo, toastOk, toastErro }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const relatorio: RelatorioHistoricoDTO | null = useSelector((state: RootState) => state.store.docRevisao.value);
    const IdsLocked: number[] = useSelector((state: RootState) => state.store.docRevisao.idsLocked);

    //Atributos de botões
    const botaoSalvar = {
        title: 'Salvar',
        icon: save,
        trigger: () => salvarRevisao(),
        disable: false,
    } as ButtonLayoutProps;

    const botaoDET = {
        title: 'DET',
        icon: document,
        trigger: () => gerarDet(),
        disable: !podeGerarDet(), //isLoading(),
    } as ButtonLayoutProps;
    
    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        //dispatch(setButtons( [botaoSalvar, botaoDET] ));
        if (relatorio === null) {
            console.log("O RelatorioHistoricoDTO no ReducerRelatorio está nulo. A página Evidência não poderá ser gerada.");
            history.push(axiosRequest.URL_PIPELINES);
        }
    }, []);

    const resultadoStatus: DetStatusTYPE[] = ["Aprovado", "Reprovado", "Parcial"];

    if (!relatorio || !user) return <></>;

    //campos da sessão 'identificação' no DET
    const idProjeto = relatorio.idProjeto;
    const nomeProjeto = relatorio.nomeProjeto;
    const nomeAtividade = relatorio.nomeAtividade;
    const testeTipo = relatorio.testeTipo;
    const cliente = relatorio.cliente;
    const nome = user.name;
    const cargo = "DEV";
    const empresa = "PPW";
    const email = user.email;
    const phone = "";

    //campos da sessão 'detalhamento' no DET
    const modulos = relatorio.pipeline;
    const parametros = relatorio.parametros;
    const dados = relatorio.dados;
    const config = relatorio.configuracao;
    const ambiente = relatorio.ambiente;

    const testcases = () => {
        if (!relatorio || !user) return <></>;

        return relatorio.evidencias.map((evidencia, evIndex) => {
            const evidenciaId = evidencia.id;
            const nome = evidencia.job;
            const descricao = evidencia.jobDescricao;
            const sha256 = evidencia.sha256;
            const exitCode = evidencia.exitCode;
            const erroFatal = evidencia.erroFatal;
            const comentario = evidencia.comentario;
            const resultado = evidencia.resultado;
            const parametros = evidencia.argumentos;
            const revisor = evidencia.revisor;
            const data = offsetDateTimeParaString(evidencia.dataFim);
            const queries = evidencia.queries;
            const tabelasNome = evidencia.queriesNome;
            const tabelasPreJob = evidencia.tabelasPreJob;
            const tabelasPosJob = evidencia.tabelasPosJob;
            const queriesInconformidade = evidencia.queriesInconformidade;
            const anexosTotais: JSX.Element[] = [];
            const pronto = checkEvidenciaPronta(evidencia);
            const lock = IdsLocked.findIndex((item) => item === evidencia.id) !== -1;

            const logsConteudo: string[] = [];
            const logsNome: string[] = [];
            const cargasConteudo: string[] = [];
            const cargasNome: string[] = [];
            const saidasConteudo: string[] = [];
            const saidasNome: string[] = [];
            const anexosInconformidade: string[] = [];

            evidencia.logs.forEach((anexo) => {
                logsConteudo.push(anexo.conteudo);
                logsNome.push(anexo.nome);
                if (anexo.inconformidade)
                    anexosInconformidade.push(anexo.inconformidade);
            });
            evidencia.cargas.forEach((anexo) => {
                cargasConteudo.push(anexo.conteudo);
                cargasNome.push(anexo.nome); 
                if (anexo.inconformidade)
                    anexosInconformidade.push(anexo.inconformidade);
            });
            evidencia.saidas.forEach((anexo) => {
                saidasConteudo.push(anexo.conteudo);
                saidasNome.push(anexo.nome);
                if (anexo.inconformidade)
                    anexosInconformidade.push(anexo.inconformidade);
            });

            //Preenchendo anexos de tabelas por query
            queries.forEach((query, index) => {
                const nomePreJob = `Tabela ${tabelasNome[index]} antes` + '\n';
                const nomePosJob = `Tabela ${tabelasNome[index]} depois` + '\n';
                const bancoInfo = <div>
                    <h5 className='fw-bold mt-3'>{tabelasNome[index]}</h5>
                    <p className='my-0 px-2 py-0 small font-monospace bg-light'>{query + '\n'}</p>
                    <div id='list-group-item'
                        className='btn btn-outline-primary py-0 px-1 me-2'
                        onClick={() => abrirAnexo(nomePreJob, tabelasPreJob[index])}
                    >
                        {nomePreJob}
                    </div>
                    <div id='list-group-item'
                        className='btn btn-outline-primary py-0 px-1 me-2'
                        onClick={() => abrirAnexo(nomePosJob, tabelasPosJob[index])}
                    >
                        {nomePosJob}
                    </div>
                </div>;
                anexosTotais.push(bancoInfo);
            });
            //Preenchendo anexos de logs
            logsNome.forEach((nome, index) => {
                const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>LOGS</h5>) : (null);
                const logInfo = <div>
                    {sessao}
                    <div id='list-group-item'
                        className='btn btn-outline-primary py-0 px-1 me-2 '
                        onClick={() => abrirAnexo(nome, logsConteudo[index])}
                    >
                        {nome + "\n"}
                    </div>
                </div>
                anexosTotais.push(logInfo);
            });
            //Preenchendo anexos de cargas
            cargasNome.forEach((nome, index) => {
                const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>CARGAS</h5>) : (null);
                const cargaInfo = <div>
                    {sessao}
                    <div id='list-group-item'
                        className='btn btn-outline-primary py-0 px-1 me-2'
                        onClick={() => abrirAnexo(nome, cargasConteudo[index])}
                    >
                        {nome + "\n"}
                    </div>
                </div>
                anexosTotais.push(cargaInfo);
            })
            //Preenchendo anexos de saídas
            saidasNome.forEach((nome, index) => {
                const sessao = (index === 0) ? (<h5 className='fw-bold mt-3'>SAÍDAS</h5>) : (null);
                const saidaInfo = <div>
                    {sessao}
                    <div id='list-group-item'
                        className='btn btn-outline-primary py-0 px-1 me-2'
                        onClick={() => abrirAnexo(nome, saidasConteudo[index])}
                    >
                        {nome + "\n"}
                    </div>
                </div>
                anexosTotais.push(saidaInfo);
            });

            const setResultado = (e: CustomEvent<RadioGroupChangeEventDetail<any>>) => { 
                const revisao = {
                    index: evIndex,
                    resultado: e.detail.value,
                    revisor: user.name,
                }
                dispatch(setTestcaseResultado(revisao));
            };

            const setComentario = (e: CustomEvent<TextareaChangeEventDetail>) => { 
                if (!e.detail.value) return;
                setTestcaseExpectativa({ index: evIndex, valor: e.detail.value })
            };

            return (
                <div className='table-responsive' key={evIndex}>
                    <IonGrid className='ion-align-items-center pt-3 pb-0'>
                        <IonRow>
                            {iconCampoObrigatorio(pronto ? "sim" : "")}
                            <span id={`${evidenciaId}`} className='h3'>{nome}</span>
                        </IonRow>
                    </IonGrid>
                    <table className='table table-light table-striped m-0 mb-5 text-start'>
                        <tbody>
                            <tr>
                                <th>Evidência ID</th>
                                <td>EVIDÊNCIA ID {evidenciaId}</td>
                            </tr>
                            <tr>
                                <th>Descrição do Job</th>
                                <td>{descricao}</td>
                            </tr>
                            <tr>
                                <th>Parâmetros do Job</th>
                                <td>{parametros}</td>
                            </tr>
                            <tr>
                                <th>SHA256</th>
                                <td>{sha256}</td>
                            </tr>
                            <tr>
                                <th>Data do Teste</th>
                                <td>{data}</td>
                            </tr>
                            <tr>
                                <th>Código de Saída</th>
                                <td>{exitCode}</td>
                            </tr>
                            <tr>
                                <th>Erro Fatal</th>
                                <td>{erroFatal}</td>
                            </tr>
                            <tr>
                                <th>Inconformidades</th>
                                <td className='font-monospace'>
                                    <div style={{ width: "100%", maxWidth: "950px", whiteSpace: "nowrap", overflowX: 'scroll' }}>
                                    { 
                                        queriesInconformidade.map(linha => <div> - {linha}</div>) 
                                    }
                                    { 
                                        anexosInconformidade.map(linha => <div> - {linha}</div>) 
                                    }
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <IonGrid>
                                        <IonRow className='ion-align-items-center'>
                                            <IonCol className='p-0 m-0'>Resultado Obtido</IonCol>
                                            <IonCol className='p-0 m-0' size='auto'>
                                                {iconCampoObrigatorio(resultado)}
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </th>
                                <td>
                                    <IonRadioGroup value={resultado} onIonChange={setResultado} >
                                        <div className='d-flex justify-items-center'>
                                        {
                                            resultadoStatus.map((item, index) => {
                                                return ( 
                                                    <IonItem key={index} 
                                                        lines='none' 
                                                        disabled={lock}
                                                        className='bg-info bg-opacity-25 rounded rounded-4 m-1 my-2'
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
                                            <IonCol className='p-0 m-0'>Revisor</IonCol>
                                            <IonCol className='p-0 m-0' size='auto'>{iconCampoObrigatorio(revisor)}</IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </th>
                                <td className='align-middle'>
                                    <span className='text-primary h6'>{revisor}</span>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <IonGrid>
                                        <IonRow className='ion-align-items-center'>
                                            <IonCol className='p-0 m-0'>Notas do Revisor</IonCol>
                                            <IonCol className='p-0 m-0' size='auto'>{iconCampoFacultativo(comentario)}</IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </th>
                                <td>
                                    <IonTextarea inputmode='text'
                                        maxlength={280}
                                        className='text-dark bg-white bg-opacity-50 ps-2 mb-2 rounded rounded-3 border'
                                        value={comentario}
                                        disabled={lock}
                                        onIonChange={setComentario}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Anexos de Evidência</th>
                                <td>{anexosTotais}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        })
    };

    //Definindo o id do elemento de cada tabela testecase com base no índice dela na lista
    //testcases?.map((tabela, index) => {
    //    const idString = tabela.titulo.replaceAll(" ", "-").toLocaleLowerCase();
    //    tabela.id = `teste-${index}-${idString}`;
    //    return tabela;
    //});

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

    const gerarEstatisticas = (): JSX.Element => {
        if (!relatorio) return <></>;

        let aprovados = 0;
        let reprovados = 0;
        let parciais = 0;
        relatorio.evidencias.forEach((teste, index) => {
            if (teste.resultado === "Reprovado") reprovados++;
            else if (teste.resultado === "Parcial") parciais++;
            else if (teste.resultado === "Aprovado") aprovados++;
        });
        let aprovadosPorcent = Math.round((aprovados * 100) / relatorio.evidencias.length);
        let reprovadosPorcent = Math.round((reprovados * 100) / relatorio.evidencias.length);
        let parciaisPorcent = Math.round((parciais * 100) / relatorio.evidencias.length);

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
        if (!relatorio) {
            toastErro("ERRO: Nenhum relatório para Revisão disponível", []);
            return;
        };
        let itensLocked = 0; //FIX01
        console.log(`Revisoeres: ${relatorio.evidencias.map((item) => item.revisor).join(", ")}`);
        if (IdsLocked.length === relatorio.evidencias.length) {
            toastInfo("Relatório já revisado. Sem necessidade de atualizar o banco.", []);
            return;
        }
        
        const data = new Date();
        const evidenciasParaSalvar: EvidenciaRevisadaDTO[] = relatorio.evidencias
            //.filter((item) => checkEvidenciaPronta(item))
            //.filter((item) => IdsLocked.findIndex((idLocked) => idLocked !== item.id) === -1)
            .map((item) => {
                return {
                    evidenciaId: item.id,
                    resivor: item.revisor,
                    dataRevisao: data,
                    comentario: item.comentario,
                    resultado: item.resultado,
                } as EvidenciaRevisadaDTO;
            });
        console.log(`[REVISAR-RELATORIO]: IDs das Evidências revisadas para salvar: ` + evidenciasParaSalvar.map((item) => item.evidenciaId));
        console.log(`[REVISAR-RELATORIO]: Total de Evidências revisadas para salvar: ` + evidenciasParaSalvar.length);
        if (evidenciasParaSalvar.length === 0) {
            toastInfo("Revise ao menos uma Evidência pendente para poder ataulizar o banco.", []);
            return;
        }
        console.log(`[REVISAR-RELATORIO]: Iniciando requisição 'Salvar Revisoão'.`);
        toastInfo("SALVAR REVISÃO: Em execução...", []);
        try {
            const evidenciasSalvas: EvidenciasRevisadasDTO = await axiosRequest.saveRevisaoEvidencia(evidenciasParaSalvar);
            dispatch(setTestcaseLock(evidenciasSalvas.saved))
            toastOk("SALVAR REVISÃO: Realizada com sucesso.", []);
            console.log(`[REVISAR-RELATORIO]: Requisição 'Salvar Revisoão' funcionou.`);
        }
        catch (error) {
            toastErro(`SALVAR REVISÃO: ${error}`, []);
            console.error(`[REVISAR-RELATORIO]: Requisição 'Salvar Revisoão' falhou.`);
        }
        
    };

    const gerarDet = async () => {
        //TODO: melhorar!
        if (!relatorio) {
            toastErro("ERRO: Nenhum Relatório para Revisão selecionado!", []);
            return;
        }
        //if (!podeGerarDet()) {
        //    toastErro("É obrigatório preencher todos os campos de revisão antes de gerar o DET", []);
        //    return;
        //}
        if (!user) {
            toastErro("ERRO: Usuário não definido!", []);
            return;
        };

        console.log(`[REVISAR-RELATORIO]: Iniciando requisição 'Obter Det'.`);
        toastInfo("OBTER DET: Em execução...", []);
        try {
            const fileBlob: Blob = await axiosRequest.getDet(relatorio.id, user.name, user.email);
            const buttons = [
                {
                  text: 'Abrir',
                  role: 'Abrir DET',
                  handler: () => abrirDet(fileBlob),
                }
            ];
            toastOk("OBTER DET: Realizada com sucesso.", buttons);
            console.log(`[REVISAR-RELATORIO]: Requisição 'Obter Det' funcionou.`);
        }
        catch (error) {
            toastErro(`OBTER DET: ${error}`, []);
            console.error(`[REVISAR-RELATORIO]: Requisição 'Obter Det' falhou.`);
        }
    }

    function abrirDet(fileBlob: Blob) {
        //TODO: >>> MOVER PARA UM OUTRO ESCOPO/CLASSE  <<<
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
    }

    function podeGerarDet(): boolean {
        if (!relatorio) return false;
        //const totalPronto = relatorio.evidencias.filter((item) => checkEvidenciaPronta(item)).length;
        return IdsLocked.length === relatorio.evidencias.length;
    }

    //Renderização do componente
    return (
        <>
            {layoutGrupoBotoes([ botaoSalvar, botaoDET ])}
            {/* Corpo principal */}
            <div className="container card justify-content-center bg-white px-0 pb-5">
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
                                        <th>PROJETO ID</th>
                                        <th>PROJETO NOME</th>
                                    </tr>
                                    <tr>
                                        <td id="projeto-id">{idProjeto}</td>
                                        <td id="projeto-nome">{nomeProjeto}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Sobre os testes */}
                        <h3 className="pt-2">SOBRE OS TESTES</h3>
                        <div className="table-responsive px-3">
                            <table className="table table-light table-striped">
                                <tbody>
                                    <tr>
                                        <th>TIPO DE TESTE</th>
                                        <th>SISTEMA(S)</th>
                                    </tr>
                                    <tr>
                                        <td id="teste-tipo">{testeTipo}</td>
                                        <td id="teste-sistema">{cliente}</td>
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
                                        <th>Nome da Pipeline</th>
                                        <td id="modulos">{modulos}</td>
                                    </tr>
                                    <tr>
                                        <th>Descrição da Pipeline</th>
                                        <td id="dados">{dados}</td>
                                    </tr>
                                    <tr>
                                        <th>Sequência de Jobs Executados</th>
                                        <td id="parametros">
                                            {
                                                parametros?.split(" ").map((item, index) =>
                                                    <p key={index} className='my-0' >{item}</p>
                                                )
                                            }
                                        </td>
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
                                                    {/* <IonCol className='p-0 m-0' size='auto'>{iconCampoFacultativo(expectativa)}</IonCol> */}
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
                                {testcases()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Fim do Corpo principal */}

            {/* Recuo */}
            <div className="p-5"></div>
        </>
    );
};

export default RevisarRelatorio;
