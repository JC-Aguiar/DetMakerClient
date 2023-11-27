import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { TokenModel } from './TokenModel';
import { ErroModel } from './ErroModel';
import { JobInfoDTO } from './JobInfoDTO';
import { PipelineInfoDTO } from './PIpelineInfoDTO';
import { PipelineNovaExecDTO } from './PipelineNovaExecDTO';
import { ComandoSQL } from './ComandoSQL';
import { JobConfigDTO } from './JobExecute';
import { RelatorioHistoricoDTO } from './RelatorioHistoricoDTO';
import { JwtDTO } from './JwtDTO';

export const GOOGLE_CLIENT_ID = '19761887139-3pq8c2re83pkh5scpls4sblkhe3c26sh.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = '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';
export const GOOGLE_REDIRECT_URI = 'http://localhost:3000/det-maker/login';
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
//const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}`;


//Headers de comum uso na maioria das requisições
const headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:1990/*",
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

/**
 * Usuário clica em login
 * recebe ou um TokenInterface ou um ErroInterface
 * dependendo do status, será tipado uma dessas interfaces e instanciada
 * de volta ao usuário
 * @param email
 * @param senha
 * @returns
 */
export async function getAccessToken(code: string): Promise<JwtDTO> {
    const titulo = "GET ACEESS TOKEN";
    requestStart(titulo);

    const data = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    };

    return await axios
        .post(GOOGLE_TOKEN_URL, data)
        .then((response) => {
            requestSucesso(titulo, response.data);
            //const jwt = {
            //    access_token: response.data.access_token,
            //    expires_in: response.data.expires_in,
            //    id_token: response.data.id_token,
            //    scope: response.data.scope,
            //    token_type: response.data.token_type,
            //} as JwtDTO;
            return response.data;
        })
        .catch((erro) => {
            throw requestErro(titulo, erro);
        });

    // Faça algo com o token de acesso

    //return await axios
    //    .post("http://localhost:8010/login", { email, senha }, headers)
    //    .then((response) => {
    //        // console.log(`[AxiosRequest] \n\t response: ${response.toString()}`);
    //        // console.log(`[AxiosRequest] \n\t response.data: ${response.data.toString()}`);
    //        // const responseData = new ResponseModel<TokenInterface, string>(response.data);
    //        // console.log(`[AxiosRequest] \n\t responseData: ${responseData.toString()}`);
    //        // const data = (response.status < 200 || response.status >= 300) ?
    //        //     new ErroModel(response.data) : new TokenModel(response.data);
    //        const data = new TokenModel(response.data);
    //        console.log(`[AxiosRequest] \n\t response: ${data}`);
    //        return data;
    //    })
    //    .catch((erro) => {
    //        console.log(erro.response.data.mensagem);
    //        throw new ErroModel(erro.response.data);
    //    });
}

//Requisição para abrir planilha Schedule
export async function openSchedule(arquivoXlsx: File): Promise<JobConfigDTO[]> {
    const titulo = "ABRIR SCHEDULE";
    requestStart(titulo);

    //Configurando requisição
    const headersXlsx: AxiosRequestHeaders = {
        "Access-Control-Allow-Origin": "http://localhost:1990/*",
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

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/job/open/xlsx',
        headers: headersXlsx,
        timeout: 30000,
        data: data
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: JobConfigDTO[] = response.data;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todos os Pipelines no banco
export async function getAllPipelines(): Promise<PipelineInfoDTO[]> {
    const titulo = "OBTENDO PIPELINES";
    requestStart(titulo);

    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/pipeline?itens=200',
        headers: headers,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: PipelineInfoDTO[] = response.data.content;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para obter todos os Jobs no banco
export async function getAllJobs(): Promise<JobConfigDTO[]> {
    const titulo = "OBTENDO JOBS";
    requestStart(titulo);

    //Configurando endereço da requisição
    const headersXlsx: AxiosRequestHeaders = {
        "Access-Control-Allow-Origin": "http://localhost:1990/*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "60000",
    }
    //Preparando requisição
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/job?itens=200',
        headers: headersXlsx,
        timeout: 30000,
    };
    //Executando requisição
    return await axios
        .request(config)
        .then((response) => {
            const json: JobConfigDTO[] = response.data.content;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para executar a Pipeline
export async function executarPilha(body: PipelineNovaExecDTO): Promise<RelatorioHistoricoDTO> {
    const titulo = "EXECUTAR PIPELINE";
    requestStart(titulo);

    //Gerando timeout com base na quantidade de JObs (aprimorar!) 
    const timeout = 40000 * body.jobs.length;

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/pipeline/run',
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
export async function getDet(body: PipelineNovaExecDTO): Promise<Blob> {
    const titulo = "EXECUTAR PIPELINE";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/pipeline/run',
        headers: headers,
        timeout: 60000,
        data: body,
    };
    //Executando requisiçãao
    return await axios.request(config)
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
        url: `http://localhost:1990/pipeline/run/again/${pipelineNome}`,
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

//Requisição para obter ConfigQuery's de um Job
export async function getQueries(jobId: number): Promise<ComandoSQL[]> {
    const titulo = "OBTER CONFIG-QUERYs";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:1990/queries/job/${jobId}`,
        headers: headers,
        timeout: 10000,
    };
    //Executando requisiçãao
    return await axios.request(config)
        .then((response) => {
            const listaDto: ComandoSQL[] = response.data;
            requestSucesso(titulo, listaDto);
            return listaDto;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}