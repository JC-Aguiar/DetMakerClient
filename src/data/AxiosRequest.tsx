import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { PipelineInfoDTO } from './PIpelineInfoDTO';
import { PipelineNovaExecDTO } from './PipelineNovaExecDTO';
import { ComandoSQL } from './ComandoSQL';
import { JobConfigDTO } from './JobExecute';
import { RelatorioHistoricoDTO } from './RelatorioHistoricoDTO';
import { JwtDTO } from './JwtDTO';
import { UserDTO } from './UserDTO';
import { EvidenciaRevisadaDTO } from './EvidenciaRevisadaDTO';
import { RelatorioRevisadoDTO } from './RelatorioRevisadoDTO';

export const GOOGLE_CLIENT_ID = '19761887139-3pq8c2re83pkh5scpls4sblkhe3c26sh.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = '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';
export const GOOGLE_REDIRECT_URI = 'http://localhost:3000/det-maker/login';
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_PROFILE_INFO = 'https://www.googleapis.com/oauth2/v3/userinfo';
export const GOOGLE_PEOPLE_API_URL = 'https://people.googleapis.com/v1/people/me?personFields=photos';
//const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}`;


//Headers para requisições ao backend do Det-Maker
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

//Obtendo access token JWT da Google com base no código regado via autenticação AOuth2
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

/* 
export async function getFoto(url: string): Blob {
    return await axios
    .get(url, {
        responseType: 'stream'
    })
    .then((response) => {
        response.data.pipe(fs.createWriteStream('profile-image.jpg'));
    })
    .catch((error) => {
        console.error('Erro ao fazer o download da imagem:', error);
    });
}
*/

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
export async function getDet(relatorioId: number): Promise<Blob> {
    const titulo = "OBTER DET";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:1990/relatorio/det/${relatorioId}`,
        headers: headers,
        timeout: 60000,
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
        url: `http://localhost:1990/evidencia/save/review`,
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

//Requisição para salvar as revisões do Relatorio
export async function saveRevisaoRelatorio(relatorio: RelatorioRevisadoDTO): Promise<void> {
    const titulo = "SALVAR REVISÃO RELATÓRIO";
    requestStart(titulo);

    //Instanciando Axios
    let config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:1990/relatorio/save/review`,
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
