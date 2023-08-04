import { IonApp, IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import "./App.css";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useState } from 'react';
import { document, checkbox, flash, settings } from 'ionicons/icons';
import Login from './pages/Login';
import AbrirSchedule from './pages/AbrirSchedule';
import EscolherJobs from './pages/EscolherJobs';
import ConfigurarJobs from './pages/ConfigurarJobs';
import ExecutarJobs from './pages/ExecutarJobs';
import { AgendaDTO } from './components/AgendaDTO';
import { ItemPilha } from './components/ItemPilha';

setupIonicReact();

export interface AgendaParaPilha {
    add: boolean,
    agenda: AgendaDTO
}

export const dataFormato: Intl.DateTimeFormatOptions = {
    //year: 'numeric',    //Exibe o ano com 4 dígitos
    //month: '2-digit',   //Exibe o mês com 2 dígitos
    //day: '2-digit',     //Exibe o dia com 2 dígitos
    //hour: '2-digit',    //Exibe a hora com 2 dígitos
    //minute: '2-digit',  //Exibe o minuto com 2 dígitos
    //second: '2-digit',  //Exibe o segundo com 2 dígitos
    //hour12: false,      //Utiliza o formato de 24 horas
    dateStyle: 'short', //Utiliza o formato de data curta com separador "/"
};

export let agenda: AgendaDTO[] = [];

export let pilha: ItemPilha[] = [];

const App = () => {
    const [boasVindas, setBoasVindas] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [jobsCount, setJobsCount] = useState(0);
    const [escolherJobsOpt, setEscolherJobsOpt] = useState(false);
    const [configurarJobsOpt, setConfigurarJobsOpt] = useState(false);
    const [executarJobsOpt, setExecutarJobsOpt] = useState(false);

    function handleUserButton(e: any) {
        if (e.detail.tab === 'user') {
            setPopoverOpen(true);
        }
    }

    function animationEnd() {
        setBoasVindas(true);
    }

    function setAgenda(arquivoXlsx: AgendaDTO[]) {
        console.log(`[APP] recebendo callback das agendas`);
        console.log(`[APP] arquivoXlsx: ${arquivoXlsx}`);
        agenda = (arquivoXlsx);
        console.log(`[APP] agenda: ${agenda}`);
        console.log(`[APP] habilitando a tab 'Escolher Jobs'`);
        limparPilha();
        setEscolherJobsOpt(true);
    }

    function limparPilha() {
        console.log(`[APP] recebendo callback para limpar pilha de execução`);
        pilha = [];
    }

    function 
    setPilha(agendaPilha: AgendaParaPilha) {
        const mensagem = agendaPilha.add ? "adicionando" : "removendo";
        console.log(`[APP] alterando pilha de execução.`);
        console.log(`[APP] ${mensagem} job: ${agendaPilha.agenda.job}`);

        //Adicionando elemento na pilha
        if (agendaPilha.add) {
            pilha.push({
                argumentos: [],
                job: agendaPilha.agenda,
                queries: [],
                cargas: [],
                pronto: false
            });
        }
        //Removendo elemento na pilha
        else {
            pilha = pilha.filter((element) => element.job !== agendaPilha.agenda);
        }
        //Verificando se a tab 'Configurar Jobs' estará acessível
        setJobsCount(pilha.length);
        console.log(`[APP] pilha atual: [${pilha.length}] ${pilha}`);
        if (pilha.length > 0) {
            console.log(`[APP] habilitando a tab 'Configurar Jobs'`);
            setConfigurarJobsOpt(true);
        }
        else {
            console.log(`[APP] dessabilitada a tab 'Configurar Jobs'`);
            setConfigurarJobsOpt(false);
        }
    }

    function contadorConfigJobs() {
        if (jobsCount === 0) return null;
        return (
            <span className='badge bg-primary config-job-count'>{jobsCount}</span>
        );
    }

    function intro() {
        return (
            <>
                <Route path="/intro" exact>
                    <Intro callBack={animationEnd} />
                </Route>
                <Redirect from='/*' to="/intro" />
            </>
        );
    }

    function menu() {
        return (
            <div className='banner h-100'>

                <IonHeader id='ppw-titulo' className='text-center' >
                    <div className="navbar-brand disabled text-white fs-1 m-0 lh-1" >
                        Peopleware
                        {/*<div className="fs-6">joao.aguiar@gmail.com</div>*/}
                    </div>
                </IonHeader>

                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/det-maker/open" exact>
                            <AbrirSchedule callBack={setAgenda} />
                        </Route>
                        <Route path="/det-maker/select" exact>
                            <EscolherJobs callBack={setPilha} callBackErase={limparPilha} />
                        </Route>
                        <Route path="/det-maker/config" exact>
                            <ConfigurarJobs pilhaExec={pilha} /></Route>
                        <Route path="/det-maker/run" exact> 
                            <ExecutarJobs />
                        </Route>
                        <Route>
                            <Redirect to="/det-maker/open" />
                        </Route>
                    </IonRouterOutlet>

                    <IonTabBar slot="top"
                        className='pt-4 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold'
                        onIonTabsWillChange={handleUserButton}
                    >
                        {/* USUÁRIO INFO 
                        <IonTabButton tab="user" className='pt-1 bg-transparent fw-bold'>
                            
                            <IonPopover ref={null} isOpen={popoverOpen} onDidDismiss={() => setPopoverOpen(false)}>
                                <div className="ion-padding px-5">joao.aguiar@gmail.com</div>
                            </IonPopover>

                            <IonIcon icon={personCircle} />
                            <IonLabel>Usuário</IonLabel>
                        </IonTabButton>
                        */}

                        {/* ABRIR SCHEDULE */}
                        <IonTabButton tab="open" href="/det-maker/open"
                            className='pt-1 bg-transparent fw-bold'
                        >
                            <IonIcon icon={document} />
                            <IonLabel>Abrir Schedule</IonLabel>
                        </IonTabButton>

                        {/* SELECIONAR JOBS */}
                        <IonTabButton tab="select" href="/det-maker/select"
                            className='pt-2 bg-transparent fw-bold'
                            disabled={!escolherJobsOpt}
                        >
                            <IonIcon icon={checkbox} />
                            <IonLabel>Escolher Jobs</IonLabel>
                        </IonTabButton>

                        {/* CONFIGURAR JOBS */}
                        <IonTabButton tab="config" href="/det-maker/config"
                            className='pt-2 bg-transparent fw-bold'
                            disabled={!configurarJobsOpt}
                        >
                            <IonIcon icon={settings} />
                            <IonLabel>Configurar Jobs {contadorConfigJobs()} </IonLabel>
                        </IonTabButton>

                        {/* EXECUTAR PILHA */}
                        <IonTabButton tab="run" href="/det-maker/run"
                            className='pt-2 bg-transparent fw-bold'
                            disabled={!executarJobsOpt}
                        >
                            <IonIcon icon={flash} />
                            <IonLabel>Executar!</IonLabel>
                        </IonTabButton>

                    </IonTabBar>
                </IonTabs>
            </div>
        );
    }

    function principal() {
        //if login
        if (true) return menu();
        else return <Login />;
    }

    function rotasDeAcesso() {
        //if boasVindas
        if (true) return principal();
        else return intro();
    }

    return (
        <IonApp>
            <IonReactRouter>
                {rotasDeAcesso()}
            </IonReactRouter>
        </IonApp>
    );
};

export default App;

/* BACKUP
<Redirect exact path="/" to="/home" />
<IonRouterOutlet id="main">
    <Route path="/det-maker/open" exact><Page page={page} /></Route>
    <Route path="/det-maker/select" exact><Page page={page} /></Route>
    <Route path="/det-maker/config" exact><Page page={page} /></Route>
    <Route path="/det-maker/run" exact><Page page={page} /></Route>
    <Route><Redirect to="/det-maker/open" /></Route>
</IonRouterOutlet>
*/
