import { IonApp, IonButton, IonContent, IonIcon, IonPage, ScrollDetail, useIonViewDidEnter } from '@ionic/react';
import { useParams } from 'react-router';

const ConfigurarJobs = (props: any) => {
    const { name } = useParams<{ name: string }>();

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
            <div className='pt-3 pt-md-5'></div>
                <div id="capa-jobs" className="row justify-content-center border border-2 rounded rounded-2 bg-white p-3 p-md-0 mx-0 mx-md-4">
                    <h1 className="card-title destaque lh-1 m-0 text-center">Pilha de Jobs</h1>
                    <h3 className="card-text h3 text-primary ms-2 text-center">Preencha todos os campos de cada job para poder executá-los.</h3>
                    {/* CARD JOB 1 */}
                    <div className="jobs col-12 col-md-5 card border-warning border-2 p-0 m-2 rounded-top rounded-4">
                        {/* header */}
                        <h4 className="card-title jobs-nome lh-1 m-0 banner p-2">
                            <span className="badge bg-white me-1 text-primary">1</span>
                            <span className="font-monospace text-white fw-bold">cy3_shell_valida_inventei_aqui.ksh</span>
                        </h4>
                        {/* check-mark */}
                        <svg id="det-check" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                            className="bi bi-check2-circle text-warning" viewBox="0 0 16 16">
                            <path
                                d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                            <path
                                d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                        </svg>
                        {/* infos */}
                        <div className="card-text text-dark rounded rounded-2 bg-light p-3 m-3">
                            {/* infos-descrição */}
                            <p className="lh-1">
                                <span className="badge bg-info my-1">Stack Nº1</span>
                                <span className="badge bg-info my-1">Versão 17/01/2023</span>
                                <span className="badge bg-info my-1">shell</span>
                                <span className="badge bg-info my-1">Grupo UDA1</span>
                                <div className="my-2"></div>
                                Processa a validação da interface de carga de faturamento que é gerado
                                quando ocorre atualizações financeiras de contratos. A origem do Arquivo é do KENNAN.
                            </p>
                        </div>
                    </div>
                    {/* CARD JOB 7 */}
                    <div className="jobs col-12 col-md-5 card border border-2 p-0 m-2 rounded-top rounded-4">
                        {/* header */}
                        <h4 className="card-title jobs-nome lh-1 m-0 banner p-2">
                            <span className="badge bg-white me-1 text-primary">7</span>
                            <span className="font-monospace text-white fw-bold">cy3_shell_valida_IE002.ksh</span>
                        </h4>
                        {/* infos */}
                        <div className="card-text text-dark rounded rounded-2 bg-light p-3 m-3">
                            {/* infos-descrição */}
                            <p className="lh-1">
                                <span className="badge bg-info my-1">Stack Nº2</span>
                                <span className="badge bg-info my-1">Versão 17/01/2023</span>
                                <span className="badge bg-info my-1">Executar após ID 1</span>
                                <span className="badge bg-info my-1">shell e beb750</span>
                                <span className="badge bg-info my-1">Tabela CONTROLE</span>
                                <span className="badge bg-info my-1">Grupo UDA1</span>
                                <div className="my-2"></div>
                                Processa a validação da interface de carga de faturamento que é gerado
                                quando ocorre atualizações financeiras de contratos. A origem do Arquivo é do BRM.
                            </p>
                            {/* infos-parâmetros */}
                            <div className="p-1 mb-3 banner rounded rounded-2">
                                <label className="form-label fw-bold text-white" htmlFor="job7-param-1">
                                    PARÂMETROS
                                </label>
                                <input id="job7-param-1" type="text" className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    placeholder="$1 - Data de referencia do ciclo (formato AAAAMMDD)" />
                            </div>
                            {/* infos-query */}
                            <div className="p-1 mb-3 banner rounded rounded-2">
                                <label className="form-label fw-bold text-white align-items-start" htmlFor="job7-sql-1">
                                    SQL QUERIES
                                </label>
                                <textarea id="job7-sql-1" className="form-control" aria-label="With textarea"
                                    placeholder="SELECT * FROM CONTROLE WHERE..."></textarea>
                            </div>
                            {/* infos-arquivo entrada */}
                            <div className="p-1 mb-3 banner rounded rounded-2">
                                <label className="form-label fw-bold text-white align-items-start" htmlFor="job7-carga-1">
                                    CARGA
                                </label>
                                <textarea id="job7-carga-1" className="form-control" aria-label="With textarea"
                                    placeholder="Conteúdo txt da carga"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className='mb-5'></div>
                </div>
                <div className='pt-3 pt-md-5'></div>
            </IonContent>
        </IonPage>
    );
};

export default ConfigurarJobs;
