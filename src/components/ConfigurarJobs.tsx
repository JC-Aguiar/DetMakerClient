import { InputChangeEventDetail, IonButton, IonCard, IonCardTitle, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonReorderGroup, IonRow, IonTextarea, ItemReorderEventDetail, TextareaChangeEventDetail, useIonModal, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router';
import JobCard from './JobCard';
import { flash } from 'ionicons/icons';
import blueThunder from '../resources/thunder spark gif blue.gif';
import darkThunder from '../resources/thunder spark gif dark.gif';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/ReduxStore';
import * as axiosRequest from "../data/AxiosRequest";
import { JobConfig, } from '../data/JobConfigDTO';
import { useDispatch } from 'react-redux';
import DynamicModal from './DynamicModal';
import { addRevisao, removeRevisao } from '../Store/Reducer/ReducerRevisao';
import { PipelineInfoDTO } from '../data/PIpelineInfoDTO';
import { PipelineExecDTO } from '../data/PipelineExecDTO';
import { RelatorioInfoDTO } from '../data/RelatorioInfoDTO';
import { UserInfoDTO } from '../data/UserInfoDTO';
import { RelatorioHistoricoDTO } from '../data/RelatorioHistoricoDTO';
import { Noticacao } from './Noticacao';
import { reorderMainJobs, setMainJobs } from '../Store/Reducer/ReducerAtividade';
import { UserDTO } from '../data/UserDTO';
import { setRelatorios } from '../Store/Reducer/ReducerRelatorios';
import { JobExecuteDTO, parseJobConfigParaJobExecute } from '../data/JobExecuteDTO';


const ConfigurarJobs: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    //Propriedades do <ConfigurarJobs>
    const dispatch = useDispatch();
    const reorderGroupRef = useRef<HTMLIonReorderGroupElement>(null);
    const user: UserDTO | null = useSelector((state: RootState) => state.store.login.user);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineDescricao: string | undefined = useSelector((state: RootState) => state.store.catalogoPipelines.catalogo)
        .find((item) => item.nome === mainPipeline)?.nome;
    const history = useHistory();
    const [thunderGif, setThunderGif] = useState(blueThunder);
    const gif = mainPipeline !== "";

    //Acionamento assim que esta página for montada
    useIonViewDidEnter(() => {
        if (mainJobs.length === 0) {
            console.log(`[CONFIGURAR-JOBS] A pilha de jobs está vazia. Retornando página.`);
        }
        else {
            console.log(`[CONFIGURAR-JOBS] Carregando cards da pilha dos jobs selecionados.`);
        }
    }, []);

    //Botão customizado com efeitos visuais
    /*
    function textoBotao(texto: string) {
        const ativo = mainPipeline !== "" ?  "bg-white banner-gold" : "disabled border-white text-white";
        return (
            <span className={`btn btn-outline-primary border border-2 ${ativo} ps-2 pe-1 py-0 mx-1`}
                onMouseOver={() => setThunderGif(darkThunder)}
                onMouseLeave={() => setThunderGif(blueThunder)}
                onClick={() => modalConfigPipelineOn()}
            >
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-1" hidden={!gif} />
                <img src={thunderGif} alt="GIF Animado" id="thunder-gif-2" hidden={!gif} />
                {texto}
                <IonIcon icon={flash} />
            </span>
        );
    }

        
    function abrirDet(fileBlob: Blob) {
        //TODO: >>> OBTER O ARQUIVO E O CAMINHO DO ARQUIVO (PARA IFNORMAR O USUÁRIO) <<<
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
    }
    */

    function reordenar(event: CustomEvent<ItemReorderEventDetail>) {
        //Valida se a referência ao IonReorderGroup existe
        const itens = reorderGroupRef?.current?.children;
        if (!itens) return;

        //Métodos `from` e `to` contêm os índices (antes e depois) do item movido
        const ordemAntiga = event.detail.from;
        const ordemNova = event.detail.to;
        event.detail.complete();

        let jobDto: JobConfig | undefined = mainJobs.find((item) => item.ordem === ordemAntiga);
        if (!jobDto) return;
        console.log(`[CONFIG-JOBS]: Movendo job ${jobDto.nome} do index ${ordemAntiga} para ${ordemNova}.`);

        //Coleta no DOM do html o elemento interno com a informação do Job.id
        const ordemIds: number[] = [];
        Array.from(itens).map((item, ordem) => {
            //Expressão XPath para realizar a coleta
            const elementoAlvo = item.querySelector('ion-row ion-item ion-label ion-reorder ion-item ion-card span span span');
            if (!elementoAlvo) return
            console.log(`elementoAlvo: ${elementoAlvo.textContent}`);

            const id = elementoAlvo.textContent ? Number.parseInt(elementoAlvo.textContent) : -999;
            if (id === -999 || Number.isNaN(id)) return;
            //console.log(`ID: ${id}`);
            ordemIds.push(id);
        });

        console.log(`[CONFIG-JOBS]: IDS nova ordem: ${ordemIds}`);

        //Atualizando estado no Redux
        dispatch(reorderMainJobs({ ids: ordemIds }));
    }

    //Renderização do componente
    return (
        <div className='container mt-3 pt-2'>
            <IonCard className='glass text-white'>
                <IonCardTitle className='glass-content text-center'>
                    <span className='h6'>
                        Ordene os Jobs e configure suas propriedades no ícone da engrenagem<br/>
                        USe o menu lateral para adicionar novos Jobs quando quiser
                    </span>
                </IonCardTitle>
            </IonCard>
                <IonRow className='ion-justify-content-center p-0 m-0 w-100'>
                    <IonList className='w-100 py-2 px-2'>
                        <IonReorderGroup disabled={false} onIonItemReorder={reordenar} ref={reorderGroupRef} className='p-0 m-0' >
                        {
                            mainJobs.map((item, index) => 
                                <JobCard key={index} 
                                    jobExec={item}
                                    //jobUserInput={JobConfigUserInput[index]}
                                    notificacao={{ toastInfo, toastOk, toastErro } as Noticacao}
                                    callback={() => null}
                                />
                            )
                        }
                        </IonReorderGroup>
                    </IonList>
                </IonRow>
        </div>
    );
};

export default ConfigurarJobs;