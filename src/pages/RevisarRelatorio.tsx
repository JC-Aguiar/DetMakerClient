import { IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRow, IonTextarea, RadioGroupChangeEventDetail, TextareaChangeEventDetail, useIonViewWillEnter } from '@ionic/react';
import capaDet from '../resources/PPW_BACKGROUND_WHITE_01.png';
import { useDispatch, useSelector } from 'react-redux';
import { RelatorioHistoricoDTO } from '../data/RelatorioHistoricoDTO';
import { RootState } from '../Store/ReduxStore';
import { addRevisao, setDadosRevisao } from '../Store/Reducer/ReducerRevisao';
import { EvidenciaInfoDTO } from '../data/EvidenciaInfoDTO';
import './template/template.css';
import { alertCircle, checkmarkCircle, document, helpCircle, save } from 'ionicons/icons';
import { UserDTO } from '../data/UserDTO';
import { EvidenciaRevisadaDTO } from '../data/EvidenciaRevisadaDTO';
import * as axiosRequest from '../data/AxiosRequest';
import { ResumoEvidenciasRevisadasDTO } from '../data/AxiosRequest';
import { dataParaString, offsetDateTimeParaString } from '../App';
import { useHistory } from 'react-router';
import { layoutGrupoBotoes, ButtonLayoutProps } from '../components/Core/ButtonLayout';
import { addMensagem, atualizarMensagem } from '../Store/Reducer/ReducerAtividade';
import { useEffect, useState } from 'react';
import Carregando from '../components/Core/Carregando';
import { RelatorioComplementoDTO } from '../data/RelatorioComplementoDTO';


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


//Typo para determinar os possíveis status de uma Evidência
export type DetStatusTYPE = "Aprovado" | "Reprovado" | "Parcial";

//Interface contendo os campos de uma Evidência que podem ser revisados pelo usuário
interface UserRevisaoProps {
    id: number,
    resultado: string,
    revisor: string,
    comentario: string,
    pendente: boolean,
}

//Componente <RevisarRelatorio>
const RevisarRelatorio: React.FC = () => {
    //Atributos prinicpais
    const dispatch = useDispatch();
    const history = useHistory();

    const [isLoading, setLoading] = useState<boolean>(false);
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const relatorio: RelatorioHistoricoDTO | null = useSelector((state: RootState) => state.store.docRevisao.relatorio);
    const [mensagemErros, setMensagemErros] = useState<Map<number, string>>(new Map());
    const [inputProjetoId, setInputProjetoId] = useState<string>(
        relatorio?.idProjeto ? relatorio.idProjeto : ""
    );
    const [inputProjetoNome, setInputProjetoNome] = useState<string>(
        relatorio?.nomeProjeto ? relatorio.nomeProjeto : ""
    );
    const [inputAtividade, setInputAtividade] = useState<string>(
        relatorio?.nomeAtividade ? relatorio.nomeAtividade : ""
    );
    const [inputConsideracoes, setInputConsideracoes] = useState<string>(
        relatorio?.consideracoes ? relatorio.consideracoes : ""
    );
    const [inputRevisao, setInputRevisao] = useState<UserRevisaoProps[]>([]);
    const relatorioCompleto = relatorio !== null
            && relatorio.idProjeto !== null
            && relatorio.nomeProjeto !== null
            && relatorio.nomeAtividade !== null
            && relatorio.idProjeto.trim().length > 0
            && relatorio.nomeProjeto.trim().length > 0
            && relatorio.nomeAtividade.trim().length > 0;

    const validarInputsRevisao = (userRevisao: UserRevisaoProps) => {
        return userRevisao.resultado !== null
            && userRevisao.revisor !== null
            && userRevisao.resultado.trim().length > 0
            && userRevisao.revisor.trim().length > 0
            && userRevisao.resultado !== 'null'
            && userRevisao.revisor !== 'null'
    };

    /*
    const relatorioCompleto = (relatorio: RelatorioHistoricoDTO) => {
        return relatorio.idProjeto !== null
            && relatorio.nomeProjeto !== null
            && relatorio.nomeAtividade !== null
            && relatorio.idProjeto.trim().length > 0
            && relatorio.nomeProjeto.trim().length > 0
            && relatorio.nomeAtividade.trim().length > 0;
    }
    */

    //Atributos de botões
    const botaoSalvar: ButtonLayoutProps = {
        title: 'Salvar',
        icon: save,
        trigger: () => salvarRevisao(),
        disabled: false,
    };
    const botaoDET: ButtonLayoutProps = {
        title: 'DET',
        icon: document,
        trigger: () => gerarDet(),
        disabled: !podeGerarDet(), //isLoading(),
    };
    
    //Ações ao carregar esta página
    useIonViewWillEnter(() => {
        if (relatorio === null) {
            console.warn("O RelatorioHistoricoDTO no ReducerRelatorio está nulo. A página Evidência não poderá ser gerada.");
            history.push(axiosRequest.URL_PIPELINES);
            return;
        }
    }, []);

    //Açao automática caso alguma Evidência do Relatório seja atualizada 
    useEffect(() => {
        if (relatorio === null) return;
        const evidenciasInput = relatorio.evidencias.map(item => ({
            id: item.id,
            resultado: item.resultado,
            revisor: item.revisor,
            comentario: item.comentario,
            pendente: !EvidenciaInfoDTO.isEvidenciaPronta(item),
        }));
        setInputRevisao(evidenciasInput);
    }, [relatorio?.evidencias]);

    const resultadoStatus: DetStatusTYPE[] = ["Aprovado", "Reprovado", "Parcial"];

    if (!relatorio || !user) return <></>;

    //campos da sessão 'identificação' no DET
    const ticketSolicitacao = relatorio.ticket;
    const usuarioAcionador = relatorio.usuario;
    const idProjeto = relatorio.idProjeto;
    const nomeProjeto = relatorio.nomeProjeto;
    const nomeAtividade = relatorio.nomeAtividade;
    const consideracoes = relatorio.consideracoes;
    const testeTipo = relatorio.testeTipo;
    const cliente = relatorio.cliente;
    const nome = user.name;
    const cargo = "DEV";
    const empresa = "PPW";
    const email = user.email;
    const phone = "";
    const envolvidos = [relatorio.usuario]; 
    relatorio.evidencias.map(item => item.revisor).forEach(item => envolvidos.push(item));

    //Campos da sessão 'Detalhes do Fluxo'
    const pipeline = relatorio.pipeline;
    const descricao = relatorio.descricao;
    const comandoExec = relatorio.evidencias.map(ev => ev.comandoExec).join('\n');
    const inconformidades = relatorio.inconformidades !== null ? relatorio.inconformidades.split('\n') : [];
    const ambiente = relatorio.ambiente;

    const testcases = () => {
        if (!relatorio || !user) return [<></>];

        return relatorio.evidencias.map((evidencia, evIndex) => {
            const evidenciaId = evidencia.id;
            const nome = evidencia.job;
            const descricao = evidencia.jobDescricao;
            const sha256 = evidencia.sha256;
            const exitCode = evidencia.exitCode;
            const erroFatal = evidencia.erroFatal;
            const comentario = evidencia.comentario;
            const resultado = evidencia.resultado;
            const comandoExec = evidencia.comandoExec;
            const revisor = evidencia.revisor;
            const dataRevisao = dataParaString(evidencia.dataRevisao);
            const data = offsetDateTimeParaString(evidencia.dataFim);
            const queries = evidencia.queries;
            const tabelasNome = evidencia.queriesNome;
            const tabelasPreJob = evidencia.tabelasPreJob;
            const tabelasPosJob = evidencia.tabelasPosJob;
            const queriesInconformidade = evidencia.queriesInconformidade;
            const anexosTotais: JSX.Element[] = [];
            const camposRevisao = inputRevisao.find(item => item.id === evidenciaId);
            if (!camposRevisao) return [<></>];

            const pronto = validarInputsRevisao(camposRevisao);
            const logsConteudo: string[] = [];
            const logsNome: string[] = [];
            const cargasConteudo: string[] = [];
            const cargasNome: string[] = [];
            const saidasConteudo: string[] = [];
            const saidasNome: string[] = [];
            const anexosInconformidade: string[] = queriesInconformidade
                .filter(text => text !== null && text !== undefined && text !== "")
                .slice();

            evidencia.logs.forEach((anexo) => {
                if (anexo.inconformidade) {
                    anexosInconformidade.push(`Coleta do log ${anexo.mascara}: ${anexo.inconformidade}`);
                    return;
                }
                logsConteudo.push(anexo.conteudo);
                logsNome.push(anexo.nome);
            });
            evidencia.cargas.forEach((anexo) => {
                if (anexo.inconformidade) {
                    anexosInconformidade.push(`Envio da carga ${anexo.mascara}: ${anexo.inconformidade}`);
                    return;
                }
                cargasConteudo.push(anexo.conteudo);
                cargasNome.push(anexo.nome); 
            });
            evidencia.saidas.forEach((anexo) => {
                if(anexo.inconformidade !== null && anexo.inconformidade !== "") {
                    anexosInconformidade.push(`Coleta da remessa ${anexo.mascara}: ${anexo.inconformidade}`);
                    return;
                };
                if(anexo.nome === null || anexo.nome === "") return;
                saidasConteudo.push(anexo.conteudo);
                saidasNome.push(anexo.nome);
            });

            //Preenchendo anexos de tabelas por query
            queries.forEach((query, index) => {
                const nomePreJob = `Tabela antes` + '\n';
                const nomePosJob = `Tabela depois` + '\n';
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

            const setResultado = (evId: number, e: CustomEvent<RadioGroupChangeEventDetail<any>>) => { 
                const novosInputs = inputRevisao.slice();
                const ev = novosInputs.find(item => item.id === evId);
                if(!ev) return;
                ev.resultado = e.detail.value;
                ev.revisor = user.name;

                setInputRevisao(novosInputs);
                //dispatch(setTestcaseResultado(revisao));
            };

            const setComentario = (evId: number, e: CustomEvent<TextareaChangeEventDetail>) => { 
                if (!e.detail.value) return;
                setInputRevisao(revisao => {
                    const ev = revisao.find(item => item.id === evId);
                    if(!ev || !e.detail.value) return revisao;

                    ev.comentario = e.detail.value;
                    return revisao;
                });
                //setTestcaseExpectativa({ index: evIndex, valor: e.detail.value })
            };

            return (
                <div className='table-responsive p-0 m-0' key={evIndex}>
                    <IonGrid className='ion-align-items-center pt-3 pb-0'>
                        <IonRow>
                            <h1 className='me-2 badge bg-primary h5 fs-5'>{evIndex+1}</h1>
                            <span id={`${evidenciaId}`} className='h3'>{nome}</span>
                            {iconCampoObrigatorio(pronto ? "sim" : "")}
                        </IonRow>
                    </IonGrid>
                    <table className='table table-light table-striped p-0 m-0 mb-5 text-start'>
                        <tbody>
                            <tr>
                                <th>Evidência ID</th>
                                <td>{evidenciaId}</td>
                            </tr>
                            <tr>
                                <th>Descrição do Job</th>
                                <td>{descricao}</td>
                            </tr>
                            <tr>
                                <th>Comando de Execução</th>
                                <td>{comandoExec}</td>
                            </tr>
                            <tr>
                                <th>Sha256</th>
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
                                <th>Inconformidades</th>
                                <td>
                                    <span hidden={anexosInconformidade.length > 0}>Nenhuma</span>
                                    <ol className="m-0 p-0" 
                                        style={{ width: "100%", maxWidth: "950px" }} 
                                        hidden={anexosInconformidade.length === 0}
                                    >
                                    { 
                                        anexosInconformidade
                                            .filter(linha => linha !== null && linha.length > 0)
                                            .map((linha, linhaIndex) => <li key={linhaIndex} className='ms-3'>{linha}</li>) 
                                    }
                                    </ol>
                                </td>
                            </tr>
                            <tr>
                                <th>Erro Fatal no Job</th>
                                <td>{erroFatal === null || erroFatal === "" ? "Não" : erroFatal}</td>
                            </tr>
                            <tr>
                                <th>
                                    <IonGrid>
                                        <IonRow className='ion-align-items-center'>
                                            <IonCol className='p-0 m-0'>Resultado Obtido</IonCol>
                                            <IonCol className='p-0 m-0' size='auto' hidden={!camposRevisao.pendente}>
                                                {iconCampoObrigatorio(camposRevisao.resultado)}
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </th>
                                <td>
                                    <IonRadioGroup 
                                        value={camposRevisao.resultado} 
                                        onIonChange={e => setResultado(evidenciaId, e)}
                                        hidden={!camposRevisao.pendente} 
                                    >
                                        <div className='d-flex justify-items-center'>
                                        {
                                            resultadoStatus.map((item, index) => {
                                                return ( 
                                                    <IonItem key={index} 
                                                        lines='none' 
                                                        className='bg-info bg-opacity-25 rounded rounded-4 m-1 my-2'
                                                    >
                                                        <IonLabel color='primary' className='p-0 m-0'>
                                                            {item}
                                                        </IonLabel>
                                                        <IonRadio color='primary' className='p-0 m-1' slot="start" value={item} />
                                                    </IonItem>
                                                );
                                            })
                                        }
                                        </div>
                                    </IonRadioGroup>
                                    <div className='mt-1' hidden={camposRevisao.pendente}>
                                        {resultado}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <IonGrid>
                                        <IonRow className='ion-align-items-center'>
                                            <IonCol className='p-0 m-0'>Revisor</IonCol>
                                            <IonCol className='p-0 m-0' size='auto' hidden={!camposRevisao.pendente}>
                                                {iconCampoObrigatorio(camposRevisao.revisor)}
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </th>
                                <td className='align-middle h6'>
                                    <span className='text-primary' hidden={!camposRevisao.pendente}>
                                        {camposRevisao.revisor}
                                    </span>
                                    <span className='text-dark' hidden={camposRevisao.pendente}>
                                        {revisor} - {dataRevisao}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <IonGrid>
                                        <IonRow className='ion-align-items-center'>
                                            <IonCol className='p-0 m-0'>Notas do Revisor</IonCol>
                                            <IonCol className='p-0 m-0' size='auto' hidden={!camposRevisao.pendente}>
                                                {iconCampoFacultativo(camposRevisao.comentario)}
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </th>
                                <td>
                                    <IonTextarea inputmode='text'
                                        maxlength={280}
                                        className='text-dark bg-white ps-2 mb-2 rounded rounded-3 border'
                                        value={camposRevisao.comentario}
                                        hidden={!camposRevisao.pendente}
                                        onIonChange={e => setComentario(evidenciaId, e)}
                                    />
                                    <div hidden={camposRevisao.pendente}>
                                        {comentario}
                                    </div>
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

    const iconCampoObrigatorio = (texto: string | null) => {
        const valido = (texto && texto.length > 0);
        const status = valido ? checkmarkCircle : alertCircle;
        const opacity = valido ? 'opacity-50' : 'opacity-75';
        return <IonIcon icon={status} size='large' color={valido ? 'primary' : 'warning'} className={opacity} />
    }

    const iconCampoFacultativo = (texto: string | null) => {
        const status = (texto && texto.length > 0) ? checkmarkCircle : helpCircle;
        return <IonIcon icon={status} size='large' color='primary' className='opacity-50' />
    }

    const gerarEstatisticas = (): JSX.Element => {
        if (!relatorio) return <></>;

        let pendentes = 0;
        let aprovados = 0;
        let reprovados = 0;
        let parciais = 0;
        relatorio.evidencias.forEach((teste, index) => {
            if (teste.resultado === "Reprovado") reprovados++;
            else if (teste.resultado === "Parcial") parciais++;
            else if (teste.resultado === "Aprovado") aprovados++;
            else pendentes++;
        });
        let aprovadosPorcent = Math.round((aprovados * 100) / relatorio.evidencias.length);
        let reprovadosPorcent = Math.round((reprovados * 100) / relatorio.evidencias.length);
        let parciaisPorcent = Math.round((parciais * 100) / relatorio.evidencias.length);
        let pendentesPorcent = Math.round((pendentes * 100) / relatorio.evidencias.length);

        const elementos: { valor: string, cor: string }[] = [];
        if (aprovados > 0)
            elementos.push({ valor: `Jobs Aprovados: ${aprovados} (${aprovadosPorcent}%)`, cor: 'bg-primary' });
        if (parciais > 0)
            elementos.push({ valor: `Jobs Parciais: ${parciais} (${parciaisPorcent}%)`, cor: 'bg-info text-secondary' });
        if (reprovados > 0)
            elementos.push({ valor: `Jobs Reprovados: ${reprovados} (${reprovadosPorcent}%)`, cor: 'bg-warning' });
        if (pendentes > 0)
            elementos.push({ valor: `Jobs Pendentes: ${pendentes} (${pendentesPorcent}%)`, cor: 'bg-secondary' });

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
            console.warn("Nenhum Relatório disponível para revisão!");
            return;
        };
        atualizarComplementoRelatorio();
        
        const data = new Date();
        const mensagemId = `Save_Review@${data.getTime()}`;
        if (inputRevisao.filter(item => item.pendente).length < 1) {
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `O Relatório já consta 100% revisado.`,
                status: 'INFO'
            }));
            return;
        }
        const evidenciasParaSalvar: EvidenciaRevisadaDTO[] = inputRevisao
            .filter(item => item.pendente)
            .filter(item => validarInputsRevisao(item))
            .map(item => ({
                evidenciaId: item.id,
                resivor: item.revisor,
                dataRevisao: data,
                comentario: item.comentario,
                resultado: item.resultado,
            }));
        console.log(`[REVISAR-RELATORIO]: IDs das Evidências revisadas para salvar: ` + evidenciasParaSalvar.map((item) => item.evidenciaId));
        console.log(`[REVISAR-RELATORIO]: Total de Evidências revisadas para salvar: ` + evidenciasParaSalvar.length);

        if (evidenciasParaSalvar.length === 0) {
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `O Relatório não possui revisões a serem salvas no banco...`,
                status: 'ERROR'
            }));
            return;
        }
        try {
            setLoading(true);
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `Relatório ID ${relatorio.id}: Salvando ${evidenciasParaSalvar.length} Evidência(s) no banco.`,
                status: 'INFO'
            }));
            const resultadoRevisao: ResumoEvidenciasRevisadasDTO = await axiosRequest.saveRevisaoEvidencia(evidenciasParaSalvar);
            const revisaoErros = new Map<number, string>();
            for (let key in resultadoRevisao.failed) {
                if(!resultadoRevisao.failed.hasOwnProperty(key)) continue;
                const id = parseInt(key);
                const erro = resultadoRevisao.failed[key];
                revisaoErros.set(id, erro);
                console.warn(id + ": " + erro);
            }
            setMensagemErros(revisaoErros);
            
            const revisaoSucesso: EvidenciaRevisadaDTO[] = [];
            resultadoRevisao.saved
                .map(id => evidenciasParaSalvar.find(item => item.evidenciaId === id))
                .filter(evSalva => evSalva !== undefined)
                .forEach(evSalva => evSalva ? revisaoSucesso.push(evSalva) : null);
            dispatch(setDadosRevisao(revisaoSucesso));

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
        finally {
            setLoading(false);
        }    
    };

    const atualizarComplementoRelatorio = async () => {
        const mensagemId = `Save_Review@${Date.now()}`;
        if (relatorioCompleto) return;

        const complementoValido = inputProjetoId.trim().length > 0 
            && inputProjetoNome.trim().length > 0
            && inputAtividade.trim().length > 0;
        if (!complementoValido) {
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `A identificação do Relatório possui campos pendente.`,
                status: 'ERROR'
            }));
            return;
        }
        const complemento: RelatorioComplementoDTO = {
            id: relatorio.id,
            idProjeto: inputProjetoId,
            nomeProjeto: inputProjetoNome,
            nomeAtividade: inputAtividade,
            consideracoes: inputConsideracoes,
        };
        try {
            setLoading(true);
            const relatorioAtualizado = await axiosRequest.saveRevisaoRelatorio(complemento);
            dispatch(addRevisao(relatorioAtualizado));
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Relatório ID ${relatorio.id} atualizado.`,
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
        finally {
            setLoading(false);
        }
    };

    const gerarDet = async () => {
        //TODO: melhorar!
        if (!relatorio) {
            console.warn("ERRO: Nenhum Relatório para Revisão selecionado!");
            return;
        }
        if (!user) {
            console.warn("ERRO: Usuário não definido!");
            return;
        };
        setLoading(true);
        const mensagemId = `Get_DET@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Obtendo DET ID ${relatorio.id}.`,
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
            abrirDet(fileBlob);
        }
        catch (error) {
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

    function abrirDet(fileBlob: Blob) {
        //TODO: >>> MOVER PARA UM OUTRO ESCOPO/CLASSE  <<<
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
    }

    function podeGerarDet(): boolean {
        if (!relatorio) return false;
        const totalEvProntas = relatorio.evidencias.filter(EvidenciaInfoDTO.isEvidenciaPronta).length;
        //const relatorioPreenchido = relatorioCompleto(relatorio);
        return relatorio.evidencias.length === totalEvProntas && relatorioCompleto;
    }

    //Renderização do componente
    if (isLoading) return <Carregando />
    return (
        <>
            {layoutGrupoBotoes([ botaoSalvar, botaoDET ])}
            
            {/* Corpo principal */}
            <div className="container card justify-content-center bg-white px-0 pb-5">
    
                {/*-----[PARTE 1: CAPA]--------------------------------------------------------------*/}
                <div className="card border border-0 m-0 p-0" id="capa">
                    <img src={capaDet} className="card-img" alt="Imagem"/>
                    <div className="row align-items-center card-img-overlay text-center">
                        <div className='row align-items-center'>
                            <div className="h1 mx-3 destaque text-primary">DET</div>
                            <div className="h3 mx-3 text-primary">Documento de Evidência e Testes</div>
                            <div className="h3 mx-3 text-primary">{inputAtividade}</div>
                        </div>
                    </div>
                </div>

                {/*-----[PARTE 2.a: PROJETO]--------------------------------------------------*/}
                <div id='envolvidos' className='p-5 pt-0 text-center'>
                    <div className='card'>
                        <div className="font-weight-bold banner py-3 mt-5 mt-md-0 rounded-top">
                            <h1 className="h1">
                                IDENTIFICAÇÃO
                            </h1>
                        </div>
                        <div className="table-responsive m-0 p-0">
                            <table className="table table-light table-striped text-start m-0 p-0">
                                <tbody>
                                    <tr>
                                        <th>
                                            <IonRow className='ion-align-items-center'>
                                                <IonCol className='p-0 m-0'>Projeto</IonCol>
                                                <IonCol className='p-0 m-0' size='auto' hidden={relatorioCompleto}>
                                                    {
                                                        inputProjetoId !== null && inputProjetoId.length === 0
                                                            ? iconCampoObrigatorio(inputProjetoId)
                                                            : iconCampoObrigatorio(inputProjetoNome)
                                                    }
                                                </IonCol>
                                            </IonRow>
                                        </th>
                                        <td>
                                            <IonLabel className='d-flex ion-align-items-center'>
                                                <span className='pe-2'>ID: {idProjeto}</span>
                                                <IonInput
                                                    className='card py-0 my-0 lh-1'
                                                    type='text'
                                                    style={{ maxWidth: '92px' }}
                                                    inputmode='text'
                                                    maxlength={7}
                                                    value={inputProjetoId}
                                                    onIonChange={e => {
                                                        const novoid = e.detail.value; 
                                                        setInputProjetoId(novoid ? novoid : "");
                                                    }}
                                                    hidden={relatorioCompleto}
                                                />
                                                <span className='ps-4 pe-2'>Nome: {nomeProjeto}</span>
                                                <IonInput
                                                    className='card py-0 my-0 lh-1 '
                                                    type='text'
                                                    inputmode='text'
                                                    maxlength={200}
                                                    value={inputProjetoNome}
                                                    onIonChange={e => {
                                                        const novonome = e.detail.value; 
                                                        setInputProjetoNome(novonome ? novonome : "");
                                                    }}
                                                    hidden={relatorioCompleto}
                                                />
                                            </IonLabel>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <IonRow className='ion-align-items-center'>
                                                <IonCol className='p-0 m-0'>Atividade</IonCol>
                                                <IonCol className='p-0 m-0' size='auto' hidden={relatorioCompleto}>
                                                    {iconCampoObrigatorio(inputAtividade)}
                                                </IonCol>
                                            </IonRow>
                                        </th>
                                        <td className=''>
                                            <IonLabel className='d-flex ion-align-items-center'>
                                                <span className='pe-2'>Nome: {nomeAtividade}</span>
                                                <IonInput
                                                    className='card py-0 my-0 lh-1 '
                                                    type='text'
                                                    inputmode='text'
                                                    maxlength={300}
                                                    value={inputAtividade}
                                                    onIonChange={e => {
                                                        const novatividade = e.detail.value; 
                                                        setInputAtividade(novatividade ? novatividade : "");
                                                    }}
                                                    hidden={relatorioCompleto}
                                                />
                                            </IonLabel>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Tipo de Teste</th>
                                        <td className='align-middle'>Teste {testeTipo}</td>
                                    </tr>
                                    <tr>
                                        <th>Ambiente</th>
                                        <td className='align-middle'>{cliente} - {ambiente}</td>
                                    </tr>
                                    
                                    <tr>
                                        <th>
                                            <IonRow className='ion-align-items-center'>
                                                <IonCol className='p-0 m-0'>Considerações</IonCol>
                                                <IonCol className='p-0 m-0' size='auto' hidden={relatorioCompleto}>
                                                    {iconCampoFacultativo(inputConsideracoes)}
                                                </IonCol>
                                            </IonRow>
                                        </th>
                                        <td>
                                            {consideracoes}
                                            <IonTextarea
                                                value={inputConsideracoes} 
                                                inputmode='text'
                                                maxlength={500}
                                                className='text-dark bg-white ps-2 mb-0 rounded rounded-3 border'
                                                onIonChange={e => {
                                                    const texto = e.detail.value; 
                                                    setInputConsideracoes(texto ? texto : "");
                                                }}
                                                hidden={relatorioCompleto}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/*-----[PARTE 2.b: ENVOLVIDOS]--------------------------------------------------*/}
                <div id='envolvidos' className='p-5 text-center'>
                    <div className='card'>
                        <div className="font-weight-bold banner py-3 mt-5 mt-md-0 rounded-top">
                            <h1 className="h1">
                                ENVOLVIDOS
                            </h1>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-light table-striped m-0">
                                <tbody>
                                    <tr className='align-middle'>
                                        <th>Nome</th>
                                        <th>Papel</th>
                                        <th>Empresa</th>
                                        <th>E-mail</th>
                                        <th>Telefone</th>
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

                {/*-----[PARTE 3: DETALHES DO FLUXO]--------------------------------------------------*/}
                <div id="detalhamento" className="p-5 text-center">
                    <div className="card">
                        <div className="font-weight-bold banner py-3 mt-5 mt-md-0 rounded-top">
                            <h1 id="detalhamento-titulo" className="h1">
                                DETALHES DO FLUXO
                            </h1>
                        </div>
                        {/* Conteúdo */}
                        <div className="table-responsive m-0 p-0">
                            <table className="table table-light table-striped text-start m-0 p-0">
                                <tbody>
                                    <tr>
                                        <th>Nome</th>
                                        <td id="nome">{pipeline}</td>
                                    </tr>
                                    <tr>
                                        <th>Descrição</th>
                                        <td id="descricao">{descricao}</td>
                                    </tr>
                                    <tr>
                                        <th>Ticket da Execução</th>
                                        <td id="ticket">{ticketSolicitacao}</td>
                                    </tr>
                                    <tr>
                                        <th>Acionador</th>
                                        <td id="acionador">{usuarioAcionador}</td>
                                    </tr>
                                    <tr>
                                        <th>Comandos Executados</th>
                                        <td id="comandos">
                                            {
                                                comandoExec?.split("\n").map((item, index) =>
                                                    <p key={index} className='my-0' >{item}</p>
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Erro Fatal na Execução</th>
                                        <td id="erroFatal">{relatorio.erroFatal ? "Sim" : "Não"}</td>
                                    </tr>
                                    <tr>
                                        <th>Inconformidades nos Jobs</th>
                                        <td id="inconformidades">
                                            <div>{inconformidades === null ? "0" : inconformidades.length }</div>
                                            <ol hidden={inconformidades === null || inconformidades.length === 0}>
                                            {
                                                inconformidades.map(
                                                    (info, index) => <li key={index}>{info}</li> 
                                                )
                                            }
                                            </ol>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Estatística dos Jobs</th>
                                        <td id="estatistica">{gerarEstatisticas()}</td>
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
                            <div className=" table-light table-striped">
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
