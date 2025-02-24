import { IonBadge, IonChip, IonIcon, IonItem, IonLabel, IonReorder, IonRow, useIonModal } from "@ionic/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { PipelineJobCargaDTO, JobConfig } from "../../data/JobConfig";
import { apps, bookmark, chatboxEllipses, closeCircleOutline, cube } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import * as axiosRequest from "../../data/AxiosRequest";
import DynamicModal from "../Core/DynamicModal";
import { JobInfoDTO } from "../../data/JobInfoDTO";
import { addMensagem, atualizarMensagem, removeOneMainJob, updateOneMainJob } from "../../Store/Reducer/ReducerAtividade";
import Uploader from "../Core/Uploader";
import { ListaRetratrilAgrupada, ListaRetratrilProps } from "../Core/ListaRetratil";
import GlassInput from "../Core/GlassInput";
import { QueryInfo } from "../../data/QueryInfoDTO";
import JobCard from "./JobCard";

//Interface com os atributos do componente <ConfigJobItem>
export interface ConfigJobItemProps {
    index: number,
}

//Interface dos métodos acionáveis via referência do <ListaVariaveisPipeline>
export interface ConfigJobItemRef {
    cargas: { jobIndex: number, arquivos: PipelineJobCargaDTO[] }
}

//Componente <ConfigJobItem>
const ConfigJobItem = forwardRef<ConfigJobItemRef, ConfigJobItemProps>((props, ref) => {

    //Atributos principais de controle
    const dispatch = useDispatch();
    const index = props.index;
    const jobExec: JobConfig | undefined = useSelector((state: RootState) => state.store.configAtividade.mainPipelineJobs)[index];
    const id = jobExec != undefined ? jobExec.id : -1;
    const nome = jobExec !== undefined ? jobExec.nome : "";
    const jobInfo: JobInfoDTO | undefined = useSelector(
        (state: RootState) => state.store.catalogoJobs.catalogo.filter(item => item.id === id)[0]
    );
    const queries: QueryInfo[] = useSelector(
        (state: RootState) => state.store.catalogoQueries.catalogo.filter(item => item.jobId === id)
    );
    const [jobConfigurado, setJobConfigurado] = useState<JobConfig>({ ...jobExec });
    const mainAmbienteId: number = useSelector((state: RootState) => state.store.configAtividade.mainAmbienteId);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const [cargas, setCargas] = useState<PipelineJobCargaDTO[]>([]);

    //Acionamento sempre que o JobConfig desse componente sofre qualquer alteração
    useEffect(() => {
        setJobConfigurado(jobExec);
    }, [jobExec]);

    //Disponibilizando os métodos acionáveis via referência 
    useImperativeHandle(ref, () => ({
        cargas: { jobIndex: index, arquivos: cargas }
    }));

    //Atributos para padrões de estilização
    const textoCodigo = (texto: string, info: string) => {
        return <span className="mx-1 small">
            <span className="text-white">{texto}</span> <span className="font-monospace">{info}</span>
        </span>
    };
    const textoLista = (texto: string, lista: string[]) => {
        return <span className="mx-1">
            <span className="text-white">{texto}</span>
            <ol className="m-0">
                {
                    lista.map((item, index) => <li key={index} className="font-monospace">{item}</li>)
                }
            </ol>
        </span>
    };
    const labelTitulo = (texto: string, htmlIdFor: string) => {
        return <label className="form-label fw-bold text-white pb-1 mb-0" htmlFor={htmlIdFor}>
            {texto}
        </label>
    };
    const badgeInfo = (texto: string, x: number, y: number) => {
        return <IonBadge color='tertiary'
            className="border m-1 sticky-top text-start ion-justify-content-start"
            style={{ position: 'absolute', top: `0%`, left: `0%`, transform: `translate(${x}%, ${y}%)` }}
        >
            {texto}
        </IonBadge>
    };

    //Método para salvar este JobCard (objeto ConfigJob) preenchido pelo usuário no banco
    async function salvandoItem() {
        dispatch(updateOneMainJob(jobConfigurado));
    }

    //Método de tratamento dos inputs do usuário para as Cargas
    const preencherCarga = (cargaIndex: number, files: FileList | null) => {
        if (cargaIndex < 0) return;
        const mensagemId = `Set_Cargas@${Date.now()}`;
        try {
            if (!files || files.length < 1) {
                dispatch(addMensagem({
                    id: mensagemId,
                    texto: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Arquivos de carga removidos.`,
                    status: 'INFO'
                }));
                setCargas(atual => {
                    const novas = atual.slice();
                    novas.splice(cargaIndex, 1);
                    return novas;
                });
                return;
            }
            let sucessos = 0;
            for (let index = 0; index < files.length; index++) {
                const file = files?.[index];
                console.log(`[MODAL CONFIG-JOB]: Anexando arquivo '${file.name}'.`);
                const reader = new FileReader();
                reader.onload = () => {
                    const cargaNova: PipelineJobCargaDTO = {
                        nome: file.name,
                        conteudo: reader.result as string,
                        tipo: file.type,
                    };
                    setCargas(atual => {
                        const novas = atual.slice();
                        novas[cargaIndex] = cargaNova;
                        return novas;
                    });
                };
                reader.readAsText(file);
                console.log(`[MODAL CONFIG-JOB]: Arquivo '${file.name}' anexado com sucesso.`);
                sucessos++;
            }
            dispatch(addMensagem({
                id: mensagemId,
                texto: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Total de ${sucessos}/${files.length} de carga(s) carregadas com sucesso.`,
                status: 'INFO'
            }));
        }
        catch (error) {
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Erro no processo de carga. ${error}`,
                status: 'INFO'
            }));
        }
    }

    //Exibindo dados do Job no card
    const informacoes = () => {
        if (!jobInfo || !jobExec) return;

        const sessoes: { icon: string, content: JSX.Element }[] = [];

        if (jobInfo.programa.length > 0) {
            sessoes.push({
                icon: cube,
                content: textoCodigo("Programas: ", jobInfo.programa.join(", "))
            });
        }
        if (jobInfo.grupoUda.length > 0) {
            sessoes.push({
                icon: bookmark,
                content: textoCodigo(`Grupo: `, `UDA${jobInfo.grupoUda}`)
            });
        }
        sessoes.push({
            icon: chatboxEllipses,
            content: textoCodigo(`Descrição: `, jobInfo.descricao)
        });

        const listaJobDados: ListaRetratrilProps[] = [];
        if (jobInfo.mascaraLog.length > 0) {
            listaJobDados.push({
                title: "Logs:",
                glass: false,
                content: <ol className="small">
                    {
                        jobInfo.mascaraLog.map((item, index) =>
                            <li key={index} className="ms-3">{item}</li>
                        )
                    }
                </ol>
            });
        }
        if (queries.length > 0) {
            listaJobDados.push({
                title: "Queries:",
                glass: false,
                content: <ol className="small">
                    {
                        queries.map(
                            (item, index) => <li key={index} className="ms-3">{item.sql}</li>
                        )
                    }
                </ol>
            });
        }

        return (
            <GlassInput text="Informações">
                <div className="mt-3">
                    {
                        sessoes.map((item, index) => <IonItem key={index} lines="none" className="border-bottom my-0 py-0">
                            <IonIcon icon={item.icon} color="light" size="small" className="p-0 mx-3 " />
                            {item.content}
                        </IonItem>
                        )
                    }
                    <ListaRetratrilAgrupada listas={listaJobDados} />
                </div>
            </GlassInput>
        );
    }

    //Faz a validação da query já preenchida (tanto manual, quanto autmática)
    const validarQuery = async (query: string) => {
        const mensagemId = `Check_Query@${Date.now()}`;
        dispatch(addMensagem({
            id: mensagemId,
            texto: `Pipeline '${mainPipeline}' - Job '${jobInfo.nome}': Validando query.`,
            status: 'INFO'
        }));
        try {
            const resultado: string = await axiosRequest.validarQuery(mainAmbienteId, query);
            dispatch(atualizarMensagem({
                id: mensagemId,
                complmento: `${resultado}`,
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
    }

    //Criando a Modal desse componente
    const [modalInfoOn, modalInfoOff] = useIonModal(DynamicModal,
        {
            titulo: <>
                <span className="badge bg-white me-1 text-primary">ID {id}</span>
                {nome}
            </>,
            elemento: <JobCard jobDto={jobInfo} />,
            onDismiss: () => modalInfoOff(),
        }
    );

    //Renderização do componente
    if (!jobExec || !jobInfo) return null;
    return (
        <IonRow className="ion-justify-content-between w-100">
            <IonItem className="w-100 border-top m-0 p-0 d-flex ion-align-items-start" lines="none">
                <IonReorder slot="start" className='d-flex bg-transparent p-0 m-0 mt-3 pt-1'>
                    <IonBadge color="tertiary" className="d-flex p-1 pe-2 m-0 item-lista">
                        <IonIcon icon={apps} size="small" className="m-0 p-0" style={{ transform: 'scale(0.5)' }} />
                        <IonLabel className="text-white p-0 m-0 h6 ">
                            {jobExec.ordem}º
                        </IonLabel>
                    </IonBadge>
                </IonReorder>
                <div className="w-100 ms-2">
                    <JobCard jobDto={jobInfo} />
                    <div className="px-1 mb-2" hidden={!jobInfo.mascaraEntrada || jobInfo.mascaraEntrada.length < 1}>
                        {labelTitulo('CARGAS DE CONSUMO', `job${id}-carga`)}
                        {
                            jobInfo.mascaraEntrada.map((item, cargaIndex) => <Uploader
                                key={cargaIndex}
                                accept=".log, .txt, .gz"
                                //arquivosAtuais={jobExec.cargas.map(item => item.nome)}
                                multiple={true}
                                titulo={item}
                                trigger={(arquivos) => preencherCarga(cargaIndex, arquivos)} //AQUI!
                            />
                            )
                        }
                    </div>
                </div>
                <IonChip
                    color="light"
                    className="m-0 p-0 mt-3 pt-1 item-lista bg-transparent"
                    style={{ transform: 'scale(1.5) translate(-2px, 0px)' }}
                    onClick={() => dispatch(removeOneMainJob(index))}
                >
                    <IonIcon icon={closeCircleOutline} className="p-0 m-0" />
                </IonChip>
            </IonItem>
        </IonRow>
    );
});

export default ConfigJobItem;