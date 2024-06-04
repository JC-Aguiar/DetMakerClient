import { IonIcon, IonRow, IonBadge, IonCol, IonInput, IonItem } from "@ionic/react";
import { alertCircle, reorderThree, save, } from "ionicons/icons";
import { useRef } from "react";
import { useDispatch } from 'react-redux';
import Botao from "../Core/Botao";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";

export interface ModalNovoJobProps {
    onSave?: () => void;
}

const ModalNovoJob: React.FC<ModalNovoJobProps> = ({ onSave = () => null }) => {
    //Atrbiutos para usar recursos Redux e React
    const dispatch = useDispatch();

    //Atributos de referência
    /*
    const nomeRef = useRef<HTMLIonInputElement>(null);
    const executarAposJobRef = useRef<HTMLIonInputElement>(null);
    const grupoConcorrenciaRef = useRef<HTMLIonInputElement>(null);
    const faseRef = useRef<HTMLIonInputElement>(null);
    const descricaoRef = useRef<HTMLIonInputElement>(null);
    const grupoUdaRef = useRef<HTMLIonInputElement>(null);
    const programaRef = useRef<HTMLIonInputElement>(null);
    const tabelasRef = useRef<HTMLIonInputElement>(null);
    const servidorRef = useRef<HTMLIonInputElement>(null);
    const caminhoExecRef = useRef<HTMLIonInputElement>(null);
    const parametrosRef = useRef<HTMLIonInputElement>(null);
    const descricaoParametrosRef = useRef<HTMLIonInputElement>(null);
    const diretorioEntradaRef = useRef<HTMLIonInputElement>(null);
    const mascaraEntradaRef = useRef<HTMLIonInputElement>(null);
    const diretorioSaidaRef = useRef<HTMLIonInputElement>(null);
    const mascaraSaidaRef = useRef<HTMLIonInputElement>(null);
    const diretorioLogRef = useRef<HTMLIonInputElement>(null);
    const mascaraLogRef = useRef<HTMLIonInputElement>(null);
    const tratamentoRef = useRef<HTMLIonInputElement>(null);
    const escalationRef = useRef<HTMLIonInputElement>(null);
    const dataAtualizacaoRef = useRef<HTMLIonInputElement>(null);
    const atualizadoPorRef = useRef<HTMLIonInputElement>(null);
    const queriesRef = useRef<HTMLIonInputElement>(null);
    */
    const dividirTexto = (valor: string) => valor.replace(/, /g, ";").split(";");

    //Defiindo atributos para gerar os campos de input, com base no JobInfoDTO
    interface elementosCoreProps {
        nome: string;
        atributo: "nome" | "executarAposJob" | "grupoConcorrencia" | "fase" | "descricao" 
                | "grupoUda" | "programa" | "tabelas" | "servidor" | "caminhoExec" | "parametros" 
                | "descricaoParametros" | "diretorioEntrada" | "mascaraEntrada" | "diretorioSaida" 
                | "mascaraSaida" | "diretorioLog" | "mascaraLog" | "tratamento" | "escalation";
        tamanho: number;
        colunas?: number;               //default: 12
        lista?: boolean;                //default: false
        tipo?: string;                  //default: 'text'
        obrigatorio?: boolean;          //default: false
        ref: React.RefObject<HTMLIonInputElement>;
    }

    //Lista dos atributos do Job para criar os campos
    const elementosCore: elementosCoreProps[] = [
        { 
            nome: "Nome", 
            atributo: "nome", 
            tamanho: 100,
            obrigatorio: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Executar após Job", 
            atributo: "executarAposJob", 
            tamanho: 60,
            colunas: 4,
            lista: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Grupo de Concorrencia", 
            atributo: "grupoConcorrencia", 
            tamanho: 25,
            colunas: 4,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Fase", 
            atributo: "fase", 
            tamanho: 25,
            colunas: 4,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Descrição", 
            atributo: "descricao", 
            tamanho: 500,
            tipo: "textArea",
            obrigatorio: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Grupo Uda", 
            atributo: "grupoUda", 
            tamanho: 5,
            colunas: 2,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Programa", 
            atributo: "programa", 
            tamanho: 150,
            colunas: 10,
            lista: true,
            obrigatorio: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Tabelas", 
            atributo: "tabelas", 
            tamanho: 300,
            colunas: 10,
            lista: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Servidor", 
            atributo: "servidor", 
            tamanho: 30,
            colunas: 2,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Caminho Execução", 
            atributo: "caminhoExec", 
            tamanho: 100,
            obrigatorio: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Pârametros", 
            atributo: "parametros", 
            tamanho: 50,
            lista: true,
            colunas: 3,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Descrição dos Parâmetros", 
            atributo: "descricaoParametros", 
            tamanho: 500,
            lista: true,
            colunas: 9,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Diretório das Entradas", 
            atributo: "diretorioEntrada", 
            tamanho: 100,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Máscara das Entradas", 
            atributo: "mascaraEntrada", 
            tamanho: 350,
            lista: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Diretório dos Produtos", 
            atributo: "diretorioSaida", 
            tamanho: 100,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Máscara dos Produtos", 
            atributo: "mascaraSaida", 
            tamanho: 150,
            lista: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Diretório dos Logs", 
            atributo: "diretorioLog", 
            tamanho: 100,
            obrigatorio: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Máscara dos Logs", 
            atributo: "mascaraLog", 
            tamanho: 300,
            lista: true,
            obrigatorio: true,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Tratamento", 
            atributo: "tratamento", 
            tamanho: 25,
            colunas: 6,
            ref: useRef<HTMLIonInputElement>(null)
        },
        { 
            nome: "Escalation", 
            atributo: "escalation", 
            tamanho: 25,
            colunas: 6,
            ref: useRef<HTMLIonInputElement>(null)
        }
    ];
    
    //Requisição para criar novo mapa de Job para este Cliente
    function criarNovoJob() {
        const mensagemId = `New_Job@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: 'Criando novo Job.',
            status: 'INFO'
        }));
        try {
            const pendente = elementosCore.find(item => item.obrigatorio && item.ref.current!.value!.toString().length < 1);
            if (pendente) {
                pendente.ref.current!.setFocus();
                throw `Campo obrigatório '${pendente.ref.current!.placeholder}' não preenchido!`;
            }
            const novoJob = instanciarInterfaceJob();
            throw "Método não implementado ainda!";
            //onSave();
        }
        catch (error) {
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${error}.`,
                status: "ERROR",
            }));
        }
    }

    const instanciarInterfaceJob = (): JobInfoDTO => {
        const jobDto: Partial<JobInfoDTO> = {};

        for (const key in elementosCore) {
            if (!elementosCore.hasOwnProperty(key)) continue;

            const chave = elementosCore[key].atributo;
            const valor = elementosCore[key].ref.current!.value!.toString();

            switch (chave) {
                case "nome":
                    jobDto[chave] = valor;
                    break;
                case "executarAposJob":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "grupoConcorrencia":
                    jobDto[chave] = valor;
                    break;
                case "fase":
                    jobDto[chave] = valor;
                    break;
                case "descricao":
                    jobDto[chave] = valor;
                    break;
                case "grupoUda":
                    jobDto[chave] = valor;
                    break;
                case "programa":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "tabelas":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "servidor":
                    jobDto[chave] = valor;
                    break;
                case "caminhoExec":
                    jobDto[chave] = valor;
                    break;
                case "parametros":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "descricaoParametros":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "diretorioEntrada":
                    jobDto[chave] = valor;
                    break;
                case "mascaraEntrada":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "diretorioSaida":
                    jobDto[chave] = valor;
                    break;
                case "mascaraSaida":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "diretorioLog":
                    jobDto[chave] = valor;
                    break;
                case "mascaraLog":
                    jobDto[chave] = dividirTexto(valor);
                    break;
                case "tratamento":
                    jobDto[chave] = valor;
                    break;
                case "escalation":
                    jobDto[chave] = valor;
                    break;
                default:
                    break;
            }
        }
        return jobDto as JobInfoDTO;
    }


    //Renderização do componente
    return <>
        <div className="container justify-content-center mt-1 px-5">
            <div className='glass px-3 text-center'>
                <div className='h5 text-white py-2 mt-2 mb-2'>
                    Preencha os dados abaixo para criar novo Job
                </div>
                <div>
                    O ícone <IonIcon icon={reorderThree} className="border rounded rounded-circle" style={{ transform: "translate(0, 2px)" }}/> indica 
                    que o campo é uma lista e os elementos podem ser separados
                    por <IonBadge className="font-monospace" style={{ transform: "translate(0, 2px)" }}>
                        ,
                    </IonBadge> ou <IonBadge className="font-monospace" style={{ transform: "translate(0, 2px)" }}>
                        ;
                    </IonBadge>.
                </div>
                <div>
                    O ícone <IonIcon icon={alertCircle} style={{ transform: "translate(0, 2px)" }}/> indica que o campo é obrigatório.
                </div>
                <div className='text-primary mt-2'>
                    <IonRow className='p-0 m-0 w-100 ion-align-items-center'>
                        {
                            elementosCore.map((item, index) => {
                                const colunas = item.colunas ? item.colunas : 12;
                                const lista = item.lista ? item.lista : false;
                                const tipo = item.tipo ? item.tipo : 'text';
                                const obrigatorio = item.obrigatorio ? item.obrigatorio : false;
                                return (
                                    <IonCol key={index} size={colunas.toString()} className="glass m-0 my-1 px-1">
                                        <IonItem className='m-0 p-0'>
                                            <IonInput inputmode="text"
                                                maxlength={item.tamanho}
                                                placeholder={item.nome}
                                                ref={item.ref}
                                                className='text-white'
                                                required={obrigatorio}
                                            />
                                            <IonIcon icon={reorderThree} hidden={!lista} className="opacity-50" />
                                            <IonIcon icon={alertCircle} hidden={!obrigatorio} className="opacity-50" />
                                        </IonItem>
                                    </IonCol>
                                );
                            })
                        }
                    </IonRow>
                    <div className="d-flex ion-justify-content-end py-2">
                        <Botao icon={save}
                            text="Salvar no Banco"
                            //disabled={nome.trim().length < 2 || ambienteSftpConexao.trim().length < 2} 
                            handler={() => criarNovoJob()} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ModalNovoJob;