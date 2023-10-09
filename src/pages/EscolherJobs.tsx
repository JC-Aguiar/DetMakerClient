import { IonCheckbox, IonContent, IonIcon, IonPage, useIonViewDidEnter } from '@ionic/react';
import { JobDTO } from '../components/JobDTO';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { AgendaParaPilha } from '../App';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { validarExibirData } from './AbrirSchedule';
import { useDispatch, useSelector } from 'react-redux';
import { ItemPilha } from '../components/ItemPilha';
import { RootState } from '../Store/ReduxStore';
import { checkItemPilha } from '../Store/Reducer/ReducerPilhaJobs';

const EscolherJobs = (props: any) => {
    const dispatch = useDispatch();
    const pilha: ItemPilha[] = useSelector((state: RootState) => state.store.pilhaJobs.value);
    const [checks, setChecks] = useState<boolean>(true);
    const history = useHistory();

    useIonViewDidEnter(() => {
        console.log(`[ESCOLHER-JOBS] Agenda Jobs: ${pilha.map((itemPilha) => itemPilha.job.nome).join(", ")}`);
        if (pilha.length === 0) {
            console.log(`[ESCOLHER-JOBS] A agenda está vazia. Retornando página.`);
            history.push('/det-maker/open/');
        }
        else {
            console.log(`[ESCOLHER-JOBS] Carregando tabela com base na agenda disponível.`);
        }
    }, []);

    async function handlerCheckAll() {
        //setChecks(checks ? false : true);
        console.log(`[ESCOLHER-JOBS] Alterando check de todos os jobs para 'false'`);
        pilha.filter((itemPilha) => itemPilha.job.checked)
            .forEach((itemPilha) => {
                checkJob(itemPilha.job.id, false)
            });
    }

    function handlerCheckJob(itemAgenda: JobDTO) {
        const checked = itemAgenda.checked ? false : true;
        checkJob(itemAgenda.id, checked);
    }

    function checkJob(id: number, checked: boolean) {
        dispatch(checkItemPilha({id: id, checked: checked}));
        document.getElementById(`job-index-${id}`)!.style.backgroundColor = checked ? 'yellow' : 'transparent';
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true}>
                <div className='pt-3 pt-md-4'></div>
                <div className="card border bg-white border-2 mx-0 mx-md-4" id="capa-schedule">
                    <h1 className="card-title destaque-low lh-1 m-0 text-center">
                        Schedule
                    </h1>
                    <h5 className="card-text h5 text-primary ms-2 text-center">
                        Documentação detalhada dos jobs disponíveis.
                    </h5>
                    <div className="schedule-tabela px-1">
                        <div className="my-3"></div>
                        <section className="schedule-tabela scroll text-center">
                            <table className="table p-0 m-0"> {/* table-light table-striped */}
                                <thead className='sticky-top align-items-center align-middle '>
                                    <tr className='text-white '>
                                        <th className='bg-primary'>
                                            <button className='btn btn-outline-light p-1 m-0 d-flex' onClick={handlerCheckAll}>
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
                                        pilha.map((itemPilha, index) => {
                                            const dto = itemPilha.job;
                                            const indexId: string = `job-index-${dto.id}`;
                                            return (
                                                <tr className="font-monospace" id={indexId}>
                                                    <td>
                                                        <IonCheckbox
                                                            className="check-box"
                                                            checked={dto.checked}
                                                            onClick={() => handlerCheckJob(dto)}
                                                        />
                                                    </td>
                                                    <td className='bg-transparent'> {dto.id} </td>
                                                    <td className='bg-transparent'> {dto.executarAposJob.join(", ")} </td>
                                                    <td className='bg-transparent'> {dto.grupoConcorrencia} </td>
                                                    <td className='bg-transparent'> {dto.fase} </td>
                                                    <td className='bg-transparent'> {dto.nome} </td>
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
function removeItemPilha(itemPilha: any): any {
    throw new Error('Function not implemented.');
}

