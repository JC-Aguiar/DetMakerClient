import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { TokenModel } from './TokenModel';
import { ErroModel } from './ErroModel';
import { JobDTO } from './JobDTO';
import { EvidenciaDTO } from './EvidenciaDTO';
import { JobExecute, JobExecuteDTO as JobExecuteDTO } from './JobExecute';
import { PipelineInfoDTO } from './PIpelineInfoDTO';
import { PipelineNovaExecDTO } from './PipelineNovaExecDTO';

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
    logInfo(titulo, mensagemSucesso + '\n' + obj);
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
export async function login(email: string, senha: string): Promise<TokenModel> {
    return await axios
        .post("http://localhost:8010/login", { email, senha }, headers)
        .then((response) => {
            // console.log(`[AxiosRequest] \n\t response: ${response.toString()}`);
            // console.log(`[AxiosRequest] \n\t response.data: ${response.data.toString()}`);
            // const responseData = new ResponseModel<TokenInterface, string>(response.data);
            // console.log(`[AxiosRequest] \n\t responseData: ${responseData.toString()}`);
            // const data = (response.status < 200 || response.status >= 300) ?
            //     new ErroModel(response.data) : new TokenModel(response.data);
            const data = new TokenModel(response.data);
            console.log(`[AxiosRequest] \n\t response: ${data}`);
            return data;
        })
        .catch((erro) => {
            console.log(erro.response.data.mensagem);
            throw new ErroModel(erro.response.data);
        });
}

//Requisição para abrir planilha Schedule
export async function openSchedule(arquivoXlsx: File): Promise<JobDTO[]> {
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
            const json: JobDTO[] = response.data;
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
export async function getAllJobs(): Promise<JobDTO[]> {
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
            const json: JobDTO[] = response.data.content;
            requestSucesso(titulo, json);
            return json;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}

//Requisição para executar a Pipeline
export async function executarPilha(body: PipelineNovaExecDTO): Promise<EvidenciaDTO[]> {
    const titulo = "EXECUTAR PIPELINE";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/pipeline/run/new',
        headers: headers,
        timeout: 60000,
        data: body,
    };
    //Executando requisiçãao
    return await axios
        .request(config)
        .then((response) => {
            const evidencias: EvidenciaDTO[] = response.data;
            requestSucesso(titulo, evidencias);
            return evidencias;
        })
        .catch((error: AxiosError) => {
            throw requestErro(titulo, error);
        });
}