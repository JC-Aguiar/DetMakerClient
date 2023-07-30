import { IonApp, IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonRow, IonSlide, IonSlides, IonText, IonThumbnail, IonTitle, IonToolbar, ScrollDetail, useIonViewDidEnter, withIonLifeCycle } from '@ionic/react';
import { useParams } from 'react-router';

const EscolherJobs = (props: any) => {
    const { name } = useParams<{ name: string }>();

    useIonViewDidEnter(() => {
    });

    //scroll-x
    return (
        <IonPage>
            <IonContent
                fullscreen={true}
                scrollEvents={true}
            >
                <div className='pt-3 pt-md-5'></div>
                <div className="card border bg-white border-2 p-3 mx-0 mx-md-4" id="capa-schedule">
                    <h1 className="card-title destaque lh-1 m-0 text-center">
                        Schedule
                    </h1>
                    <h3 className="card-text h3 text-primary ms-2 text-center">
                        Documentação detalhada dos jobs disponíveis.
                    </h3>
                    <div id="schedule-tabela">
                        <div className="my-3"></div>
                        <div className="banner py-2 p-2"></div>
                        <section className="scroll-x text-center ">
                            <table className="table table-light table-bordered table-striped align-items-center align-middle">
                                <thead className='align-middle'>
                                    <tr>
                                        <th>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                className="bi bi-stack" viewBox="0 0 16 16">
                                                <path
                                                    d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z" />
                                                <path
                                                    d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z" />
                                            </svg>
                                        </th>
                                        <th>JOB ID</th>
                                        <th>EXECUTA APÓS ID</th>
                                        <th>GRUPO CONCORRÊNCIA</th>
                                        <th>FASE</th>
                                        <th>JOB NOME</th>
                                        <th className="td-long">JOB DESCRIÇÃO</th>
                                        <th>GRUPO UDA</th>
                                        <th>PROGRAMA</th>
                                        <th>TABELAS ATUALIZADAS</th>
                                        <th>SERVIDOR</th>
                                        <th>CAMINHO JOB</th>
                                        <th>PARÂMETROS</th>
                                        <th className="td-long">DESCRIÇÕES PARÂMETROS</th>
                                        <th>ARQUIVO ENTRADA (CAMINHO)</th>
                                        <th>ARQUIVO ENTRADA (MÁSCARA)</th>
                                        <th>ARQUIVO SAÍDA (CAMINHO)</th>
                                        <th>ARQUIVO SAÍDA (MÁSCARA)</th>
                                        <th>LOG (CAMINHO)</th>
                                        <th>LOG (MÁSCARA)</th>
                                        <th>TRATAMENTO</th>
                                        <th>ESCALATION</th>
                                        <th>DATA ATUALIZAÇÃO</th>
                                        <th>ATUALZIADO POR</th>
                                    </tr>
                                </thead>
                                <tbody> {/* style={{overflowX: 'auto', whiteSpace: 'nowrap'}} */}
                                    <tr className="font-monospace">
                                        {/* ACTION */}
                                        <td><input className="form-check-input  p-3" type="checkbox" value="" id="1" /></td>
                                        {/* JOB */}
                                        <td>
                                            <div>7</div>
                                        </td>
                                        {/* EXECUTA */}
                                        <td>
                                            <div>1</div>
                                        </td>
                                        {/* GRUPO */}
                                        <td>
                                            <div>A</div>
                                        </td>
                                        {/* FASE */}
                                        <td>
                                            <div>Pré-Cyber</div>
                                        </td>
                                        {/* JOB */}
                                        <td>
                                            <div>cy3_shell_valida_IE002.ksh</div>
                                        </td>
                                        {/* JOB DESCRIÇÃO */}
                                        <td>
                                            <div>
                                                Processa a validação da interface de carga de faturamento que é gerado quando
                                                ocorre atualizações financeiras de contratos. A origem do Arquivo é do BRM.
                                            </div>
                                        </td>
                                        {/* GRUPO */}
                                        <td>
                                            <div>1</div>
                                        </td>
                                        {/* PROGRAMA */}
                                        <td>
                                            <div>shell e beb750</div>
                                        </td>
                                        {/* TABELAS */}
                                        <td>
                                            <div>CONTROLE</div>
                                        </td>
                                        {/* SERVIDOR */}
                                        <td>
                                            <div>svuxpjob2</div>
                                        </td>
                                        {/* CAMINHO */}
                                        <td>
                                            <div>/app/rcvry/shells</div>
                                        </td>
                                        {/* PARÂMETROS */}
                                        <td>
                                            <div>AAAAMMDD</div>
                                        </td>
                                        {/* PARAM DESCRIÇÕES */}
                                        <td>
                                            <div>$1 - Data de referencia do ciclo (formato AAAAMMDD)</div>
                                        </td>
                                        {/* ENTRADA DIR */}
                                        <td>
                                            <div>app/rcvry/cy3/ftp/input</div>
                                        </td>
                                        {/* ENTRADA MASK */}
                                        <td>
                                            <div>CY3_IE002_NNNNNNNN_faturas.txt</div>
                                        </td>
                                        {/* SAIDA DIR */}
                                        <td>
                                            <div>N/A</div>
                                        </td>
                                        {/* SAIDA MASK */}
                                        <td>
                                            <div>N/A</div>
                                        </td>
                                        {/* LOG DIR */}
                                        <td>
                                            <div>/app/rcvry/cy3/log</div>
                                        </td>
                                        {/* LOG MASK */}
                                        <td>
                                            <div>CY3_VALIDA_IE012_AAAAMMDD_HHMMSS.log</div>
                                        </td>
                                        {/* TRATAMENTO */}
                                        <td>
                                            <div>Rerun</div>
                                        </td>
                                        {/* ESCALATION */}
                                        <td>
                                            <div>Nivel 1</div>
                                        </td>
                                        {/* DATA */}
                                        <td>
                                            <div>29/03/2023</div>
                                        </td>
                                        {/* POR QUEM */}
                                        <td>
                                            <div>PPW</div>
                                        </td>
                                    </tr>
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
