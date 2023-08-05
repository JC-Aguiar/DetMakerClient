import { IonCheckbox, IonContent, IonIcon, IonPage, useIonViewDidEnter } from '@ionic/react';
import { AgendaDTO } from '../components/AgendaDTO';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { AgendaParaPilha, agenda } from '../App';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { validarExibirData } from './AbrirSchedule';
import { controlePilhaPronta } from './ConfigurarJobs';

const EscolherJobs = (props: any) => {
    const [checks, setChecks] = useState<boolean>(true);
    const history = useHistory();
    const callBack = props.callBack;
    const callBackErase = props.callBackErase;

    async function jobsCallBack(agenda: AgendaDTO) {
        console.log(`[ESCOLHER-JOBS] Realizando callback do job ${agenda.job}`);
        const config: AgendaParaPilha = { 
            add: agenda.checked, 
            agenda: agenda 
        }
        callBack(config);
    }

    async function jobsCallBackErase() {
        console.log(`[ESCOLHER-JOBS] Realizando callback para limpar todos os jobs`);
        callBackErase();
    }

    /*
    CÓDIGO ÚTIL (BACK-UP):
        useEffect(() => {
            try {
                if (!match) {
                    return;
                }
    
                if (location.state && location.state.data) {
                    const planilhasDTO: AgendaDTO[] = JSON.parse(location.state.data);
                    setData(planilhasDTO);
                    console.log(`location.state: ${location.state}`);
                    console.log(`data: ${data}`);
                    data.map((elemento, index) => {
                        console.log(elemento.job);
                    });
                }
                else {
                    throw "Nenhum job informado. Retornando página.";
                }
            }
            catch (error) {
                console.error(error);
                //history.goBack();
            }
        }, [location.state, match]);

        useIonViewDidEnter(() => {
            try {
                if (location.state && location.state.data) {
                    const planilhasDTO: AgendaDTO[] = JSON.parse(location.state.data);
                    setData(planilhasDTO);
                    console.log(`location.state: ${location.state}`);
                    console.log(`data: ${data}`);
                    data.map((elemento, index) => {
                        console.log(elemento.job);
                    });
                }
                else {
                    throw "Nenhum job informado. Retornando página.";
                }
            }
            catch (error) {
                console.error(error);
                history.goBack();
            }
        }, [location.state]);
    */

    useIonViewDidEnter(() => {
        if (agenda.length === 0) {
            console.log(`[ESCOLHER-JOBS] A agenda está vazia. Retornando página.`);
            history.goBack();
        }
        else {
            console.log(`[ESCOLHER-JOBS] Carregando tabela com base na agenda disponível.`);
        }
    }, []);

    async function checkAll() {
        //setChecks(checks ? false : true);
        console.log(`[ESCOLHER-JOBS] Alterando check de todos os jobs para ${checks}`);
        jobsCallBackErase();
        agenda.map((elemento, index) => {
            elemento.checked = checks;
            checkJob(elemento, index);
        });
    }

    async function checkJob(dto: AgendaDTO, index: number) {
        dto.checked = dto.checked ? false : true;
        //const mensagem = elemento.checked ? "selecionado" : "desselecionado";
        //console.log(`[ESCOLHER-JOBS] ${mensagem} Job ${elemento.id}: ${elemento.job}`);
        document.getElementById(`job-index-${index}`)!.style.backgroundColor = dto.checked ? 'yellow' : 'transparent';
        if (!dto.checked) {
            controlePilhaPronta(-1, dto, [], [], [], false);
        }
        await jobsCallBack(dto);
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true}>
                <div className='pt-3 pt-md-4'></div>
                <div className="card border bg-white border-2 mx-0 mx-md-4" id="capa-schedule">
                    <h1 className="card-title destaque lh-1 m-0 text-center">
                        Schedule
                    </h1>
                    <h3 className="card-text h3 text-primary ms-2 text-center">
                        Documentação detalhada dos jobs disponíveis.
                    </h3>
                    <div className="schedule-tabela px-1">
                        <div className="my-3"></div>
                        <section className="schedule-tabela scroll text-center">
                            <table className="table p-0 m-0"> {/* table-light table-striped */}
                                <thead className='sticky-top align-items-center align-middle '>
                                    <tr className='text-white '>
                                        <th className='bg-primary'>
                                            <button className='btn btn-outline-light p-1 m-0 d-flex' onClick={checkAll}>
                                                <IonIcon icon={checks ? closeCircle : checkmarkCircle} size='large' />
                                            </button>
                                        </th>
                                        <th className='bg-primary'>JOB ID</th>
                                        <th className='bg-primary'>EXECUTA APÓS ID</th>
                                        <th className='bg-primary'>GRUPO CONCORRÊNCIA</th>
                                        <th className='bg-primary'>FASE</th>
                                        <th className='bg-primary'>JOB NOME</th>
                                        <th className='bg-primary td-long'>JOB DESCRIÇÃO</th>
                                        <th className='bg-primary'>GRUPO UDA</th>
                                        <th className='bg-primary'>PROGRAMA</th>
                                        <th className='bg-primary'>TABELAS ATUALIZADAS</th>
                                        <th className='bg-primary'>SERVIDOR</th>
                                        <th className='bg-primary'>CAMINHO JOB</th>
                                        <th className='bg-primary'>PARÂMETROS</th>
                                        <th className='bg-primary td-long'>DESCRIÇÕES PARÂMETROS</th>
                                        <th className='bg-primary'>ARQUIVO ENTRADA (CAMINHO)</th>
                                        <th className='bg-primary td-long'>ARQUIVO ENTRADA (MÁSCARA)</th>
                                        <th className='bg-primary'>ARQUIVO SAÍDA (CAMINHO)</th>
                                        <th className='bg-primary'>ARQUIVO SAÍDA (MÁSCARA)</th>
                                        <th className='bg-primary'>LOG (CAMINHO)</th>
                                        <th className='bg-primary td-long'>LOG (MÁSCARA)</th>
                                        <th className='bg-primary'>TRATAMENTO</th>
                                        <th className='bg-primary'>ESCALATION</th>
                                        <th className='bg-primary'>DATA ATUALIZAÇÃO</th>
                                        <th className='bg-primary'>ATUALZIADO POR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        agenda.map((dto, index) => {
                                            const indexId: string = `job-index-${index}`;
                                            return (
                                                <tr className="font-monospace" id={indexId}>
                                                    <td>
                                                        <IonCheckbox
                                                            className="check-box"
                                                            checked={dto.checked}
                                                            onClick={() => checkJob(dto, index)}
                                                        />
                                                    </td>
                                                    <td className='bg-transparent'> {dto.id} </td>
                                                    <td className='bg-transparent'> {dto.executarAposJob.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.grupoConcorrencia} </td>
                                                    <td className='bg-transparent'> {dto.fase} </td>
                                                    <td className='bg-transparent'> {dto.job} </td>
                                                    <td className='bg-transparent'> {dto.descricao} </td>
                                                    <td className='bg-transparent'> {dto.grupoUda} </td>
                                                    <td className='bg-transparent'> {dto.programa.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.tabelas.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.servidor} </td>
                                                    <td className='bg-transparent'> {dto.caminhoExec} </td>
                                                    <td className='bg-transparent'> {dto.parametros.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.descricaoParametros.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.diretorioEntrada} </td>
                                                    <td className='bg-transparent'> {dto.mascaraEntrada.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.diretorioSaida} </td>
                                                    <td className='bg-transparent'> {dto.mascaraSaida.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.diretorioLog} </td>
                                                    <td className='bg-transparent'> {dto.mascaraLog.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.tratamento} </td>
                                                    <td className='bg-transparent'> {dto.escalation} </td>
                                                    <td className='bg-transparent'> {validarExibirData(dto.dataAtualizacao)} </td>
                                                    <td className='bg-transparent'> {dto.atualizadoPor} </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </section>
                    </div>
                    <div className='mb-5'></div>
                </div>
                <div className='pt-3 pt-md-5'></div>
            </IonContent>
        </IonPage>
    );
};

export default EscolherJobs;
