import { IonButton, IonContent, IonPage, IonPopover, useIonViewDidEnter } from '@ionic/react';
import capaDet from '../resources/VIVO_DET_PAGE_BACKGROUND_3.png';
import { MouseEvent, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Page, View, Document, PDFDownloadLink } from '@react-pdf/renderer';
import ReactDOMServer from 'react-dom/server';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import { useDispatch } from 'react-redux';
import {hide, show} from '../Store/Reducer/ReducerTabMenu';
import './template/template.css';


//Interface das Tabelas de Teste
interface TabelasTeste {
    id: string,
    titulo: string,
    nome: string,
    descricao: string,
    preCondicoes: string,
    expectativa: string,
    resultadoFinal: string,
    status: string,
    responsavel: string,
    data: string,
    listaAnexos: string[],
    nomesAnexos: string[],
}


const Det = (props: any) => {
    const dispatch = useDispatch();

    //Identificação
    const assinatura = "Documento gerado automaticamente pela aplicação DET-MAKER<br> Versão v0.1.BETA - yyyy/MM/dd HH:mm:ss";
    const atividadeNome = "[PF-9854] Alterando forma de pagamento";
    const projetoId = "IN1920";
    const projetoNome = "FENIX";
    const testeTipo = "Teste Unitário";
    const testeSistema = "Cyber Vivo 3";
    const userNome = "João Aguiar";
    const userCargo = "Desenvolvedor";
    const userEmpresa = "PPW";
    const userEmail = "joao.aguiar@ppware.com.br";
    const userPhone = "";

    //Detalhamento dos Testes
    const detalhesModulos = "";
    const detalhesParametros = "";
    const detalhesDados = "";
    const detalhesConfig = "";
    const detalhesAmbiente = "";

    //Evolução dos Tabelas
    const TabelasTestecase: TabelasTeste[] = [
        {
            id: "",
            titulo: 'TESTE TITULO 1',
            nome: 'Teste 1',
            descricao: 'Processando eventos',
            preCondicoes: 'Apenas executar',
            expectativa: 'Processo completo com commit no banco realizado com sucesso',
            resultadoFinal: 'Processo completo com commit no banco realizado com sucesso',
            status: 'Aprovado',
            responsavel: 'João Aguiar',
            data: '24/07/2023',
            listaAnexos: [testeConteudo, testeConteudo],
            nomesAnexos: [
                'EVENTOS_WEB_017_20230524_180401.log',
                'EVENTOS_WEB_017_20230524_180401.log'
            ],
        },
        {
            id: "",
            titulo: 'TESTE TITULO 2',
            nome: 'Teste 2',
            descricao: 'Processando eventos',
            preCondicoes: 'Apenas executar',
            expectativa: 'Processo completo com commit no banco realizado com sucesso',
            resultadoFinal: 'Processo completo com commit no banco realizado com sucesso',
            status: 'Aprovado',
            responsavel: 'João Aguiar',
            data: '24/07/2023',
            listaAnexos: [testeConteudo, testeConteudo],
            nomesAnexos: [
                'EVENTOS_WEB_017_20230524_180401.log',
                'EVENTOS_WEB_017_20230524_180401.log'
            ],
        }
    ];
    //Definindo o id do elemento de cada tabela testecase com base no índice dela na lista
    TabelasTestecase.map((tabela, index) => {
        const idString = tabela.titulo.replaceAll(" ", "-").toLocaleLowerCase();
        tabela.id = `teste-${index}-${idString}`;
        return tabela;
    });

    useIonViewDidEnter(() => {
        dispatch(hide());
    }, []);

    const gerarTabelaTeste = (tabela: TabelasTeste, index: number) => {
        return (
            <div className='table-responsive' key={index}>
                <h3 id={`${tabela.id}`} className='pt-3'>{tabela.titulo}</h3>
                <table className='table table-light table-striped m-0 mb-5 text-start'>
                    <tbody>
                        <tr>
                            <th>Nome do Caso de Teste</th>
                            <td>{tabela.nome}</td>
                        </tr>
                        <tr>
                            <th>Descrição do Caso de Teste</th>
                            <td>{tabela.descricao}</td>
                        </tr>
                        <tr>
                            <th>Descrição das Pré-Condições</th>
                            <td>{tabela.preCondicoes}</td>
                        </tr>
                        <tr>
                            <th>Resultado Esperado</th>
                            <td>{tabela.expectativa}</td>
                        </tr>
                        <tr>
                            <th>Resultados Obtidos</th>
                            <td>{tabela.resultadoFinal}</td>
                        </tr>
                        <tr>
                            <th>Projeto/PP - Situação Atual\nINC/PBI/PKE - Detalhe da Falha\nWO - Detalhe da Solicitação</th>
                            <td>{tabela.status}</td>
                        </tr>
                        <tr>
                            <th>Responsável pelo Teste</th>
                            <td>{tabela.responsavel}</td>
                        </tr>
                        <tr>
                            <th>Data do Teste</th>
                            <td>{tabela.data}</td>
                        </tr>
                        <tr>
                            <th>Anexo/Caminho da Evidência</th>
                            <td>{anexarArquivosTxt(tabela.listaAnexos, tabela.nomesAnexos)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    const anexarArquivosTxt = (anexos: string[], nomes: string[]) => {
        return anexos.map((conteudo, index) =>
            <IonButton fill='clear' onClick={(e) => abrirAnexo(conteudo)}>
                {nomes[index]}
            </IonButton>
        )

    }

    const abrirAnexo = (conteudo: string) => {
        const linhas = conteudo.split("\n");
        const textoFormatado = linhas.join("<br>").replace("\t", '&nbsp;&nbsp;&nbsp;&nbsp;')
        const newWindow = window.open('', '_blank');
        newWindow?.document.write(`<pre>${textoFormatado}</pre>`);
        newWindow?.document.close();
    }

    const abrirNovaAba = () => {
        //const file = './template/template-p1.html';
        //const response = await fetch(file); // Faz uma solicitação para obter o arquivo HTML
        //const htmlContent = await response.text(); // Extrai o conteúdo do arquivo HTML
        //const conteudoString = ReactDOMServer.renderToString(conteudo);
        const htmlContent = ReactDOMServer.renderToString(
            <html lang="pt-br">
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>DET MAKER TEMPLATE</title>
                    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                    <script src="https://unpkg.com/@popperjs/core@2"></script>
                    <link rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
                        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                        crossOrigin="anonymous"
                    />
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js"
                        integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V"
                        crossOrigin="anonymous">
                    </script>
                    <script src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
                    <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
                    <script src="./template-content.js"></script>
                    <link rel="stylesheet" href="./template.css" />
                </head>
                <body className="bg-light">{}</body>
            </html>
        );
        const PdfDocument = () => (
            <Document>
                <Page><View>{pagina}</View></Page>
            </Document>
        );
        const donwloadLink = (
            <PDFDownloadLink
                document={<PdfDocument />}
                fileName="det-teste.pdf"
                style={{
                    textDecoration: "none",
                    padding: "10px",
                    color: "#4a4a4a",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #4a4a4a"
                }}
            >
            {
                ({ blob, url, loading, error }) => loading ? "Loading document..." : "Download Pdf"
            }
            </PDFDownloadLink>
        );
        console.log(donwloadLink);
        return donwloadLink;
        //window.open(htmlContent, '_system'); // Abre uma nova janela em branco
        //window.location.href = file;
        //window.open(file, '_system');
        //const newWindow = window.open('', '_blank');
        //newWindow?.document.write(`${htmlContent}`);
        //newWindow?.document.close();
    }

    function navegarPara(event: MouseEvent, id: string): void {
        //event.preventDefault();
        const idAlvo = document.getElementById(id);
        idAlvo!.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }


    const pdfExportComponent = useRef(null);
    const contentArea = useRef(null);
    const savePdf1 = (event) => {
        //console.log("SALVANDO PDF 1");
        //(pdfExportComponent.current! as PDFExport).save();
        abrirNovaAba();
    }
    const savePdf2 = (event) => {
        console.log("SALVANDO PDF 2");
        const page = document.getElementById("root");
        console.log(page);
        savePDF(page!, { paperSize: "A4" });
    }
    const pagina = (
        <PDFExport ref={pdfExportComponent} paperSize="A4">
            <IonPage ref={contentArea} id="det-page">
                <IonContent fullscreen={true} scrollEvents={true} >
                    {/* Recuo */}
                    <div className='pt-3 pt-md-4'></div>

                    {/* Menu Fixo */}
                    <nav className="navbar navbar-expand-md banner fixed-top align-items-center px-md-5">
                        <div className="d-flex">
                            {/* Botão de menu quando em mídia pequena */}
                            <button className="navbar-toggler text-info bg-white m-2" 
                                type="button" 
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" 
                                aria-controls="navbarSupportedContent" 
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <IonButton id="ppw" 
                                className="navbar-brand disabled text-white fs-1 p-0 m-2"
                                fill='clear'
                                onClick={(e) => navegarPara(e, "capa")}
                            >
                                Peopleware
                            </IonButton>
                        </div>
                        {/* Links do menu */}
                        <div className="collapse navbar-collapse mx-2" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mt-3">
                                <li className="nav-item">
                                    <IonButton id="menu-identificacao" 
                                        className="text-dark" 
                                        fill='clear'
                                        onClick={(e) => navegarPara(e, "identificacao")}
                                    >
                                        IDENTIFICAÇÃO
                                    </IonButton>
                                </li>
                                <li className="nav-item">
                                    <IonButton id="menu-detalhamento" 
                                        className="text-dark" 
                                        fill='clear'
                                        onClick={(e) => navegarPara(e, "detalhamento")}
                                    >
                                        DETALHAMENTO DOS TESTES
                                    </IonButton>
                                </li>
                                <IonButton id="menu-testcase-links" className='text-dark' fill='clear'>
                                    EVOLUÇÃO DOS TESTES
                                </IonButton>
                                <IonPopover trigger="menu-testcase-links" triggerAction="click" showBackdrop={false}>
                                {
                                    TabelasTestecase.map((tabela, index) =>
                                        <IonContent
                                            id={`link-${tabela.id}`}
                                            key={index}
                                            className='ion-padding text-center w-100'
                                            onClick={(e) => navegarPara(e, tabela.id)}
                                            color='primary'
                                        >
                                            {tabela.titulo}
                                        </IonContent>
                                    )
                                }
                                </IonPopover>
                            </ul>
                        </div>
                    </nav>
                    {/* Fim do Menu Fixo */}

                    {/* Recuo */}
                    <div className="p-5"></div>

                    {/* Corpo principal */}
                    <div className="container justify-content-center bg-white px-0 pb-5 my-5">
                        {/*-----[PARTE 1: CAPA]--------------------------------------------------------------*/}
                        <div className="card border border-0 mb-5" id="capa">
                            <img src={capaDet} id="capa-background" className="card-img" alt="Imagem" />
                            <div className="card-img-overlay text-center text-md-start ">
                                <div className="row">
                                    <h1 className="card-title destaque lh-1">DET</h1>
                                    <h1 className="card-text h1 mx-3 text-primary">Documento de Evidência e Testes</h1>
                                    <h3 className="card-text h3 mx-3 text-primary">Sistema Cyber</h3>
                                    <h3 id="atividade-nome" className="card-text h3 mx-3 text-primary">{atividadeNome}</h3>
                                </div>
                            </div>
                        </div>
                        {/*-----[PARTE 2: IDENTIFICAÇÃO]------------------------------------------------------*/}
                        <div id="identificacao" className="text-center p-5">
                            <div className="font-weight-bold banner py-3 mt-5 mt-md-0">
                                <h1 id="identificacao-titulo" className="">IDENTIFICAÇÃO</h1>
                            </div>
                            {/* Sobre o projeto */}
                            <div className="my-3">
                                <h3 className="pt-3">SOBRE O PROJETO</h3>
                                <div className="table-responsive">
                                    <table className="table table-light table-striped">
                                        <tbody>
                                            <tr>
                                                <th>ID(S) DA ORIGEM</th>
                                                <th>NOME/DESCRIÇÃO DA ORIGEM</th>
                                            </tr>
                                            {/* Conteúdo */}
                                            <tr>
                                                <td id="projeto-id">{projetoId}</td>
                                                <td id="projeto-nome">{projetoNome}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Sobre o teste */}
                            <div className="my-3">
                                <h3 className="pt-3">SOBRE OS TESTES</h3>
                                <div className="table-responsive">
                                    <table className="table table-light table-striped">
                                        <tbody>
                                            <tr>
                                                <th>TIPO DE TESTE</th>
                                                <th>SISTEMA(S)</th>
                                            </tr>
                                            {/* Conteúdo */}
                                            <tr>
                                                <td id="teste-tipo">{testeTipo}</td>
                                                <td id="teste-sistema">{testeSistema}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Sobre os envolvidos */}
                            <div className="my-3">
                                <h3 className="pt-3">SOBRE OS ENVOLVIDOS</h3>
                                <div className="table-responsive">
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
                                                <td id="user-nome-1">{userNome}</td>
                                                <td id="user-cargo-1">{userCargo}</td>
                                                <td id="user-empresa-1">{userEmpresa}</td>
                                                <td id="user-email-1">{userEmail}</td>
                                                <td id="user-phone-1">{userPhone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* Recuo  */}
                        <div className="p-3"></div>

                        {/*-----[PARTE 3: DETALHAMENTO DOS TESTES]--------------------------------------------------*/}
                        <div id="detalhamento" className="p-5 text-center">
                            <div className="font-weight-bold banner py-3 mt-5 mt-md-0">
                                <h1 id="detalhamento-titulo" className="">DETALHAMENTO DOS TESTES</h1>
                            </div>
                            {/* Conteúdo */}
                            <div className="my-3">
                                <div className="table-responsive">
                                    <table className="table table-light table-striped text-start">
                                        <tbody>
                                            <tr>
                                                <th>Módulos Necessários</th>
                                                <td id="modulos">{detalhesModulos}</td>
                                            </tr>
                                            <tr>
                                                <th>Parâmetros da Execução do Sistema</th>
                                                <td id="parametros">{detalhesParametros}</td>
                                            </tr>
                                            <tr>
                                                <th>Dados de Teste</th>
                                                <td id="dados">{detalhesDados}</td>
                                            </tr>
                                            <tr>
                                                <th>Configuração</th>
                                                <td id="configuracao">{detalhesConfig}</td>
                                            </tr>
                                            <tr>
                                                <th>Ambiente</th>
                                                <td id="ambiente">{detalhesAmbiente}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Recuo */}
                        <div className="p-3"></div>

                        {/*-----[PARTE 4: EVOLUÇÃO DOS TESTES]-------------------------------------------------*/}
                        <div id="evolucao-testes" className="p-5 text-center">
                            <div className="font-weight-bold banner py-3 mt-5 mt-md-0">
                                <h1 className="banner">EVOLUÇÃO DOS TESTES</h1>
                            </div>
                            {/* Conteúdo */}
                            <div className="table-responsive">
                                <div className=" table-light table-striped m-0 text-start">
                                    {
                                        TabelasTestecase.map((tabela, index) => gerarTabelaTeste(tabela, index))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Fim do Corpo principal */}

                    {/* Recuo */}
                    <div className="p-5"></div>

                    {/* Rodapé */}
                    <div className="banner p-3">
                        <div id="assinatura" className="text-center">{assinatura}</div>
                    </div>
                    {/* Fim do Rodapé */}
                </IonContent>
            </IonPage>
        </PDFExport>
    );

    return pagina;
};

export default Det;

const testeConteudo = `
Aplicação Java para rotina diária batch com a finalidade de consultar a tabela EVENTOS_WEB e dela preencher as tabelas temporárias e encaminhar mensagem via Kafka ao Hub de Pagamentos
23/05/24 18:04:03
    THREAD: eventos-web-017
        LOGGER: br.com.ppware.ew017.App
            INFO : ******************************
            INFO : INICIANDO EVENTOS WEB 017
            INFO : ******************************
            INFO : Modo teste: Desativado
            INFO : Etapas:
            INFO : ******************************
            INFO : Carregando Variáveis do Ambiente
            INFO : Variáveis do Ambiente finalizadas
            INFO : Criando Unidade de Persistência
        LOGGER: org.hibernate.jpa.internal.util.LogHelper
            INFO : HHH000204: Processing PersistenceUnitInfo [
    name: eventosWeb017
    ...]
        LOGGER: org.hibernate.Version
            INFO : HHH000412: Hibernate Core {1.2-b4848}
        LOGGER: org.hibernate.cfg.Environment
            INFO : HHH000206: hibernate.properties not found
        LOGGER: org.hibernate.annotations.common.Version
            INFO : HCANN000001: Hibernate Commons Annotations {5.0.4.Final}
23/05/24 18:04:04
    THREAD: eventos-web-017
        LOGGER: org.hibernate.orm.connections.pooling
            WARN : HHH10001002: Using Hibernate built-in connection pool (not for production use!)
            INFO : HHH10001005: using driver [oracle.jdbc.driver.OracleDriver] at URL [jdbc:oracle:thin:@10.129.164.205:1521:CYB3DEV]
            INFO : HHH10001001: Connection properties: {user=rcvry, password=****, autocommit=false}
            INFO : HHH10001003: Autocommit mode: false
        LOGGER: org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl
            INFO : HHH000115: Hibernate connection pool size: 20 (min=1)
23/05/24 18:04:05
    THREAD: eventos-web-017
        LOGGER: org.hibernate.dialect.Dialect
            INFO : HHH000400: Using dialect: org.hibernate.dialect.Oracle10gDialect
        LOGGER: org.hibernate.type.BasicTypeRegistry
            INFO : HHH000270: Type registration [java.lang.Object] overrides previous : org.hibernate.type.ObjectType@7a3c0dc6
            INFO : HHH000270: Type registration [java.time.MonthDay] overrides previous : com.vladmihalcea.hibernate.type.basic.MonthDayDateType@379ee84e
            INFO : HHH000270: Type registration [java.time.YearMonth] overrides previous : com.vladmihalcea.hibernate.type.basic.YearMonthDateType@75038f62
            INFO : HHH000270: Type registration [java.time.YearMonth] overrides previous : com.vladmihalcea.hibernate.type.basic.YearMonthEpochType@2eb453b8
            INFO : HHH000270: Type registration [java.time.YearMonth] overrides previous : com.vladmihalcea.hibernate.type.basic.YearMonthIntegerType@781d9257
            INFO : HHH000270: Type registration [json] overrides previous : com.vladmihalcea.hibernate.type.json.JsonStringType@5ac214
23/05/24 18:04:06
    THREAD: eventos-web-017
        LOGGER: org.hibernate.orm.connections.access
            INFO : HHH10001501: Connection obtained from JdbcConnectionAccess [org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator$ConnectionProviderJdbcConnectionAccess@3fb64e65] for (non-JTA) DDL execution was not in auto-commit mode; the Connection 'local transaction' will be committed and the Connection will be set into auto-commit mode.
        LOGGER: br.com.ppware.ew017.App
            INFO : Unidade de Persistência pronta para uso
            INFO : ******************************
            INFO : Iniciando execução principal da aplicação
        LOGGER: org.hibernate.hql.internal.QueryTranslatorFactoryInitiator
            INFO : HHH000397: Using ASTQueryTranslatorFactory
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : JPQL = select eventoweb.EVID, eventoweb.EVACCT, eventoweb.EVACCTG, eventoweb.EVDTPROC, eventoweb.EVDTREG, eventoweb.EVDTSOLIC, eventoweb.EVEXPDESC, eventoweb.EVOBJ, eventoweb.EVSTATUS, eventoweb.EVTYPE from rcvry.EVENTOS_WEB eventoweb where eventoweb.EVTYPE='EV_BOLETO_HUBPGTO_CYBER' and eventoweb.EVSTATUS=1
        LOGGER: br.com.ppware.ew017.App
            INFO : --- EVENTO ID 3000 GRUPO 1 CONTRATO 088999677651-BRM ------------------------------ START
            INFO : EventoWeb: EVID=3000, EVACCTG=1, EVACCT=088999677651-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"1","ds_paying_account_identification":"088999677651","ds_identification_document_invoice":"0018716815","ds_type_document_invoice":"3","ds_customer_document":"03269258054","am_reference":"202305","dt_due_date":"20230512","ds_creditcard_mask":"","ds_cardbrand_code":"","ds_cardbrand_name":"","nu_unique_payment":"","ds_order_code":"","ds_operator_transaction_id":"","ds_uuid_payment":"6408ece97a6bb6676db520a5","ds_operator_code":"","ds_operator_name":"","ds_installment":"","vl_installment_amount":"","ds_bank_code":"096","ds_bank_name":"Valentina Cardoso","vl_received_amount":"48,00","dt_payment_date":"20230511","ds_late_fee":"","ds_fundraising_method":"LOTERICA","ds_bar_code":"84650000000480005050000008899967760018716815","ds_uuid_payment_original":"","ds_payment_method":"CODIGO DE BARRAS","ds_bank_document":"00000000000191","ds_participant_category_code":"CL","ds_participant_code":"37172","dt_publish_date":"2023-05-10T10:10:10.000+0000","nu_agreement":1,"nu_installment_agreement":"1"}, EVDTREG=2023-05-11T13:13:13.131313, EVDTSOLIC=2023-05-11T13:13:13.133, EVDTPROC=2023-05-11T13:14:14.144, EVSTATUS=1, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 2
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=3000, EVACCTG=1, EVACCT=088999677651-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"1","ds_paying_account_identification":"088999677651","ds_identification_document_invoice":"0018716815","ds_type_document_invoice":"3","ds_customer_document":"03269258054","am_reference":"202305","dt_due_date":"20230512","ds_creditcard_mask":"","ds_cardbrand_code":"","ds_cardbrand_name":"","nu_unique_payment":"","ds_order_code":"","ds_operator_transaction_id":"","ds_uuid_payment":"6408ece97a6bb6676db520a5","ds_operator_code":"","ds_operator_name":"","ds_installment":"","vl_installment_amount":"","ds_bank_code":"096","ds_bank_name":"Valentina Cardoso","vl_received_amount":"48,00","dt_payment_date":"20230511","ds_late_fee":"","ds_fundraising_method":"LOTERICA","ds_bar_code":"84650000000480005050000008899967760018716815","ds_uuid_payment_original":"","ds_payment_method":"CODIGO DE BARRAS","ds_bank_document":"00000000000191","ds_participant_category_code":"CL","ds_participant_code":"37172","dt_publish_date":"2023-05-10T10:10:10.000+0000","nu_agreement":1,"nu_installment_agreement":"1"}, EVDTREG=2023-05-11T13:13:13.131313, EVDTSOLIC=2023-05-11T13:13:13.133, EVDTPROC=2023-05-11T13:14:14.144, EVSTATUS=2, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : Convertendo JSON em classe DTO (BoletoHubDTO)
            INFO : Conversão bem sucedida
            WARN : Contrato fora do padrão esperado: não inicia com '000'
            INFO : BoletoHubDTO: ds_event_type=1, ds_system=CYBER, ds_paying_account_identification=088999677651, ds_identification_document_invoice=0018716815, ds_type_document_invoice=3, ds_customer_document=03269258054, dt_due_date=1970-01-01, ds_uuid_payment=6408ece97a6bb6676db520a5, ds_bank_code=096, ds_bank_name=Valentina Cardoso, vl_received_amount=48.0, dt_payment_date=1970-01-01, ds_late_fee= , ds_fundraising_method=LOTERICA, ds_bar_code=84650000000480005050000008899967760018716815, ds_bank_document=00000000000191, ds_participant_category_code=CL, ds_participant_code=37172, ds_uuid_payment_original=, dt_publish_date=2023-05-10T10:10:10, ds_payment_method=CODIGO DE BARRAS, nu_agreement=1, nu_installment_agreement=1
            INFO : Validando tipo de envio do boleto
            WARN : O boleto possui tipo de envio diferente de 01
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 0
23/05/24 18:04:07
    THREAD: eventos-web-017
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=3000, EVACCTG=1, EVACCT=088999677651-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"1","ds_paying_account_identification":"088999677651","ds_identification_document_invoice":"0018716815","ds_type_document_invoice":"3","ds_customer_document":"03269258054","am_reference":"202305","dt_due_date":"20230512","ds_creditcard_mask":"","ds_cardbrand_code":"","ds_cardbrand_name":"","nu_unique_payment":"","ds_order_code":"","ds_operator_transaction_id":"","ds_uuid_payment":"6408ece97a6bb6676db520a5","ds_operator_code":"","ds_operator_name":"","ds_installment":"","vl_installment_amount":"","ds_bank_code":"096","ds_bank_name":"Valentina Cardoso","vl_received_amount":"48,00","dt_payment_date":"20230511","ds_late_fee":"","ds_fundraising_method":"LOTERICA","ds_bar_code":"84650000000480005050000008899967760018716815","ds_uuid_payment_original":"","ds_payment_method":"CODIGO DE BARRAS","ds_bank_document":"00000000000191","ds_participant_category_code":"CL","ds_participant_code":"37172","dt_publish_date":"2023-05-10T10:10:10.000+0000","nu_agreement":1,"nu_installment_agreement":"1"}, EVDTREG=2023-05-11T13:13:13.131313, EVDTSOLIC=2023-05-11T13:13:13.133, EVDTPROC=2023-05-11T13:14:14.144, EVSTATUS=0, EVEXPDESC=O boleto possui tipo de envio diferente de 01
        LOGGER: br.com.ppware.ew017.App
            WARN : --- EVENTO ID 3000 GRUPO 1 CONTRATO 088999677651-BRM ------------------------------ ERRO
            INFO : --- EVENTO ID -1214 GRUPO 1 CONTRATO 088999677651-BRM ------------------------------ START
            INFO : EventoWeb: EVID=-1214, EVACCTG=1, EVACCT=088999677651-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"1","ds_paying_account_identification":"088999677651","ds_identification_document_invoice":"0018716834","ds_type_document_invoice":"3","ds_customer_document":"03269258054","dt_due_date":"20230723","ds_uuid_payment":"1746546546014939330507999","ds_bank_code":"250","ds_bank_name":"Fernando Lima","vl_received_amount":"48,89","dt_payment_date":"20230723","ds_late_fee":"N","ds_fundraising_method":"LOTERICA","ds_bar_code":"84600000000488905050000008899967760018716834","ds_bank_document":"7292990495277","ds_participant_category_code":"4","ds_participant_code":"75703","ds_uuid_payment_original":"6173938260196020972742852","dt_publish_date":"20230723","ds_payment_method":"Manual","nu_agreement":"59072393","nu_installment_agreement":"2"}
, EVDTREG=2023-05-17T19:00, EVDTSOLIC=2023-05-17T19:00, EVDTPROC=null, EVSTATUS=1, EVEXPDESC=Text '20230723' could not be parsed at index 0
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 2
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=-1214, EVACCTG=1, EVACCT=088999677651-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"1","ds_paying_account_identification":"088999677651","ds_identification_document_invoice":"0018716834","ds_type_document_invoice":"3","ds_customer_document":"03269258054","dt_due_date":"20230723","ds_uuid_payment":"1746546546014939330507999","ds_bank_code":"250","ds_bank_name":"Fernando Lima","vl_received_amount":"48,89","dt_payment_date":"20230723","ds_late_fee":"N","ds_fundraising_method":"LOTERICA","ds_bar_code":"84600000000488905050000008899967760018716834","ds_bank_document":"7292990495277","ds_participant_category_code":"4","ds_participant_code":"75703","ds_uuid_payment_original":"6173938260196020972742852","dt_publish_date":"20230723","ds_payment_method":"Manual","nu_agreement":"59072393","nu_installment_agreement":"2"}
, EVDTREG=2023-05-17T19:00, EVDTSOLIC=2023-05-17T19:00, EVDTPROC=null, EVSTATUS=2, EVEXPDESC=Text '20230723' could not be parsed at index 0
        LOGGER: br.com.ppware.ew017.App
            INFO : Convertendo JSON em classe DTO (BoletoHubDTO)
java.time.format.DateTimeParseException: Text '20230723' could not be parsed at index 0
    at java.time.format.DateTimeFormatter.parseResolved0(DateTimeFormatter.java:1949)
    at java.time.format.DateTimeFormatter.parse(DateTimeFormatter.java:1851)
    at java.time.LocalDateTime.parse(LocalDateTime.java:492)
    at br.com.ppware.ew017.util.LocalDateTimeAdapter.deserialize(LocalDateTimeAdapter.java:28)
    at br.com.ppware.ew017.util.LocalDateTimeAdapter.deserialize(LocalDateTimeAdapter.java:15)
    at com.google.gson.internal.bind.TreeTypeAdapter.read(TreeTypeAdapter.java:76)
    at com.google.gson.internal.bind.ReflectiveTypeAdapterFactory$1.readIntoField(ReflectiveTypeAdapterFactory.java:212)
    at com.google.gson.internal.bind.ReflectiveTypeAdapterFactory$FieldReflectionAdapter.readField(ReflectiveTypeAdapterFactory.java:433)
    at com.google.gson.internal.bind.ReflectiveTypeAdapterFactory$Adapter.read(ReflectiveTypeAdapterFactory.java:393)
    at com.google.gson.Gson.fromJson(Gson.java:1227)
    at com.google.gson.Gson.fromJson(Gson.java:1137)
    at com.google.gson.Gson.fromJson(Gson.java:1047)
    at com.google.gson.Gson.fromJson(Gson.java:982)
    at br.com.ppware.ew017.App.processarEventosWeb(App.java:304)
    at java.util.ArrayList.forEach(ArrayList.java:1249)
    at br.com.ppware.ew017.App.main(App.java:98)
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 0
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=-1214, EVACCTG=1, EVACCT=088999677651-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"1","ds_paying_account_identification":"088999677651","ds_identification_document_invoice":"0018716834","ds_type_document_invoice":"3","ds_customer_document":"03269258054","dt_due_date":"20230723","ds_uuid_payment":"1746546546014939330507999","ds_bank_code":"250","ds_bank_name":"Fernando Lima","vl_received_amount":"48,89","dt_payment_date":"20230723","ds_late_fee":"N","ds_fundraising_method":"LOTERICA","ds_bar_code":"84600000000488905050000008899967760018716834","ds_bank_document":"7292990495277","ds_participant_category_code":"4","ds_participant_code":"75703","ds_uuid_payment_original":"6173938260196020972742852","dt_publish_date":"20230723","ds_payment_method":"Manual","nu_agreement":"59072393","nu_installment_agreement":"2"}
, EVDTREG=2023-05-17T19:00, EVDTSOLIC=2023-05-17T19:00, EVDTPROC=null, EVSTATUS=0, EVEXPDESC=Text '20230723' could not be parsed at index 0
        LOGGER: br.com.ppware.ew017.App
            WARN : Erro inesperado durante o processo: Text '20230723' could not be parsed at index 0
            WARN : --- EVENTO ID -1214 GRUPO 1 CONTRATO 088999677651-BRM ------------------------------ ERRO
            INFO : --- EVENTO ID 1561 GRUPO 1 CONTRATO 1611939056-BRM ------------------------------ START
            INFO : EventoWeb: EVID=1561, EVACCTG=1, EVACCT=1611939056-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0001611939056","ds_identification_document_invoice":"412954037510436","ds_type_document_invoice":"3","ds_customer_document":"21456778419","dt_due_date":"20230624","ds_uuid_payment":"400495163465506196040243","ds_bank_code":"513","ds_bank_name":"BANCO MAURÍCIO","vl_received_amount":"372171616,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"68122363713641944608355827818944067806011976","ds_bank_document":"30105134335900","ds_participant_category_code":"CL","ds_participant_code":"77575","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.443+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.463317, EVDTSOLIC=2023-05-24T17:56:07.463317, EVDTPROC=2023-05-24T17:56:07.462319, EVSTATUS=1, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 2
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1561, EVACCTG=1, EVACCT=1611939056-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0001611939056","ds_identification_document_invoice":"412954037510436","ds_type_document_invoice":"3","ds_customer_document":"21456778419","dt_due_date":"20230624","ds_uuid_payment":"400495163465506196040243","ds_bank_code":"513","ds_bank_name":"BANCO MAURÍCIO","vl_received_amount":"372171616,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"68122363713641944608355827818944067806011976","ds_bank_document":"30105134335900","ds_participant_category_code":"CL","ds_participant_code":"77575","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.443+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.463317, EVDTSOLIC=2023-05-24T17:56:07.463317, EVDTPROC=2023-05-24T17:56:07.462319, EVSTATUS=2, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : Convertendo JSON em classe DTO (BoletoHubDTO)
            INFO : Conversão bem sucedida
            INFO : Ajustando layout do contrato HUB para CYBER
            INFO : BoletoHubDTO: ds_event_type=01, ds_system=CYBER, ds_paying_account_identification=1611939056-BRM, ds_identification_document_invoice=412954037510436, ds_type_document_invoice=3, ds_customer_document=21456778419, dt_due_date=1970-01-01, ds_uuid_payment=400495163465506196040243, ds_bank_code=513, ds_bank_name=BANCO MAURÍCIO, vl_received_amount=3.72171616E8, dt_payment_date=1970-01-01, ds_late_fee=S, ds_fundraising_method=LOTERICA, ds_bar_code=68122363713641944608355827818944067806011976, ds_bank_document=30105134335900, ds_participant_category_code=CL, ds_participant_code=77575, ds_uuid_payment_original=, dt_publish_date=2023-05-24T17:56:07.443, ds_payment_method=PAGAMENTO MANUAL, nu_agreement=null, nu_installment_agreement=null
            INFO : Validando tipo de envio do boleto
            INFO : Validando campos obrigatórios
            INFO : Validações finalizadas sem erros
            INFO : Convertendo DTO em Entidade (TmpEntradaPagto)
            INFO : Conversão bem sucedida
            INFO : TmpEntradaPagto: PBID=null, PBACCT=1611939056-BRM, PBNOSSONUM=412954037510436, PBTPREG=3, PBSSNUM=21456778419, PBDTVENC=null, PBIDHUB=400495163465506196040243, PBBANKCOD=513, PBBANKNOME=BANCO MAURÍCIO, PBVLRPAGO=3.72171616E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=68122363713641944608355827818944067806011976, PBBANKDOC=30105134335900, PBCODCATPAR=CL, PBCODPAR=77575, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:07.443, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
            INFO : Persistindo Entidade na tabela TMP_ENTRADA_PAGTO
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Inserção realizada com sucesso
            INFO : TmpEntradaPagto: PBID=529, PBACCT=1611939056-BRM, PBNOSSONUM=412954037510436, PBTPREG=3, PBSSNUM=21456778419, PBDTVENC=null, PBIDHUB=400495163465506196040243, PBBANKCOD=513, PBBANKNOME=BANCO MAURÍCIO, PBVLRPAGO=3.72171616E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=68122363713641944608355827818944067806011976, PBBANKDOC=30105134335900, PBCODCATPAR=CL, PBCODPAR=77575, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:07.443, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 9
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1561, EVACCTG=1, EVACCT=1611939056-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0001611939056","ds_identification_document_invoice":"412954037510436","ds_type_document_invoice":"3","ds_customer_document":"21456778419","dt_due_date":"20230624","ds_uuid_payment":"400495163465506196040243","ds_bank_code":"513","ds_bank_name":"BANCO MAURÍCIO","vl_received_amount":"372171616,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"68122363713641944608355827818944067806011976","ds_bank_document":"30105134335900","ds_participant_category_code":"CL","ds_participant_code":"77575","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.443+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.463317, EVDTSOLIC=2023-05-24T17:56:07.463317, EVDTPROC=2023-05-24T17:56:07.462319, EVSTATUS=9, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : --- EVENTO ID 1561 GRUPO 1 CONTRATO 1611939056-BRM ------------------------------ SUCESSO
            INFO : --- EVENTO ID 1563 GRUPO 1 CONTRATO 2810452107-BRM ------------------------------ START
            INFO : EventoWeb: EVID=1563, EVACCTG=1, EVACCT=2810452107-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0002810452107","ds_identification_document_invoice":"633998785883081","ds_type_document_invoice":"3","ds_customer_document":"75057314471","dt_due_date":"20230624","ds_uuid_payment":"451697781298358323179136","ds_bank_code":"554","ds_bank_name":"BANCO ALBERTO","vl_received_amount":"643388672,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"44939905644005597256311683535230301558754595","ds_bank_document":"14698071488077","ds_participant_category_code":"CL","ds_participant_code":"81656","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.976+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.976084, EVDTSOLIC=2023-05-24T17:56:07.976084, EVDTPROC=2023-05-24T17:56:07.976084, EVSTATUS=1, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 2
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1563, EVACCTG=1, EVACCT=2810452107-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0002810452107","ds_identification_document_invoice":"633998785883081","ds_type_document_invoice":"3","ds_customer_document":"75057314471","dt_due_date":"20230624","ds_uuid_payment":"451697781298358323179136","ds_bank_code":"554","ds_bank_name":"BANCO ALBERTO","vl_received_amount":"643388672,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"44939905644005597256311683535230301558754595","ds_bank_document":"14698071488077","ds_participant_category_code":"CL","ds_participant_code":"81656","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.976+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.976084, EVDTSOLIC=2023-05-24T17:56:07.976084, EVDTPROC=2023-05-24T17:56:07.976084, EVSTATUS=2, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : Convertendo JSON em classe DTO (BoletoHubDTO)
            INFO : Conversão bem sucedida
            INFO : Ajustando layout do contrato HUB para CYBER
            INFO : BoletoHubDTO: ds_event_type=01, ds_system=CYBER, ds_paying_account_identification=2810452107-BRM, ds_identification_document_invoice=633998785883081, ds_type_document_invoice=3, ds_customer_document=75057314471, dt_due_date=1970-01-01, ds_uuid_payment=451697781298358323179136, ds_bank_code=554, ds_bank_name=BANCO ALBERTO, vl_received_amount=6.43388672E8, dt_payment_date=1970-01-01, ds_late_fee=S, ds_fundraising_method=LOTERICA, ds_bar_code=44939905644005597256311683535230301558754595, ds_bank_document=14698071488077, ds_participant_category_code=CL, ds_participant_code=81656, ds_uuid_payment_original=, dt_publish_date=2023-05-24T17:56:07.976, ds_payment_method=PAGAMENTO MANUAL, nu_agreement=null, nu_installment_agreement=null
            INFO : Validando tipo de envio do boleto
            INFO : Validando campos obrigatórios
            INFO : Validações finalizadas sem erros
            INFO : Convertendo DTO em Entidade (TmpEntradaPagto)
            INFO : Conversão bem sucedida
            INFO : TmpEntradaPagto: PBID=null, PBACCT=2810452107-BRM, PBNOSSONUM=633998785883081, PBTPREG=3, PBSSNUM=75057314471, PBDTVENC=null, PBIDHUB=451697781298358323179136, PBBANKCOD=554, PBBANKNOME=BANCO ALBERTO, PBVLRPAGO=6.43388672E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=44939905644005597256311683535230301558754595, PBBANKDOC=14698071488077, PBCODCATPAR=CL, PBCODPAR=81656, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:07.976, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
            INFO : Persistindo Entidade na tabela TMP_ENTRADA_PAGTO
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Inserção realizada com sucesso
            INFO : TmpEntradaPagto: PBID=530, PBACCT=2810452107-BRM, PBNOSSONUM=633998785883081, PBTPREG=3, PBSSNUM=75057314471, PBDTVENC=null, PBIDHUB=451697781298358323179136, PBBANKCOD=554, PBBANKNOME=BANCO ALBERTO, PBVLRPAGO=6.43388672E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=44939905644005597256311683535230301558754595, PBBANKDOC=14698071488077, PBCODCATPAR=CL, PBCODPAR=81656, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:07.976, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 9
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1563, EVACCTG=1, EVACCT=2810452107-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0002810452107","ds_identification_document_invoice":"633998785883081","ds_type_document_invoice":"3","ds_customer_document":"75057314471","dt_due_date":"20230624","ds_uuid_payment":"451697781298358323179136","ds_bank_code":"554","ds_bank_name":"BANCO ALBERTO","vl_received_amount":"643388672,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"44939905644005597256311683535230301558754595","ds_bank_document":"14698071488077","ds_participant_category_code":"CL","ds_participant_code":"81656","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.976+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.976084, EVDTSOLIC=2023-05-24T17:56:07.976084, EVDTPROC=2023-05-24T17:56:07.976084, EVSTATUS=9, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : --- EVENTO ID 1563 GRUPO 1 CONTRATO 2810452107-BRM ------------------------------ SUCESSO
            INFO : --- EVENTO ID 1565 GRUPO 1 CONTRATO 6877975302-BRM ------------------------------ START
            INFO : EventoWeb: EVID=1565, EVACCTG=1, EVACCT=6877975302-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0006877975302","ds_identification_document_invoice":"612165466195631","ds_type_document_invoice":"3","ds_customer_document":"89995820145","dt_due_date":"20230624","ds_uuid_payment":"736726289079412626967803","ds_bank_code":"865","ds_bank_name":"BANCO ISABELLE","vl_received_amount":"808290624,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"02689446637811275782200994910014618907754816","ds_bank_document":"15742259565797","ds_participant_category_code":"CL","ds_participant_code":"72557","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:08.333+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:08.333537, EVDTSOLIC=2023-05-24T17:56:08.333537, EVDTPROC=2023-05-24T17:56:08.333537, EVSTATUS=1, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 2
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1565, EVACCTG=1, EVACCT=6877975302-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0006877975302","ds_identification_document_invoice":"612165466195631","ds_type_document_invoice":"3","ds_customer_document":"89995820145","dt_due_date":"20230624","ds_uuid_payment":"736726289079412626967803","ds_bank_code":"865","ds_bank_name":"BANCO ISABELLE","vl_received_amount":"808290624,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"02689446637811275782200994910014618907754816","ds_bank_document":"15742259565797","ds_participant_category_code":"CL","ds_participant_code":"72557","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:08.333+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:08.333537, EVDTSOLIC=2023-05-24T17:56:08.333537, EVDTPROC=2023-05-24T17:56:08.333537, EVSTATUS=2, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : Convertendo JSON em classe DTO (BoletoHubDTO)
            INFO : Conversão bem sucedida
            INFO : Ajustando layout do contrato HUB para CYBER
            INFO : BoletoHubDTO: ds_event_type=01, ds_system=CYBER, ds_paying_account_identification=6877975302-BRM, ds_identification_document_invoice=612165466195631, ds_type_document_invoice=3, ds_customer_document=89995820145, dt_due_date=1970-01-01, ds_uuid_payment=736726289079412626967803, ds_bank_code=865, ds_bank_name=BANCO ISABELLE, vl_received_amount=8.08290624E8, dt_payment_date=1970-01-01, ds_late_fee=S, ds_fundraising_method=LOTERICA, ds_bar_code=02689446637811275782200994910014618907754816, ds_bank_document=15742259565797, ds_participant_category_code=CL, ds_participant_code=72557, ds_uuid_payment_original=, dt_publish_date=2023-05-24T17:56:08.333, ds_payment_method=PAGAMENTO MANUAL, nu_agreement=null, nu_installment_agreement=null
            INFO : Validando tipo de envio do boleto
            INFO : Validando campos obrigatórios
            INFO : Validações finalizadas sem erros
            INFO : Convertendo DTO em Entidade (TmpEntradaPagto)
            INFO : Conversão bem sucedida
            INFO : TmpEntradaPagto: PBID=null, PBACCT=6877975302-BRM, PBNOSSONUM=612165466195631, PBTPREG=3, PBSSNUM=89995820145, PBDTVENC=null, PBIDHUB=736726289079412626967803, PBBANKCOD=865, PBBANKNOME=BANCO ISABELLE, PBVLRPAGO=8.08290624E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=02689446637811275782200994910014618907754816, PBBANKDOC=15742259565797, PBCODCATPAR=CL, PBCODPAR=72557, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:08.333, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
            INFO : Persistindo Entidade na tabela TMP_ENTRADA_PAGTO
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Inserção realizada com sucesso
            INFO : TmpEntradaPagto: PBID=531, PBACCT=6877975302-BRM, PBNOSSONUM=612165466195631, PBTPREG=3, PBSSNUM=89995820145, PBDTVENC=null, PBIDHUB=736726289079412626967803, PBBANKCOD=865, PBBANKNOME=BANCO ISABELLE, PBVLRPAGO=8.08290624E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=02689446637811275782200994910014618907754816, PBBANKDOC=15742259565797, PBCODCATPAR=CL, PBCODPAR=72557, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:08.333, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 9
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1565, EVACCTG=1, EVACCT=6877975302-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0006877975302","ds_identification_document_invoice":"612165466195631","ds_type_document_invoice":"3","ds_customer_document":"89995820145","dt_due_date":"20230624","ds_uuid_payment":"736726289079412626967803","ds_bank_code":"865","ds_bank_name":"BANCO ISABELLE","vl_received_amount":"808290624,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"02689446637811275782200994910014618907754816","ds_bank_document":"15742259565797","ds_participant_category_code":"CL","ds_participant_code":"72557","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:08.333+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:08.333537, EVDTSOLIC=2023-05-24T17:56:08.333537, EVDTPROC=2023-05-24T17:56:08.333537, EVSTATUS=9, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : --- EVENTO ID 1565 GRUPO 1 CONTRATO 6877975302-BRM ------------------------------ SUCESSO
            INFO : --- EVENTO ID 1564 GRUPO 1 CONTRATO 8228774135-BRM ------------------------------ START
            INFO : EventoWeb: EVID=1564, EVACCTG=1, EVACCT=8228774135-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0008228774135","ds_identification_document_invoice":"839351150554116","ds_type_document_invoice":"3","ds_customer_document":"59423235262","dt_due_date":"20230624","ds_uuid_payment":"291446990816668032687928","ds_bank_code":"646","ds_bank_name":"BANCO MATHEUS","vl_received_amount":"540871104,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"45853023482969975492698896901413830830473911","ds_bank_document":"71517863349805","ds_participant_category_code":"CL","ds_participant_code":"56590","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:08.156+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:08.156955, EVDTSOLIC=2023-05-24T17:56:08.156955, EVDTPROC=2023-05-24T17:56:08.156955, EVSTATUS=1, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 2
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1564, EVACCTG=1, EVACCT=8228774135-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0008228774135","ds_identification_document_invoice":"839351150554116","ds_type_document_invoice":"3","ds_customer_document":"59423235262","dt_due_date":"20230624","ds_uuid_payment":"291446990816668032687928","ds_bank_code":"646","ds_bank_name":"BANCO MATHEUS","vl_received_amount":"540871104,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"45853023482969975492698896901413830830473911","ds_bank_document":"71517863349805","ds_participant_category_code":"CL","ds_participant_code":"56590","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:08.156+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:08.156955, EVDTSOLIC=2023-05-24T17:56:08.156955, EVDTPROC=2023-05-24T17:56:08.156955, EVSTATUS=2, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : Convertendo JSON em classe DTO (BoletoHubDTO)
            INFO : Conversão bem sucedida
            INFO : Ajustando layout do contrato HUB para CYBER
            INFO : BoletoHubDTO: ds_event_type=01, ds_system=CYBER, ds_paying_account_identification=8228774135-BRM, ds_identification_document_invoice=839351150554116, ds_type_document_invoice=3, ds_customer_document=59423235262, dt_due_date=1970-01-01, ds_uuid_payment=291446990816668032687928, ds_bank_code=646, ds_bank_name=BANCO MATHEUS, vl_received_amount=5.40871104E8, dt_payment_date=1970-01-01, ds_late_fee=S, ds_fundraising_method=LOTERICA, ds_bar_code=45853023482969975492698896901413830830473911, ds_bank_document=71517863349805, ds_participant_category_code=CL, ds_participant_code=56590, ds_uuid_payment_original=, dt_publish_date=2023-05-24T17:56:08.156, ds_payment_method=PAGAMENTO MANUAL, nu_agreement=null, nu_installment_agreement=null
            INFO : Validando tipo de envio do boleto
            INFO : Validando campos obrigatórios
            INFO : Validações finalizadas sem erros
            INFO : Convertendo DTO em Entidade (TmpEntradaPagto)
            INFO : Conversão bem sucedida
            INFO : TmpEntradaPagto: PBID=null, PBACCT=8228774135-BRM, PBNOSSONUM=839351150554116, PBTPREG=3, PBSSNUM=59423235262, PBDTVENC=null, PBIDHUB=291446990816668032687928, PBBANKCOD=646, PBBANKNOME=BANCO MATHEUS, PBVLRPAGO=5.40871104E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=45853023482969975492698896901413830830473911, PBBANKDOC=71517863349805, PBCODCATPAR=CL, PBCODPAR=56590, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:08.156, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
            INFO : Persistindo Entidade na tabela TMP_ENTRADA_PAGTO
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Inserção realizada com sucesso
            INFO : TmpEntradaPagto: PBID=532, PBACCT=8228774135-BRM, PBNOSSONUM=839351150554116, PBTPREG=3, PBSSNUM=59423235262, PBDTVENC=null, PBIDHUB=291446990816668032687928, PBBANKCOD=646, PBBANKNOME=BANCO MATHEUS, PBVLRPAGO=5.40871104E8, PBDTCREDIT=null, PBFLJURMUL=S, PBFORCAPT=LOTERICA, PBBARCODE=45853023482969975492698896901413830830473911, PBBANKDOC=71517863349805, PBCODCATPAR=CL, PBCODPAR=56590, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:08.156, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 9
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1564, EVACCTG=1, EVACCT=8228774135-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0008228774135","ds_identification_document_invoice":"839351150554116","ds_type_document_invoice":"3","ds_customer_document":"59423235262","dt_due_date":"20230624","ds_uuid_payment":"291446990816668032687928","ds_bank_code":"646","ds_bank_name":"BANCO MATHEUS","vl_received_amount":"540871104,00","dt_payment_date":"20230624","ds_late_fee":"S","ds_fundraising_method":"LOTERICA","ds_bar_code":"45853023482969975492698896901413830830473911","ds_bank_document":"71517863349805","ds_participant_category_code":"CL","ds_participant_code":"56590","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:08.156+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:08.156955, EVDTSOLIC=2023-05-24T17:56:08.156955, EVDTPROC=2023-05-24T17:56:08.156955, EVSTATUS=9, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : --- EVENTO ID 1564 GRUPO 1 CONTRATO 8228774135-BRM ------------------------------ SUCESSO
            INFO : --- EVENTO ID 1562 GRUPO 1 CONTRATO 9588571353-BRM ------------------------------ START
            INFO : EventoWeb: EVID=1562, EVACCTG=1, EVACCT=9588571353-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0009588571353","ds_identification_document_invoice":"074544086056617","ds_type_document_invoice":"3","ds_customer_document":"40953904204","dt_due_date":"20230624","ds_uuid_payment":"610343035054555250422483","ds_bank_code":"927","ds_bank_name":"BANCO JULIANA","vl_received_amount":"529825952,00","dt_payment_date":"20230624","ds_late_fee":"N","ds_fundraising_method":"LOTERICA","ds_bar_code":"63114131637644632923994823218785119942115269","ds_bank_document":"77946204910149","ds_participant_category_code":"CL","ds_participant_code":"82485","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.812+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.812211, EVDTSOLIC=2023-05-24T17:56:07.812211, EVDTPROC=2023-05-24T17:56:07.812211, EVSTATUS=1, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 2
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1562, EVACCTG=1, EVACCT=9588571353-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0009588571353","ds_identification_document_invoice":"074544086056617","ds_type_document_invoice":"3","ds_customer_document":"40953904204","dt_due_date":"20230624","ds_uuid_payment":"610343035054555250422483","ds_bank_code":"927","ds_bank_name":"BANCO JULIANA","vl_received_amount":"529825952,00","dt_payment_date":"20230624","ds_late_fee":"N","ds_fundraising_method":"LOTERICA","ds_bar_code":"63114131637644632923994823218785119942115269","ds_bank_document":"77946204910149","ds_participant_category_code":"CL","ds_participant_code":"82485","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.812+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.812211, EVDTSOLIC=2023-05-24T17:56:07.812211, EVDTPROC=2023-05-24T17:56:07.812211, EVSTATUS=2, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : Convertendo JSON em classe DTO (BoletoHubDTO)
            INFO : Conversão bem sucedida
            INFO : Ajustando layout do contrato HUB para CYBER
            INFO : BoletoHubDTO: ds_event_type=01, ds_system=CYBER, ds_paying_account_identification=9588571353-BRM, ds_identification_document_invoice=074544086056617, ds_type_document_invoice=3, ds_customer_document=40953904204, dt_due_date=1970-01-01, ds_uuid_payment=610343035054555250422483, ds_bank_code=927, ds_bank_name=BANCO JULIANA, vl_received_amount=5.29825952E8, dt_payment_date=1970-01-01, ds_late_fee=N, ds_fundraising_method=LOTERICA, ds_bar_code=63114131637644632923994823218785119942115269, ds_bank_document=77946204910149, ds_participant_category_code=CL, ds_participant_code=82485, ds_uuid_payment_original=, dt_publish_date=2023-05-24T17:56:07.812, ds_payment_method=PAGAMENTO MANUAL, nu_agreement=null, nu_installment_agreement=null
            INFO : Validando tipo de envio do boleto
            INFO : Validando campos obrigatórios
            INFO : Validações finalizadas sem erros
            INFO : Convertendo DTO em Entidade (TmpEntradaPagto)
            INFO : Conversão bem sucedida
            INFO : TmpEntradaPagto: PBID=null, PBACCT=9588571353-BRM, PBNOSSONUM=074544086056617, PBTPREG=3, PBSSNUM=40953904204, PBDTVENC=null, PBIDHUB=610343035054555250422483, PBBANKCOD=927, PBBANKNOME=BANCO JULIANA, PBVLRPAGO=5.29825952E8, PBDTCREDIT=null, PBFLJURMUL=N, PBFORCAPT=LOTERICA, PBBARCODE=63114131637644632923994823218785119942115269, PBBANKDOC=77946204910149, PBCODCATPAR=CL, PBCODPAR=82485, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:07.812, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
            INFO : Persistindo Entidade na tabela TMP_ENTRADA_PAGTO
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Inserção realizada com sucesso
            INFO : TmpEntradaPagto: PBID=533, PBACCT=9588571353-BRM, PBNOSSONUM=074544086056617, PBTPREG=3, PBSSNUM=40953904204, PBDTVENC=null, PBIDHUB=610343035054555250422483, PBBANKCOD=927, PBBANKNOME=BANCO JULIANA, PBVLRPAGO=5.29825952E8, PBDTCREDIT=null, PBFLJURMUL=N, PBFORCAPT=LOTERICA, PBBARCODE=63114131637644632923994823218785119942115269, PBBANKDOC=77946204910149, PBCODCATPAR=CL, PBCODPAR=82485, PBIDHUBORIG=, PBDTOCORR=2023-05-24T17:56:07.812, PBFORPGTO=PAGAMENTO MANUAL, PBAGR=null, PBPARC=null
        LOGGER: br.com.ppware.ew017.dao.EventosDAO
            INFO : Atualizando evento para status 9
        LOGGER: br.com.ppware.ew017.dao.BaseDAO
            INFO : Atualização realizada com sucesso
            INFO : EventoWeb: EVID=1562, EVACCTG=1, EVACCT=9588571353-BRM, EVTYPE=EV_BOLETO_HUBPGTO_CYBER, EVOBJ={"ds_event_type":"01","ds_system":"CYBER","ds_paying_account_identification":"0009588571353","ds_identification_document_invoice":"074544086056617","ds_type_document_invoice":"3","ds_customer_document":"40953904204","dt_due_date":"20230624","ds_uuid_payment":"610343035054555250422483","ds_bank_code":"927","ds_bank_name":"BANCO JULIANA","vl_received_amount":"529825952,00","dt_payment_date":"20230624","ds_late_fee":"N","ds_fundraising_method":"LOTERICA","ds_bar_code":"63114131637644632923994823218785119942115269","ds_bank_document":"77946204910149","ds_participant_category_code":"CL","ds_participant_code":"82485","ds_uuid_payment_original":"","dt_publish_date":"2023-05-24T17:56:07.812+0000","ds_payment_method":"PAGAMENTO MANUAL","nu_agreement":"","nu_installment_agreement":""}, EVDTREG=2023-05-24T17:56:07.812211, EVDTSOLIC=2023-05-24T17:56:07.812211, EVDTPROC=2023-05-24T17:56:07.812211, EVSTATUS=9, EVEXPDESC=null
        LOGGER: br.com.ppware.ew017.App
            INFO : --- EVENTO ID 1562 GRUPO 1 CONTRATO 9588571353-BRM ------------------------------ SUCESSO
            INFO : ******************************
            INFO : Total de acordos obtidos = 7
            INFO : 	 - GRUPO 1 CONTRATO 088999677651-BRM
            INFO : 	 - GRUPO 1 CONTRATO 088999677651-BRM
            INFO : 	 - GRUPO 1 CONTRATO 1611939056-BRM
            INFO : 	 - GRUPO 1 CONTRATO 2810452107-BRM
            INFO : 	 - GRUPO 1 CONTRATO 6877975302-BRM
            INFO : 	 - GRUPO 1 CONTRATO 8228774135-BRM
            INFO : 	 - GRUPO 1 CONTRATO 9588571353-BRM
            INFO : Total de parcelas processadas e enviadas com sucesso = 5
            INFO : 	 - GRUPO 1 CONTRATO 1611939056-BRM
            INFO : 	 - GRUPO 1 CONTRATO 2810452107-BRM
            INFO : 	 - GRUPO 1 CONTRATO 6877975302-BRM
            INFO : 	 - GRUPO 1 CONTRATO 8228774135-BRM
            INFO : 	 - GRUPO 1 CONTRATO 9588571353-BRM
            INFO : Processo finalizado - Encerrando recursos da aplicação...
        LOGGER: org.hibernate.orm.connections.pooling
            INFO : HHH10001008: Cleaning up connection pool [jdbc:oracle:thin:@10.129.164.205:1521:CYB3DEV]
        LOGGER: br.com.ppware.ew017.App
            INFO : Duração total: 3873 milissegundos
            INFO : ******************************
            INFO : ENCERRANDO EVENTOS WEB 017
            INFO : ******************************
`;


