import { IonIcon, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { JobConfigDTO } from '../data/JobExecute';
import { RootState } from '../Store/ReduxStore';
import { checkItemPilha } from '../Store/Reducer/ReducerPilhaJobs';
import JobSchedule from '../components/JobSchedule';
import { Noticacao } from '../components/Noticacao';

const EscolherJobs: React.FC<Noticacao> = ({ toastInfo, toastOk, toastErro }) => {
    const dispatch = useDispatch();
    const pilha: JobConfigDTO[] = useSelector((state: RootState) => state.store.pilhaJobs.value);
    const [checks, setChecks] = useState<boolean>(true);
    const history = useHistory();

    useIonViewDidEnter(() => {
        //dispatch(show());
        if (pilha.length === 0) {
            console.log(`[ESCOLHER-JOBS] A pilha de jobs está vazia. Retornando página.`);
            history.push('/det-maker/open/');
        }
        else {
            console.log(`[ESCOLHER-JOBS] Carregando tabela com base na pilha de jobs disponíveis.`);
        }
    }, []);

    async function handlerCheckAll() {
        console.log(`[ESCOLHER-JOBS] Alterando check de todos os jobs para 'false'`);
        pilha.forEach((itemPilha) => dispatch( 
            checkItemPilha({
                id: itemPilha.job.id, 
                checked: false,
                ordem: itemPilha.ordem
            })
        ));
    }

    return (
        <div className="schedule-tabela px-1">
            <div className="my-3"></div>
            <section className="schedule-tabela scroll text-center">
                <table className="table p-0 m-0"> {/* table-light table-striped */}
                    <thead className='sticky-top align-items-center align-middle '>
                        <tr className='text-white fs-6'>
                            <th className='bg-primary'>
                                <button className='btn btn-outline-light bg-transparent border-0 p-1 pb-0 m-0' onClick={handlerCheckAll}>
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
                            const job = itemPilha.job;
                            const indexId: string = `job-index-${job.id}`;
                            return <JobSchedule job={job} indexId={indexId} ordem={itemPilha.ordem} key={index} />
                        })
                    }
                    </tbody>
                </table>
            </section>
            <div className='mb-5'></div>
        </div>
    );
};

export default EscolherJobs;

