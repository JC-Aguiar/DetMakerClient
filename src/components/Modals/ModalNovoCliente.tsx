import { TextareaChangeEventDetail, IonTextarea, IonButton, IonIcon, InputChangeEventDetail, IonRow, IonBadge, IonCol, IonInput, IonLabel, IonItem } from "@ionic/react";
import { closeCircle, flag, save, trash } from "ionicons/icons";
import { useRef, useState } from "react";
import { Notificacao } from "../Core/Noticacao";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import Botao from "../Core/Botao";
import { addAmbiente, loadingClientes } from "../../Store/Reducer/ReducerClientes";
import { ClienteInfoDTO } from "../../data/ClienteInfoDTO";
import { ClienteNovoDTO } from "../../data/ClienteNovoDTO";

export interface ModalNovoClienteProps {
    notificacao: Notificacao;
    onSave?: () => void;
}

const ModalNovoCliente: React.FC<ModalNovoClienteProps> = ({ notificacao, onSave = () => null }) => {
    //Atrbiutos para usar recursos Redux e React
    const dispatch = useDispatch();

    //Atibutos de estado gerenciados via Redux
    const refNome = useRef<HTMLIonInputElement>(null);
    const refBanner = useRef<HTMLInputElement>(null);
    
    //Atributos úteis
    const { toastInfo, toastOk, toastErro } = notificacao;

    //Requisição para criar novo Ambiente para este mesmo Cliente
    async function criarNovoCliente() {
        const nome = refNome!.current!.value;
        const banner = refBanner!.current!.files;
        const maxMB = 1; // 1MB

        if (!nome || nome.toString().length < 0) {
            toastErro(`Preencha o campo obrigatório 'Nome'.`, []);
            refNome!.current!.setFocus();
            return;
        };

        const cliente: ClienteNovoDTO = {
            nome: nome.toString(),
            banner: "", //new Uint8Array(),
        };
        
        toastInfo("Salvando no banco novo Cliente...", []);
        try {
            if (banner && banner.length > 0) {
                if (banner[0].size > (maxMB * 1024 * 1024))
                    throw `Tamanho do arquivo excede o limite de ${maxMB}MB.`;
                cliente.banner = await fileToBase64(banner[0]);
            }
            await axiosRequest.saveNovoCliente(cliente); //const novoCliente: ClienteInfoDTO = 
            toastOk("Cliente criado com sucesso.", []);
            onSave();
        }
        catch (error) {
            toastErro(`Erro ao tentar criar novo Cliente: ${error}`, []);
        }
        dispatch(loadingClientes(false));
    }

    //Converte File para array de bytes
    function convertFileToByteArray(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const byteArray = new Uint8Array(arrayBuffer);
            resolve(byteArray);
          };
          reader.onerror = () => {
            reject(new Error('Erro ao ler o imagem.'));
          };
          reader.readAsArrayBuffer(file);
        });
    }

    //Converte File para string
    function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    //Renderização do componente
    return <>
        <div className="container justify-content-center mt-1 px-5">
            <div className='glass px-3'>
                <div className='h5 text-center text-white py-2 mt-2 mb-4'>
                    Preencha os dados abaixo para criar novo Cliente
                </div>
                <div className='text-primary'>
                    <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                        <IonCol size='12' className="glass m-0 my-1 px-1">
                            <IonItem className='m-0 p-0'>
                                <IonInput inputmode='text'
                                    maxlength={50}
                                    placeholder="Nome do Cliente"
                                    ref={refNome}
                                    className='text-white'
                                    required
                                />
                            </IonItem>
                        </IonCol>
                        <IonCol size='12' className="glass m-0 my-1 px-1">
                                    <div className="position-relative mx-2 my-3">
                                        <form action="/upload" method="post" encType="multipart/form-data" className="" >
                                            <label htmlFor="formFile" className="form-label">
                                                Banner
                                            </label>
                                            <input className="form-control" 
                                                type="file" 
                                                id="formFile" 
                                                accept=".png, .gif, .jpg, .jpeg"
                                                multiple={false}
                                                ref={refBanner}
                                                onChange={e => null} 
                                            />
                                        </form>
                                    </div>
                        </IonCol>
                    </IonRow>
                    <div className="d-flex ion-justify-content-end py-2">
                        <Botao icon={save}
                            texto="Salvar no Banco"
                            //disabled={nome.trim().length < 2 || ambienteSftpConexao.trim().length < 2} 
                            handler={() => criarNovoCliente()} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ModalNovoCliente;