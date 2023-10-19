import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { TokenModel } from './TokenModel';
import { ErroModel } from './ErroModel';
import { JobDTO } from './JobDTO';
import { EvidenciaDTO } from './EvidenciaDTO';
import { JobExecute, JobExecuteDTO as JobExecuteDTO } from './ItemPilha';

const headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:1990/*",
    "Access-Control-Allow-Methods": "POST, GET",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "60000",
}

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

export function requestErro(axiosError: AxiosError) {
    let mensagemErro = "";
    //O servidor respondeu com um status diferente de 2xx
    if (axiosError.response) {
        mensagemErro = `O servidor respondeu com status diferente de sucesso.` + '\n'
            + `Status ${axiosError.response.status}: ${axiosError.response.data}.`;
    }
    else if (axiosError.request) {
        mensagemErro = "Falha de conexão. Sem resposta do servidor.";
    }
    else {
        mensagemErro = `Erro ao fazer a requisição: ${axiosError.message}.`;
    }
    
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


export async function openSchedule(arquivoXlsx: File): Promise<JobDTO[]> {
    //Configurando endereço da requisição
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
    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/job/open/xlsx',
        headers: headersXlsx,
        timeout: 30000,
        data: data
    };
    //Executando requisiçãao
    return await axios
        .request(config)
        .then((response) => {
            const json: JobDTO[] = response.data;
            console.log(json);
            return json;
        })
        .catch((error: string) => {
            console.error(error);
            throw error;
        });
}

export async function getAllJobs(): Promise<JobDTO[]> {
    //Configurando endereço da requisição
    const headersXlsx: AxiosRequestHeaders = {
        "Access-Control-Allow-Origin": "http://localhost:1990/*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "60000",
    }
    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/job?itens=200',
        headers: headersXlsx,
        timeout: 30000,
    };
    //Executando requisiçãao
    return await axios
        .request(config)
        .then((response) => {
            const json: JobDTO[] = response.data.content;
            console.log(json);
            return json;
        })
        .catch((error: string) => {
            console.error(error);
            throw error;
        });
}

export async function executarPilha(pilha: JobExecuteDTO[]): Promise<EvidenciaDTO[]> {
    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:1990/job/execute/stack',
        headers: headers,
        timeout: 60000,
        data: pilha,
    };
    //Executando requisiçãao
    return await axios
        .request(config)
        .then((response) => {
            const evidencias: EvidenciaDTO[] = response.data;
            console.log(evidencias);
            return evidencias;
        })
        .catch((error: string) => {
            console.error(error);
            throw error;
        });
}