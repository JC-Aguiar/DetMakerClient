import { TextareaChangeEventDetail, IonTextarea, IonButton, IonIcon, IonRow, IonCol, IonItem, IonGrid, IonBadge, IonSelect, IonSelectOption, useIonViewWillEnter, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonInput, InputChangeEventDetail, useIonViewDidEnter, IonLabel } from "@ionic/react";
import { save, shieldCheckmark, close, checkmarkDone } from "ionicons/icons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Botao, { BotaoProps, Botoes } from "../Core/Botao";
import { QueryInfoDTO } from "../../data/QueryInfoDTO";
import { FiltroSQL } from "../../data/FiltroSQL";
import * as AxiosRequest from "../../data/AxiosRequest";
import Informativo from "../Core/Informativo";
import { useDispatch, useSelector } from "react-redux";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";
import { RootState } from "../../Store/ReduxStore";
import e from "express";
import { ComandoSQL } from "../../data/ComandoSQL";
import GlassInput from "../Core/GlassInput";
import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { setJobQuerys } from "../../Store/Reducer/ReducerJobs";

export interface ModalConfigQueryProps {
    jobId: number,
    jobNome: string,
    queryInfo?: QueryInfoDTO,
    onSave?: () => void,
}

/**
 * Componente <ModalConfigQuery>
 * Se `queryInfo` seja informado, o componente estará no modo `Editar ConfigQuery`.
 * Senão, o componente estará no modo `Nova ConfigQuery`, com valores em branco e `id = -1`.
 */
const ModalConfigQuery: React.FC<ModalConfigQueryProps> = ({ jobId, jobNome, queryInfo, onSave = () => null }) => {
    //Atributos do componente
    const dispatch = useDispatch();
    const mainAmbinteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    const [loading, setLoading] = useState<boolean>(false);
    const [infos, setInfos] = useState<QueryInfoDTO>(queryInfo ? queryInfo : QueryInfoDTO.empty());
    const [inputFiltros, setInputFiltros] = useState<FiltroSQL[]>([]);
    const sqlValida = () => infos.sql.trim().length > 15;
    const configValida = () => infos.nome.length > 3
        && inputFiltros.every(filtro => filtro.tabela.length > 3)
        && sqlValida();
    //const sqlInputRef = useRef<HTMLIonTextareaElement>(null); 

    const obterQueryMetadados = async () => {
        const mensagemId = `Get_Query_Infos@${Date.now()}`;
        try {
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Obtendo dados da query configurada ID ${infos.id}.`,
                status: 'INFO'
            }));
            await AxiosRequest
                .getQueryFiltros(infos.id)
                .then(setInputFiltros);
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `Sucesso.`,
                status: 'OK'
            }));

        }
        catch (error) {
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${error}`,
                status: 'ERROR'
            }));
        }
        finally {
            setLoading(false);
        }
    }

    //Acionamento automático no carregamento, antes do componente ser renderizado
    //useLayoutEffect(() => {
    //sqlInputRef.current?.setFocus();
    //if (!queryInfo || queryInfo.id === -1) {
    //    setLoading(false);
    //    return;
    //}
    //obterQueryMetadados();
    //}, []);

    //Acionamento automático na alteração de determinadas variáveis

    useEffect(() => {
        setInputFiltros(
            ComandoSQL.getFiltrosFromQuery(infos.sql)
            //.filter(novoFiltro => !inputFiltros.some(filtro => FiltroSQL.isEquals(novoFiltro, filtro)))
        );
    }, [infos.sql]);

    const preencherNome = (event: CustomEvent<InputChangeEventDetail>) => {
        const nome = event.detail.value;
        if (!nome) return;
        setInfos(thisInfo => ({ ...thisInfo, nome: nome }));
    }

    //Handler para preencher a descrição dessa configuração
    const preencherDescricao = (event: CustomEvent<TextareaChangeEventDetail>) => {
        const descricao = event.detail.value;
        if (!descricao) return;
        setInfos(thisInfo => ({ ...thisInfo, descricao: descricao }));
    }

    //Handler para preencher query
    const preencherSql = (event: CustomEvent<TextareaChangeEventDetail>) => {
        const sql = event.detail.value;
        if (!sql) return;
        setInfos(thisInfo => ({ ...thisInfo, sql: sql }));
    }

    const preencherTabela = (e: CustomEvent<InputChangeEventDetail>, index: number) => {
        const valor = e.detail.value;
        if (!valor) return;
        if (inputFiltros.length <= index) return;
        setInputFiltros(thisFiltro => {
            thisFiltro[index].tabela = valor;
            return thisFiltro;
        });
    }

    async function saveNewConfigQuery(ambienteId: number, comando: ComandoSQL): Promise<QueryInfoDTO> {
        //Preparando requisição
        const titulo = `SALVANDO CONFIG-QUERY`;
        AxiosRequest.requestStart(titulo);

        const REQUEST_URL = "http://localhost:1990";
        const headers: AxiosRequestHeaders = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `${REQUEST_URL}/*`,
            "Access-Control-Allow-Methods": "POST, GET",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "60000",
        }

        let config: AxiosRequestConfig = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: `${REQUEST_URL}/query/ambiente/${ambienteId}`,
            headers: headers,
            timeout: 30000,
            data: comando,
        };
        //Executando requisição
        return await axios
            .request(config)
            .then((response) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw AxiosRequest.requestErro(titulo, error);
            });
    }

    //Realiza requisição para tentar salvar a nova configuração no banco  
    const salvar = async () => {
        const mensagemId = `Set_Query_Vars@${Date.now()}`;
        const mensagem = infos.id !== -1 ? `query configurada ID ${infos.id}` : "nova query configurada";
        try {
            setLoading(true);
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Salvando ${mensagem}.`,
                status: 'INFO'
            }));
            inputFiltros.forEach(filtro => console.log(filtro.coluna + ": " + filtro.variavel));
            const comando: ComandoSQL = {
                id: infos.id === -1 ? undefined : infos.id,
                jobId: jobId,
                nome: infos.nome,
                descricao: infos.descricao,
                sql: infos.sql,
                filtros: inputFiltros,
                valores: {},
                autopreenchimento: false,
            };
            const novaQuery = await saveNewConfigQuery(mainAmbinteId, comando);
            setInfos(novaQuery);
            dispatch(setJobQuerys({
                jobId: jobId,
                queries: [novaQuery]
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
        finally {
            setLoading(false);
        }
    }

    const tabelaFiltrosHeader = [
        "Variável",
        "Coluna",
        "Tabela",
        "Input",
    ];

    //Renderização visual do componente
    if (loading) return <Informativo status="Carregando" mensagem="Obtendo dados da Query no banco" />;
    return (
        <div className='position-relative mx-3 px-2'>
            <IonRow className="d-flex m-0 p-0 ms-1 mt-2 ion-align-items-center">
                <IonCol>
                    <IonItem lines="none" color="primary" className="word-wrap h5 lh-1 glass">
                        Job <span className="font-monospace ms-1 me-3">{jobNome}</span>
                        ID <span className="font-monospace mx-1">{jobId}</span>
                    </IonItem>
                </IonCol>
                <IonCol>
                    <GlassInput text="Nome">
                        <IonInput className='text-start font-monospace small m-0 p-0 py-2'
                            inputmode='text'
                            type="text"
                            maxlength={25}
                            value={infos.nome}
                            onIonChange={preencherNome}
                        />
                    </GlassInput>
                </IonCol>
            </IonRow>
            <GlassInput text="Descrição">
                <IonTextarea className='text-start font-monospace small m-0 p-0 py-2'
                    inputmode='text'
                    rows={1}
                    maxlength={500}
                    value={infos.descricao}
                    onIonChange={preencherDescricao}
                />
                <IonBadge color='#' className="position-fixed end-0 text-end" style={{ transform: 'translate(0%, -100%)' }}>
                    {infos.descricao.length}/500
                </IonBadge>
            </GlassInput>
            <GlassInput text="Query">
                <IonTextarea className='text-start font-monospace small m-0 p-0 py-2'
                    inputmode='text'
                    rows={4}
                    //ref={sqlInputRef}
                    maxlength={900}
                    value={infos.sql}
                    onIonChange={preencherSql}
                />
                <IonBadge color='#' className="position-fixed end-0 text-end" style={{ transform: 'translate(0%, -100%)' }}>
                    {infos.sql.length}/900
                </IonBadge>
            </GlassInput>
            <IonItem className="p-0 mx-0 my-2" lines="none">
                <IonGrid className="p-0 m-0">
                    <IonRow className="p-1 border-bottom" hidden={inputFiltros.length < 1}>
                        {
                            tabelaFiltrosHeader.map((col, index) =>
                                <IonCol key={index} className="p-0 m-0">{col}</IonCol>
                            )
                        }
                    </IonRow>
                    {
                        inputFiltros.map((filtro, index) => {
                            const color = index % 2 === 0 ? 'none' : 'medium'
                            return (
                                <div key={index}>
                                    <IonBadge hidden className="position-absolute" style={{ transform: 'translate(0%, 50%)' }}>
                                        {index + 1}
                                    </IonBadge>
                                    <IonItem className="p-0 m-0 small lh-1" color={color}>
                                        <IonCol className="p-0 m-0 small lh-1">
                                            {filtro.variavel.substring(0, 25)}
                                        </IonCol>
                                        <IonCol className="p-0 m-0 small lh-1">
                                            {filtro.coluna}
                                        </IonCol>
                                        <IonCol className="p-0 pe-3 m-0 lh-1">
                                            <IonInput inputmode='text'
                                                maxlength={50}
                                                placeholder="?"
                                                value={filtro.tabela}
                                                className='glass px-1 lh-1'
                                                onIonChange={(e) => preencherTabela(e, index)}
                                            />
                                        </IonCol>
                                        <IonCol className="p-0 m-0 small lh-1">
                                            {filtro.array ? "Múltiplo" : "Unitário"}
                                        </IonCol>
                                    </IonItem>
                                </div>
                            );
                        })
                    }
                </IonGrid>
            </IonItem>
            <IonRow className='ion-justify-content-end mt-5'>
                <Botao text="Salvar" icon={save} disabled={!configValida()} handler={salvar} /> 
            </IonRow>
        </div>
    );
}

export default ModalConfigQuery;