import { IonCard, IonAccordionGroup, IonAccordion, IonItem, IonCardHeader, IonCardTitle, IonCardContent, IonTitle, IonBadge, IonButton, IonIcon, IonRow, useIonModal, IonChip, IonLabel } from "@ionic/react";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addCircle, create, createOutline, trash } from "ionicons/icons";
import DynamicModal, { DynamicModalProps } from "../Core/DynamicModal";
import ModalConfigQuery from "../Modals/ModalConfigQuery";
import { useState } from "react";
import { QueryInfoDTO } from "../../data/QueryInfoDTO";
import GlassInput from "../Core/GlassInput";
import { useDispatch } from "react-redux";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";
import * as AxiosRequest from "../../data/AxiosRequest";
import { setJobQuerys, updateJob } from "../../Store/Reducer/ReducerJobs";
import Informativo from "../Core/Informativo";

export interface JobCardProps {
    jobDto: JobInfoDTO,
}

//Componente <JobCard>
const JobCard: React.FC<JobCardProps> = ({ jobDto }) => {

    //Atributos do componente
    const dispatch = useDispatch();
    const fonteCodigo = 'font-monospace text-white fw-bold'
    const [loading, setLoading] = useState<boolean>(false);
    const [queryInfo, setQueryInfo] = useState<QueryInfoDTO>(QueryInfoDTO.empty());
    const [modalQueryOn, modalQueryOff] = useIonModal(
        DynamicModal, {
        titulo: queryInfo.nome.length < 1 ? "Criar nova Query" : `Query ${queryInfo.nome}`,
        elemento: <ModalConfigQuery
            jobId={jobDto.id}
            jobNome={jobDto.nome}
            queryInfo={queryInfo}
            onSave={() => modalQueryOff()}
        />,
        onDismiss: () => modalQueryOff(),
    }
    );

    //Acionamento para abrir modal para editar as configurações da query
    const abrirModal = (configQuery?: QueryInfoDTO) => {
        setQueryInfo(configQuery ? configQuery : QueryInfoDTO.empty());
        modalQueryOn({ cssClass: 'modal-large' });
    }

    //Requisição para deletar uma configuração de query já existente
    const deletar = async (queryId: number) => {
        const mensagemId = `Delete_Query@${Date.now()}`;
        try {
            setLoading(true);
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Deletando query configurada ID ${queryId}.`,
                status: 'INFO'
            }));
            await AxiosRequest.deleteConfigQuery(queryId);
            dispatch(setJobQuerys({
                jobId: jobDto.id,
                queries: [...jobDto.queries.filter(item => item.id !== queryId)]
            }));
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
                <IonTitle color='primary' className='p-0'>Dados da Schedule</IonTitle>
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
                            jobDto.queries.map((queryItem, queryIndex) =>
                                <GlassInput
                                    key={queryIndex}
                                    text={queryItem.nome}
                                    textButtons={[
                                        { icon: createOutline, handler: () => abrirModal(queryItem) },
                                        { icon: trash, handler: () => deletar(queryItem.id) }
                                    ]}
                                >
                                    <IonLabel className={`${fonteCodigo} pt-3 pb-1 fw-bold text-wrap`} >
                                        {queryItem.sql}
                                    </IonLabel>
                                </GlassInput>
                            )
                        }
                        <IonRow className="m-0 p-0 ion-justify-content-start text-center">
                            <IonButton color='primary'
                                fill="clear"
                                className="m-0 w-100 opacity-50"
                                style={{ backgroundColor: `transparent` }}
                                //disabled={!camposPreenchidos()}
                                onClick={() => abrirModal()}
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
                                <IonBadge color="light" style={{ transform: 'translate(0, 5px)' }}>{jobDto.id}</IonBadge>
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