import { IonRow, IonCol, IonInput, IonItem } from "@ionic/react";
import { save } from "ionicons/icons";
import { useRef } from "react";
import { useDispatch } from 'react-redux';
import * as axiosRequest from "../../data/AxiosRequest";
import Botao from "../Core/Botao";
import { addAmbiente, loadingClientes } from "../../Store/Reducer/ReducerClientes";
import { AmbienteInfoDTO } from "../../data/AmbienteInfoDTO";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";

export interface ModalNovoAmbienteProps {
    clienteId:  number,
    onSave?: () => void;
}

const ModalNovoAmbiente: React.FC<ModalNovoAmbienteProps> = ({ clienteId, onSave = () => null }) => {
    //Atrbiutos para usar recursos Redux e React
    const dispatch = useDispatch();

    //Atibutos de estado gerenciados via Redux
    const refNome = useRef<HTMLIonInputElement>(null);
    const refSftpConexao = useRef<HTMLIonInputElement>(null);
    const refSftpUsuario = useRef<HTMLIonInputElement>(null);
    const refSftpSenha = useRef<HTMLIonInputElement>(null);
    const refBancoConexao = useRef<HTMLIonInputElement>(null);
    const refBancoUsuario = useRef<HTMLIonInputElement>(null);
    const refBancoSenha = useRef<HTMLIonInputElement>(null); 

    //Requisição para criar novo Ambiente para este mesmo Cliente
    async function criarNovoAmbiente() {
        const mensagemId = `New_Environment@${Date.now()}`;
        const elementos: HTMLIonInputElement[] = [
            refNome!.current!,
            refSftpConexao!.current!,
            refSftpUsuario!.current!,
            refSftpSenha!.current!,
            refBancoConexao!.current!,
            refBancoUsuario!.current!,
            refBancoSenha!.current!
        ];
        const pendentes = elementos.filter(item =>  !item.value || item.value.toString().length < 1);
        if (pendentes.length > 0) {
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `Preencha o campo obrigatório '${pendentes[0].placeholder}' para criar novo Ambiente.`,
                status: 'ERROR'
            }));
            pendentes[0].setFocus();
            return;
        };

        const [nome, sftpConexao, sftpUsuario, sftpSenha, bancoConexao, bancoUsuario, bancoSenha] = elementos
            .map(item => item.value!.toString());
        
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Salvando novo Ambiente '${nome}' no catálogo do Cliente.`,
            status: 'INFO'
        }));
        dispatch(loadingClientes(true));
        try {
            const ambiente: AmbienteInfoDTO = {
                id: -1,
                nome: nome,
                ftp: {
                    conexao: sftpConexao,
                    usuario: sftpUsuario,
                    senha: sftpSenha,
                },
                banco: {
                    conexao: bancoConexao,
                    usuario: bancoUsuario,
                    senha: bancoSenha,
                }
            };
            const novoAmbiente: AmbienteInfoDTO = await axiosRequest.saveNovoAmbiente(clienteId, ambiente);
            dispatch(addAmbiente({ 
                clienteId: clienteId, 
                ambiente: novoAmbiente 
            }));
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `Sucesso.`,
                status: 'OK'
            }));
            onSave();
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
        dispatch(loadingClientes(false));
    }

    //Renderização do componente
    return <>
        <div className="container justify-content-center mt-1 px-5">
            <div className='glass px-3'>
                <div className='h5 text-center text-white py-2 mt-2 mb-4'>
                    Preencha os dados abaixo para criar novo Ambiente
                </div>
                <div className='text-primary'>
                    <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                        <IonCol size='12' className="glass m-0 my-1 px-1">
                            <IonItem className='m-0 p-0'>
                                <IonInput inputmode='text'
                                    maxlength={50}
                                    placeholder="Nome do Ambiente"
                                    ref={refNome}
                                    //value={nome}
                                    className='text-white'
                                    //onIonChange={(e) => preencherNome(e)}
                                    required
                                />
                            </IonItem>
                        </IonCol>
                        <IonCol size='12' className='glass m-0 my-1 px-1'>
                            <IonRow>
                                <IonItem className='m-0 p-0 w-50'>
                                    <IonInput inputmode='text'
                                        maxlength={25}
                                        placeholder="Conexão SFTP"
                                        ref={refSftpConexao}
                                        //value={nome}
                                        className='text-white'
                                        //onIonChange={(e) => preencherNome(e)}
                                        required
                                    />
                                </IonItem>
                                <IonItem className='m-0 p-0 w-25'>
                                    <IonInput inputmode='text'
                                        maxlength={100}
                                        placeholder="Usuário SFTP"
                                        ref={refSftpUsuario}
                                        //value={nome}
                                        className='text-white'
                                        //onIonChange={(e) => preencherNome(e)}
                                        required
                                    />
                                </IonItem>
                                <IonItem className='m-0 p-0 w-25'>
                                    <IonInput inputmode='text'
                                        type="password"
                                        maxlength={200}
                                        placeholder="Senha SFTP"
                                        ref={refSftpSenha}
                                        //value={nome}
                                        className='text-white'
                                        //onIonChange={(e) => preencherNome(e)}
                                        required
                                    />
                                </IonItem>
                            </IonRow>
                        </IonCol>
                        <IonCol size='12' className='glass m-0 my-1 px-1'>
                            <IonRow>
                                <IonItem className='m-0 p-0 w-50'>
                                    <IonInput inputmode='text'
                                        maxlength={75}
                                        placeholder="Conexão Banco"
                                        ref={refBancoConexao}
                                        //value={nome}
                                        className='text-white'
                                        //onIonChange={(e) => preencherNome(e)}
                                        required
                                    />
                                </IonItem>
                                <IonItem className='m-0 p-0 w-25'>
                                    <IonInput inputmode='text'
                                        maxlength={100}
                                        placeholder="Usuário Banco"
                                        ref={refBancoUsuario}
                                        //value={nome}
                                        className='text-white'
                                        //onIonChange={(e) => preencherNome(e)}
                                        required
                                    />
                                </IonItem>
                                <IonItem className='m-0 p-0 w-25'>
                                    <IonInput inputmode='text'
                                        type="password"
                                        maxlength={200}
                                        placeholder="Senha Banco"
                                        ref={refBancoSenha}
                                        //value={nome}
                                        className='text-white'
                                        //onIonChange={(e) => preencherNome(e)}
                                        required
                                    />
                                </IonItem>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <div className="d-flex ion-justify-content-end py-2">
                        <Botao icon={save}
                            text="Salvar no Banco"
                            //disabled={nome.trim().length < 2 || ambienteSftpConexao.trim().length < 2} 
                            handler={() => criarNovoAmbiente()} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ModalNovoAmbiente;