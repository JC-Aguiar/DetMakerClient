import { IonApp, IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { JobDTO } from './components/JobDTO';
import { ItemPilha } from './components/ItemPilha';
import { RootState } from './Store/ReduxStore';

/* Recursos de uso comum */

setupIonicReact();

export interface AgendaParaPilha {
    add: boolean,
    job: JobDTO
}

export const dataFormato: Intl.DateTimeFormatOptions = {
    dateStyle: 'short', //Utiliza o formato de data curta com separador "/"
};

/* Componente <App> */
const App = () => {
    const [boasVindas, setBoasVindas] = useState(false);
    const pilha: ItemPilha[] = useSelector((state: RootState) => state.store.pilhaJobs.value);
    const escolherJobsOpt: boolean = pilha.length > 0;
    const jobsCount: number = pilha.filter((itemPilha) => itemPilha.job.checked).length;
    const configurarJobsOpt: boolean = jobsCount > 0;
    const executarJobsOpt: boolean = false;
    const evidenciaPag: boolean = useSelector((state: RootState) => state.store.evidenciaJobs);

    function animationEnd() {
        setBoasVindas(true);
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
                        <Route path="/det-maker/open" exact> <AbrirSchedule /> </Route>
                        <Route path="/det-maker/select" exact> <EscolherJobs /> </Route>
                        <Route path="/det-maker/config" exact> <ConfigurarJobs /> </Route>
                        <Route path="/det-maker/result" exact> <ConfigurarJobs /> </Route>
                        <Route> <Redirect to="/det-maker/open" /> </Route>
                    </IonRouterOutlet>

                    <IonTabBar slot="top" className='pt-4 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold' >
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

                        {/* EVIDÊNCIAS DOS JOBS */}
                        <IonTabButton tab="select" href="/det-maker/result"
                            className='pt-2 bg-transparent fw-bold'
                            disabled={!evidenciaPag}
                        >
                            <IonIcon icon={checkbox} />
                            <IonLabel>Evidências</IonLabel>
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
