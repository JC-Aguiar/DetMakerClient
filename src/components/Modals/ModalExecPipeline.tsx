import { IonTextarea, IonButton, IonInput, IonLabel, IonItem, InputChangeEventDetail, TextareaChangeEventDetail, IonTitle, IonRow, IonCol, IonBadge, IonIcon, useIonAlert } from "@ionic/react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { JobConfig } from "../../data/JobConfigDTO";
import { PipelineInfoDTO } from "../../data/PIpelineInfoDTO";
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import { setRelatorios } from "../../Store/Reducer/ReducerRelatorios";
import { removeRevisao, addRevisao } from "../../Store/Reducer/ReducerRevisao";
import { JobExecuteDTO } from "../../data/JobExecuteDTO";
import { PipelineExecDTO } from "../../data/PipelineExecDTO";
import { RelatorioHistoricoDTO } from "../../data/RelatorioHistoricoDTO";
import { AtividadeInfoDTO } from "../../data/AtividadeInfoDTO";
import { UserInfoDTO } from "../../data/UserInfoDTO";
import { UserDTO } from "../../data/UserDTO";
import { useHistory } from "react-router";
import Botao, { BotaoProps, Botoes } from "../Core/Botao";
import { closeCircle } from "ionicons/icons";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";


//Componente <ModalExecPipeline>
const ModalExecPipeline: React.FC = () => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();
    const history = useHistory();

    //Atributos com estado gerenciado via Redux
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);  
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);  
    const mainPipelineDescricao: string | undefined = useSelector(
        (state: RootState) => state.store.catalogoPipelines.catalogo)
        .find((item) => item.nome === mainPipeline)?.nome;
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);

    //Atributos com estado gerenciado via React
    const [projetoId, setProjetoId] = useState<string>("");
    const [projetoNome, setProjetoNome] = useState<string>("");
    const [atividadeNome, setAtividadeNome] = useState<string>("");
    const [configuracao, setConfiguracao] = useState<string>("");
    const [jobsParaExec, setJobsParaExec] = useState<JobConfig[]>(mainJobs);
    const [alerta] = useIonAlert();

    //Handler para alertar ao usuário caso ele queira executar a Pipeline com Jobs a menos
    const exibirAlerta = () => {
        alerta({
            header: 'ATENÇÃO!',
            message: 'Alguns Jobs foram desmarcados. ' 
                + 'Essa mudança refletirá no registro dessa Pipeline no banco. Deseja continuar?',
            buttons: [
                'Não',
                { text: 'Sim', handler: (d) => executarPipeline() }
            ],
        });
    };

    //Handler para preencher id do projeto
    const preencherProjetoId = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setProjetoId(value);
        console.log(`[CONFIGURAR-JOBS] Projeto id alterado para ${value}.`);
    }

    //Handler para preencher nome do projeto
    const preencherProjetoNome = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setProjetoNome(value);
        console.log(`[CONFIGURAR-JOBS] Projeto nome alterado para ${value}.`);
    }

    //Handler para preencher nome da atividade
    const preencherAtividade = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setAtividadeNome(value);
        console.log(`[CONFIGURAR-JOBS] Atividade nome alterada para ${value}.`);
    }

    //Handler para preencher configuração do môdulo
    const preencherConfiguracao = (event: CustomEvent<TextareaChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setConfiguracao(value);
        console.log(`[CONFIGURAR-JOBS] Configuração do môdulo alterado para ${value}.`);
    }

    //Handler para valdiar os campos obrigatórios
    function camposPreenchidos(): boolean {
        if (!mainPipelineDescricao) return false;
        return projetoId.trim().length > 0 
            && projetoNome.trim().length > 0
            && atividadeNome.trim().length > 0
            && jobsParaExec.length > 0;
    }

    //Requisição para executar a Pipeline
    async function executarPipeline() {
        const mensagemId = `Run_Pipeline@${Date.now()}`;
        if (!camposPreenchidos || !mainPipelineDescricao) {
            console.log('[CONFIGURAR-JOBS]: Preencha os campos antes de executar a Pipeline!');
            return;
        };
        dispatch(addMensagem({ 
            id: mensagemId, 
            texto: `Executando Pipeline '${mainPipeline}'.`,
            status: 'INFO'
        }));
        
        try {
            /*
            const pipelineDto: PipelineInfoDTO = {
                id: mainPipelineId,
                nome: mainPipeline,
                descricao: mainPipelineDescricao,
                clienteId: mainClienteId,
                jobs: mainJobs.map((item) => item.nome),
                checked: true,
            };
            */
            const relatorioDto: AtividadeInfoDTO = {
                idProjeto: projetoId,
                nomeProjeto: projetoNome,
                nomeAtividade: atividadeNome,
                configuracao: configuracao,
                testeTipo: "Unitário",
            };
            const jobsDto: JobExecuteDTO[] = mainJobs.map(JobExecuteDTO.parseJobConfig);
            const body: PipelineExecDTO = {
                pipelineId: mainPipelineId,
                atividade: relatorioDto,
                jobs: jobsDto,
                user: {
                    nome: user ? user.name : null,
                    papel: user ? "DEV" : null,
                    empresa: user ? "PPW" : null,
                } as UserInfoDTO,
                ambienteId: mainAmbienteId,
                clienteId: mainClienteId
            };

            dispatch(removeRevisao());
            const relatorioParaRevisar: RelatorioHistoricoDTO = await axiosRequest.executarPipeline(body);
            //dispatch(loadingRelatorios(true));
            //dispatch(addRevisao({ value: relatorio }));
            const buttons = [
                {
                  text: 'Revisar',
                  role: 'Revisar DET',
                  handler: () => {
                    dispatch(addRevisao(relatorioParaRevisar));
                    console.log(`[CONFIGURAR-JOBS] Navegando para: ${axiosRequest.URL_DET}`);
                    history.push(axiosRequest.URL_DET);
                  },
                }
            ];
            //dispatch(setRelatorios(null));
            //dispatch(loadingRelatorios(false));
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: 'Sucesso.\n'
                    + `Atualize a página de Relatórios e produce pelo ID ${relatorioParaRevisar.id}.`,
                status: 'OK'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({ 
                id: mensagemId, 
                complmento: `${error}.`,
                status: 'ERROR'
            }));
        }
    }

    //Botões a serem renderizar dentro da modal
    const botoes: BotaoProps[] = [
        {
            text: "RESTAURAR JOBS", 
            handler: () => setJobsParaExec(mainJobs),  
            disabled: mainJobs.length === jobsParaExec.length
        },
        {
            text: "EXECUTAR", 
            handler: () => {
                if (mainJobs.length !== jobsParaExec.length) exibirAlerta();
                else executarPipeline();
            },  
            disabled: !camposPreenchidos()
        },
    ];

    //Renderiza (ou não) a lista de Jobs a serem executados pela Pipeline 
    const jobs = () => {
        if (jobsParaExec.length < 1) return <></>; 
        return (
            <IonCol size='12' className='mx-0 px-0 '>
                <IonRow className='glass px-3 pt-2'>
                    <IonCol size='12' className="opacity-50">Jobs</IonCol>
                    {
                        jobsParaExec.map((item, index) => <IonCol key={index} size="6" className=""> 
                            <IonBadge color='tertiary' className='ion-align-items-center font-monospace small w-100 text-start'>
                                <span style={{backgroundColor: 'var(--ion-color-dark)'}} className='rounded text-white px-1'>
                                    Nº{index+1}
                                </span>
                                <span className="ms-1">{item.nome}</span>
                                <IonIcon icon={closeCircle} 
                                    color="light"
                                    className="btn btn-outline m-0 p-0 ms-1 mb-1" 
                                    onClick={() => setJobsParaExec(jobsParaExec.filter((job, jobIndex) => jobIndex !== index)) } 
                                />
                            </IonBadge>
                        </IonCol>
                        )
                    }
                </IonRow>
            </IonCol>
        );
    }

    //Renderização deste componente 
    if (mainPipeline === "") return<></>;
    return (
        <div className="row justify-content-center px-3 mx-0">
            <div className='col row mt-2 px-3 mx-0 glass'>
                <IonTitle className='h5 text-center m-4'>
                    Preencha os dados abaixo para prosseguir
                </IonTitle>
                <IonRow >
                    <IonCol size="3" className="glass m-0 my-1 px-1">
                        <IonItem className='m-0 p-0'>
                            <IonInput inputmode='text'
                                type='text'
                                size={10}
                                placeholder="Projeto Id"
                                maxlength={7}
                                value={projetoId}
                                className='text-white'
                                onIonChange={(e) => preencherProjetoId(e)}
                                required
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol size="9" className="glass m-0 my-1 px-1">
                        <IonItem className='m-0 p-0'>
                            <IonInput inputmode='text'
                                type='text'
                                size={50}
                                placeholder="Projeto Nome"
                                maxlength={200}
                                value={projetoNome}
                                className='text-white'
                                onIonChange={(e) => preencherProjetoNome(e)}
                                required
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol size="12" className="glass m-0 my-1 px-1">
                        <IonItem className='m-0 p-0'>
                            <IonInput inputmode='text'
                                maxlength={300}
                                placeholder="Atividade"
                                value={atividadeNome}
                                className='text-white'
                                onIonChange={(e) => preencherAtividade(e)}
                                required
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol size="12" className="glass m-0 my-1 px-1">
                        <IonItem className='m-0 p-0'>
                            <IonTextarea inputmode='text'
                                maxlength={200}
                                placeholder="Configurações"
                                value={configuracao}
                                className='text-white'
                                onIonChange={(e) => preencherConfiguracao(e)}
                            />
                        </IonItem>
                    </IonCol>
                    {jobs()}
                </IonRow>
                <IonRow className='py-3 ion-justify-content-end pe-1' >
                    <Botoes botoes={botoes} />
                </IonRow>
            </div>
        </div>
    );
}

export default ModalExecPipeline;