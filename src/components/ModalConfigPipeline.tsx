import { IonTextarea, IonButton, IonInput, IonLabel, IonItem, InputChangeEventDetail, TextareaChangeEventDetail } from "@ionic/react";
import { useState } from "react";
import { Notificacao } from "./Noticacao";
import { useDispatch, useSelector } from 'react-redux';
import { JobConfig } from "../data/JobConfigDTO";
import { PipelineInfoDTO } from "../data/PIpelineInfoDTO";
import { RootState } from "../Store/ReduxStore";
import * as axiosRequest from "../data/AxiosRequest";
import { setRelatorios } from "../Store/Reducer/ReducerRelatorios";
import { removeRevisao, addRevisao } from "../Store/Reducer/ReducerRevisao";
import { JobExecuteDTO, parseJobConfigParaJobExecute } from "../data/JobExecuteDTO";
import { PipelineExecDTO } from "../data/PipelineExecDTO";
import { RelatorioHistoricoDTO } from "../data/RelatorioHistoricoDTO";
import { RelatorioInfoDTO } from "../data/RelatorioInfoDTO";
import { UserInfoDTO } from "../data/UserInfoDTO";
import { UserDTO } from "../data/UserDTO";
import { useHistory } from "react-router";

const ModalConfigPipeline: React.FC<Notificacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Atrbiutos Redux e React
    const dispatch = useDispatch();
    const history = useHistory();

    //Atributos próprios
    const [projetoId, setProjetoId] = useState<string>("");
    const [projetoNome, setProjetoNome] = useState<string>("");
    const [atividadeNome, setAtividadeNome] = useState<string>("");
    const [configuracao, setConfiguracao] = useState<string>("");

    //Atributos globais
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);  
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);  
    const mainPipelineDescricao: string | undefined = useSelector(
        (state: RootState) => state.store.catalogoPipelines.catalogo)
        .find((item) => item.nome === mainPipeline)?.nome;
    const mainClienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainClienteId);

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
        return projetoId.trim().length > 0 && projetoNome.trim().length > 0 && atividadeNome.trim().length > 0;
    }

    //Requisição para executar a Pipeline
    async function executarPipeline() {
        console.log(`[CONFIGURAR-JOBS]: Iniciando requisição 'Executar Pipeline'.`);
        //modalConfigPipelineOff();
        if (!camposPreenchidos || !mainPipelineDescricao) {
            console.log('[CONFIGURAR-JOBS]: Preencha os campos antes de executar a Pipeline!');
            return;
        };
        toastInfo("EXECUTAR PIPELINE: Em execução...", []);
        try {
            const pipelineDto: PipelineInfoDTO = {
                id: mainPipelineId,
                nome: mainPipeline,
                descricao: mainPipelineDescricao,
                clienteId: mainClienteId,
                jobs: mainJobs.map((item) => item.nome),
                checked: true,
            };
            const relatorioDto: RelatorioInfoDTO = {
                idProjeto: projetoId,
                nomeProjeto: projetoNome,
                nomeAtividade: atividadeNome,
                configuracao: configuracao,
                testeTipo: "Unitário",
            };
            console.log('[CONFIGURAR-JOBS]: Copvnertendo JobConfig para JobExecuteDTO...');
            const jobsDto: JobExecuteDTO[] = mainJobs.map((item) => {
                //console.log(JSON.stringify(item));
                return parseJobConfigParaJobExecute(item);
            });
            const body: PipelineExecDTO = {
                pipeline: pipelineDto,              //TODO: informação repetida aqui
                relatorio: relatorioDto,
                jobs: jobsDto,
                userInfo: {
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
            dispatch(setRelatorios([]));
            //dispatch(loadingRelatorios(false));
            toastOk("EXECUTAR PIPELINE: Realizada com sucesso.", buttons);
            console.log(`[CONFIGURAR-JOBS]: Requisição 'Executar Pipeline' funcionou.`);
            
            
        }
        catch (error) {
            toastErro(`EXECUTAR PIPELINE: ${error}`, []);
            console.error(`[CONFIGURAR-JOBS]: Requisição 'Executar Pipeline' falhou.`);
        }
    }

    if (mainPipeline === "") return<></>;
    return (
        <div className="row justify-content-center px-3 mx-0">
            <div className='col row mt-2 px-0 mx-0 glass'>
                <div className='h5 bg-primary text-center text-white py-1 mb-3 rounded-top rounded-top-2'>
                    Preencha os dados abaixo para prosseguir
                </div>
                <IonItem className='text-primary'>
                    <IonLabel className='fw-bold me-4 '>Projeto Id:</IonLabel>
                    <IonInput inputmode='text'
                        type='text'
                        size={10}
                        maxlength={7}
                        value={projetoId}
                        className='glass text-white m-1 ms-3 me-3'
                        style={{width: '256px', maxWidth: '256px'}}
                        onIonChange={(e) => preencherProjetoId(e)}
                        required
                    />
                    <IonLabel className='fw-bold '>Projeto Nome:</IonLabel>
                    <IonInput inputmode='text'
                        type='text'
                        size={50}
                        maxlength={200}
                        value={projetoNome}
                        className='glass text-white m-1'
                        onIonChange={(e) => preencherProjetoNome(e)}
                        required
                    />
                </IonItem>
                <IonItem className='text-primary'>
                    <IonLabel className='fw-bold me-4'>Atividade:</IonLabel>
                    <IonInput inputmode='text'
                        maxlength={300}
                        value={atividadeNome}
                        className='glass text-white m-1 ms-3'
                        onIonChange={(e) => preencherAtividade(e)}
                        required
                    />
                </IonItem>
                <IonItem className='text-primary'>
                    <IonLabel className='fw-bold'>Configurações:</IonLabel>
                    <IonTextarea inputmode='text'
                        maxlength={200}
                        value={configuracao}
                        className='glass text-white m-1'
                        onIonChange={(e) => preencherConfiguracao(e)}
                    />
                </IonItem>
                <div className='py-3' />
                <IonButton color='primary' 
                    className='session-login-button' 
                    fill="solid" 
                    disabled={!camposPreenchidos()}
                    onClick={() => executarPipeline()}
                >
                    EXECUTAR
                </IonButton>
                <div className='pb-3' />
            </div>
        </div>
    );
}

export default ModalConfigPipeline;