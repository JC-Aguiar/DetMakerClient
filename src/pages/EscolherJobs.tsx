import { IonCheckbox, IonContent, IonIcon, IonPage, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import { AgendaDTO } from '../components/AgendaDTO';
import { useState, useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { agenda } from '../App';
import { func } from 'prop-types';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

const EscolherJobs = (props: any) => {
    const location = useLocation<{ data: string }>();
    const [data, setData] = useState<AgendaDTO[]>([]);
    const [checks, setChecks] = useState<boolean>(false);
    const history = useHistory();

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


    function checkAll() {
        setChecks(checks ? false : true);
        console.log(`[ESCOLHER-JOBS] Alterando check de todos os jobs para ${checks}.`);
        agenda.map((elemento, index) => {
            elemento.checked = checks;
            checkJob(elemento, index);
        });
    }

    function checkJob(elemento: AgendaDTO, index: number) {
        elemento.checked = elemento.checked ? false : true;
        const mensagem = elemento.checked ? "selecionado" : "desselecionado";
        console.log(`[ESCOLHER-JOBS] ${mensagem} Job ${elemento.id}: ${elemento.job}.`);
        document.getElementById(`job-index-${index}`)!.style.backgroundColor = elemento.checked ? 'yellow' : 'transparent';

        //const xpath = `//table/tbody/tr[${index+1}]/td`;
        //const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        //
        //for (let i = 0; i < result.snapshotLength; i++) {
        //    const elementoHtml = result.snapshotItem(i) as Element;
        //    elementoHtml?.classList.add( elemento.checked ? 'bg-warning' : 'bg-transparent');
        //    elementoHtml?.classList.remove( elemento.checked ? 'bg-transparent' : 'bg-warning');
        //    console.log("[ESCOLHER-JOBS] elmento: " + elementoHtml?.textContent);
        //}
    }
    /*
    /html/body/div/ion-app/div/div/ion-tabs/div/ion-router-outlet/div[1]/ion-content/div[2]/div[1]/section/table/tbody/tr[1]/td[1]
    //*[@id="capa-schedule"]/div[1]/section/table/tbody/tr[1]/td[1]
    //table/tbody/tr[index+1]/td
    */

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
                            <table className="table  p-0 m-0"> {/* table-light table-striped */}
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
                                <tbody> {/* style={{overflowX: 'auto', whiteSpace: 'nowrap'}} */}
                                    {
                                        agenda.map((elemento, index) => {
                                            const indexId: string = `job-index-${index}`;
                                            return (
                                                <tr className="font-monospace" id={indexId}>
                                                    {/* ACTION */}
                                                    <td>
                                                        <IonCheckbox
                                                            className="check-box bg-transparent"
                                                            checked={elemento.checked}
                                                            onClick={() => checkJob(elemento, index)}
                                                        />
                                                    </td>
                                                    <td className='bg-transparent'> {elemento.id} </td>
                                                    <td className='bg-transparent'> {elemento.executarAposJob} </td>
                                                    <td className='bg-transparent'> {elemento.grupoConcorrencia} </td>
                                                    <td className='bg-transparent'> {elemento.fase} </td>
                                                    <td className='bg-transparent'> {elemento.job} </td>
                                                    <td className='bg-transparent'> {elemento.descricao} </td>
                                                    <td className='bg-transparent'> {elemento.grupoUda} </td>
                                                    <td className='bg-transparent'> {elemento.programa} </td>
                                                    <td className='bg-transparent'> {elemento.tabelas} </td>
                                                    <td className='bg-transparent'> {elemento.servidor} </td>
                                                    <td className='bg-transparent'> {elemento.caminhoExec} </td>
                                                    <td className='bg-transparent'> {elemento.parametros} </td>
                                                    <td className='bg-transparent'> {elemento.descricaoParametros} </td>
                                                    <td className='bg-transparent'> {elemento.diretorioEntrada} </td>
                                                    <td className='bg-transparent'> {elemento.mascaraEntrada} </td>
                                                    <td className='bg-transparent'> {elemento.diretorioSaida} </td>
                                                    <td className='bg-transparent'> {elemento.mascaraSaida} </td>
                                                    <td className='bg-transparent'> {elemento.diretorioLog} </td>
                                                    <td className='bg-transparent'> {elemento.mascaraLog} </td>
                                                    <td className='bg-transparent'> {elemento.tratamento} </td>
                                                    <td className='bg-transparent'> {elemento.escalation} </td>
                                                    <td className='bg-transparent'> {elemento.dataAtualizacao} </td>
                                                    <td className='bg-transparent'> {elemento.atualizadoPor} </td>
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
