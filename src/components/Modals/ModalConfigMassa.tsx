import { IonButton, IonLabel, IonItem, IonCol, IonRow, IonCard, IonInput, IonGrid, IonSelect, IonSelectOption, InputChangeEventDetail, TextareaChangeEventDetail, SelectChangeEventDetail, IonIcon, IonTitle, useIonModal, IonModal, IonToggle, } from "@ionic/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import { MassaTabelaDTO } from "../../data/MassaTabelaDTO";
import { massaColunaTipos } from "../../data/MassaColunaTipo";
import { MassaColunaDTO } from "../../data/MassaColunaDTO";
import { DynamicModalContent } from "../Core/DynamicModalContent";
import { add, addCircle, checkmarkCircle, closeCircle, cube, helpCircle } from "ionicons/icons";
import DynamicModal from "../Core/DynamicModal";
import ModalTiposDeMassa from "./ModalTiposDeMassa";
import { MassaPreparada } from "../../data/MassaPreparada";
import ModalTesteMassa from "./ModalTesteMassa";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";

export interface ModalConfigMassaProps {
    massa: MassaTabelaDTO | undefined,
}

const ModalConfigMassa: React.FC<ModalConfigMassaProps & DynamicModalContent> = ({ massa }) => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();

    //Atributos próprios
    //const [projetoId, setProjetoId] = useState<string>("");
    //const [projetoNome, setProjetoNome] = useState<string>("");
    //const [atividadeNome, setAtividadeNome] = useState<string>("");
    const [massaConfig, setMassaConfig] = useState<MassaColunaDTO[]>( [...massa!.colunas] ); 
    const [usaPessoaConfig, setUsaPessoaConfig] = useState<boolean>(massa!.usaPessoa);
    const [massaGerada, setMassaGerada] = useState<MassaPreparada[]>([]);
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);

    //configurações e propriedades da modal guia de uso do Gerador de Massa  
    const [verModalGuia, setVerModalGuia] = useState<boolean>(false);
    const modalRef = useRef<HTMLIonModalElement>(null);
    const [verModalTeste, setVerModalTeste] = useState<boolean>(false);
    const testeRef = useRef<HTMLIonModalElement>(null);
    
    const [modalTesteMassaOn, modalTesteMassaOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Teste da Massa Gerada",
            elemento: <ModalTesteMassa massa={massaGerada} />,
            onDismiss: () => modalTesteMassaOff(),
        }
    );

    /*
        function getButtons() {
            return <IonFabButton color="#" >
                <IonIcon icon={cube} color="#" />
            </IonFabButton>
        }
    */

    //Atributos globais
    //const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    //const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    //const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);  
    //const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    //const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);  
    //const mainPipelineDescricao: string | undefined = useSelector(
    //    (state: RootState) => state.store.catalogoPipelines.catalogo)
    //    .find((item) => item.nome === mainPipeline)?.nome;

    //Interface das colunas a serem renderizadas
    interface colunaTitulo {
        tamanho: number,
        titulo: string,
    }

    //Definição dos títulos e tamanhos para cada coluna
    const header: colunaTitulo[] = [
        {tamanho: 3, titulo: "NOME"},
        {tamanho: 1, titulo: "TAMANHO"},
        {tamanho: 3, titulo: "TIPO"},
        {tamanho: 5, titulo: "OPÇÃO DE VALOR"},
    ];

    //Método que renderiza todas as colunas dentro do ion-grid/ion-row
    const renderizarTitulos = header.map((item, index) => 
        <IonCol key={index} className='px-2' size={`${item.tamanho}`}>
            <strong>{item.titulo}</strong>
        </IonCol>
    );

    //Handler para preencher a massa: nome da coluna 
    const preencherMassaColunaNome = (index: number, event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        const novaMassa = massaConfig!.map((item, massaIndex) => {
            if(index === massaIndex) return {...item, nome: value};
            return item;
        });
        setMassaConfig(novaMassa);
        console.log(`[MODAL-CONFIG-MASSA] Usuário modificou MassaColunaDTO[${index}]: nome = ${novaMassa[index].nome}.`);
    }

    //Handler para preencher a massa: tamanho máximo da coluna no banco
    const preencherMassaColunaTamanho = (index: number, event: CustomEvent<InputChangeEventDetail>) => {
        const value = Number.parseInt((event.target as HTMLInputElement).value);
        const novaMassa = massaConfig!.map((item, massaIndex) => {
            if(index === massaIndex) return {...item, tamanhoMax: value};
            return item;
        });
        setMassaConfig(novaMassa);
        console.log(`[MODAL-CONFIG-MASSA] Usuário modificou MassaColunaDTO[${index}]: tamanho = ${novaMassa[index].tamanhoMax}.`);
    }

    //Handler para preencher a massa: tipo de gerador de valor
    const preencherMassaColunaTipo = (index: number, event: CustomEvent<SelectChangeEventDetail<any>>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        const tipo = massaColunaTipos.find(tipo => tipo.nomeTipo === value)
        if (!tipo) {
            dispatch(addMensagem({ 
                id: `Set_Massa_Tipo@${Date.now()}`, 
                texto: `Não encontrado Massa tipo '${value}'`,
                status: 'INFO'
            }));
            return;
        }
        const novaMassa = massaConfig!.map((item, massaIndex) => {
            if(index === massaIndex) return {
                ...item, 
                tipo: value, 
                opcao: (tipo.comInput ?  item.opcao : "")
            };
            return item;
        });
        setMassaConfig(novaMassa);
        console.log(`[MODAL-CONFIG-MASSA] Usuário modificou MassaColunaDTO[${index}]: tipo = ${novaMassa[index].tipo}.`);
    }

    //Handler para preencher a massa: valor(s) pré-definido(s)
    const preencherMassaColunaValoresPrefixo = (index: number, event: CustomEvent<TextareaChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        const novaMassa = massaConfig!.map((item, massaIndex) => {
            if(index === massaIndex) return {...item, opcao: value};
            return item;
        });
        setMassaConfig(novaMassa);
        console.log(`[MODAL-CONFIG-MASSA] Usuário modificou MassaColunaDTO[${index}]: opcao = ${novaMassa[index].opcao}.`);
    }

    //Handler para criar mapeamento para nova coluna 
    const adicionarNovaColuna = () => {
        const novaMassa: MassaColunaDTO = {
            nome: "",
            tipo: massaColunaTipos[0].nomeTipo,
            tamanhoMax: 1,
            opcao: "",
        };
        setMassaConfig([...massaConfig, novaMassa]);
        console.log(`[MODAL-CONFIG-MASSA] Usuário solicitou nova MassaColunaDTO. Índice: [${massaConfig.length}].`);
    }

    const identificarCampoComInput = (tipoNome: string): boolean | undefined => massaColunaTipos
        .find(tipo => tipo.nomeTipo === tipoNome)?.comInput;

    const camposPreenchidos = (): boolean => {
        const opcoesPreenchidas = massaConfig
            .filter(item => identificarCampoComInput(item.tipo))
            .every(item => item.opcao.length > 0);
        return massaConfig.length > 0 && opcoesPreenchidas;
    }

    const testarMassa = async () => {
        const mensagenId = `Check_Massa@${Date.now()}`;
        dispatch(addMensagem({ 
            id: mensagenId, 
            texto: `Testando nova Massa.`,
            status: 'INFO'
        }));

        try {
            const tabelaDto: MassaTabelaDTO = {
                nome: massa!.nome,
                colunas: massaConfig,
                usaPessoa: usaPessoaConfig
            };
            setMassaGerada(await axiosRequest.testarMassa(tabelaDto, mainAmbienteId));
            dispatch(atualizarMensagem({ 
                id: mensagenId, 
                complmento: `Sucesso.`,
                status: 'OK'
            }));
            if (!testeRef || !testeRef.current) return;
            setVerModalTeste(true);
            testeRef.current.present();
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagenId, 
                complmento: `${error}.`,
                status: 'ERROR'
            }));
        }
    }

    //Renderização do componente
    if (!massa) return<></>;
    return (
        <div className="row justify-content-center px-3 mx-0 text-center">
            <IonCard className="glass">
                <IonGrid className="glass-content text-primary p-0 m-0 w-100 h-100" >
                    {/*
                        style={{ backgroundColor: `var(--ion-color-primary-shade)`}} 
                        color="tertiary"
                     */}
                    <IonRow className='text-dark ion-justify-content-between p-0 m-0'>
                        <IonCol className="w-100"></IonCol>
                        <IonCol className="w-100">
                            <IonItem lines="none" className="" >
                                <IonLabel className='text-center py-0 my-0' >
                                    <IonTitle className="fs-1">{massa.nome}</IonTitle>
                                </IonLabel>
                            </IonItem>
                        </IonCol> 
                        <IonCol className="w-100 d-flex ion-align-items-center ion-justify-content-end">
                            <IonItem lines="none"> 
                                <IonLabel className='text-end' >
                                    Dados Da Mesma Pessoa 
                                </IonLabel>
                                <IonIcon className="ms-0 me-1" icon={usaPessoaConfig ? checkmarkCircle : closeCircle} />
                                <IonToggle slot="end"
                                    className={`px-0 ${usaPessoaConfig ? "" : "disable"}`} 
                                    checked={usaPessoaConfig} 
                                    onIonChange={(e) => setUsaPessoaConfig(e.detail.checked)}
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className='text-dark ion-justify-content-between' 
                        style={{ backgroundColor: `var(--ion-color-primary-shade)`}}
                    >    
                        {renderizarTitulos}
                    </IonRow>
                    {
                        massaConfig.map((col, index) => {
                            const color = index % 2 === 0 ? 'medium' : 'none';
                            const valorComInput = identificarCampoComInput(col.tipo);
                            return (
                                <IonRow key={index} 
                                    className="py-2 ion-justify-content-center text-center text-white"
                                    style={{ backgroundColor: `var(--ion-color-${color})` }} 
                                >
                                    <IonCol size={`${header[0].tamanho}`}>
                                        <IonInput inputmode='text'
                                            type='text'
                                            maxlength={25}
                                            value={col.nome}
                                            className='glass '
                                            style={{ backgroundColor: `var(--ion-color-tertiary-shade)` }}
                                            onIonChange={(e) => preencherMassaColunaNome(index, e)}
                                            required
                                        />
                                    </IonCol>
                                    <IonCol size={`${header[1].tamanho}`}>
                                        <IonInput inputmode='numeric'
                                            type='number'
                                            max="999"
                                            min="1"
                                            step="1"
                                            value={col.tamanhoMax}
                                            className='glass text-center ps-0 pe-2'
                                            style={{ backgroundColor: `var(--ion-color-tertiary-shade)` }}
                                            onIonChange={(e) => preencherMassaColunaTamanho(index, e)}
                                            required
                                        />
                                    </IonCol>
                                    <IonCol size={`${header[2].tamanho}`} className="d-flex">
                                        <IonSelect id='opcao-tipo-massa'
                                            className='glass py-1 h-100 w-100' 
                                            interfaceOptions={{ cssClass: `ion-select-action-sheet` }} 
                                            color="primary"
                                            value={col.tipo}
                                            style={{ backgroundColor: `var(--ion-color-tertiary-shade)` }}
                                            onIonChange={(e) => preencherMassaColunaTipo(index, e)}
                                        >
                                        {
                                            massaColunaTipos.map((item, index) => (
                                                <IonSelectOption key={index} value={item.nomeTipo}>
                                                    {item.nomeTipo}
                                                </IonSelectOption>
                                            ))
                                        }
                                        </IonSelect>
                                    </IonCol>
                                    <IonCol size={`${header[3].tamanho}`} >
                                        <IonInput inputmode='text'
                                            type='text'
                                            size={10}
                                            maxlength={30}
                                            value={col.opcao}
                                            className={valorComInput ? 'glass ' : ''}
                                            style={{ backgroundColor: valorComInput ? `var(--ion-color-tertiary-shade)` : '' }}
                                            disabled={!valorComInput}
                                            onIonChange={(e) => preencherMassaColunaValoresPrefixo(index, e)}
                                        />
                                    </IonCol>
                                </IonRow>
                            )
                        })
                    }
                    <IonRow className="m-0 p-0 ion-justify-content-start text-center">
                        <IonButton color='primary'
                            fill="clear"
                            className="m-0 w-100 opacity-50"
                            style={{ backgroundColor: `transparent` }}
                            //disabled={!camposPreenchidos()}
                            onClick={() => adicionarNovaColuna()}
                        >
                            <IonIcon icon={addCircle} size="large" />
                            Adicionar novo campo
                        </IonButton>
                    </IonRow>
                    <IonRow className='text-dark ion-justify-content-end ion-aling-items-center px-1 py-2' >
                        <IonButton color='#'
                            fill="clear"
                            className="m-0 p-0"
                            size='large'
                            onClick={() => {
                                if (!modalRef || !modalRef.current) return;
                                modalRef.current.present();
                                setVerModalGuia(true);
                            }}
                        >
                            <IonIcon icon={helpCircle} className="p-0 m-0" />
                        </IonButton>
                        <IonButton color='secondary'
                            fill="outline"
                            className="glass m-2"
                            disabled={!camposPreenchidos}
                            onClick={testarMassa}
                        >
                            TESTAR
                        </IonButton>
                        <IonButton color='secondary'
                            fill="outline"
                            className="glass m-2"
                            //disabled={!camposPreenchidos()}
                            onClick={() => null}
                        >
                            SALVAR
                        </IonButton>
                    </IonRow>
                </IonGrid>
            </IonCard>

            {/* Modal personalizada do guia de uso do Gerador de Massa */}
            <IonModal style={{'--min-width': '94%', '--min-height': '90%'}} isOpen={verModalGuia} ref={modalRef}>
                <DynamicModal
                    titulo="Guia de Uso do Gerador de Massa"
                    elemento={<ModalTiposDeMassa />}
                    onDismiss={() => {
                        if (!modalRef || !modalRef.current) return;
                        modalRef.current.dismiss();
                        setVerModalGuia(false);
                    }}
                    padding={true}
                />
            </IonModal>

            {/* Modal personalizada do teste do Gerador de Massa */}
            <IonModal style={{'--min-width': '94%', '--min-height': '90%'}} isOpen={verModalTeste} ref={testeRef}>
                <DynamicModal
                    titulo="Teste do Gerador de Massa"
                    elemento={<ModalTesteMassa massa={massaGerada} />}
                    onDismiss={() => {
                        if (!testeRef || !testeRef.current) return;
                        testeRef.current.dismiss();
                        setVerModalTeste(false);
                    }}
                    padding={true}
                />
            </IonModal>
        </div>
    );
}

export default ModalConfigMassa;