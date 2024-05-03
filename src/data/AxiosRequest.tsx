import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { PipelineInfoDTO } from './PIpelineInfoDTO';
import { PipelineExecDTO } from './PipelineExecDTO';
import { ComandoSQL } from './ComandoSQL';
import { RelatorioHistoricoDTO } from './RelatorioHistoricoDTO';
import { JwtDTO } from './JwtDTO';
import { UserDTO } from './UserDTO';
import { EvidenciaRevisadaDTO } from './EvidenciaRevisadaDTO';
import { RelatorioRevisadoDTO } from './RelatorioRevisadoDTO';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_PROFILE_INFO, GOOGLE_REDIRECT_URI, GOOGLE_TOKEN_URL } from '../config/OAuth2';
import { JobInfoDTO } from './JobInfoDTO';
import { RelatorioResumoDTO } from './RelatorioResumoDTO';
import { ClienteInfoDTO } from './ClienteInfoDTO';
import { QueryInfoDTO } from './QueryInfoDTO';
import { MassaTabelaDTO } from './MassaTabelaDTO';
import { MassaPreparada } from './MassaPreparada';

const EM_TESTE = true;

//URLs do servidor
export const SERVER_URL = 'localhost:8080'; //window.location.origin;
export const SERVER_URL_DEV = 'localhost:1990';
export const SERVER_CONTEXT_PATH = '/det-maker-server';
export const SERVER_CONTEXT_PATH_DEV = '';
export const REQUEST_URL = EM_TESTE ? 
    `http://${SERVER_URL_DEV}${SERVER_CONTEXT_PATH_DEV}` : 
    `http://${SERVER_URL}${SERVER_CONTEXT_PATH}`;

//URLs do cliente
export const CLIENT_URL = 'localhost:8080'; //'172.31.10.17';
export const CLIENT_URL_DEV = 'localhost:3000';
//export const CLIENT_CONTEXT_PATH = '/det-maker-client';
export const URL_CLIENTES = `/clients`;
export const URL_PIPELINES = `/pipelines`;
export const URL_RELATORIOS = `/reports`;
export const URL_DET = `/evidence`;
export const URL_LOGIN = `/login`;

//Headers para requisições ao backend do Det-Maker
const headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": `${REQUEST_URL}/*`,
    "Access-Control-Allow-Methods": "POST, GET",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "60000",
}

//Padrão de exibição das mensagens
function logInfo(titulo: string, mensagem: string) {
    console.info(`[${titulo}]: ${mensagem}`);
}
function logErro(titulo: string, mensagem: string) {
    console.error(`[${titulo}]: ${mensagem}`);
} 

//Validadores do status da resposta
export function responseCheck(response: Response) {
    if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
    }
}
export function statusCheck(status: number) {
    if (status < 200 || status >= 300) {
        throw new Error(`Status ${status}`);
    }
}

//Padrão de exibição de mensagem ao iniciar requisição
export function requestStart(titulo: string) {
    const mensagemInicio = "Em execução...";
    logInfo(titulo, mensagemInicio);
    
}

//Padrão de exibição de mensagem em caso da resposta ser positiva
export function requestSucesso(titulo: string, obj: any) {
    const mensagemSucesso = `Processo realizado com sucesso!`;
    const json = JSON.stringify(obj, null, 2);
    logInfo(titulo, mensagemSucesso + '\n' + json);
}

//Padrão de exibição de mensagem em caso da resposta ser negativa
export function requestErro(titulo: string, axiosError: AxiosError): string {
    let mensagemErro = "";
    //O servidor respondeu com um status diferente de 2xx
    if (axiosError.response) {
        mensagemErro = `Sem sucesso (status ${axiosError.response.status}). `
            + `${axiosError.response.data}.`;
    }
    else if (axiosError.request) {
        mensagemErro = "Falha de conexão. Sem resposta do servidor.";
    }
    else {
        mensagemErro = `Erro ao fazer a requisição. ${axiosError.message}.`;
    }
    logErro(titulo, mensagemErro);
    return mensagemErro;
}

//Obtendo access token JWT da Google com base no código regado via autenticação AOuth2
export async function getAccessToken(code: string): Promise<JwtDTO> {
    const titulo = "GET ACEESS TOKEN";
    requestStart(titulo);

    const data = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI, //'http://localhost:1990/det-maker-client/login',
        grant_type: 'authorization_code',
    };

    return await axios
        .post(GOOGLE_TOKEN_URL, data)
        .then((response) => {
            requestSucesso(titulo, response.data);
            return response.data;
        })
        .catch((erro) => {
            throw requestErro(titulo, erro);
        });
}

//Obtendo dados do usuário Google, usando tokende acesso JWT
export async function getUserInfo(accessToken: string): Promise<UserDTO> {
    const titulo = "GET PROFILE PHOTO";
    requestStart(titulo);

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    return await axios
        .get(GOOGLE_PROFILE_INFO, { headers: headers })
        .then((response) => {
            requestSucesso(titulo, response.data);
            return response.data;
        })
        .catch((erro) => {
            throw requestErro(titulo, erro);
        });
}

//Requisição para obter todos os Pipelines no banco
export async function getAllClientes(): Promise<ClienteInfoDTO[]> {
    const titulo = "OBTENDO CLIENTES";
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/cliente`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: ClienteInfoDTO[] = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para abrir planilha Schedule
export async function openSchedule(ambienteId: number, arquivoXlsx: File): Promise<JobInfoDTO[]> {
    const titulo = "ABRIR SCHEDULE";
    requestStart(titulo);

//Configurando requisição
    const headersXlsx: AxiosRequestHeaders = {
        "Access-Control-Allow-Origin": `${REQUEST_URL}/*`,
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "60000",
    }
    //Anexando arquivo
    let data: FormData = new FormData();
    let blob = new File([arquivoXlsx], `${arquivoXlsx.name}`, {
        type: "multipart/form-data"
    });
    data.append('file', blob);

    throw "Falta desenvolver a coleta do nome da planilha";
    const planilhaNome = "TODO"; //TODO!

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/job/ambiente/${ambienteId}/read/xlsx/planilha/${planilhaNome}`,
        headers: headersXlsx,
        timeout: 30000,
        data: data
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: JobInfoDTO[] = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todos os Pipelines no banco
export async function getAllPipelines(clienteId: number): Promise<PipelineInfoDTO[]> {
    const titulo = "OBTENDO PIPELINES";
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/pipeline/cliente/${clienteId}`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: PipelineInfoDTO[] = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todos os Jobs no banco
export async function getAllJobs(clienteId: number): Promise<JobInfoDTO[]> {
    const titulo = "OBTENDO JOBS";
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/job/cliente/${clienteId}`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: JobInfoDTO[] = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter somente 1 Relatório no banco
export async function getUmRelatorio(id: number): Promise<RelatorioResumoDTO> {
    const titulo = `OBTENDO RELATORIO ID ${id}`;
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/relatorio/id/${id}`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const relatorio: RelatorioResumoDTO = response.data;
            requestSucesso(titulo, relatorio);
            return relatorio;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todas as Massa no banco
export async function getAllMassas(clienteId: number): Promise<MassaTabelaDTO[]> {
    const titulo = "OBTENDO MASSAS";
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/gerar-massa/cliente/${clienteId}`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: MassaTabelaDTO[] = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para testar uma Massa de banco
export async function testarMassa(massa: MassaTabelaDTO, clienteId: number): Promise<MassaPreparada[]> {
    const titulo = "TESTANDO MASSA";
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/gerar-massa/cliente/${clienteId}/test`,
        headers: headers,
        timeout: 30000,
        data: massa
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: MassaPreparada[] = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todos os Relatórios no banco
export async function getAllRelatorios(ambienteId: number): Promise<RelatorioResumoDTO[]> {
    const titulo = "OBTENDO RELATORIOS";
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/relatorio/summary/ambiente/${ambienteId}`,
        headers: headers,
        timeout: 30000,
        params: {
            itens: 200,
        }
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: RelatorioResumoDTO[] = response.data.content;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todos os Jobs no banco
export async function reexecutarRelatorio(id: number): Promise<RelatorioHistoricoDTO> {
    const titulo = `REEXECUTANDO RELATORIO ID ${id}`;
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/relatorio/rerun/${id}`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const resutlado: RelatorioHistoricoDTO = response.data;
            requestSucesso(titulo, resutlado);
            return resutlado;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para salvar nova Pipeline no banco
export async function salvarNovaPipeline(novaPipeline: PipelineInfoDTO): Promise<PipelineInfoDTO> {
    const titulo = "SALVAR NOVA PIPELINE";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/pipeline/new`,
        data: novaPipeline,
        headers: headers,
        timeout: 10000,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            const json: PipelineInfoDTO = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para executar a Pipeline
export async function executarPipeline(body: PipelineExecDTO): Promise<RelatorioHistoricoDTO> {
    const titulo = "EXECUTAR PIPELINE";
    requestStart(titulo);

    //Gerando timeout com base na quantidade de JObs (aprimorar!) 
    const timeout = 40000 * body.jobs.length;

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/pipeline/run`,
        headers: headers,
        timeout: timeout,
        data: body,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//>>>>>>>>>>>>>>>> TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//Requisição para executar a Pipeline
export async function getDet(relatorioId: number, nome: string, email: string): Promise<Blob> {
    const titulo = "OBTER DET";
    requestStart(titulo);

    let config: AxiosRequestConfig<any> = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/relatorio/det/${relatorioId}`,
        headers: { },
        params: {
            user: nome,
            email: email,
        }
    };

    //Executando requisiçãao
    return await axios.request(config, )
        .then((response) => {
            return new Blob([response.data], { type: 'text/html' });
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para reexecutar uma Pipeline
export async function reexecutarPilha(pipelineNome: string): Promise<Blob> {
    const titulo = "REEXECUTAR PIPELINE";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/pipeline/run/again/${pipelineNome}`,
        headers: headers,
        timeout: 60000,
        //data: pipelineNome,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            const fileBlob = response.data;
            requestSucesso(titulo, fileBlob);
            return fileBlob;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Interface retornada pela requisição
export interface EvidenciasRevisadasDTO { 
    saved: number[],
    failed: number[] 
}

//Requisição para salvar as revisões das Evidências
export async function saveRevisaoEvidencia(evidencias: EvidenciaRevisadaDTO[]): Promise<EvidenciasRevisadasDTO> {
    const titulo = "SALVAR REVISÃO EVIDÊNCIA";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/evidencia/review`,
        data: evidencias,
        headers: headers,
        timeout: 10000,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            const mensagem: EvidenciasRevisadasDTO = response.data;
            requestSucesso(titulo, mensagem);
            return mensagem;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter um Relatório para revisar
export async function getUmaRevisao(id: number): Promise<RelatorioHistoricoDTO> {
    const titulo = "OBTER UMA REVISÃO";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/relatorio/review/${id}`,
        headers: headers,
        timeout: 10000,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            const mensagem: RelatorioHistoricoDTO = response.data;
            requestSucesso(titulo, mensagem);
            return mensagem;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para salvar as revisões do Relatorio
export async function saveRevisaoRelatorio(relatorio: RelatorioRevisadoDTO): Promise<void> {
    const titulo = "SALVAR REVISÃO RELATÓRIO";
    throw "FALTA IMPLEMENTAR DATA no PAYLOAD";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/relatorio/review`,
        headers: headers,
        timeout: 10000,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            requestSucesso(titulo, "Sucesso");
            return;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todas as ConfigQuery's dos Jobs de um Cliente
export async function getAllConfigQueries(clienteId: number): Promise<QueryInfoDTO[]> {
    const titulo = `OBTENDO TODOS As QUERIES DO CLIENTE ID ${clienteId}`;
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/query/cliente/${clienteId}`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const lista: QueryInfoDTO[] = response.data;
            requestSucesso(titulo, lista);
            return lista;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter ConfigQuery's de um Job
export async function getJobConfigQueries(jobId: number): Promise<ComandoSQL[]> {
    const titulo = `OBTENDO CONFIG-QUERIES DO JOB ID ${jobId}`;
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/query/job/${jobId}`,
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const lista: ComandoSQL[] = response.data;
            requestSucesso(titulo, lista);
            return lista;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para validar querys
export async function validarQuery(ambienteId: number, comandoSql: ComandoSQL | string): Promise<string> {
    const titulo = "VALIDAR QUERY";
    requestStart(titulo);
    const endpoint = (typeof comandoSql === 'string') ? 'manual' : 'dynamic';

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${REQUEST_URL}/query/validade/${endpoint}/ambiente/${ambienteId}`,
        headers: headers,
        timeout: 10000,
        data: comandoSql,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            requestSucesso(titulo, response.data);
            return response.data;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}
