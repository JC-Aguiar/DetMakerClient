import { IonCard, IonAccordionGroup, IonAccordion, IonItem, IonCardHeader, IonCardTitle, IonCardContent, IonTitle, IonBadge, IonButton, IonIcon, IonRow, useIonModal, IonLabel, useIonAlert } from "@ionic/react";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addCircle, close, createOutline, trash, trashOutline } from "ionicons/icons";
import DynamicModal from "../Core/DynamicModal";
import ModalConfigQuery from "../Modals/ModalConfigQuery";
import { useState } from "react";
import GlassInput from "../Core/GlassInput";
import { useDispatch, useSelector } from "react-redux";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";
import * as AxiosRequest from "../../data/AxiosRequest";
import Informativo from "../Core/Informativo";
import { RootState } from "../../Store/ReduxStore";
import { removeQuery } from "../../Store/Reducer/ReducerQueries";
import { QueryInfoDTO } from "../../data/QueryInfoDTO";
import { removerJobs as removerJobsCatalogo } from "../../Store/Reducer/ReducerJobs";
import { removerJobs as removerJobsPiepline } from "../../Store/Reducer/ReducerPipelines";

export interface JobCardProps {
    jobDto: JobInfoDTO,
}

//Componente <JobCard>
const JobCard: React.FC<JobCardProps> = ({ jobDto }) => {

    //Atributos do componente
    const dispatch = useDispatch();
    const fonteCodigo = 'font-monospace text-white fw-bold'
    const [loading, setLoading] = useState<boolean>(false);
    const queries: QueryInfoDTO[] = useSelector((state: RootState) => state.store.catalogoQueries.catalogo)
        .filter(item => item.jobId === jobDto.id);
    const [queryIndex, setQueryIndex] = useState<number>(-1);
    const [alerta] = useIonAlert();

    //Atributo da modal acionada pelo componente
    const [modalQueryOn, modalQueryOff] = useIonModal(DynamicModal, 
        {
            titulo: "Editar Configuração de Query",
            elemento: <ModalConfigQuery 
                        jobId={jobDto.id}
                        jobNome={jobDto.nome} 
                        queryInfo={queries[queryIndex]} 
                        onSave={() => modalQueryOff()} 
                    />,
            onDismiss: () => modalQueryOff(),
        }
    );

    //Handler para alertar ao usuário caso ele queira excluir o Jobs
    const exibirAlerta = () => {
        alerta({
            header: 'Deletar Job!',
            message: 'Tem certeza que deseja deletar esse Job da base da dados?',
            buttons: [
                'Não',
                { text: 'Sim', handler: (d) => deletarJob() }
            ],
        });
    };

    //Acionamento para abrir modal para editar as configurações da query
    const abrirModal = (index: number) => {
        setQueryIndex(index);
        modalQueryOn({ cssClass: 'modal-large' });
    }

    const deletarJob = async () => {
        const mensagemId = `Delete_Job@${Date.now()}`;
        try {
            setLoading(true);
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Deletando Job ${jobDto.nome} [${jobDto.id}].`,
                status: 'INFO'
            }));
            await AxiosRequest.deleteJobs([jobDto.id]);
            dispatch(removerJobsPiepline([jobDto.nome]));
            dispatch(removerJobsCatalogo([jobDto.nome]));
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

    //Requisição para deletar uma configuração de query já existente
    const deletarQuery = async (index: number) => {
        const queryAlvo = queries[index];
        const mensagemId = `Delete_Query@${Date.now()}`;
        try {
            if (!queryAlvo) 
                throw new String(`Erro ao deletar query configurada! Não localizada: Job ${jobDto.nome}, Query Nº${index}.`);
            if (!queryAlvo.id) 
                throw new String(`Erro ao deletar query configurada! Id inválido: Job ${jobDto.nome}, Query Nº${index}.`);

            setLoading(true);
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Deletando query configurada ID ${queryAlvo.id}.`,
                status: 'INFO'
            }));
            await AxiosRequest.deleteConfigQuery(queryAlvo.id);
            dispatch(removeQuery(index));
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

    //Exibe o conteúdo principal dentro do card (loading ou dados)
    const conteudo = () => {
        if (loading) return <Informativo status="Carregando" />
        return (
            <>
                <IonTitle color='primary' className='p-0'>
                    <IonLabel>Dados da Schedule</IonLabel>
                    <IonButton className="position-absolute end-0" 
                        fill="solid" 
                        shape="round" 
                        color="danger" 
                        size="small"
                        onClick={e => exibirAlerta()}
                    >
                        Excluir <IonIcon icon={trashOutline} size="small" style={{ transform: 'translate(0, -2px)' }} />
                    </IonButton>
                </IonTitle>
                    <section className="mb-4">
                        <table className="table table-stripe">
                            <tbody className='text-white fw-bold'>
                                <tr className='p-0 m-0'>
                                    <td className='text-end' style={{ width: '0%' }}>Descrição:</td>
                                    <td className='' colSpan={3}>
                                        <span className={fonteCodigo}>{jobDto.descricao}</span>
                                    </td>
                                </tr>
                                <tr className='p-0 m-0'>
                                    <td className='text-end'>Fase:</td>
                                    <td colSpan={3}>
                                        <span className={fonteCodigo}>{jobDto.fase}</span>
                                    </td>
                                </tr>
                                <tr className='p-0 m-0'>
                                    <td className='text-end'>Programas:</td>
                                    <td colSpan={3}>
                                        <span className={fonteCodigo}>{jobDto.programa.join(", ")}</span>
                                    </td>
                                </tr>
                                <tr className='p-0 m-0'>
                                    <td className='text-end'>Tabelas:</td>
                                    <td colSpan={3}>
                                        <span className={fonteCodigo}>{jobDto.tabelas.join(", ")}</span>
                                    </td>
                                </tr>
                                <tr className='p-0 m-0'>
                                    <td className='text-end'>Máscara Carga:</td>
                                    <td colSpan={3}>
                                        <span className={fonteCodigo}>{jobDto.mascaraEntrada.join(", ")}</span>
                                    </td>
                                </tr>
                                <tr className='p-0 m-0'>
                                    <td className='text-end'>Máscara Produto:</td>
                                    <td colSpan={3}>
                                        <span className={fonteCodigo}>{jobDto.mascaraSaida.join(", ")}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <IonTitle color='primary' className='p-0'>Queries Configuradas</IonTitle>
                        {
                            queries.map((item, index) =>
                                <GlassInput
                                    key={index}
                                    text={item.nome}
                                    textButtons={[
                                        { icon: createOutline, handler: () => abrirModal(index) },
                                        { icon: trash, handler: () => deletarQuery(index) }
                                ]}>
                                    <IonLabel className={`${fonteCodigo} pt-3 pb-1 fw-bold text-wrap`} >
                                        {item.sql}
                                    </IonLabel>
                                </GlassInput>
                            )
                        }
                        <IonRow className="m-0 p-0 ion-justify-content-start text-center">
                            <IonButton color='primary'
                                fill="clear"
                                className="m-0 w-100 opacity-50"
                                style={{ backgroundColor: `transparent` }}
                                onClick={() => abrirModal(-1)}
                            >
                                <IonIcon icon={addCircle} size="large" />
                                Adicionar nova query
                            </IonButton>
                        </IonRow>
                    </section>
            </>
        );
    }

    //Renderização do componente
    return (
        <IonCard>
            <IonAccordionGroup>
                <IonAccordion value="first">
                    <IonItem slot="header" color="primary" className='' >
                        <IonCardHeader className='p-0'>
                            <IonCardTitle color='dark' className='p-0'>
                                <IonBadge color="light" style={{ transform: 'translate(0, 5px)' }}>ID {jobDto.id}</IonBadge>
                                <span className="ms-1">{jobDto.nome}</span>
                            </IonCardTitle>
                        </IonCardHeader>
                    </IonItem>
                    <div className='glass rounded-0 rounded-bottom' slot="content">
                        <IonCardContent className='glass-content rounded-0 rounded-bottom small'>
                            {conteudo()}
                        </IonCardContent>
                    </div>
                </IonAccordion>
            </IonAccordionGroup>
        </IonCard>
    );
}

export default JobCard;