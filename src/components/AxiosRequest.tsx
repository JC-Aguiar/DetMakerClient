import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { TokenModel } from './TokenModel';
import { ErroModel } from './ErroModel';

const headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:8010/*",
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
        });;
}


